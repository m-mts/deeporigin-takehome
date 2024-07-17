FROM oven/bun:1.1-alpine AS base
 
FROM base AS builder
RUN apk update && apk add --no-cache bash python3 gcc make
ENV enable_lto=false
# RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /all-apps
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN bun global add turbo@^2

COPY . .

#RUN bun install

#RUN bun run build


CMD ["sh"]

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }

# RUN bunx @turbo/workspaces@latest convert ./ yarn --skip-install

# RUN turbo prune --scope=@schedule-repo/ui-app --docker
 
# # Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer
# #RUN apk update
# #RUN apk add --no-cache libc6-compat
# WORKDIR /app
 
# # First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
# RUN bun install --yarn
 
# # Build the project
# COPY --from=builder /app/out/full/ .
# RUN bun turbo run build --filter=web...
 
# FROM base AS runner
# WORKDIR /app
 
# USER bun
 
# COPY --from=installer /app/@schedule-repo/ui-app/next.config.js .
# COPY --from=installer /app/@schedule-repo/ui-app/package.json .
 
# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=nextjs:nodejs /app/@schedule-repo/ui-app/.next/standalone ./
# COPY --from=installer --chown=nextjs:nodejs /app/@schedule-repo/ui-app/.next/static ./@schedule-repo/ui-app/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/@schedule-repo/ui-app/public ./@schedule-repo/ui-app/public

# ENV NODE_ENV=production
# ENV HOST=localhost
# ENV PORT=80

# ENV SESSION_PASSWORD=aZ3$7dE9F2G!5Y4z@1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4zA72B%4C&5D6E7F*8G
# ENV SESSION_COOKIE_NAME=ui-app-icon-session-name-3aB7dE9F2G

# ENV USER_SERVICE_BASE_URL=http://localhost:8080
# ENV SCHEDULE_SERVICE_BASE_URL=http://localhost:8081

# CMD ["bun", "run", "start"]