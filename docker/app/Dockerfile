FROM node:12

WORKDIR /usr/src/app

COPY ./server ./
#COPY settings.json ./
RUN npm install

EXPOSE 8080

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && node index.js