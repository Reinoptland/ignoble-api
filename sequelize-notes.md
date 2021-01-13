# Steps

- Make a folder: server (optional)

```bash
cd server
```

- Start npm project

```bash
npm init
```

- Install dependencies

```bash
npm install sequelize sequelize-cli pg
```

- Setup sequelize folder structure, models, migrations, seeders and config folders

```bash
npx sequelize-cli init
```

- install dotenv to hide our database url in an .env file

```bash
npm install dotenv
```

- Make a .env file in the server folder

```text
DEV_DATABASE_URL=<your database url here>
```

- Rename config/config.json to config/config.js
- Rename config.json to config.js inside models/index.js (line 8)
- Edit the config/config.js file:

```js
require("dotenv").config();

// console.log(process.env) -> check if the variables are loaded from the file

module.exports = {
  development: {
    use_env_variable: "DEV_DATABASE_URL",
    dialect: "postgres",
  },
};
```

- test the connection

```bash
npx sequelize-cli db:migrate
```

## Create datamodel

[https://dbdiagram.io/](https://dbdiagram.io/)

## Translate the datamodel into migrations and models

- Use sequelize-cli model:generate

```bash
npx sequelize-cli model:generate --name Prize --attributes year:integer,type:string,description:text
```

- Run migrations

```bash
npx sequelize-cli db:migrate
```

- Check result in GUI

Format of a postgres url

```text
<database type>://<User>:<Password>@<Host>:<Port>/<Database name>
```

## Seeding

```bash
npx sequelize-cli seed:generate --name seed-prizes
```

- Create a "up" script
- Create a "down" script

Check results in the GUI
