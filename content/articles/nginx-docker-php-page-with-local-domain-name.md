---
title: Nginx + PHP + Docker - Setting Up a Local PHP Page with a Domain Name
date: 2020-01-21
description: Tutorial on how to set up a simple PHP page using Docker and Nginx, complete with a local domain name.
tags:
  - docker
  - nginx
  - php
  - web development
image: http://localhost:3000/articles/docker-recipe-2-php.jpg
readingTime: "2"
---

## Introduction

This guide will walk you through setting up a simple PHP page using Docker and Nginx, complete with a local domain name.

You can find the source files for this tutorial in the `recipe-02` folder of this repository: [https://github.com/ikknd/docker-study](https://github.com/ikknd/docker-study){target="_blank"}

![preview](/articles/docker-recipe-2-php.jpg)

## 1. Project Folder Setup

Create the following project directory structure:

```
/var/www/docker-study.loc/recipe-02
  ├── docker
  └── php
```

Inside the `php` folder, create an `index.php` file that will execute `phpinfo()`:

```php
<?php
phpinfo();
?>
```

## 2. Nginx Configuration (site.conf)

Create a `site.conf` file within the `docker` folder with the following Nginx configuration:

```nginx
server {
    server_name myapp.loc;

    root /var/www/myapp;
    index index.php index.html index.htm;

    access_log /var/log/nginx/back-access.log;
    error_log /var/log/nginx/back-error.log;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM Configuration Nginx
    location ~ \.php$ {
        try_files $uri = 404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param REQUEST_URI $request_uri;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}
```

The line `fastcgi_pass php:9000;` is crucial as it tells Nginx how to connect to the PHP container.

## 3. Host Machine Configuration (/etc/hosts)

Edit the `/etc/hosts` file on your host machine and add the following record to map your local domain:

```
127.0.0.1       myapp.loc
```

## 4. Docker Compose Configuration (docker-compose.yml)

Create a `docker-compose.yml` file within the `docker` folder with the following content:

```yaml
version: "3.7"

services:

  web:
    image: nginx:1.17
    ports:
      - 80:80
    volumes:
      - /var/www/docker-study.loc/recipe-02/php:/var/www/myapp
      - /var/www/docker-study.loc/recipe-02/docker/site.conf:/etc/nginx/conf.d/site.conf
    depends_on:
      - php

  php:
    image: php:7.2-fpm
    volumes:
      - /var/www/docker-study.loc/recipe-02/php:/var/www/myapp
      - /var/www/docker-study.loc/recipe-02/docker/php.ini:/usr/local/etc/php/php.ini
```

In this `docker-compose.yml` file:

*   We use a custom `php.ini` file, which is copied into the PHP container. This allows for easy modification of PHP settings by simply editing `php.ini` and restarting the container.
*   When you make changes to your PHP code (e.g., `index.php`), these changes are applied immediately upon reloading the browser page; there's no need to restart the container.
*   The `depends_on` directive ensures that the `web` container (Nginx) does not start before the `php` container is ready.

## 5. Running the Setup

Navigate to the `docker` folder (where your `docker-compose.yml` file is located) in your terminal and execute the following command:

```bash
docker-compose up -d
```

After the containers have started, you should be able to visit `myapp.loc/` in your browser and see the output of the `phpinfo()` function.
