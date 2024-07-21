This is **monorepo**:

_ui-app_: react/next.js UI application

_packages/db_ - prisma db schema, sql, client libraries

_packages/logger_ - logger lib/config, used across applocations

_packages/definitions_ - gRPS Service definitions/schemas/types

_services/user-microservice_ - simple microservice for users, no real user management, jusn find bu user name or create

_services/schedule-microservice_ - all operation with schedule/tasks, all of them can be found in src/connect-actions

_services/master-cron-job_ - cron based process responsible to start to plan execution for next interval

_services/worker-process_ - execute planned schediled task/job


Each of them idempptent aand can be deployed/scalled separatly

to run locally fro demo:
```
docker compose up -d
```

UI should run on [http://localhost:3000](http://localhost:3000)
