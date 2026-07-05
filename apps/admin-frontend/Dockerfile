FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY apps/admin-frontend/package.json apps/admin-frontend/package.json
RUN pnpm install --filter @knife/admin-frontend... --frozen-lockfile=false

FROM deps AS build
COPY packages packages
COPY apps/admin-frontend apps/admin-frontend
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/admin-frontend/node_modules /app/apps/admin-frontend/node_modules
WORKDIR /app/apps/admin-frontend
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --chown=nextjs:nextjs --from=build /app/apps/admin-frontend/.next/standalone ./
COPY --chown=nextjs:nextjs --from=build /app/apps/admin-frontend/.next/static ./apps/admin-frontend/.next/static
COPY --chown=nextjs:nextjs --from=build /app/apps/admin-frontend/public ./apps/admin-frontend/public
USER nextjs
EXPOSE 3001
ENV PORT=3001
CMD ["node", "apps/admin-frontend/server.js"]
