# Webshop Automatikus Tesztelési Projekt (Playwright + TypeScript)

Ez egy olyan automata tesztelési rendszer, amely egy webáruház ([Automation Exercise](https://automationexercise.com/)) működését ellenőrozi teljesen önállóan, emberi beavatkozás nélkül. A program képes a böngészőben gépelni, kattintani, termékeket a kosárba tenni, regisztrálni és vásárolni, valamint a háttérben a webshop szerverével is kommunikálni, hogy minden gomb, űrlap és funkció tökéletesen működjön.

A projekt a modern szoftvertesztelési elveket követi: könnyen bővíthető, átlátható szerkezetű, és a GitHub segítségével minden kódmódosítás után automatikusan lefutatja a teszteket.

---

## Architektúra és Mappaszerkezet

A kódbázis tiszta, moduláris felépítést követ, szigorúan elválasztva az oldalabsztrakciókat a tesztesetektől:

```text
qa-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI/CD pipeline
├── src/
│   ├── pages/                    # Page Object Model (POM) osztályok
│   │   ├── CartPage.ts           # Kosár ellenőrzése és továbblépés a pénztárba
│   │   ├── CheckoutPage.ts       # Megrendelés áttekintés és fizetési űrlap kezelése
│   │   ├── ContactUsPage.ts      # Kapcsolatfelvételi űrlap, fájlfeltöltés és natív dialógusok
│   │   ├── LoginPage.ts          # Autentikáció
│   │   ├── ProductsPage.ts       # Termékkatalógus keresés és modális kosár műveletek
│   │   └── SignupPage.ts         # Regisztráció
│   └── tests/
│       ├── api/                  # REST API tesztcsomagok
│       │   ├── api.spec.ts               # Terméklista GET és HTTP ellenőrzések
│       │   ├── data-driven-api.spec.ts   # Paraméterezett bejelentkezési adatok
│       │   └── user-lifecycle.spec.ts    # Teljes CRUD életciklus
│       └── ui/                   # UI End-to-End tesztcsomagok
│           ├── cart.spec.ts              # Termék kosárba rakása és modális interakciók
│           ├── contact-us.spec.ts        # Űrlap beküldés fájlmelléklettel és alert kezeléssel
│           ├── e2e-checkout.spec.ts      # Teljes felhasználói út a regisztrációtól a fizetésig
│           ├── login.spec.ts             # Pozitív és negatív bejelentkezési forgatókönyvek
│           ├── products.spec.ts          # Katalógus láthatóság és kulcsszavas keresés pontossága
│           └── signup.spec.ts            # Dinamikus regisztráció és duplikált email ellenőrzés
│
├── package.json                  # Projekt függőségek és parancsok
├── playwright.config.ts          # Playwright futtatókonfiguráció
└── tsconfig.json                 # TypeScript fordító beállításai