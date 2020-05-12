# Snake games

There is the project with different types of snake game 

## Setup

Prepare before setup:

```
cp client/settings.json.dist client/settings.json // modify if need with your own params
cp server/settings.json.dist server/settings.json // modify if need with your own params
```

For prod mode

```
cd docker
docker-compose up --build
```

For dev mode


```
cd docker
docker-compose -f docker-compose-dev.yml up --build
docker exec -it snake_client npm run start // run this in another shell window
```
