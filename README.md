
# FoodNet
The following README is used for hosting FoodNet on a proper VPS or any other computing solution.

  

### Reproduction Steps (Frontend/Internals)

1. Clone the **prod** branch using `git clone https://github.com/chkargakou/Foodnet.git --branch prod`

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

3. Run `npm i` at `frontend/client` and `frontend/server`.

4. Run `npm run build` at `frontend/client`, then using **serve** (npm i -g serve) `serve -s build`.

5. Either run `node index.js` at `frontend/server`, or use **pm2** (npm i -g pm2) `pm2 start index.js --name server`. (any process manager will do for that matter)

  

### Reproduction Steps (Backend/Database)

1. Clone the repository.

2. Create Database in mysql`CREATE DATABASE fooodnet;`

3.  `mysql -u username -p foodnet < foodnet.sql` to create the database (`foodnet.sql` can be found inside `/database/`)
(you might need to run `CREATE DATABASE foodnet;` on the MySQL console beforehand)

4. Create a .env file inside the `backend/FoodNetBackend` directory which must contain:

  

`backend/FoodNetBackend/.env`

```.env

DB_CONNECTION_STRING="Server={server address/most probably localhost};Database=foodnet;User={database username};Password={database user password};"
ENCRYPTION_KEY="{32 char AES key}"

```

  

5. Inside of the `backend/FoodNetBackEnd` directory.

- run `dotnet restore`.
- run `dotnet build`.
- run `dotnet run`.

  

### Reverse proxy and SSL installation with NGINX and Certbot
1. Follow the steps above.
2. Install NGINX and use the following configuration at your `sites-available` or `sites-enabled` default config:
```nginx
server {
	listen 80;
	listen [::]:80;
	server_name foodnet.example.com;
	
	location / {
		proxy_pass http://localhost:3000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}

# Don't use this part if you plan on hosting the API at localhost.
server {
	listen 80;
	listen [::]:80;
	server_name api.example.com;

	location / {
		proxy_pass http://localhost:8081;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}
```
3. Install Certbot and its NGINX extension and run either:
	- `sudo certbot certonly --nginx --preferred-challenges dns -d example.com -d api.example.com`
	- `sudo certbot certonly --nginx --preferred-challenges dns -d example.com` (if you plan on hosting the API on localhost)
	
4. Use either ufw or iptables to open the following ports:
- 3000/tcp
- 8081/tcp (if you use a domain/subdomain for the API)

5. All done! By now you should have a production build of FoodNet in your hands.