const express = require("express");
const app = express();
const port = 8081;

const cors = require("cors");
const superagent = require("superagent")
const bodyParser = require('body-parser');

// env variables
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

var corsOpts = {
    credentials: true,
    origin: true,
}

app.use(cors(corsOpts))
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    let body = await superagent.get(`http://${process.env.API_IP}:5145`);
    res.send(body.text);
});

app.post('/register', async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    password = Buffer.from(`${password}`, 'utf8').toString('base64');

    if (req.body.password != req.body.confirmPass) return res.send("badPass");

    await superagent
        .post(`http://${process.env.API_IP}:5145/register`)
        .send({ Username: username, Password: password })
        .set('Accept', 'application/json')
        .then(r => {
            var rand = function () {
                return Math.random().toString(36).substring(2);
            };

            // 22 characters
            var token = function () {
                return rand() + rand();
            };

            let userCookie = `${token()}|${username}|${Date.now()}`;

            res.cookie("SessionID", userCookie, { maxAge: 120 * 60 * 1000 })
            return res.sendStatus(200);
        }).catch(err => res.send({ err }));
});

app.post('/login', async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    password = Buffer.from(`${password}`, '').toString('base64');

    await superagent
        .post(`http://${process.env.API_IP}:5145/register/login`)
        .send({ Username: username, Password: password })
        .set('Accept', 'application/json')
        .then(r => {
            if (r.status == 200) {
                var rand = function () {
                    return Math.random().toString(36).substring(2);
                };

                // 22 characters
                var token = function () {
                    return rand() + rand();
                };

                let userCookie = `${token()}|${username}|${Date.now()}`;

                res.cookie("SessionID", userCookie, { maxAge: 120 * 60 * 1000 })
                return res.sendStatus(200);
            }
        }).catch(err => res.send({ err }));
});

app.post('/getUUID', async (req, res) => {

    let username = req.body.username;

    await superagent
        .post(`http://${process.env.API_IP}:5145/register/getuuid`)
        .send({ Username: username })
        .set('Accept', 'application/json')
        .then(r => {
            res.send(r);
        }).catch(err => res.send({ err }));
});

app.get('/getStores', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/register/getStores`);

    let storesList = ``;

    for (let i = 0; i < body.length; i++) {
        storesList += `
        <div class="card bg-base-100 w-full shadow-xl">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].name}</h2>
            <p>${body[i].location}</p>
            <div class="card-actions justify-end">
            <a href="/Store?name=${body[i].name}">
              <button class="btn btn-primary">Πάμε!</button>
            </a>
            </div>
          </div>
        </div>
        `
    }
    res.send(storesList);
});

app.get('/getProducts', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/register/getproducts`).send({ Storename: `${req.query.name}` });

    if (body.length < 1) return res.send("Αυτό το μαγαζί δεν έχει προϊόντα ακόμα.")

    let productsList = ``;

    for (let i = 0; i < body.length; i++) {
        productsList += `
        <div class="card bg-base-100 w-full shadow-xl">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].productname}</h2>
            <p>${body[i].price}</p>
            <div class="card-actions justify-end">
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart') || ''; localStorage.setItem('myCart', cart + '${body[i].productname}|${body[i].price},'); document.location.reload(true) })() }" class="btn btn-primary">Πάρ' το!</button>
            </div>
          </div>
        </div>
        `
    }
    
    res.send(productsList);
});

app.get('/getProduct', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/register/getproducts`).send({ Storename: `${req.query.name}` });

    if (body.length < 1) return res.send("Αυτό το μαγαζί δεν έχει προϊόντα ακόμα.")
    else if (!req.query.q) return res.send("NO_QUERY");

    let product;

    for (let i = 0; i < body.length; i++) {
        if (body[i].productname == req.query.q) {
            // Product result object
            product = { "name": body[i].productname, "price": body[i].price }
            return res.send(product);
        }
    }
});

app.listen(port, () => {
    console.log('server listening on port ' + port);
});