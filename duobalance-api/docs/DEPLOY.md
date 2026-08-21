# DEPLOY — DuoBalance

> Guía completa de despliegue, configuración de entornos y roadmap de infraestructura para DuoBalance.
> Estado: **pre-beta** — el MVP funciona en local, este documento define cómo llevarlo a producción.

---

## 1. Resumen ejecutivo

| Pieza | Beta ($0/mes) | Producción |
|-------|--------------|------------|
| Backend API | Oracle Cloud Always Free (Ubuntu VM) | Azure (Container Apps / VM) |
| PostgreSQL | Oracle VM (local) | Azure Database for PostgreSQL (managed) |
| Storage (uploads/) | Oracle Block Volume | Azure Blob Storage / Cloudflare R2 |
| Frontend | Cloudflare Pages (estático) | ✅ `duobalance-app.pages.dev` | Cloudflare Pages (estático) |
| Dominio API | `api-duobalance.duckdns.org` (DuckDNS) | `api.duobalance.com` |
| Dominio frontend | `duobalance-app.pages.dev` (Cloudflare Pages) | `www.duobalance.com` |
| HTTPS | Let's Encrypt + certbot (API) / Cloudflare auto (frontend) | Cloudflare + Azure managed |

**Objetivo Beta: $0/mes.** Siempre activos, sin sleeps.

---

## 2. Arquitectura

### 2.1 Beta (Etapa 1)

```
                    Internet (usuarios)
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
    Cloudflare Pages              Oracle Cloud VM
    (frontend estático)          (Ubuntu 24.04)
    duobalance-app.pages.dev     │
            │                    ├── Nginx (reverse proxy + HTTPS)
            │                    │     ↓
            │                    ├── PM2 (process manager)
            │                    │     ↓
            │                    ├── NestJS (duobalance-api)
            │                    │     │
            │                    │     ├── uploads/ (block volume persistente)
            │                    │     │
            │                    │     └── PostgreSQL
            │                    │           └── duobalance DB
            │                    │
            └──────────┬─────────┘
                       │ HTTPS
                       ▼
          api-duobalance.duckdns.org
```

### 2.2 Producción (Etapa 2)

```
                     USUARIOS
                        │
                        ▼
                     Cloudflare
                        │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
        Web CDN               API HTTPS
        (Pages)                   │
                                  │ Azure
                                  │
                            ┌─────┴─────┐
                            │           │
                            ▼           ▼
                       NestJS API  PostgreSQL
                                  (managed)
                                  │
                            Object Storage
                         (Blob Storage / R2)
```

### 2.3 Evolución: mismo código, diferente infra

```
                     MISMO CÓDIGO
                          │
              ┌───────────┴───────────┐
              │                       │
           BETA ENV              PROD ENV
              │                       │
           Oracle                  Azure
              │                       │
          PostgreSQL            PostgreSQL (managed)
```

**La diferencia debe estar en infraestructura y variables de entorno, NO en la aplicación.**

---

## 3. Configuración de entornos

### 3.1 Frontend (`DuoBalance-app`)

**Expo CLI carga `.env` según el comando:**
- `pnpm start` / `pnpm web` → **development** → lee `.env.development` + `.env`
- `pnpm export:web` / `pnpm build` → **production** → lee `.env.production` + `.env`

**Archivos commiteados:**

| Archivo | Contenido | Rama |
|---------|-----------|------|
| `.env.development` | `EXPO_PUBLIC_API_URL=http://localhost:3000` | `dev` |
| `.env.production` | `EXPO_PUBLIC_API_URL=https://api-duobalance.duckdns.org` | `main`, `dev` |
| `.env.example` | Plantilla genérica | `main`, `dev` |

**Archivo gitignored (overrides locales):**
- `.env` → valores personalizados del desarrollador.

**Scripts en `package.json`:**
```json
{
  "scripts": {
    "start": "expo start",
    "web": "expo start --web",
    "export:web": "EXPO_PUBLIC_API_URL=https://api-duobalance.duckdns.org expo export -p web"
  }
}
```

### 3.2 Backend (`duobalance-api`)

| Archivo | Contenido | Estado |
|---------|-----------|--------|
| `.env.example` | Plantilla con todas las vars | ✅ Commit |
| `.env` | Secrets reales del desarrollador | ✅ Gitignored |

