FROM oven/bun:1 AS base
 
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN bun global add turbo@^2
RUN bun global add turbo@^2
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune @schedule-repo/master-cron-job --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lockb ./bun.lockb
RUN bun install
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN bun turbo run build --filter=web...
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 bun
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=installer /app/@schedule-repo/master-cron-job/next.config.js .
COPY --from=installer /app/@schedule-repo/master-cron-job/package.json .
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/@schedule-repo/master-cron-job/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/@schedule-repo/master-cron-job/.next/static ./@schedule-repo/master-cron-job/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/@schedule-repo/master-cron-job/public ./@schedule-repo/master-cron-job/public
 
CMD node apps/web/server.js