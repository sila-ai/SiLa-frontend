# Populating New Task Definition JSON File with new parameters
AWSREGION=eu-west-1
ECS_CLUSTER=sila
SERVICE_NAME=frontend
TASK_DEFINITION=frontend

echo -e "\r\n*** Sila Server: Populating New Task Definition JSON File with new parameters ***"


NEW_TASK_DEFINITION=$(echo `cat <<EOF
{
        "containerDefinitions": [{
                        "logConfiguration": {
                                "logDriver": "awslogs",
                                "options": {
                                        "awslogs-group": "frontend",
                                        "awslogs-region": "eu-west-1",
                                        "awslogs-stream-prefix": "ecs"
                                }
                        },
                        "portMappings": [{
                                "hostPort": 8080,
                                "protocol": "tcp",
                                "containerPort": 8080
                        }],
                        "memoryReservation": 400,
                        "image": "912998523803.dkr.ecr.eu-west-1.amazonaws.com/frontend:latest",
                        "name": "frontend"
                },  
        ],
        "family": "sila-frontend"
}
EOF`
)


    echo -e "${NEW_TASK_DEFINITION}\r\n"
    # echo $NEW_TASK_DEFINITION | jq . > NewTaskDefinitionJSON.JSON
    # Registering New Task Definition
    echo -e "\r\n*** frontend server: Registering New Task Definition ***"
    NEW_TASK_INFO=$(aws ecs register-task-definition --region ${AWSREGION} --cli-input-json "$NEW_TASK_DEFINITION")
    echo -e "${NEW_TASK_INFO}\r\n"
    #echo $NEW_TASK_INFO | jq .
    # Getting the Version of the New Task Definition
    echo -e "\r\n*** frontend Server: Getting the Version of the New Task Definition ***"
    NEW_REVISION=$(echo $NEW_TASK_INFO | jq '.taskDefinition.revision')
    #echo $NEW_REVISION
    echo -e "${NEW_REVISION}\r\n"
    # Updating the Service with the New Task Definition
    echo -e "\r\n*** frontend Server: Updating the Service with the New Task Definition ***"
    aws ecs update-service --cluster ${ECS_CLUSTER} --region ${AWSREGION} --service ${SERVICE_NAME} --task-definition ${TASK_DEFINITION}:${NEW_REVISION}
    echo ""
    # Force Deployment of New Task Definition with the running Service
    echo -e "\r\n*** frontend Server: Force Deployment of New Task Definition with the running Service ***"
    aws ecs update-service --cluster ${ECS_CLUSTER} --region ${AWSREGION} --service ${SERVICE_NAME}  --force-new-deployment
    echo ""
    echo ""
    echo ""
