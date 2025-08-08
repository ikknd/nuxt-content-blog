---
title: Redis + redis-commander + Docker — How to set up
date: 2020-01-23
description: "Docker Compose setup for Redis with persistent storage and redis-commander UI."
tags:
  - docker
  - redis
  - redis-commander
  - docker-compose
image: http://localhost:3000/articles/docker-recipe-4-redis.jpg
readingTime: "1"
---

## Introduction

This guide demonstrates Docker Compose setup for Redis with persistent storage and redis-commander UI.

You can find the source files for this tutorial in the `recipe-04` folder of this repository: [https://github.com/ikknd/docker-study](https://github.com/ikknd/docker-study){target="_blank"}

![preview](/articles/docker-recipe-4-redis.jpg)

## docker-compose.yml

Create a `docker-compose.yml` file with the following content:

```yaml
version: "3.7"

services:

  redis:
    image: redis:latest
    ports:
      - 6379:6379
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis-data:/data

  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379
      - HTTP_USER=root
      - HTTP_PASSWORD=qwerty
    ports:
      - 8081:8081
    depends_on:
      - redis

volumes:
  redis-data:
```

## What this does

- Creates a Docker volume `redis-data` — Redis data is persisted there so it survives container restarts.
- `command: ["redis-server", "--appendonly", "yes"]` — starts Redis with AOF persistence enabled.
- `REDIS_HOSTS=local:redis:6379` — tells redis-commander how to connect to the Redis service.
- `HTTP_USER` and `HTTP_PASSWORD` — protect the redis-commander UI with HTTP basic auth.
- `depends_on` — ensures `redis-commander` waits for the `redis` service to be started.

## Run

From the project docker directory (example path used here):

```bash
cd /var/www/docker-study.loc/recipe-04/docker/
docker-compose up -d
```

Open http://localhost:8081 to see the Redis Commander interface (use the credentials defined in the compose file).

## Using a custom redis.conf

If you want to use your own `redis.conf`, mount it into the container and update the command. Example compose snippet:

```yaml
services:
  redis:
    image: redis:latest
    ports:
      - 6379:6379
    command: ["redis-server", "--appendonly", "yes", "/usr/local/etc/redis/redis.conf"]
    volumes:
      - redis-data:/data
      - /var/www/docker-study.loc/recipe-04/docker/redis.conf:/usr/local/etc/redis/redis.conf
```

This mounts your local `redis.conf` into the container and instructs Redis to load it on start.