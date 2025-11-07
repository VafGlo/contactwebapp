# Contact Web App

Aplicación Next.js + TypeScript para gestionar contactos. Incluye frontend (App Router), contexto de estado, componentes reutilizables y un servidor local simple en `server/` que expone una API JSON (ej. `/api/users`).

---

## Resumen rápido
- Frontend: Next.js (App Router) + TypeScript — código en `src/app`, `src/components`, `src/context`.
- Backend local: código TypeScript en `server/src` que expone endpoints en `http://localhost:4000/api/...`.
- Helper de consumo de API: `src/lib/reqres.ts`.

---

## Requisitos
- Node.js >= 18
- npm
- Puerto 3000 (Next) y 4000 (servidor API) libres por defecto

---

## Instalación

1. Desde la raíz del repo:
```bash
npm install
```

2. (Si aplica) Instalar dependencias del servidor:
```bash
cd server
npm install
cd ..
```

---

## Variables de entorno

Crea un `.env.local` en la raíz con, al menos:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

El frontend usa `NEXT_PUBLIC_API_URL` como base para las llamadas API. Si no se configura, el proyecto contiene fallback a `https://reqres.in` en algunos helpers.

---

## Ejecutar en desarrollo

1. Iniciar backend (desde `server/`):
```bash
cd server
npm run dev
```
Verificar endpoint:
```bash
curl "http://localhost:4000/api/users?page=1"
```

2. Iniciar frontend (desde la raíz):
```bash
npm run dev
# luego abrir la app:
$BROWSER http://localhost:3000
```

Sugerencia: ejecutar ambos en terminales separados o usar herramientas como tmux.

---

## Estructura del proyecto (relevante)

- src/app — rutas y UI (App Router)
- src/components — componentes reutilizables
- src/context — contexto y provider de contactos
- src/lib — helpers para consumir APIs (ej. reqres.ts)
- server/src — servidor local y rutas (ej. users.ts)
- public — recursos estáticos

---

## Endpoints (ejemplo)
- GET /api/users?page=N — lista paginada de usuarios (revisar `server/src/routes/users.ts` para detalles).

---

## Lint y formateo

Recomendado:
- ESLint + Prettier
- Configurar reglas y añadir scripts:
```bash
npm install -D eslint prettier eslint-config-prettier
npx eslint --init
```

---

## Buenas prácticas

- No hardcodear URLs: usar `NEXT_PUBLIC_API_URL`.
- Manejar errores en helpers fetch (ya hay manejo básico en `src/lib/reqres.ts`).
- Escribir tests unitarios para componentes y utilidades.
- Añadir scripts para arrancar frontend + backend en desarrollo si lo usas frecuentemente.

---

## Problemas comunes y soluciones rápidas

- Error al hacer fetch a `http://localhost:4000` en el navegador:
  - Asegúrate de que `server/` está corriendo.
  - Verifica `NEXT_PUBLIC_API_URL`.
  - Habilita CORS en el backend si es necesario.
  - Probar endpoint con `curl` para confirmar respuesta.

- Rutas del App Router que no cargan: revisar `src/app` (archivos `page.tsx`, `layout.tsx`) y la consola del navegador.

- Tipos TypeScript: verificar `tsconfig.json` y que los tipos (p. ej. ReqresUser) estén exportados/importados correctamente.

---

## Recursos

- Next.js: https://nextjs.org
- Vitest: https://vitest.dev
- React Testing Library: https://testing-library.com
- Playwright: https://playwright.dev