**Variables de entorno requeridas** (validadas por `src/config/env.config.ts`):

| Variable | Tipo | Descripción | Ejemplo dev | Ejemplo prod |
|----------|------|-------------|-------------|--------------|
| `PORT` | number | Puerto del servidor | `3000` | `3000` |
| `DATABASE_URL` | string (required) | Connection string Postgres | `postgresql://duobalance:pass@localhost:5432/duobalance` | `postgresql://duobalance:pass@localhost:5432/duobalance` |
| `JWT_SECRET` | string (required) | Secreto para firmar JWT | `openssl rand -hex 32` | `openssl rand -hex 32` |
| `MAIL_PROVIDER` | string | Proveedor de email | `resend` o `brevo` | `resend` o `brevo` |
| `RESEND_API_KEY` | string (si resend) | API key de Resend | `re_xxxxxxxxxxxx` | `re_xxxxxxxxxxxx` |
| `BREVO_API_KEY` | string (si brevo) | API key de Brevo | `xkeysib-xxxxxxxxxxxx` | `xkeysib-xxxxxxxxxxxx` |
| `MAIL_FROM` | string | Email remitente | `onboarding@resend.dev` | `noreply@tudominio.com` |
| `FRONTEND_URL` | string | URL del frontend (para links de email) | `http://localhost:8081` | `https://duobalance-app.pages.dev` |
| `CORS_ORIGINS` | string | Orígenes permitidos (CSV) | `http://localhost:8081,http://localhost:8082` | `https://duobalance-app.pages.dev` |

**Generar `JWT_SECRET` seguro:**
```bash
openssl rand -hex 32
```

### 3.3 Entornos preparados desde ya

```
.env.development    → desarrollo local
.env.beta           → beta en Oracle Cloud
.env.production     → producción en Azure
```

---

## 4. Flujo de ramas (git)

### 4.1 Estrategia

| Rama | Propósito | Deploy |
|------|-----------|--------|
| `main` | **Producción estable** — solo deploys | Deploy automático/manual |
| `dev` | **Integración continua** — trabajo diario | No deploy |
| `feature/*` | Features individuales | Merge → `dev` vía PR |

**Flujo diario:**
```
feature/mi-cambio → PR → dev (CI: tsc + lint + build)
dev → PR → main (release tag) → deploy
```

### 4.2 Comandos básicos

```bash
# Empezar feature nueva
git checkout dev
git pull origin dev
git checkout -b feature/mi-cambio

# Trabajar, commitear, push
git add .
git commit -m "feat: descripción"
git push origin feature/mi-cambio

# PR a dev → CI valida → merge
# PR de dev a main → release → deploy
```

### 4.3 Diferencias entre ramas

**`main` solo tiene archivos de producción:**
- `.env.production`
- `.env.example`
- Código listo para deploy

**`dev` tiene archivos de desarrollo + producción:**
- `.env.development` (para `pnpm start` local)
- `.env.production` (para `pnpm export:web` local)
- `.env.example`
- Código en desarrollo

---

## 5. Modo desarrollo (local)

### 5.1 Setup inicial

**Backend:**
```bash
cd duobalance-api
cp .env.example .env
# Editar .env con tus secrets reales

pnpm install --frozen-lockfile
npx prisma migrate dev
pnpm start:dev
```

**Frontend:**
```bash
cd DuoBalance-app
pnpm install --frozen-lockfile
pnpm web  # o pnpm start
```

**URLs locales:**
- Frontend: `http://localhost:8081`
- Backend API: `http://localhost:3000`

---

## 6. Despliegue en producción (12 fases)

### FASE 1 — Preparar producción ✅ (completado)

**Backend:**
- [x] Variables de entorno documentadas en `.env.example`
- [x] CORS configurado vía `CORS_ORIGINS` (no hardcodeado)
- [x] `FRONTEND_URL` configurable
- [x] Validación con Joi en `src/config/env.config.ts`

**Frontend:**
- [x] `EXPO_PUBLIC_API_URL` en `.env.production`
- [x] `resolveImageUrl` usa `API_URL` (leído de `EXPO_PUBLIC_API_URL`)
- [x] Script `export:web` configurado
- [x] Archivos separados: `.env.development` (dev), `.env.production` (prod)

