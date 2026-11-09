"use client";

import { useEffect, useRef } from "react";

// Google Programmable Search Engine (cse.google.com), пошукова система Олесі.
const CX = "12a583004cd7e423b";
const SCRIPT_ID = "google-cse-script";

type CseWindow = Window & {
  google?: {
    search?: { cse?: { element?: { go: (el?: Element | null) => void } } };
  };
};

export function GoogleSearch() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // React не знає про розмітку, яку вставляє Google, тому тег віджета
    // створюємо самі й прибираємо все при виході зі сторінки.
    // Окремо поле й окремо результати: так видача йде просто на сторінці,
    // а не у спливному вікні, яке на телефоні виходить вузьким.
    // enableHistory: запит потрапляє в адресу, працює кнопка «Назад».
    // linkTarget _self: результати з нашого ж сайту відкриваються в цій вкладці.
    el.innerHTML =
      '<div class="gcse-searchbox" data-enableHistory="true"></div>' +
      '<div class="gcse-searchresults" data-linkTarget="_self"></div>';

    const cse = (window as CseWindow).google?.search?.cse?.element;
    if (cse) {
      // Скрипт уже завантажений (повернулися на сторінку без перезавантаження).
      cse.go(el);
    } else if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.async = true;
      s.src = `https://cse.google.com/cse.js?cx=${CX}`;
      document.body.appendChild(s);
    }

    return () => {
      el.innerHTML = "";
    };
  }, []);

  return (
    <div ref={box} className="seobaza-cse min-h-[60px]">
      <noscript>
        Пошук працює через Google і потребує JavaScript. Без нього шукайте в
        Google запитом site:seobaza.com.ua.
      </noscript>
    </div>
  );
}
