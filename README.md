# Daniela Tomečková — fitness trenérka

Finální statický web připravený pro GitHub a Cloudflare Pages.

## Obsah projektu

- `index.html`
- `styles.css`
- `script.js`
- `assets/images/` — optimalizované fotografie ve formátu WebP
- `assets/favicon.svg`
- `_headers` — bezpečnostní a cache hlavičky pro Cloudflare Pages
- `_redirects` — fallback pro stránku

## Lokální spuštění

Ve VS Code otevři celou složku a spusť `index.html` přes Live Server.

## GitHub

1. V GitHub Desktop klikni na **Add existing repository** nebo vytvoř nový repozitář.
2. Vyber tuto složku.
3. Commitni všechny soubory.
4. Klikni na **Publish repository** / **Push origin**.

## Cloudflare Pages

1. V Cloudflare otevři **Workers & Pages**.
2. Klikni **Create application → Pages → Connect to Git**.
3. Vyber GitHub repozitář.
4. Nastavení buildu:
   - Framework preset: `None`
   - Build command: nechat prázdné
   - Build output directory: `/`
5. Spusť deploy.

## Co ještě zbývá před ostrým spuštěním

- potvrdit, která fotografie má být definitivně hlavní,
- doplnit finální cenu samostatného tréninkového plánu,
- dodat finální PDF plánu,
- napojit platební bránu a automatické doručení,
- případně přidat obchodní podmínky a zásady ochrany osobních údajů,
- připojit vlastní doménu.


## Aktualizace V2

- tlačítko u tréninkového plánu otevírá modal „Již brzy v prodeji“
- přidaná možnost napsat si o upozornění na spuštění
- nový favicon s iniciálami DT


## Aktualizace V3 – ceník

- služby jsou uspořádané ve velkých kartách pod sebou
- cena je na mobilu i počítači lépe čitelná
- přidaný náhled původní fotografie ceníku
- kliknutím se celý ceník otevře přes obrazovku


## Aktualizace V4 – galerie a reference

- fotografie z tréninku jsou klikací
- fullscreen galerie se šipkami, klávesnicí a swipe na mobilu
- hover efekt a označení „Zvětšit“
- reference jsou kompaktnější
- reference fungují jako slider
- slider podporuje šipky, tečky a swipe na mobilu


## Aktualizace V5 – finální náhled

- kliknutí na logo Daniely plynule vrátí web úplně nahoru
- hlavní tlačítko „Napsat Daniele“ vede přímo na její Instagram
- připraveno k nahrání na GitHub a Cloudflare Pages


## Aktualizace V6 – připraveno ke sdílení

- finální text hlavního kontaktního tlačítka: „Spojit se se mnou“
- zachovaný odkaz na Instagram Daniely
- responzivní verze pro desktop, tablet i mobil
- připraveno pro GitHub a Cloudflare Pages


## Aktualizace V7 – finální CTA

- hlavní kontaktní tlačítko změněno na „Začít spolupráci“
- odkaz stále vede na Instagram Daniely
