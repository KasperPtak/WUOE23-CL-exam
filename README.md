# Containerization & Linux 2024
In this project, we were tasked to containerize 2 projects, a vue frontend and an expressJS backend, and deploy it on 3 computers using some container orchestration tool.
To do this, 3 computers were given, running a bare install of ubuntu 22.04 LTS with out any desktop environment. This forces the use of the CLI to install docker and utilize it to build images and run a docker swarm cluster and manage permissions and groups. 
## Node setup

### Step 1: Update packagelist and upgrade packages

1. Update packagelist and upgrade installed packages

```bash
sudo apt update && sudo apt upgrade
```

### Step 2: Setup docker

1. Setup docker's apt repo

```sh
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

2. Install docker packages

```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. Verify docker installation

```sh
sudo docker run hello-world
```

4. Post installation - Add docker group and add user to docker group

```sh
sudo groupadd docker && sudo usermod -aG docker $USER
```

5. Reboot to let groups take effect

```sh
sudo systemctl reboot
```

6. Verify docker can run without sudo

```sh
docker run hello-world
```

### Step 3: Setup swarm cluster

1. init swarm cluster on manager

```sh
docker swarm init
```

2. Join swarm cluster on worker nodes

```sh
docker swarm join --token $SWARM_INIT_TOKEN $MANAGER_IP:2377
```

To test if the swarm is configured and all nodes are on the same cluster we can use:
```sh
docker node ls
```
It should give an output looking something like: 
```sh
ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
8w2v5dzgj83yzetlj2o36xgol *   node01     Ready     Active         Leader           26.1.2
vinimxsizzqo2twqkx5gnm3wy     node02     Ready     Active                          26.1.2
lzxqeqk3bidoz5g3j301at4ss     node03     Ready     Active                          26.1.2
```
## Build and deploy the project

### Step 1 build and push images to docker hub

1. Log in to docker hub

```sh
docker login
```

2. create a Dockerfile for the frontend

&nbsp;&nbsp;&nbsp;&nbsp;[Dockerfile frontend](https://github.com/KasperPtak/WUOE23-CL-exam/blob/main/frontend/Dockerfile)

3. build and push to docker hub

&nbsp;&nbsp;&nbsp;&nbsp;Make sure you're in the right directory

```sh
cd frontend
```

```sh
docker build -t kasperptak/cl-exam-frontend
```

```sh
docker push kasperptak/cl-exam-frontend
```

&nbsp;&nbsp;&nbsp;&nbsp;[link to image on the hub](https://hub.docker.com/repository/docker/kasperptak/cl-exam-frontend/general)

4. create dockerfile for the backend

&nbsp;&nbsp;&nbsp;&nbsp;[Dockerfile backend](https://github.com/KasperPtak/WUOE23-CL-exam/blob/main/backend/Dockerfile)

5. push to docker hub

```sh
cd backend
```

```sh
docker build -t kasperptak/cl-exam-backend
```

```sh
docker push kasperptak/cl-exam-backend
```

&nbsp;&nbsp;&nbsp;&nbsp;[link to image on the hub](https://hub.docker.com/repository/docker/kasperptak/cl-exam-backend/general)

### Step 2 create & deploy project on cluster

1. create the docker-compose

&nbsp;&nbsp;&nbsp;&nbsp;[docker-compose.yml](https://github.com/KasperPtak/WUOE23-CL-exam/blob/main/docker-compose.yaml)

2. Clone project onto manager node

```sh
git clone https://github.com/KasperPtak/WUOE23-CL-exam && cd WUOE23-CL-exam 
```

3. Deploy stack on cluster

```sh
docker stack deploy --compose-file docker-compose.yml cl-eksamen-stack
```

To test if the stack were successfully deployed, we can use:

```sh
docker stack services cl-eksamen-stack
```
It should give an output looking like this:
```sh
ID             NAME               MODE         REPLICAS   IMAGE                                PORTS
58olu8b6msbm   cl-exam_backend    replicated   2/2        kasperptak/cl-exam-backend:latest    *:3000->3000/tcp
j303jrlclehz   cl-exam_db         replicated   1/1        mysql:latest                         *:3306->3306/tcp
rfp9es9m7yve   cl-exam_frontend   replicated   2/2        kasperptak/cl-exam-frontend:latest   *:5173->5173/tcp
```
Which displays the replication status of each service, which image it is using, and which ports are exposed.
