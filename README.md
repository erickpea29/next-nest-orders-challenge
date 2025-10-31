# Mini-Suite (Next.js + NestJS)

Realiza un fork de este repositorio y clónalo en tu máquina local, 

1) Ve a la página del repositorio en GitHub.
2) Haz clic en el botón "Fork" en la esquina superior derecha de la página.
3) Esto creará una copia del repositorio en tu cuenta de GitHub.
4) Abre tu terminal y navega hasta el directorio donde deseas clonar el repositorio.
5) Ejecuta el siguiente comando, reemplazando `<tu-usuario>` con tu nombre de usuario de GitHub:

```
git clone https://github.com/<tu-usuario>/next-nest-orders-challenge.git
```

6) Ahora tienes una copia local del repositorio en tu máquina. Puedes comenzar a trabajar en él y hacer commits como lo harías con cualquier otro repositorio Git.


--- 

Este repo es un **challenge técnico**. Tu objetivo:
1) **Hacer funcionar** el snippet end-to-end (API NestJS + Web Next.js, flujo básico de “Orders”).
- Alcance: CRUD mínimo de Orders en API; listado y alta en Web.
- Integración: variables de entorno configuradas; contrato de API respetado.
- Validación: ejecución vía docker-compose; happy path y manejo de errores visibles.
- Frontend (Next.js App Router):
  - Estructura: app/ con layout.tsx, page.tsx, loading.tsx, error.tsx y componentes reutilizables.
  - Server vs Client Components: usar Server Components para data fetching y Client para interactividad.
  - Data fetching: llamadas a la API; manejo de cache y revalidate (ISR) donde aplique; estados de error/carga.
  - Formularios: creación de Orders con validación y feedback (success/error).
  - Estado y navegación: actualizar el listado tras crear; invalidación de cache; prefetch de rutas críticas.
  - Configuración: .env.local.example con variables (p.ej. NEXT_PUBLIC_API_BASE_URL); no exponer secretos.
  - Accesibilidad y SEO: metadatos, roles/labels, navegación por teclado.

2) **Arquitectura y diseño** (modularización, capas, desacople, principios SOLID).
- Implementa mejoras a nivel de Arquitectura y Diseño, te recomendamos seguir estos conceptos: 
  - Capas: Controllers/Routes, Use Cases/Services, Repositories/Adapters.
  - Dominio: modelos y lógica de negocio aislada; puertos y adaptadores.
  - Desacople: interfaces/tokens para inyección de dependencias.

3) **Roadmap** con hitos y criterios de éxito.
- Imagina que eres un líder de desarrollo y defines el roadmap para agregar una nueva funcionalidad, crea un documento .MD con el orden a ejecutar la nueva funcionalidad

4) **Infraestructura** 
- Crea un documento .MD con la arquitectura para subir a producción, base de datos, EC2 o cualquier elemento de cloud necesario, CI /  CD, etc.
- Alcance: diagrama de arquitectura (componentes, redes, flujos) y decisiones clave.
- Datos: elección de base de datos, esquema, replicación, backups y restauración; migraciones de datos y estrategia de versionado.
- CI/CD: pipeline de build/test/deploy, artefactos, strategy (blue/green/canary), rollback y control de cambios.
- Observabilidad: logging, métricas, tracing; health-checks, alertas
- Seguridad: gestión de secretos
- Referencias: enlaza a docs/architecture.md y ADRs relevantes (docs/adr-001-architecture.md).

5) **Testing**.
- API: unitarios (servicios/uso de casos) e integración (controllers/repos); cobertura ≥ 70%.
- Web: e2e de flujos clave (listar, crear, error); reportes integrados en CI.

---

## Estructura
```
/apps
  /api       # NestJS (REST)
  /web       # Next.js (App Router)
/docs        # arquitectura, ADR, roadmap, OpenAPI
/infra
  compose.yaml
.github/workflows/ci.yaml
```

## Requisitos previos
- Node.js 20+
- Docker & docker-compose (opcional pero recomendado)

---

## Variables de entorno
Copia los ejemplos y ajusta si es necesario:

```
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

---

## Ejecutar con Docker (recomendado)
Desde la raíz del repo:

```
docker compose -f infra/compose.yaml up --build
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Docs OpenAPI: http://localhost:3001/docs
- DB: Postgres en `localhost:5432` (user: postgres / pass: postgres / db: orders)

Para destruir contenedores/volúmenes:
```
docker compose -f infra/compose.yaml down -v
```

---

## Ejecutar en local (sin Docker)
Instala dependencias y corre los dos proyectos en paralelo:

```
npm ci
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

> Asegúrate de tener una base de datos Postgres corriendo en `DATABASE_URL` (ver `apps/api/.env`).

Compilar:
```
npm run build
```

Tests:
```
npm test
```

Lint (suave, no bloqueante):
```
npm run lint
```

---

## Endpoints principales
- `GET /orders?page=1&size=10&q=matcha` – lista con paginación/búsqueda.
- `POST /orders` – crea orden (usa `Idempotency-Key` para idempotencia).
- `PATCH /orders/:id` – actualiza `status` (NEW|PAID|CANCELLED).
- `GET /health` – health check.

OpenAPI disponible en `/docs` y un contrato en `docs/api-contract.yaml`.

---

## Lo que evaluamos
- **Correctitud funcional** (CRUD parcial, paginación, validaciones).
- **Patrones/arquitectura** (capas, SOLID, idempotencia).
- **Frontend** (UX: loading/error, accesibilidad, búsqueda/paginación).
- **Infra/DevEx** (Docker, compose, health checks, CI).
- **Calidad técnica** (manejo de errores, CORS, seguridad básica).
- **Documentación** (README claro, ADRs, diagramas si los agregas).


Happy conding!

