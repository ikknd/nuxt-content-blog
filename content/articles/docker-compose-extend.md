---
title: "How to use different/multiple Docker Compose files on different servers"
date: 2020-03-05
description: > 
  Two common approaches for composing multiple docker-compose files (default overrides
  and explicit override files), their drawbacks, and a recommended workflow using
  `docker-compose config` to produce a merged file that can be inspected and used
  with both `docker-compose` and Docker Swarm.
canonical: https://hackernoon.com/how-to-extend-docker-compose-file-jc723ypq
tags:
  - docker
  - docker-compose
  - docker-swarm
  - devops
image: http://localhost:3000/articles/docker-recipe-8-extend.jpg
readingTime: "2"
---

## Introduction

<a href="https://docs.docker.com/compose/extends/" target="_blank">Official docs</a>

![preview](/articles/docker-recipe-8-extend.jpg)

There are two common options for using multiple compose files.

## Option 1 — Default override file

By default, Compose reads `docker-compose.yml` and an optional
`docker-compose.override.yml`. Example setups:

- Local machine: only `docker-compose.yml`
- Dev/prod servers: `docker-compose.yml` + `docker-compose.override.yml`

This is simple but not very flexible. Keeping a correct
`docker-compose.override.yml` in your repository can be hard when servers differ.

## Option 2 — Explicit override files

Use explicit override files per environment, for example:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

You can keep multiple override files like `docker-compose.prod.yml`,
`docker-compose.dev.yml`, etc. This is more versatile than the default override.

## Problems with the above approaches

- Files are combined at runtime, so you don't get a resulting merged
  `docker-compose.yml` file to inspect and verify.
- The `-f ... -f ...` override syntax works with docker-compose but
  does not directly translate to Docker Swarm's `docker stack deploy`.

## Recommended solution — generate the merged file

Use `docker-compose config` to produce a merged/flattened compose file you
can review and then use with `docker-compose` or `docker stack deploy`:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml \
  config > docker-compose.stack.yml
```

This command merges the files the same way Compose would at runtime, but
writes the final composed YAML to `docker-compose.stack.yml` so you can:
- review/validate the resulting configuration
- store or audit the merged output
- use it with Docker Swarm

Now you can start with the merged file:

```bash
docker-compose -f docker-compose.stack.yml up -d
```

Or deploy it to a Swarm:

```bash
docker stack deploy -c docker-compose.stack.yml mystack
```

Benefits:
- You can verify the merged configuration before applying it.
- The same merged file works for Compose and Swarm deployments.