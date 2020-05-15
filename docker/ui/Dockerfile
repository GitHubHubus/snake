FROM nginx:1.17.1-alpine

WORKDIR /usr/share/nginx/html
COPY ./client/package*.json ./
RUN apk add --update npm && npm install
COPY ./client ./

RUN npm rebuild node-sass && npm run build

EXPOSE 80