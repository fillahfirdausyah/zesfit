# Zesfit Studio: static build served by nginx.
# Build context is the repo root, because web/ imports ../packages/hwt:
#   docker build -f web/Dockerfile -t zesfit-studio .

FROM oven/bun:1 AS build
WORKDIR /repo

COPY packages/hwt/package.json packages/hwt/bun.lock packages/hwt/
RUN cd packages/hwt && bun install --frozen-lockfile --production

# Not --frozen-lockfile: web/bun.lock is lockfileVersion 2, which bun 1.3 rejects as unknown.
COPY web/package.json web/bun.lock web/
RUN cd web && bun install

COPY packages/hwt packages/hwt
COPY web web
# Cloudflare-only artifacts; nginx.conf replaces _headers.
RUN cd web && bun run build && rm -f dist/wrangler.json dist/_headers dist/.assetsignore

FROM nginx:stable-alpine
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/web/dist /usr/share/nginx/html
EXPOSE 80
