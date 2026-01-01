---
title: "MariaDB + phpmyadmin + Docker - Local DB Setup and Container Import/Export"
date: 2020-01-22
description: "Tutorial on how to set up MariaDB and phpMyAdmin with Docker, including importing and exporting databases from containers."
canonical: https://hackernoon.com/mariadb-phpmyadmin-docker-running-local-database-ok9q36ji
tags:
  - docker
  - mariadb
  - mysql
  - phpmyadmin
  - database
image: /articles/docker-recipe-3-mysql.jpg
readingTime: "2"
---

## Introduction

This guide will walk you through setting up MariaDB and phpMyAdmin within Docker containers. We will reuse the folder setup and files from the previous recipe (recipe-02).

You can find the source files for this tutorial in the `recipe-03` folder of this repository: [https://github.com/ikknd/docker-study](https://github.com/ikknd/docker-study){target="_blank"}

![preview](/articles/docker-recipe-3-mysql.jpg)

## 1. Modify `docker-compose.yml` File

Here's the `docker-compose.yml` configuration:

```yaml
version: "3.7"

services:

  web:
    image: nginx:1.17
    ports:
      - 80:80
    volumes:
      - /var/www/docker-study.loc/recipe-03/php:/var/www/myapp
      - /var/www/docker-study.loc/recipe-03/docker/site.conf:/etc/nginx/conf.d/site.conf
    depends_on:
      - php
      - mariadb

  php:
    image: php:7.2-fpm
    volumes:
      - /var/www/docker-study.loc/recipe-03/php:/var/www/myapp
      - /var/www/docker-study.loc/recipe-03/docker/php.ini:/usr/local/etc/php/php.ini
    depends_on:
      - mariadb

  mariadb:
    image: mariadb:10.4
    restart: always
    volumes:
      - mariadb-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: qwerty

  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    ports:
      - 8000:80
    environment:
      - PMA_ARBITRARY=1
      - PMA_HOST=mariadb
    depends_on:
      - mariadb

volumes:
  mariadb-data:
```

In this configuration:

*   **`mariadb-data` volume**: This volume is created to store all database data. Even if the container is restarted, the data will persist.
*   **`MYSQL_ROOT_PASSWORD: qwerty`**: This environment variable sets the root password for the MariaDB container.
*   **`PMA_ARBITRARY=1`**: This environment variable adds a "server" input field to the phpMyAdmin login page. This allows you to use phpMyAdmin with external MySQL databases, not just this local setup.
*   **`PMA_HOST=mariadb`**: This environment variable configures phpMyAdmin to connect to the MariaDB container, which is named `mariadb` in this `docker-compose.yml`.
*   **`ports: - 8000:80`**: This maps port 80 inside the phpmyadmin container to port 8000 on your host machine, making phpMyAdmin accessible via `localhost:8000`.
*   **`depends_on`**: This ensures that containers are started in the correct order, preventing a container from starting before the services it depends on are running.

## 2. Running the Containers

Navigate to the `docker/` directory within your project's `recipe-03` folder and execute the following command:

```bash
docker-compose up -d
```

After the containers have started:

*   You should be able to access the phpinfo page at `myapp.loc/`.
*   You can access phpMyAdmin at `myapp.loc:8000`. Log in using the credentials:
    *   **Username:** `root`
    *   **Password:** `qwerty`

## 3. Initializing the Database with Data

If you need your database to be up and running with initial data, you can modify the MariaDB service in your `docker-compose.yml`:

Add the following to the `mariadb` service:

```yaml
command: "mysqld --init-file /data/application/init.sql"
```

And add a volume mapping for your initialization script:

```yaml
volumes:
  - mariadb-data:/var/lib/mysql
  - ./init.sql:/data/application/init.sql # Add this line
```

*   **`init.sql`**: This file should contain your existing database dump.
*   **Volume Mapping**: Using volumes, we copy the `init.sql` file into the container at `/data/application/init.sql`.
*   **`mysqld --init-file`**: This command tells MySQL to start and import the SQL file specified by `--init-file` during its initialization process.

## 4. Importing and Exporting Databases

Once your database is running, you can manage your data using `docker exec`.

First, find the name or ID of your MariaDB container:

```bash
docker container ls
```

This command will list all running containers. Look for the container associated with MariaDB (it might be named something like `docker_mariadb_1`).

### Importing a Database

To import a local database dump into a container, use the following command, replacing `docker_mariadb_1`, `DB_NAME`, and `your_local_db_dump.sql` with your specific details:

```bash
docker exec -i docker_mariadb_1 mysql -uroot -pqwerty DB_NAME < your_local_db_dump.sql
```

*   **`docker exec -i`**: Executes a command in a running container. The `-i` flag keeps STDIN open even if not attached.
*   **`docker_mariadb_1`**: The name or ID of your MariaDB container.
*   **`mysql -uroot -pqwerty DB_NAME`**: The command to connect to MySQL as root with the password `qwerty` and select the `DB_NAME` database.
*   **`< your_local_db_dump.sql`**: Redirects the content of your local SQL dump file into the `mysql` command.

### Exporting a Database

To export a database from a container to a local file, use this command:

```bash
docker exec -i docker_mariadb_1 mysqldump -uroot -pqwerty DB_NAME > your_local_db_dump.sql
```

*   **`mysqldump -uroot -pqwerty DB_NAME`**: This command dumps the specified `DB_NAME` database from the MariaDB container.
*   **`> your_local_db_dump.sql`**: Redirects the output of `mysqldump` to a local file named `your_local_db_dump.sql`.
