---
title: Nginx + Docker - Serving a Simple HTML Page with a Local Domain Name
date: 2020-01-20
description: Tutorial on how to set up a very simple HTML page using Docker and Nginx, accessible via a local domain name.
tags:
  - Docker
  - Nginx
  - Web development
image: http://localhost:3000/articles/docker-recipe-1-nginx.jpg
readingTime: "2"
---

## Introduction

This guide demonstrates how to set up a very simple HTML page using Docker and Nginx, accessible via a local domain name.

You can find the source files for this tutorial in the `recipe-01` folder of this repository: [https://github.com/ikknd/docker-study](https://github.com/ikknd/docker-study){target="_blank"}

![preview](/articles/docker-recipe-1-nginx.jpg)

### 1. Project Folder Setup

First, create the necessary project folders on your host machine.

```
/var/www/docker-study.loc/recipe-01
    ├── docker
    └── html
```

Inside the `html` folder, create an `index.html` file with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Docker Nginx Test</title>
</head>
<body>
    <h1>I work inside docker!</h1>
</body>
</html>
```

The `docker` folder will house all Docker-related configuration files.

### 2. Nginx Configuration (`site.conf`)

Create an Nginx configuration file named `site.conf` inside the `docker` folder.

```nginx
server {
    server_name myapp.loc;

    root /var/www/myapp;
    index index.php index.html index.htm;

    access_log /var/log/nginx/front-access.log;
    error_log /var/log/nginx/front-error.log;

    location / {
        try_files $uri $uri/ /index.html?$query_string;
    }
}
```

### 3. Update Host Machine's `/etc/hosts` File

On your host machine, edit the `/etc/hosts` file and add the following line to map your local domain name to your local machine:

```
127.0.0.1       myapp.loc
```

### 4. Docker Compose Configuration (`docker-compose.yml`)

Create a `docker-compose.yml` file inside the `docker` folder with the following content:

```yaml
version: "3.7"

services:
  web:
    image: nginx:1.17
    ports:
      - 80:80
    volumes:
      - /var/www/docker-study.loc/recipe-01/html:/var/www/myapp
      - /var/www/docker-study.loc/recipe-01/docker/site.conf:/etc/nginx/conf.d/site.conf
```

Here I do several things:

- point port 80 from inside container to port 80 on my host machine
- copy html folder on my host machine to /var/www/myapp folder inside of container
- copy site.conf nginx config file to /etc/nginx/conf.d/site.conf location in container

Note that we can point not only directories from host machines to inside of container, but also individual files.

### 5. Start the Docker Container

Navigate to the `docker` folder in your terminal and execute the following command:

```bash
docker-compose up -d
```

This command will build and start your Nginx container in detached mode (`-d`).

### Verification

Now, open your web browser and navigate to `http://myapp.loc/`. You should see the message:

```
I work inside docker!
```

In these simple steps, you've successfully served an HTML file via Nginx within a Docker container and configured a local domain name to access it.
