This is monorepo:

ui-app: react/next.js UI application

packages/db - prisma db schema, sql, client libraries

packages/logger - logger lib/config, used across applocations

packages/definitions - gRPS Service definitions/schemas/types

services/user-microservice - simple microservice for users, no real user management, jusn find bu user name or create

services/schedule-microservice - all operation with schedule/tasks, all of them can be found in src/connect-actions

services/master-cron-job - cron based process responsible to start to plan execution for next interval

services/worker/process - execute planned schediled task/job


Each of them idempptent aand can be deployed/scalled separatly

to run locally fro demo:
```
docker compose up -d
```

UI should run on [http://localhost:3000](http://localhost:3000)
