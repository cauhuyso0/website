# Deploy all-in VPS — Vietnix + PAVietnam

Cả **Next.js** và **Strapi + Postgres** chạy trên **một VPS Vietnix**. Không dùng Vercel.

```text
Khách  →  https://your-domain.com       →  Nginx  →  Next.js :3000
Admin  →  https://cms.your-domain.com   →  Nginx  →  Strapi  :1337
```

Thay `your-domain.com` bằng domain PAVietnam.

---

## 0. Chuẩn bị

- Domain PAVietnam đã active
- VPS Vietnix: Ubuntu 22.04, RAM ≥ 2GB, IP public, SSH `root`
- Repo GitHub (ví dụ `https://github.com/cauhuyso0/website.git`)

SSH (PowerShell):

```bash
ssh root@IP_VPS
```

---

## 1. DNS trên PAVietnam

**Quản lý DNS** — cả 3 bản ghi trỏ **IP VPS**:

| Loại | Host | Giá trị | TTL |
|------|------|---------|-----|
| A | `@` | `IP_VPS` | 300 |
| A | `www` | `IP_VPS` | 300 |
| A | `cms` | `IP_VPS` | 300 |

Đợi 5–30 phút:

```bash
ping your-domain.com
ping cms.your-domain.com
```

Cả hai phải ra IP VPS.

---

## 2. Swap 2GB (làm trước — VPS 2GB dễ chết khi build)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h
```

---

## 3. Cài phần mềm

```bash
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw postgresql postgresql-contrib

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

node -v   # >= 20
```

Firewall (mở SSH trước):

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

Không mở port 3000 / 1337 ra ngoài — chỉ Nginx 80/443.

---

## 4. PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER strapi WITH PASSWORD 'MAT_KHAU_MANH';
CREATE DATABASE strapi OWNER strapi;
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;
\q
```

---

## 5. Clone repo

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/cauhuyso0/website.git
cd website
```

---

## 6. Cấu hình và chạy Strapi

```bash
cd /var/www/website/apps/cms
npm ci
```

Tạo secret:

```bash
node -e "for (let i=0;i<6;i++) console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Tạo `/var/www/website/apps/cms/.env`:

```env
HOST=127.0.0.1
PORT=1337
PUBLIC_URL=https://cms.your-domain.com

APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=xxx
ADMIN_JWT_SECRET=xxx
TRANSFER_TOKEN_SALT=xxx
JWT_SECRET=xxx
ENCRYPTION_KEY=xxx

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=MAT_KHAU_MANH
DATABASE_SSL=false

CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

```bash
npm run build
```

---

## 7. Cấu hình và build Next.js

Tạo `/var/www/website/apps/web/.env.production`:

```env
NEXT_PUBLIC_STRAPI_URL=https://cms.your-domain.com
PORT=3000
HOSTNAME=127.0.0.1
```

`NEXT_PUBLIC_*` phải có **trước** `npm run build` (bị nhúng vào client).

```bash
cd /var/www/website/apps/web
npm ci
npm run build
```

---

## 8. PM2 — chạy cả hai app

Từ thư mục repo:

```bash
cd /var/www/website
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
pm2 status
```

Kiểm tra local:

```bash
curl -I http://127.0.0.1:1337/admin
curl -I http://127.0.0.1:3000
```

---

## 9. Nginx

Tạo `/etc/nginx/sites-available/hieuhien`:

```nginx
# Storefront
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Strapi CMS
server {
    listen 80;
    server_name cms.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/hieuhien /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

SSL (DNS phải đã trỏ đúng):

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com -d cms.your-domain.com
```

---

## 10. Lần đầu vào CMS

1. Mở `https://cms.your-domain.com/admin` → tạo tài khoản admin.
2. Kiểm tra Product, Home Page, Site Setting (seed chạy khi DB trống).
3. Mở `https://your-domain.com` — phải thấy site + sản phẩm.

Test: `/san-pham`, ảnh category, đặt 1 đơn COD.

---

## Cập nhật code sau này

```bash
cd /var/www/website
git pull

cd apps/cms && npm ci && npm run build
cd ../web && npm ci && npm run build

pm2 restart strapi web
```

Build lần lượt (đừng build 2 app cùng lúc trên máy 2GB).

---

## Backup hàng ngày

```bash
mkdir -p /root/backups
crontab -e
```

```cron
0 3 * * * pg_dump -U strapi strapi > /root/backups/strapi-$(date +\%F).sql
0 3 * * * tar -czf /root/backups/uploads-$(date +\%F).tar.gz /var/www/website/apps/cms/public/uploads
```

---

## Sự cố thường gặp

| Hiện tượng | Cách xử lý |
|------------|------------|
| 502 Bad Gateway | `pm2 status` / `pm2 logs` — app chết hoặc chưa start |
| Trang không có sản phẩm | Sai `NEXT_PUBLIC_STRAPI_URL` (phải rebuild web) / CMS down / chưa Publish |
| Ảnh không hiện | Sai `PUBLIC_URL` trên Strapi, restart `strapi` |
| CORS error | `CORS_ORIGINS` thiếu domain shop, `pm2 restart strapi` |
| Certbot fail | DNS chưa trỏ IP VPS |
| Build bị kill / Killed | Chưa bật swap, hoặc đang build 2 app cùng lúc |
| Hết RAM lúc chạy | `pm2 logs` — tăng VPS lên 4GB nếu thường xuyên |

Lệnh hữu ích:

```bash
pm2 status
pm2 logs web
pm2 logs strapi
free -h
```
