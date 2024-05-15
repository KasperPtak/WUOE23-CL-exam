FROM node:lts-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

COPY ./seed.sh /seed.sh

RUN chmod +x /seed.sh

EXPOSE 3000

ENTRYPOINT [ "/seed.sh" ]
