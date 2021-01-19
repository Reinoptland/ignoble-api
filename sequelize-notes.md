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

## Seeding related data

hasOne (one to one): the id of this row, is foreignkey in another table
hasMany (one to many): the id of this row, is foreignkey in another table
belongsTo: there is a foreing key in this table which refers to the id in another table
belongsToMany (many to many): there is join table, which relates this table to another table

- [x] Prizes
- [ ] Make a model & migration for the Researchers
- [ ] Make a model & migration for the Winners
- [ ] Relate the Researchers and Prizes to the Winners table
  - Researchers hasMany Winners, Winners belongsTo Researchers
  - Prizes hasMany Winners, Winners belongsTo Prizes
- [ ] Relate the Researchers and the Prizes (belongsToMany)
