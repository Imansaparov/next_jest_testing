# The Artisan Kiln — Ceramic Tile Order Form

Одностраничная форма заказа керамической плитки (тестовое задание).

Demo (self-hosted): https://92-5-169-52.sslip.io

- **Mobile** (< 1024px) — вертикальная форма заказа (`design_mobile.png`);
- **Tablet** (`md`, 1024–1199px) — сетка 2×2: корзина | Design Tool сверху, Order Summary | Select Payment Method снизу;
- **Desktop** (`lg`, ≥ 1200px) — три колонки в пропорциях макета 380 : 520 : 308 (`design_desktop.png`). Брейкпоинты `md`/`lg` переопределены в `tailwind.config.ts`.

## Стек

- Next.js 16 (App Router, Turbopack) + TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`);
- Tailwind CSS v4 — кастомные цвета, шрифты, тени, `bg-ruled` вынесены в [`tailwind.config.ts`](tailwind.config.ts) (подключён через `@config`);
- Redux Toolkit + React Redux (`combineSlices`, slice selectors, `createAsyncThunk`);
- Motion (framer-motion) — анимации корзины, сетки, итогов, оплаты, диалога;
- Jest + React Testing Library;
- ESLint + Prettier (с сортировкой импортов по слоям FSD).

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # unit + component тесты
npm run check      # lint + typecheck + format:check + test
npm run build && npm run start
```

## Деплой

Self-hosted: Docker + Nginx на VPS (Oracle Cloud Always Free, Ubuntu), автодеплой через GitHub Actions.

- [`Dockerfile`](Dockerfile) — multi-stage сборка, `output: 'standalone'`, запуск от непривилегированного пользователя;
- [`docker-compose.yml`](docker-compose.yml) — контейнер слушает только `127.0.0.1:3000`;
- [`deploy/nginx/artisan-kiln.conf`](deploy/nginx/artisan-kiln.conf) — reverse proxy, HTTPS через Let's Encrypt (certbot);
- [`deploy/server-setup.sh`](deploy/server-setup.sh) — первичная настройка сервера одной командой;
- [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) — на push в `master`: lint + typecheck + format + tests + build, затем деплой по SSH (`git pull` → `docker compose up -d --build`).

```bash
# локально
docker compose up -d --build   # http://localhost:3000

# на новом сервере
curl -fsSL https://raw.githubusercontent.com/Imansaparov/next_jest_testing/master/deploy/server-setup.sh | sudo bash
```

Секреты репозитория для деплоя: `SSH_HOST`, `SSH_USER`, `SSH_KEY`.

## Функциональность

**Shopping Cart** — изменение количества (ввод или кнопка ADD = +1 коробка, 10 sq. ft.), удаление позиций, добавление новых коллекций через «Add new tile to cart». Стартовые данные из макета: Ocean Wave (150), Forest Fern (75), Terracotta Dot (200), Yellow Star (50).

**Расчёты** (`src/entities/cart/lib/cart-calculations.ts`, все суммы в центах — без ошибок плавающей точки):

- `Subtotal = Σ (quantity × unitPrice)`;
- `Shipping` — `$0.00`, если `Subtotal > $500`, иначе `$25.00` (для пустой корзины — `$0.00`);
- `Grand Total = Subtotal + Shipping`.

**Design Tool** (tablet и desktop) — сетка 7×7 в Redux: видно 7 колонок × 6 рядов, как на макете, 7-й ряд открывается прокруткой (полосы прокрутки рисуются как в макете, их можно тянуть):

- выбрать плитку в палитре → кликнуть по ячейке (повторный клик той же плиткой очищает ячейку);
- drag & drop из палитры в сетку и между ячейками (обмен местами);
- ластик, Clear, Reset, ПКМ / Delete очищает ячейку, навигация стрелками.

**Checkout** — валидация обязательных полей, email, телефона, номера карты (длина + алгоритм Луна), срока действия (MM / YY, не в прошлом) и CVV; ошибки показываются после blur или попытки отправки, фокус переходит к первому невалидному полю. Переключение методов оплаты: Credit Card / PayPal / Apple Pay / Bank Transfer. Отправка — мок-API с задержкой и диалог подтверждения.

## Архитектура (Feature-Sliced Design)

```text
src/
├── app/            # Next.js routes, layout, providers, store (combineSlices)
├── views/order/    # композиция страницы (слой pages; `pages/` занят Next.js)
├── widgets/        # site-header, order-hero, shopping-cart, design-tool,
│                   # order-summary, site-footer, page-decor
├── features/
│   ├── checkout/       # форма, валидация, оплата, placeOrder thunk
│   ├── manage-cart/    # количество, add/remove, меню добавления плитки
│   └── tile-designer/  # палитра, сетка, drag & drop, тулбар
├── entities/
│   ├── tile/        # каталог плиток + SVG-узоры (TileArt)
│   ├── cart/        # cart slice, расчёты, CartTotals
│   └── design-grid/ # grid slice 7×7
└── shared/          # ui-kit, иконки, lib (cn, format, redux hooks), config
```

- Слои импортируют slice только через public API (`index.ts`), внутри slice — относительные импорты.
- `RootState` / `AppDispatch` объявлены глобально в `src/app/store.ts`, поэтому типизированные хуки из `shared/lib/redux` не импортируют верхний слой.
- Одно DOM-дерево на все раскладки: порядок секций соответствует мобильному макету, на tablet/desktop секции явно раскладываются по CSS Grid.
- Иллюстрации (руки с плиткой, растения, плитки по краям, палитра) вырезаны прямо из макетов `design/*.png`: фон удалён, поэтому это прозрачные PNG в `src/shared/assets/decor`, они выводятся через `next/image` (`aria-hidden`, `pointer-events-none`). Десктопные фрагменты стоят в координатах макета 1:1 (рамка 1376px = ширина макета). Подсказка «рука перетаскивает плитку» над сеткой исчезает после первого действия пользователя.
- Изображения плиток (каталог, палитра, сетка, эмблемы коллекций), иконки оплаты и иконки в заголовке тоже вырезаны из макетов — `src/entities/tile/assets`, `src/features/checkout/assets`.
- Сетка Design Tool прокручивается по обеим осям; полосы прокрутки нарисованы как в макете (`useScrollThumbs`, ползунки можно тянуть).
- На мобильном макете нет кнопки заказа — она добавлена (под полем заметок, не перекрывая иллюстрацию), иначе заказ нельзя отправить без клавиатуры; поля карты раскрываются после выбора способа оплаты.
- Футер корзины: «Add new tile» слева, итоги справа всегда в одну строку; рука с плиткой показывается через container query, только когда помещается.

## Тесты

- `cart-calculations.test.ts` — subtotal, граница бесплатной доставки ($500.00 → $25, $500.01 → $0), clamp количества;
- `cart.slice.test.ts`, `design-grid.slice.test.ts` — редьюсеры и селекторы;
- `validate-checkout.test.ts`, `card-format.test.ts` — валидация и форматирование;
- `checkout.slice.test.ts` — `placeOrder` thunk на реальном store;
- `shopping-cart.test.tsx` — компонент корзины через RTL.
