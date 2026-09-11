# Integración Frontend — Google OAuth 2.0 (DuoBalance)

> **Documentación de Autenticación Federada en el Frontend**  
> **Estado:** Implementado con `expo-auth-session`  
> **Nota de Seguridad:** Este repositorio es público. **NUNCA** almacenar aquí secretos de cliente (`Client Secret`), claves privadas ni tokens de servicio. Toda validación criptográfica y credenciales privadas residen exclusivamente en el repositorio privado del backend (`duobalance-api`).

---

## 1. Configuración de Entorno (Frontend)

Para habilitar el botón "Continuar con Google" en tu entorno local:

1. Crea o edita tu archivo `.env` local (ignorado por Git):
   ```env
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
   ```
2. Consulta `.env.example` para la lista completa de variables públicas de Expo.
3. El frontend está protegido contra excepciones en tiempo de render: si estas variables no están configuradas, el hook `useGoogleAuth` degrada elegantemente sin romper la aplicación y muestra una alerta informativa al pulsar el botón.

---

## 2. Parámetros de Plataforma Web (Google Cloud Console)

Cuando configures las credenciales de tipo **Aplicación Web** en Google Cloud Console:

- **Orígenes autorizados de JavaScript**:
  - `http://localhost:8081` (Desarrollo local Metro Web)
  - `http://localhost:8082` (Puerto alternativo)
  - `https://duobalance-app.pages.dev` (Despliegue Cloudflare Pages)

- **URIs de redireccionamiento autorizados**:
  - `http://localhost:8081`
  - `http://localhost:8082`
  - `https://duobalance-app.pages.dev`

- **Scopes requeridos**:
  - `openid`
  - `profile`
  - `email`

---

## 3. Flujo en el Cliente (`DuoBalance-app`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DuoBalance-app                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                  [1] Usuario pulsa "Continuar con Google"
                                    │
                                    ▼
       Llama a promptAsync() vía Google.useIdTokenAuthRequest
                                    │
                                    ▼
           Popup de consentimiento de Google Cloud Platform
                                    │
                                    ▼
                   Retorna response.params.id_token
                                    │
                                    ▼
               Envía idToken a POST /auth/google (Backend)
                                    │
                                    ▼
            Backend valida criptográficamente con Google JWKS
             y emite access_token + refresh_token de DuoBalance
                                    │
                                    ▼
        Almacena tokens en SecureStore / LocalStorage y redirige
                            a /(protected)
```

---

## 4. Archivos Clave en el Frontend

- [`src/features/auth/use-google-auth.ts`](file:///home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/features/auth/use-google-auth.ts): Hook que encapsula `expo-auth-session`, fallback seguro para web, validación de estado y llamada al backend.
- [`src/components/auth/social-login-button.tsx`](file:///home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/components/auth/social-login-button.tsx): Botón con estados de carga e interactividad accesible.
- [`src/services/api/auth.ts`](file:///home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/services/api/auth.ts): Función `loginWithGoogle(idToken)`.
- [`src/app/(auth)/login.tsx`](file:///home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/app/(auth)/login.tsx) y [`src/app/(auth)/register.tsx`](file:///home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/app/(auth)/register.tsx): Vistas conectadas al hook.