**Pendiente en FASE 1:**
- [ ] Crear `ecosystem.config.js` para PM2
- [ ] Crear `nginx.conf` de ejemplo
- [ ] Crear endpoint `/health` (si no existe)

---

### FASE 2 — Oracle Cloud

**Objetivo:** Levantar Ubuntu VM con acceso público.

**Tareas:**
1. Crear cuenta en [Oracle Cloud](https://cloud.oracle.com/) (requiere tarjeta para verificación, pero no cobra).
2. Seleccionar **home region** (ej: us-ashburn-1, sa-santiago-1).
3. Intentar VM **ARM Ampere A1** (4 OCPU, 24 GB RAM, free).
   - Si no hay capacidad → usar 2 AMD VMs (1 OCPU, 1 GB RAM cada una).
4. Crear instancia Ubuntu 24.04 LTS.
5. **Reservar IP pública estática** (gratis) y adjuntar a la VM.
6. Configurar SSH:
   ```bash
   # Local
   ssh-keygen -t rsa -b 4096 -C "tu-email" -f ~/.ssh/oracle
   ssh-copy-id -i ~/.ssh/oracle.pub ubuntu@<IP_PUBLICA>
   ```
7. Configurar Security List (red):
   - Puerto 22 (SSH): solo tu IP
   - Puerto 80 (HTTP): 0.0.0.0/0
   - Puerto 443 (HTTPS): 0.0.0.0/0
8. Configurar firewall del SO (ufw):
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
9. Crear **block volume** (persistente, gratis hasta 200 GB total).

---

### FASE 3 — PostgreSQL en Oracle VM

**Tareas:**
1. Conectar a la VM:
   ```bash
   ssh -i ~/.ssh/oracle ubuntu@<IP_PUBLICA>
   ```
2. Instalar Postgres:
   ```bash
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib
   ```
3. Crear DB y usuario:
   ```bash
   sudo -u postgres psql
   CREATE USER duobalance WITH PASSWORD 'tu-password-seguro';
   CREATE DATABASE duobalance OWNER duobalance;
   GRANT ALL PRIVILEGES ON DATABASE duobalance TO duobalance;
   \q
   ```
4. Configurar conexión local (solo Nginx/PM2 acceden localmente):
   ```
   listen_addresses = 'localhost'
   ```
5. Probar conexión:
   ```bash
   psql -U duobalance -d duobalance -h localhost
   ```

---

### FASE 4 — Backend (NestJS)

**Tareas:**
1. Instalar Node.js 20:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
2. Instalar PM2 globalmente:
   ```bash
   sudo npm install -g pm2
   ```
3. Clonar repo (o subir código):
   ```bash
   cd /opt
   sudo git clone https://github.com/152004E/duobalance-api.git
   sudo chown -R ubuntu:ubuntu duobalance-api
   cd duobalance-api
   ```
4. Instalar dependencias:
   ```bash
   pnpm install --frozen-lockfile
   npx prisma generate
   ```
5. Crear `.env` en la VM (NO commitear):
   ```env
   PORT=3000
   DATABASE_URL=postgresql://duobalance:tu-password@localhost:5432/duobalance
   JWT_SECRET=<openssl rand -hex 32>
   MAIL_PROVIDER=resend
   RESEND_API_KEY=re_xxxxxxxxxxxx
   MAIL_FROM=noreply@tudominio.com
   FRONTEND_URL=https://duobalance-app.pages.dev
   CORS_ORIGINS=https://duobalance-app.pages.dev
   ```
6. Crear `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'duobalance-api',
       script: 'dist/main.js',
       instances: 1,
       exec_mode: 'fork',
       env: {
         NODE_ENV: 'production',
       },
     }],
   };
   ```
7. Compilar y arrancar:
   ```bash
   pnpm build
   pm2 start ecosystem.config.js
   pm2 startup  # genera comando para systemd
   pm2 save     # guarda estado actual
   ```
8. Probar API:
   ```bash
   curl http://localhost:3000
   ```

---

### FASE 5 — Nginx + HTTPS

**Tareas:**
1. Instalar Nginx:
   ```bash
   sudo apt install -y nginx
   ```
2. Instalar certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```
3. Crear config Nginx (`/etc/nginx/sites-available/duobalance`):
   ```nginx
   server {
     listen 80;
     server_name api-duobalance.duckdns.org;
     client_max_body_size 6m;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```
4. Activar:
   ```bash
   sudo ln -s /etc/nginx/sites-available/duobalance /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
5. Configurar DuckDNS:
   - Crear cuenta en [duckdns.org](https://www.duckdns.org/)
   - Crear dominio `api-duobalance` → apuntar a la IP pública de Oracle
   - Actualizar cada 5 min (cron o script).
6. Obtener certificado HTTPS:
   ```bash
   sudo certbot --nginx -d api-duobalance.duckdns.org
   ```
7. Verificar renovación automática:
   ```bash
   sudo certbot renew --dry-run
   ```

---

### FASE 6 — Persistencia (uploads/)

**Objetivo:** Comprobantes y avatares sobreviven a reinicios.

**Tareas:**
1. Adjuntar block volume a la VM (Oracle Console → Storage → Block Volumes → Attach).
2. En la VM, formatear y montar:
   ```bash
   lsblk
   sudo mkfs.ext4 /dev/sdb
   sudo mkdir -p /opt/duobalance-api/uploads
   sudo mount /dev/sdb /opt/duobalance-api/uploads
   echo "/dev/sdb /opt/duobalance-api/uploads ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab
   ```
3. Probar:
   ```bash
   # Subir un comprobante desde el frontend
   # Reiniciar API
   pm2 restart duobalance-api
   # Verificar que el comprobante sigue disponible
   # Reiniciar VM
   sudo reboot
   # Verificar que el comprobante sigue disponible
   ```

**⚠️ Gotcha:** Si el `uploads/` está en el boot volume (no en el block volume), se pierde en cada reinicio.

---

### FASE 7 — Cloudflare Pages (frontend) ✅ COMPLETADO

**Estado:** Frontend desplegado y funcionando.

**URL:** `https://duobalance-app.pages.dev`

**Configuración utilizada:**
- Build command: `pnpm install --frozen-lockfile && pnpm export:web`
- Build output directory: `dist`
- Root directory: `/`
- Branch: `main`

**Variables de entorno configuradas:**
- `EXPO_PUBLIC_API_URL=https://api-duobalance.duckdns.org`
- `EXPO_PUBLIC_APP_NAME=DuoBalance`

**Archivos creados para Cloudflare Pages:**
- `public/_redirects` — SPA routing fallback (`/* /index.html 200`)
- `public/_headers` — Headers de seguridad y caché
- `public/404.html` — Página 404 personalizada

**Fecha de despliegue:** Agosto 2026

---

### FASE 8 — Conectar frontend + backend

**Checklist end-to-end:**
- [ ] Registro de usuario nuevo
- [ ] Email de verificación llega
- [ ] Link de verificación abre `https://duobalance-app.pages.dev/verify-email?token=...`
- [ ] Login funciona
- [ ] Crear grupo/pareja
- [ ] Registrar gasto
- [ ] Subir comprobante → imagen carga desde `https://api-duobalance.duckdns.org/uploads/...`
- [ ] Balance se calcula correctamente
- [ ] Reportes muestran datos
- [ ] Logout
- [ ] Forgot password → email llega → link funciona

**⚠️ Validar:**
- CORS funciona (no hay errores de "blocked by CORS policy").
- URLs de uploads resuelven correctamente.
- Links de email apuntan al dominio real.

---

### FASE 9 — Backups

**Tareas:**
1. Script de backup (`/opt/scripts/backup-db.sh`):
   ```bash
   #!/bin/bash
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/opt/backups/db"
   mkdir -p $BACKUP_DIR

   pg_dump -U duobalance -d duobalance | gzip > $BACKUP_DIR/duobalance_$TIMESTAMP.sql.gz
   ```
2. Hacer ejecutable:
   ```bash
   chmod +x /opt/scripts/backup-db.sh
   ```
3. Cron diario (3 AM):
   ```bash
   crontab -e
   0 3 * * * /opt/scripts/backup-db.sh
   ```
4. **Probar restauración:**
   ```bash
   createdb duobalance_test
   gunzip -c backup.sql.gz | psql -U duobalance -d duobalance_test
   psql -U duobalance -d duobalance_test -c "SELECT COUNT(*) FROM \"Expense\";"
   ```

**⚠️ Importante:** Backup en la misma VM no sirve si la VM muere → subir a Object Storage o descargar fuera.

---

### FASE 10 — Monitorización básica

1. **PM2:**
   ```bash
   pm2 status
   pm2 logs
   pm2 monit
   ```
2. **Health check endpoint:**
   ```typescript
   @Get('health')
   healthCheck() {
     return { status: 'ok', timestamp: new Date().toISOString() };
   }
   ```
3. **Cron check** (`/etc/cron.d/api-health`):
   ```bash
   */5 * * * * curl -f https://api-duobalance.duckdns.org/health || echo "API DOWN" >> /var/log/api-health.log
   ```
4. **Logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/postgresql/postgresql-16-main.log
   ```

---

### FASE 11 — Android (post-web)

**Estado:** Diferido. La beta es **solo web** por ahora.

1. Configurar `android.package` en `app.json`:
   ```json
   { "expo": { "android": { "package": "com.duobalance.app" } } }
   ```
2. Instalar y login EAS CLI:
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. Build APK:
   ```bash
   cd DuoBalance-app
   eas build --platform android --profile preview
   ```

---

### FASE 12 — Prueba end-to-end de producción

1. Abrir `https://duobalance-app.pages.dev`
2. Registrar usuario nuevo
3. Verificar email → click link → cuenta verificada
4. Login
5. Crear pareja
6. Registrar gasto con comprobante
7. Verificar que el comprobante carga
8. Revisar balance, reportes
9. Logout
10. Probar forgot password
11. (Si hay APK) Probar mismo flujo desde APK

---

## 7. Resumen de comandos clave

### Backend (producción)
```bash
# Instalar
pnpm install --frozen-lockfile
npx prisma generate
npx prisma migrate deploy

# Compilar
pnpm build

# Arrancar
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Logs / reiniciar
pm2 logs
pm2 restart duobalance-api
```

### Frontend (producción)
```bash
# Build → dist/ listo para Cloudflare Pages
pnpm export:web
```

---

## 8. Beta cerrada — Plan de validación

### Alcance del MVP (flujo principal)

```
Registro
   ↓
Verificación
   ↓
Login
   ↓
Crear pareja
   ↓
Invitar pareja
   ↓
Configurar porcentaje
   ↓
Crear gasto
   ↓
Subir comprobante
   ↓
Balance
   ↓
Historial
   ↓
Reportes
```

### Estrategia de rollout

```
BETA
  │
  ├── 5-10 usuarios (conocidos)
  ├── 25 usuarios
  ├── 50 usuarios
  ├── 100 usuarios
  │
  ▼
  feedback → correcciones → estabilidad
```

### ¿Cuándo pasar a producción?

**No por tiempo. Por uso.**

| Señal | Indicador |
|-------|-----------|
| Usuarios activos | Hay personas usando DuoBalance regularmente |
| Gastos reales | Se están registrando gastos reales (no solo de prueba) |
| API estable | Sin errores significativos en logs |
| Storage funciona | Comprobantes y avatares persisten correctamente |
| Infraestructura | La VM soporta la carga actual |

---

## 9. Roadmap de infraestructura

```
                         DUOBALANCE
                              │
              ┌───────────────┴───────────────┐
              │                               │
             BETA                         PRODUCCIÓN
              │                               │
              ▼                               ▼
       Cloudflare Pages                 Cloudflare Pages
              │                               │
              ▼                               ▼
        Oracle Cloud                    Azure / Cloud
              │                               │
          ┌───┴────┐                    ┌─────┴─────┐
          │        │                    │           │
       NestJS   PostgreSQL            NestJS    PostgreSQL
          │                             │         (managed)
       uploads                      Blob/R2
```

### Bloque 1 — Preparación ✅
- [x] Production readiness
- [x] Variables de entorno
- [x] CORS
- [x] Configuración de uploads
- [x] Configuración de builds
- [x] Separación dev / beta / production

### Bloque 2 — Beta Web $0
- [ ] Oracle Cloud VM
- [ ] PostgreSQL
- [ ] NestJS + PM2
- [ ] Nginx + HTTPS
- [ ] Storage persistente
- [ ] Cloudflare Pages
- [ ] Dominio gratuito (DuckDNS)
- [ ] Backups
- [ ] Monitoring básico

### Bloque 3 — Beta cerrada
- [ ] 5–10 usuarios (conocidos)
- [ ] 25 usuarios
- [ ] 50+ usuarios
- [ ] Recopilar errores
- [ ] Medir rendimiento
- [ ] Revisar logs
- [ ] Corregir problemas
- [ ] Validar estabilidad

### Bloque 4 — Preparación producción
- [ ] Dominio propio
- [ ] Separar API y DB
- [ ] PostgreSQL administrado
- [ ] Object Storage
- [ ] CI/CD
- [ ] Secrets management
- [ ] Backups automatizados
- [ ] Monitoring + Alertas
- [ ] Rate limiting
- [ ] Hardening de seguridad

### Bloque 5 — Producción
- [ ] Azure para backend
- [ ] PostgreSQL administrado
- [ ] Blob Storage / R2
- [ ] Cloudflare (se mantiene)
- [ ] Dominio `duobalance.com`
- [ ] HTTPS
- [ ] CI/CD
- [ ] Monitoring
- [ ] Backups
- [ ] Disaster recovery
- [ ] Escalamiento

### Bloque 6 — Escalamiento
```
1.000 usuarios
      ↓
API scaling → DB optimization → CDN → Object storage → Caching → Queues → Observability
```

---

## 10. Costos

### Beta

| Componente | Tecnología | Costo |
|-----------|-----------|-------|
| Frontend | Cloudflare Pages | $0 |
| Backend | Oracle Always Free | $0 |
| PostgreSQL | Oracle | $0 |
| Storage | Oracle Block Volume | $0* |
| HTTPS | Let's Encrypt / Cloudflare | $0 |
| Dominio | pages.dev + DuckDNS | $0 |
| **Total** | | **$0/mes** |

*Dentro de los límites gratuitos de Oracle Cloud.

### Producción

| Componente | Tecnología | Costo |
|-----------|-----------|-------|
| Frontend | Cloudflare Pages | $0 |
| Backend | Azure (créditos estudiante) | Variable |
| PostgreSQL | Azure Database | Variable |
| Storage | Azure Blob / Cloudflare R2 | Variable |
| Dominio | `duobalance.com` | ~$10-15/año |
| **Total** | | **Según uso** |

> Los créditos de Azure Student cubren inicialmente buena parte del costo mientras haya saldo.

---

## 11. Troubleshooting

### uploads no cargan en producción
**Causa:** `uploads/` no está en block volume o Nginx limita body size.
**Solución:** Verificar montaje (`df -h /opt/duobalance-api/uploads`) y Nginx (`client_max_body_size 6m;`).

### CORS error en navegador
**Causa:** `CORS_ORIGINS` no incluye el dominio de Cloudflare Pages.
**Solución:** Verificar `.env` en VM: `CORS_ORIGINS=https://duobalance-app.pages.dev` → reiniciar PM2.

### Links de email apuntan a localhost
**Causa:** `FRONTEND_URL` no configurado para producción.
**Solución:** Verificar `.env` en VM: `FRONTEND_URL=https://duobalance-app.pages.dev`.

### API no arranca después de reinicio VM
**Causa:** PM2 no está configurado para arrancar al boot.
**Solución:**
```bash
pm2 startup  # genera comando para systemd
pm2 save
```

### Certificado SSL no renueva
**Causa:** DuckDNS IP no apunta a la VM.
**Solución:** Actualizar DuckDNS IP. Verificar: `nslookup api-duobalance.duckdns.org`.

---

## 12. Referencias

- [Expo CLI — Environment variables](https://docs.expo.dev/guides/environment-variables/)
- [NestJS — Configuration](https://docs.nestjs.com/techniques/configuration)
- [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [PM2 — Quick Start](https://pm2.keymetrics.io/docs/quick-start/)
- [Let's Encrypt — Certbot](https://certbot.eff.org/)
- [DuckDNS](https://www.duckdns.org/)

---

**Última actualización:** 2026-08-20
