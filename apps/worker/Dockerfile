FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/package.json
# Keep a local copy of the Prisma schema inside the worker package so Prisma can
# resolve the correct project root and generate the client without auto-installing.
COPY apps/api/prisma apps/worker/prisma
RUN pnpm install --filter @knife/worker... --frozen-lockfile=false
WORKDIR /app/apps/worker
RUN pnpm exec prisma generate --schema prisma/schema.prisma

FROM deps AS build
WORKDIR /app
COPY apps/worker /app/apps/worker
# Restore the copied schema after the source copy, because the worker source tree
# does not own a prisma directory in the repository.
COPY apps/api/prisma /app/apps/worker/prisma
WORKDIR /app/apps/worker
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/worker/node_modules /app/apps/worker/node_modules
COPY --from=build /app/apps/worker/dist /app/apps/worker/dist
COPY --from=build /app/apps/worker/prisma /app/apps/worker/prisma
COPY --from=build /app/apps/worker/package.json /app/apps/worker/package.json
WORKDIR /app/apps/worker
CMD ["node", "dist/main.js"]
