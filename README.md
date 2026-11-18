# Webshop Automatikus Tesztelési Projekt (Playwright + TypeScript)

Ez egy olyan automata tesztelési rendszer, amely egy teljes értékű e-commerce webáruház ([Automation Exercise](https://automationexercise.com/)) működését ellenőrzi önállóan, emberi beavatkozás nélkül. A rendszer támogatja a böngészős UI End-to-End teszteket, a REST API validációkat, valamint a hibrid (API + UI) tesztelési mintákat.

A projekt a modern szoftvertesztelési elveket követi: Page Object Model (POM) architektúrával, dinamikus tesztadat-generálással (`Faker.js`) és GitHub Actions CI/CD pipeline-nal biztosítja a folyamatos és megbízható futtatást.

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
│   │   ├── CartPage.ts           # Kosár kezelése, törlés és továbblépés
│   │   ├── CheckoutPage.ts       # Megrendelés áttekintés és fizetési űrlap kezelése
│   │   ├── ContactUsPage.ts      # Kapcsolatfelvételi űrlap, fájlfeltöltés és natív dialógusok
│   │   ├── LoginPage.ts          # Autentikáció és fióktörlés kezelése
│   │   ├── ProductsPage.ts       # Termékkatalógus keresés és modális kosár műveletek
│   │   ├── SignupPage.ts         # Regisztráció
│   │   └── SubscriptionPage.ts   # Hírlevél feliratkozás és footer kezelés
│   └── tests/
│       ├── api/                  # REST API tesztcsomagok
│       │   ├── api-negative.spec.ts      # Negatív API validációk és Data-Driven tesztek
│       │   ├── user-api.spec.ts          # Terméklista GET és POST ellenőrzések
│       │   └── user-lifecycle.spec.ts    # Teljes CRUD életciklus (Create -> Get -> Verify -> Delete)
│       ├── hybrid/               # Hibrid tesztcsomagok
│       │   └── hybrid-flow.spec.ts       # API-n alapú adat-előkészítés + UI művelet és API validáció
│       └── ui/                   # UI End-to-End tesztcsomagok
│           ├── cart.spec.ts              # Termék kosárba rakása, törlése és üres kosár állapotok
│           ├── contact-us.spec.ts        # Űrlap beküldés fájlmelléklettel és alert kezeléssel
│           ├── e2e-checkout.spec.ts      # Teljes felhasználói út a regisztrációtól a fizetésig
│           ├── login.spec.ts             # Pozitív és negatív bejelentkezési forgatókönyvek
│           ├── products.spec.ts          # Katalógus láthatóság és kulcsszavas keresés pontossága
│           ├── signup.spec.ts            # Dinamikus regisztráció és duplikált email ellenőrzés
│           └── subscription.spec.ts      # Hírlevél feliratkozás tesztek
│
├── package.json                  # Projekt függőségek és parancsok
├── playwright.config.ts          # Playwright futtatókonfiguráció
└── tsconfig.json                 # TypeScript fordító beállításai