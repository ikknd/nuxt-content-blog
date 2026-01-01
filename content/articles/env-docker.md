---
title: "How to use environment variables (.env) in docker compose file"
date: 2020-02-26
description: "Example showing how to use .env variables (with defaults) in a docker-compose.yml file — using Redis + redis-commander as an example."
canonical: https://hackernoon.com/how-to-use-environment-variables-in-docker-compose-file-l2n32ou
tags:
  - docker
  - docker-compose
  - env
  - redis
image: /articles/docker-recipe-7-env.jpg
readingTime: "1"
---

## Introduction

This guide demonstrates how to use environment variables (.env) in docker compose file

![preview](/articles/docker-recipe-7-env.jpg)

If you want to use different credentials on different servers, environment variables work great with Docker Compose.

Below is an example `docker-compose.yml` (based on a Redis + redis-commander recipe) demonstrating how to consume variables from a `.env` file and provide defaults.

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
      - HTTP_USER=${REDIS_USER:-admin}
      - HTTP_PASSWORD=${REDIS_PASSWORD:-qwerty}
    ports:
      - 8081:8081
    depends_on:
      - redis

volumes:
  redis-data:
```

### Notes

- `HTTP_USER=${REDIS_USER:-admin}` — this uses the `${VAR:-default}` syntax: use the `REDIS_USER` variable from the `.env` file; if it's missing, use `admin` as the default.
- Docker Compose automatically picks up a `.env` file located next to the compose file when you run `docker-compose up -d`. You don't need to pass it explicitly.

If you run the compose file without a `.env` file, the credentials for redis-commander will be `admin` / `qwerty`.

Create a `.env` file next to your `docker-compose.yml` with the following contents to override the defaults (example):

```ini
# .env
REDIS_USER=test
REDIS_PASSWORD=1234
```

With the above `.env`, redis-commander credentials will be `test` / `1234`.