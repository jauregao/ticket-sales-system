FROM node:21-slim

RUN apt update && apt install -y openssl procps

RUN npm install -g @nestjs/cli@10.3.2

WORKDIR /home/node/app

COPY id_rsa /root/.ssh/id_rsa

RUN chmod 600 /root/.ssh/id_rsa

RUN eval "$(ssh-agent -s)" && ssh-add /root/.ssh/id_rsa

USER node

CMD tail -f /dev/null
