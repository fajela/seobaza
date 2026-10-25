"""Brand OG card (1200x630) for the tools catalog /kg/tool (category pages: maybe later),
same look as scripts/og-cards-hubs.py. Saves JPG q90 to public/images/og/kg/.

Run: python scripts/og-cards-tools.py  (needs Pillow and Chrome)."""
import os, re, json, subprocess, html, tempfile
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(os.sep, '/')
TMP = os.path.join(tempfile.gettempdir(), 'seobaza-og-cards').replace(os.sep, '/')
CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
os.makedirs(TMP, exist_ok=True)
logo = 'file:///' + f'{REPO}/public/seobaza.png'

# Template from og-cards-hubs.py, with our own kicker and note.
src = open(f'{REPO}/scripts/og-cards-hubs.py', encoding='utf-8').read()
TEMPLATE = re.search(r"TEMPLATE = '''(.*?)'''", src, re.S).group(1)
TEMPLATE = TEMPLATE.replace('Граф знань SEO Baza', 'Каталог сервісів SEO Baza').replace(
    'новини, розбори і статистика спільноти', '{note}')

# slug -> file name with the keyword, as the SEO rules ask
FILES = {
    '': 'seo-instrumenty-katalog-servisiv',
}
NAMES = {
    '': 'SEO-інструменти', 'ai': 'AI для SEO', 'tekhnichnyi-audyt': 'Технічний аудит',
    'semantyka-i-kontent': 'Семантика і контент', 'linkbilding': 'Лінкбілдинг', 'lokalne-seo': 'Локальне SEO',
    'ahentsii': 'Для агенцій', 'partnerski-prohramy': 'Партнерські програми', 'inshi': 'Інші сервіси',
}

tools = json.load(open(f'{REPO}/content/tools/tools.json', encoding='utf-8'))


def plural(n):
    if n % 10 == 1 and n % 100 != 11:
        return 'сервіс'
    if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14:
        return 'сервіси'
    return 'сервісів'


for slug, fname in FILES.items():
    n = len(tools) if not slug else sum(1 for t in tools if t['category'] == slug)
    name = NAMES[slug]
    label = 'Інструменти'
    size = 104 if len(name) <= 14 else 84 if len(name) <= 22 else 66
    note_left = 64 + 26 * 2 + int(len(label) * 14.5) + 24
    page = TEMPLATE.format(size=size, logo=logo, name=html.escape(name), label=label, note_left=note_left,
                           note=f'{n} {plural(n)} з описами і українськими мітками')
    hp, png = f'{TMP}/tools-{fname}.html', f'{TMP}/tools-{fname}.png'
    open(hp, 'w', encoding='utf-8').write(page)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                    f'--screenshot={png}', '--window-size=1200,630', 'file:///' + hp], capture_output=True, timeout=60)
    out = f'{REPO}/public/images/og/kg/{fname}.jpg'
    Image.open(png).convert('RGB').crop((0, 0, 1200, 630)).save(out, quality=90)
    print(out, Image.open(out).size)
