FROM nginx:1.17.1-alpine

WORKDIR /usr/share/nginx/html
COPY ./client ./
#COPY settings.json ./

RUN apk add --update npm && npm install && npm rebuild node-sass && npm run build

EXPOSE 80