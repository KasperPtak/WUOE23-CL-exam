# Containerization & Linux 2024

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

3. Confirm nodes status on manager node

```sh
docker node ls
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

<br>
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

4. Check stack deployment status

```sh
docker stack services cl-eksamen-stack
```
