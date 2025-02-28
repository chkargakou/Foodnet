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


app.get('/isAdmin', async (req, res) => {
    let { body } = await superagent.get(`http://${process.env.API_IP}:5145/register/isAdmin?uuid=${req.query.uuid}`);
    res.send(body);
});


app.get('/getStores', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/register/getStores`);

    let storesList = ``;

    for (let i = 0; i < body.length; i++) {
        storesList += `
        <div class="card bg-base-100 w-full shadow-md">
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

    if (body.length < 1) return res.send("Αυτό το μαγαζί δεν έχει προϊόντα ακόμα.");

    let productsList = ``;

    for (let i = 0; i < body.length; i++) {
        productsList += `
        <div class="card bg-base-100 w-full shadow-xl">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].productname}</h2>
            <p>${body[i].price}€</p>
            <div class="card-actions justify-end">
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart') || ''; localStorage.setItem('myCart', cart + '${body[i].productname}|${body[i].price}|${req.query.name},'); document.location.reload(true) })() }" class="btn btn-primary">+1</button>
            </div>
          </div>
        </div>
        `
    }

    res.send(productsList);
});


app.get('/getOrdersUser', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/register/getOrdersUser?uuid=${req.query.uuid}`);

    if (body.length < 1) return res.send("Δεν υπάρχει καμία παραγγελία.")

    let orders = "";
    let products = "";

    for (let i = body.length-1; i >= 0; i--) {

        let productList = body[i].productList.split(",");

        for (let j = 0; j < productList.length - 1; j++) {
            products += `<p>• x${productList[j].split("|")[1]} ${productList[j].split("|")[0]}</p>`;   
        }

        orders += `<div class="card bg-base-100 w-full shadow-xl container mx-auto mx-32">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].storeName}</h2>
            ${products}
            <hr/>
            <p>Διεύθυνση: ${body[i].address}, ${body[i].postNumber}</p>
            <p>Τηλέφωνο: ${body[i].telNumber}</p>
            <p>Σημειώσεις για Delivery: <div class="bg-white-100 px-4 py-3 mr-64" role="alert"><p class="text-sm">${body[i].deliveryOrders}</p></div></p>
            <p>Κατάσταση Παραγγελίας: ${body[i].isCompleted === true ? "Ολοκληρωμένη" : "Στον Δρόμο"}</p>
            <div class="card-actions justify-end">
                <p>Σύνολο: ${body[i].orderValue}€</p>
            </div>
          </div>
        </div>`

        products = "";

    }

    return res.send(orders);
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
        .then(async registerRes => {

            if (registerRes.status === 200) {

                await superagent
                    .post(`http://${process.env.API_IP}:5145/register/getuuid`)
                    .send({ Username: username })
                    .set('Accept', 'application/json')
                    .then(r => {
                        let userCookie = `${r._body.uuid}`;

                        res.cookie("SessionID", userCookie, { maxAge: 120 * 60 * 1000 })
                        return res.sendStatus(200);
                    }).catch(err => res.send({ err }));

            }
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
        .then(async loginRes => {

            if (loginRes.status === 200) {

                await superagent
                    .post(`http://${process.env.API_IP}:5145/register/getuuid`)
                    .send({ Username: username })
                    .set('Accept', 'application/json')
                    .then(async r => {
                        let userCookie = `${r._body.uuid}`;

                        res.cookie("SessionID", userCookie, { maxAge: 120 * 60 * 1000 })
                        return res.sendStatus(200);
                    }).catch(err => res.send({ err }));

            }

        }).catch(err => res.send({ err }));
});


app.post('/getUsername', async (req, res) => {
    await superagent
        .post(`http://${process.env.API_IP}:5145/register/getUsername?uuid=${req.body.c}`)
        .set('Accept', 'application/json')
        .then(r => {
            let html = `<div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">${r._body}</div>
        <ul
          tabindex="0"
          class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
          <li><a href="/myorders">Οι παραγγελείες μου</a></li>
          <li><a href="/logout">Αποσύνδεση</a></li>
        </ul>
      </div>`;
            res.send({ name: r._body, content: html });
        }).catch(err => res.send({ err }));
});


app.post('/addOrder', async (req, res) => {
    console.log("order added")
    console.log(req.body);
    await superagent
        .post(`http://${process.env.API_IP}:5145/register/addOrder`)
        .send(req.body)
        .set('Accept', 'application/json')
        .then(r => {
            res.send("OK");
        }).catch(err => res.send({ err }));
});


app.listen(port, () => {
    console.log('server listening on port ' + port);
});