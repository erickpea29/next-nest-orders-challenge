FROM node:20-alpine AS development
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json

RUN npm ci

WORKDIR /app/apps/api

EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json

RUN npm ci

COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN npx nest build


FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json

RUN npm pkg delete scripts && npm i --omit=dev

EXPOSE 3001
CMD ["node", "dist/main.js"]