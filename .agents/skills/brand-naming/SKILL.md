---
name: brand-naming
description: Use when brainstorming, generating, evaluating, or validating names for applications, products, fintechs, startups, or brands. Audits the codebase, features, and architecture to extract true product identity, applies linguistic territories, and verifies official ICANN domains.
---

# Brand Naming & Product Identity

Framework profesional de naming para aplicaciones móviles y productos digitales. Basa cada propuesta en la realidad del código fuente, el flujo de usuario y la arquitectura del proyecto, combinándola con fonética y validación oficial de dominios.

---

## 🚀 Proceso de Naming en 5 Fases

### 🔍 Fase 0: Auditoría y Escaneo Holístico del Proyecto (Obligatorio)
Antes de formular una sola idea de nombre, el agente DEBE explorar y entender cómo se compone el proyecto:
1. **Inspección de Identidad y Configuración:**
   - Leer `app.json`, `package.json` y los manifiestos de la app.
   - Revisar `assets/` para entender el estilo visual existente (logos, colores, iconografía).
2. **Inspección de la Lógica de Negocio y Dominio:**
   - Revisar los modelos de datos y tipos TypeScript (`docs/DATA_STRUCTURE.md`, interfaces, schemas) para identificar las entidades clave (ej. saldos, participantes, gastos, prorrateos, balances).
3. **Inspección de la Experiencia de Usuario (UI / Navegación):**
   - Auditar las rutas y pantallas (`app/` o `src/screens/`) para entender el flujo real del usuario: ¿qué ve primero?, ¿dónde ocurre el momento "ajá" o de mayor valor?
4. **Lectura de Documentación Existente:**
   - Consultar `docs/ARCHITECTURE.md`, `docs/PLAN.md` o README para capturar la visión del creador.

---

### 🧬 Fase 1: Extracción del ADN y Arquetipo de Marca
Con los datos reales del código en mano:
1. **El Verbo Clave del Producto:** La acción nuclear que ejecuta el software (ej. *saldar, dividir, equilibrar, sincronizar*).
2. **El Dolor Técnico/Emocional Resuelto:** Qué problema elimina en la vida del usuario (ej. *la incomodidad de cobrar a un amigo, las cuentas desbalanceadas*).
3. **El Arquetipo de Marca:**
   - *El Amigo / Colaborador:* Cercano, coloquial, sin tensiones (*Mitadita, Atablas*).
   - *El Sabio / Financiero:* Preciso, técnico, confiable (*DualBudget, Settle*).
   - *El Mago / Tech:* Abstracto, ágil, neobanco moderno (*Duobal, Revolut, Monzo*).

---

### 🗺️ Fase 2: Generación en los 4 Territorios Lingüísticos
Generar propuestas categorizadas para evitar el "tiro al blanco":
1. **Territorio Funcional:** Qué hace el software de forma explícita (*Splitwise, PayPal*).
2. **Territorio Evocativo:** El alivio o resultado emocional (*Slack, Paz, Balance*).
3. **Territorio Metafórico:** Analogías de la vida real o expresiones culturales (*Atablas, Robinhood, Plaid*).
4. **Territorio Neologismo / Tech:** Nombres de una sola palabra, cortos (5-7 letras) con fonética premium (*Duobal, Klarna, Brex*).

---

### 🗣️ Fase 3: Filtro Fonético y de Usabilidad
- **Métrica silábica:** 2 a 3 sílabas máximo (5 a 8 letras).
- **Prueba de la radio:** ¿Se puede escribir sin dudar al escucharlo una sola vez?
- **Eufonía:** Alternancia consonante-vocal para fácil pronunciación.
- **Chequeo transcultural:** Verificar que no tenga significados negativos en otros idiomas principales.

---

### 🛡️ Fase 4: Validación Oficial y Legal en Vivo
**REGLA:** Nunca presentar un nombre al usuario sin verificar su disponibilidad técnica:
1. **Verisign RDAP para dominios `.com`:**
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" "https://rdap.verisign.com/com/v1/domain/<nombre>.com"
   # 404 = LIBRE Y DISPONIBLE PARA COMPRA
   # 200 = OCUPADO / REGISTRADO
   ```
2. **IANA RDAP para dominios `.app`:**
   ```bash
   curl -s -A "Mozilla/5.0" "https://rdap.iana.org/domain/<nombre>.app" | grep -q "404"
   ```
3. **Verificación de Apps Activas:** Búsqueda en Google y tiendas (Play Store / App Store) para garantizar que no haya otra app en el mismo nicho con nombre idéntico o confuso.
