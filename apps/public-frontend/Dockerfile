FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY apps/public-frontend/package.json apps/public-frontend/package.json
RUN pnpm install --filter @knife/public-frontend... --frozen-lockfile=false

FROM deps AS build
COPY packages packages
COPY apps/public-frontend apps/public-frontend
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/public-frontend/node_modules /app/apps/public-frontend/node_modules
WORKDIR /app/apps/public-frontend
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --chown=nextjs:nextjs --from=build /app/apps/public-frontend/.next/standalone ./
COPY --chown=nextjs:nextjs --from=build /app/apps/public-frontend/.next/static ./apps/public-frontend/.next/static
COPY --chown=nextjs:nextjs --from=build /app/apps/public-frontend/public ./apps/public-frontend/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/public-frontend/server.js"]
