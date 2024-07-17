from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.compute import Server
from diagrams.onprem.client import Users, Client
from diagrams.generic.storage import Storage
from diagrams.alibabacloud.database import DatabaseBackupService, DataManagementService, HybriddbForMysql
from diagrams.alibabacloud.network import SmartAccessGateway
with Diagram("Distributed Scheduler", show=False):
    users = Users("User")
    client = Client("Client API/UI")

    with Cluster("Service Cluster"):
        leader = Server("cron-srv: leader")
        outages = [Server("cron-srv: outages"), Server("cron-srv: outages")]
        servers = [
            Server("cron-srv: follower"),
            Server("cron-srv: follower"),
            Server("cron-srv: follower"),
            Server("cron-srv: follower"),
            Server("cron-srv: follower")]
        leader >> Edge(label="job/sync") >> servers
        servers >> Edge(label="status") >> leader 
        leader >> Edge(label="attempt - job/sync", style="dotted", color="red") >> outages

    users >> client >> leader
    users << client << leader


    with Diagram("Leader", show=False):
        with Cluster("Leader"):
            storage = DataManagementService("Execution Log Storage")
            cron = DatabaseBackupService("Cron")
            clusterData = HybriddbForMysql("Cron Service Cluster Nodes Data")

    with Diagram("Node", show=False):
        with Cluster("Node"):
            storage = DataManagementService("Execution Log Storage")
            clusterData = HybriddbForMysql("Cron Service Cluster Nodes Data")
            master = SmartAccessGateway("Leader Node info")


