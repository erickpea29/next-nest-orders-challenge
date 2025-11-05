FROM node:20-alpine AS development
WORKDIR /app


COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./


COPY apps/web/package.json apps/web/package.json


COPY apps/web ./apps/web

RUN npm ci


WORKDIR /app/apps/web

EXPOSE 3000
CMD ["npm", "run", "dev"]


FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN npm run build


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