---
title: "Cron + Docker — what to do"
date: 2020-01-29
description: "How to run Linux cron jobs that execute commands inside Docker containers, with practical examples and notes."
tags:
  - docker
  - cron
  - linux
image: http://localhost:3000/articles/docker-recipe-6-cron.jpg
readingTime: "2"
---

## Introduction

This guide demonstrates how to run Linux cron jobs that execute commands inside Docker containers.
When I started to google this, I found two solutions right away, but both seemed problematic.

You can find the source files for this tutorial in the `recipe-06` folder of this repository: [https://github.com/ikknd/docker-study](https://github.com/ikknd/docker-study){target="_blank"}

![preview](/articles/docker-recipe-6-cron.jpg)

## Bad option 1 — build a dedicated cron container

Build a custom crontab image, copy the crontab file inside, and run commands toward other containers.

Problems:
- You must rebuild the image every time you change a cron command or add a new one.
- Making calls from the cron container to other containers can be awkward (networking, container IDs, etc.).

## Bad option 2 — modify the application container to run cron

Add cron to the app container and run both cron and the original process inside the same container.

Problems:
- The container ends up running two processes (cron + the app), which goes against Docker philosophy: “one process per container”.
- Adds complexity to the app image and lifecycle.

## Good option — run cron on the host

Run cron on the host machine where you start your Docker containers and use `docker exec` from cron to run the command inside the target container.

Example crontab line:

```cron
* * * * * docker exec -t {containerID} {command} >> /dev/null 2>&1
```

Concrete example (Laravel scheduler):

```cron
* * * * * docker exec -t $(docker ps -qf "name=docker_php_1") \
  php artisan schedule:run >> /dev/null 2>&1
```

Notes and explanations:
- Normally you would run:
  ```sh
  docker exec -t <container_id> php artisan schedule:run
  ```
  but container IDs can change on restart. You don't want to edit crontab every time a container restarts.
- Use `$(docker ps -qf "name=<container_name>")` to lookup the container ID by name:
  ```sh
  $(docker ps -qf "name=docker_php_1")
  ```
- Or lookup by image ancestor:
  ```sh
  $(docker ps -qf "ancestor=php:7.2-fpm")
  ```
- `php artisan schedule:run` is a Laravel-specific command used here as an example; replace with whatever command you need to execute inside the container.
- Redirecting output to `/dev/null` (`>> /dev/null 2>&1`) silences stdout/stderr; remove or change that redirect while debugging.

## Tips

- If your host cron environment doesn't have the same `PATH` or environment variables as your interactive shell, use full paths in the cron command or source an environment file first.
  Example using a script:
  ```cron
  * * * * * /usr/local/bin/run-scheduled.sh >> /var/log/cron-scheduler.log 2>&1
  ```
  where `run-scheduled.sh` contains:
  ```sh
  #!/usr/bin/env bash
  # optional: source environment variables
  # . /etc/profile
  docker exec -t $(docker ps -qf "name=docker_php_1") \
    php /var/www/html/artisan schedule:run
  ```
- Ensure the host user running cron has permission to use Docker (is in the `docker` group or runs cron under root).
- For reliability, consider adding checks to the wrapper script to ensure the container exists and is running before calling `docker exec`.

That's it — keeping cron on the host and using `docker exec` avoids rebuilding images or running multiple processes inside a container while giving you stable cron entries that locate containers by name or image.