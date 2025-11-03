# ============================================
# DEVELOPMENT STAGE
# ============================================
FROM node:20-alpine AS development
WORKDIR /app

# Copiar archivos de configuración raíz
COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./

# Copiar package.json del workspace web
COPY apps/web/package.json apps/web/package.json

# ⚠️ IMPORTANTE: Copiar el código fuente ANTES de npm ci
# Esto es necesario para que npm workspaces funcione correctamente
COPY apps/web ./apps/web

# Instalar dependencias (ahora sí reconocerá tw-animate-css)
RUN npm ci

# El código se sobrescribirá con el volume, pero las dependencias ya están instaladas
WORKDIR /app/apps/web

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ============================================
# BUILD STAGE (para producción)
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN npm run build

# ============================================
# RUNTIME STAGE (producción)
# ============================================
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/package.json
COPY --from=build /app/package.json ./package.json

WORKDIR /app/apps/web

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]