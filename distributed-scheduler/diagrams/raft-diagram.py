from diagrams import Diagram, Edge, Cluster
from diagrams.generic.blank import Blank
from diagrams.alibabacloud.compute import ECS, BatchCompute, OperationOrchestrationService

with Diagram("Consensus Algorithm", show=False, direction="LR"):
    start = Blank("")
    leader = BatchCompute("Leader")

    with Cluster("Followers"):
        follower = ECS("Follower") 
        follower1 = ECS("Follower")
        follower2 = ECS("Follower")
        follower3 = ECS("Follower")
        follower4 = ECS("Follower")
        follower - follower1
        follower - follower2
        follower - follower3
        follower - follower4
        follower1 - follower2
        follower1 - follower3
        follower1 - follower4
        follower2 - follower3
        follower2 - follower4
        follower3 - follower4

    start >> Edge(label="starts up", color="#0000ff", text="#ff0000") >> follower
    
    with Cluster("Candidate"):
        candidate = OperationOrchestrationService("Candidate")
        candidate1 = OperationOrchestrationService("Candidate")
        candidate2 = OperationOrchestrationService("Candidate")
        candidate - candidate1
        candidate1 - candidate2
        candidate >> Edge(label="times out, new election") >> candidate2

    follower4 >> Edge(label="times out, starts election" , color="#0000ff") >>candidate2
    candidate >> Edge(label="receives votes from majority of servers", color="#0000ff") >> leader
    candidate1 >> Edge(label="discovers current leader or new term", color="#0000ff") >> follower3
    leader >> Edge(label="discovers server with higher term", color="#0000ff") >> follower
    

    
    
    # candidate = OperationOrchestrationService("Candidate")
    # 

    
    #     >> Edge(label="times out, starts election" , color="#0000ff") >>candidate
    #     >> Edge(label="receives votes from majority of servers", color="#0000ff") \
    #     >> leader

    # with Cluster("Candidate"):
    #     candidate >> Edge(label="times out, new election") >> candidate
    
    
    # candidate 
    # candidate >> Edge(label="discovers current leader or new term") >> follower
    # leader >> Edge(label="discovers server with higher term") >> follower
 