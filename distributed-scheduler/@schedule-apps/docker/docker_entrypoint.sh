#!/bin/sh

set -e

cd /app

cron

tail -f /var/log/cron.log &

cd /app
exec bun run dev-docker