# FoodNet 
An e-food clone made for the course "Special Topics in Software Engineering" at uniWA.

![foodnet-preview](https://cdn.discordapp.com/attachments/1223657359008731177/1364937022774579311/foodnet.png?ex=680b7c29&is=680a2aa9&hm=7d75a404c32e8a51c0e4cd3f6cc0ec35cf96de960e917e255ef6dc43c6efee70&)

### This project uses:
Node.js, Express.js, React, MySQL, Dapper, Tailwind CSS, .NET Core. 

### This project aims to:
- Host multiple stores, with multiple products.
- Host customers that make orders to those stores.
- Serve as a middleman for holding delivery orders for stores.
- Make seemless charges on each sale by increase orders to a point it's a mere negligible fee.

### Reproduction Steps (Frontend/Internals)
1. Clone the repository.
2. Create files `frontend/server/.env` and `frontend/client/.env`, they **must** contain the following inside:

`frontend/client/.env`
```.env
REACT_APP_HOST=0.0.0.0
REACT_APP_PORT=<port from frontend/server/index.js:3>
REACT_APP_PROTOCOL=http/https
```

`frontend/server/.env`
```.env
API_IP=0.0.0.0
```

4. Run `npm i` at `frontend/client` and `frontend/server`.
5. Run `npm run build` at `frontend/client`, then using **serve** (npm i -g serve) `serve -s build`
6. Either run `node index.js` at `frontend/server`, or use **pm2** (npm i -g pm2) `pm2 start index.js --name server`. (any process manager will do for that matter)

### Reproduction Steps (Backend/Database)
1. Clone the repository.
2. Create Database in mysql`CREATE DATABASE fooodnet;`
3. `mysql -u username -p foodnet < foodnet.sql` to create the database (`foodnet.sql` can be found inside `/database/`)
4. Create a .env file inside the `backend/FoodNetBackend` directory which must contain:

`backend/FoodNetBackend/.env`
```.env
DB_CONNECTION_STRING="Server={server address};Database=foodnet;User={database username};Password={database user password};"
ENCRYPTION_KEY="{32 char AES key}"
```

4. Inside of the `backend/FoodNetBackEnd` directory.
	- run `dotnet restore`.
	- run `dotnet build`.
	- run `dotnet run`.

### Production
Check the README at [prod branch](https://github.com/chkargakou/Foodnet/tree/prod).
