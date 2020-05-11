# Snake games

There is the project with different types of snake game 

## Setup

For prod mode

```
cp settings.json.dist settings.json // modify if need with your own params
cd docker
docker-compose up --build
```

For dev mode


```
cp settings.json.dist settings.json // modify if need with your own params
cp settings.json client/settings.json
cp settings.json server/settings.json
cd docker
docker-compose -f docker-compose-dev.yml up --build
docker exec -it snake_client npm run start // run this in another shell window
```
