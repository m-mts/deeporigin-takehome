from diagrams import Diagram, Cluster, Edge
from diagrams.k8s.compute import Pod
from diagrams.k8s.network import Service
from diagrams.onprem.client import User
from diagrams.programming.language import NodeJS
from diagrams.onprem.queue import Kafka
from diagrams.onprem.database import Postgresql

with Diagram("K8s CronJob-Based Microservices System", show=False):

    user = User("User")
    
    with Cluster("Kubernetes Cluster"):
        k8s_service = Service("K8s Service")

        with Cluster("Next.JS UI (Bun)"):
            ui = [Pod("UI (Bun)"),
                  Pod("UI (Bun)"),
                  Pod("UI (Bun)")]

        with Cluster("Master Cron Job"):
            cron_job = Pod("Master-Cron-Job (Bun)")

        with Cluster("Schedule Microservice"):
            schedule_microservice = [Pod("Schedule-Microservice (Bun)"),
                                     Pod("Schedule-Microservice (Bun)"),
                                     Pod("Schedule-Microservice (Bun)")]

        with Cluster("Worker Processes"):
            workers = [Pod("Worker (Bun)"),
                       Pod("Worker (Bun)"),
                       Pod("Worker (Bun)")]

    db = Postgresql("Postgres DB")
    mq = Kafka("BullMQ (DragonflyDB)")

    user >> ui[0]
    ui[0] >> schedule_microservice[0]
    cron_job >> schedule_microservice[0]
    schedule_microservice[0] >> k8s_service
    schedule_microservice[0] >> Edge(label="Scheduled Jobs") >> mq
    workers[0] >> Edge(label="Delayed Tasks") >> mq
    schedule_microservice[0] >> db
    workers[0] >> db