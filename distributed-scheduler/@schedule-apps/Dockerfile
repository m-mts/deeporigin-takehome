FROM node:current-bullseye  AS base
RUN apt-get update
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.16"
ENV PATH="/root/.bun/bin:$PATH"

RUN bun --version

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build


FROM base AS release
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.17"
ENV PATH="/root/.bun/bin:$PATH"
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=base /app .

copy --from=base /app/docker_entrypoint /usr/bin/docker_entrypoint
RUN chmod +x /usr/bin/docker_entrypoint

RUN apt-get update && apt-get install -y cron

COPY --from=base /app/services/master-cron-job/docker-cron-job /etc/cron.d/docker-cron-job
RUN chmod 0644 /etc/cron.d/docker-cron-job
RUN crontab /etc/cron.d/docker-cron-job
RUN touch /var/log/cron.log



WORKDIR /app

EXPOSE 8080/tcp
ENTRYPOINT ["/usr/bin/docker_entrypoint"]