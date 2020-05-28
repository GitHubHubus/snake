FROM nginx:1.17.1-alpine

WORKDIR /usr/share/nginx/html
COPY ./client/package*.json ./
RUN apk add --update npm && npm install
COPY ./client ./
RUN npm rebuild node-sass && npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 80