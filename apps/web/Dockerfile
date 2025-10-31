# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci
COPY apps/web ./apps/web
COPY tsconfig.base.json ./
RUN npm --workspace apps/web run build

# runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/package.json ./package.json
COPY --from=build /app/apps/web/public ./public
RUN npm pkg delete scripts && npm i --omit=dev
EXPOSE 3000
CMD ["npx","next","start","-p","3000"]
