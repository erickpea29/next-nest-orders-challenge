# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci
COPY tsconfig.base.json ./
COPY apps/api ./apps/api
RUN npx nest build apps/api

# runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
RUN npm pkg delete scripts && npm i --omit=dev
EXPOSE 3001
CMD ["node", "dist/main.js"]
