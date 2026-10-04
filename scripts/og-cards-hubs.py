"""Brand OG cards (1200x630) for published KG entity hubs, SEO Baza style:
#262626 background, #7CFF3D accent, logo top-left, green bar at the bottom.
Renders HTML with headless Chrome, saves JPG q90 to public/images/og/kg/, and
sets `image:` in the entity frontmatter.

Run from anywhere: python scripts/og-cards-hubs.py  (needs Pillow and Chrome).
Regenerates every published hub; unchanged cards come out byte-identical."""
import os, re, subprocess, sys, html, tempfile
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(os.sep, '/')
TMP = os.path.join(tempfile.gettempdir(), 'seobaza-og-cards').replace(os.sep, '/')
CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
TYPE_LABEL = {'concept': 'Концепт', 'tool': 'Інструмент', 'assistant': 'AI-асистент', 'org': 'Компанія',
              'social': 'Соцмережа', 'event': 'Подія', 'place': 'Місце', 'series': 'Серія'}
os.makedirs(TMP, exist_ok=True)
os.makedirs(f'{REPO}/public/images/og/kg', exist_ok=True)
logo = 'file:///' + f'{REPO}/public/seobaza.png'

TEMPLATE = '''<!doctype html><html><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:#262626;font-family:Arial,Helvetica,sans-serif;color:#fff;position:relative;overflow:hidden}}
.glow{{position:absolute;right:-200px;top:-200px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(124,255,61,.18),rgba(124,255,61,0) 65%)}}
.brand{{position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:22px}}
.brand img{{width:72px;height:72px;border-radius:50%}}
.brand b{{display:block;font-size:24px;letter-spacing:2px}}
.brand span{{display:block;font-size:15px;color:#7CFF3D;letter-spacing:2px;margin-top:6px;font-weight:bold}}
.kicker{{position:absolute;left:64px;top:215px;font-size:26px;color:#bdbdbd}}
.name{{position:absolute;left:64px;top:262px;right:64px;font-size:{size}px;font-weight:900;line-height:1.05;color:#7CFF3D}}
.pill{{position:absolute;left:64px;bottom:62px;background:#7CFF3D;color:#1a1a1a;font-weight:bold;font-size:24px;border-radius:30px;padding:12px 26px}}
.note{{position:absolute;left:{note_left}px;bottom:74px;font-size:22px;color:#bdbdbd}}
.bar{{position:absolute;left:0;right:0;bottom:0;height:14px;background:#7CFF3D}}
</style></head><body><div class="glow"></div>
<div class="brand"><img src="{logo}"><div><b>SEO BAZA</b><span>SEOBAZA.COM.UA</span></div></div>
<div class="kicker">Граф знань SEO Baza</div>
<div class="name">{name}</div>
<div class="pill">{label}</div>
<div class="note">новини, розбори і статистика спільноти</div>
<div class="bar"></div></body></html>'''

def card(etype, slug, name):
    size = 104 if len(name) <= 14 else 84 if len(name) <= 22 else 66
    label = TYPE_LABEL[etype]
    note_left = 64 + 26 * 2 + int(len(label) * 14.5) + 24
    page = TEMPLATE.format(size=size, logo=logo, name=html.escape(name), label=label, note_left=note_left)
    hp = f'{TMP}/{etype}-{slug}.html'
    png = f'{TMP}/{etype}-{slug}.png'
    open(hp, 'w', encoding='utf-8').write(page)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                    f'--screenshot={png}', '--window-size=1200,630', 'file:///' + hp], capture_output=True, timeout=60)
    out = f'{REPO}/public/images/og/kg/{etype}-{slug}.jpg'
    Image.open(png).convert('RGB').crop((0, 0, 1200, 630)).save(out, quality=90)
    return f'/images/og/kg/{etype}-{slug}.jpg'

for etype in TYPE_LABEL:
    d = f'{REPO}/content/kg/{etype}'
    if not os.path.isdir(d):
        continue
    for f in os.listdir(d):
        if not f.endswith('.mdx'):
            continue
        p = f'{d}/{f}'
        s = open(p, encoding='utf-8').read()
        if 'status: "published"' not in s.split('---')[1]:
            continue
        name = re.search(r'^name:\s*"([^"]+)"', s, re.M).group(1)
        img = card(etype, f[:-4], name)
        if re.search(r'^image:', s, re.M):
            s = re.sub(r'^image:.*$', f'image: "{img}"', s, count=1, flags=re.M)
        else:
            s = s.replace('status: "published"\n', f'status: "published"\nimage: "{img}"\n', 1)
        open(p, 'w', encoding='utf-8').write(s)
        print(img, Image.open(REPO + '/public' + img).size)
