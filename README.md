# Yến Sào Hiếu Hiền — Website bán yến sào (Next.js + Strapi)

Monorepo storefront + CMS cho thương hiệu **Yến Sào Hiếu Hiền**: catalog sản phẩm, giỏ hàng, checkout COD, blog và liên hệ.

## Cấu trúc

```
apps/
  web/   # Next.js 15 (App Router) — storefront
  cms/   # Strapi 5 — content & orders
```

## Yêu cầu

- Node.js >= 20
- npm >= 10

## Chạy local

1. Cài dependency (từ root):

```bash
npm install
```

2. Env storefront (đã có mẫu):

- `apps/web/.env.local` — `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`

3. Chạy CMS (terminal 1):

```bash
npm run dev:cms
```

Lần đầu mở http://localhost:1337/admin để tạo tài khoản admin. Bootstrap sẽ:

- cấp quyền Public (đọc catalog/content, tạo order + contact)
- seed categories, products, articles, site-setting, home/about/guide

4. Chạy storefront (terminal 2):

```bash
npm run dev:web
```

Mở http://localhost:3000

## Luồng chính

- Trang chủ / danh mục / PDP lấy dữ liệu từ Strapi REST
- Giỏ hàng client (Zustand + localStorage)
- Checkout COD → `POST /api/orders` (Next) → Strapi `orders`
- Form liên hệ → `POST /api/contact` → Strapi `contact-messages`

## Layering (web)

- `app/api/*` — validate request
- `services/*` — business logic
- `repositories/*` — Strapi access only

## Scripts root

| Script | Mô tả |
|--------|--------|
| `npm run dev:web` | Next.js dev |
| `npm run dev:cms` | Strapi develop |
| `npm run build:web` | Build storefront |
| `npm run build:cms` | Build Strapi admin |

## Deploy (all-in VPS Vietnix + PAVietnam)

Xem [DEPLOY.md](DEPLOY.md). Next.js + Strapi + Postgres chạy trên một VPS.

## Ngoài MVP

Thanh toán online, tài khoản khách, coupon, i18n đầy đủ.
