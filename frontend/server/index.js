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
    let { body } = await superagent.get(`http://${process.env.API_IP}:5145/management/isAdmin?uuid=${req.query.uuid}`);
    res.send(body);
});


app.get('/isOwner', async (req, res) => {
    let { body } = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.query.uuid}`);
    res.send(body);
});


app.get('/getStores', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/store/getStores`);

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


app.get('/getStoresOwned', async (req, res) => {

    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/store/getStoresOwned?uuid=${req.query.uuid}`);

    let storesList = ``;

    for (let i = 0; i < body.length; i++) {
        storesList += `
        <div class="card bg-base-100 w-full shadow-md">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].name}</h2>
            <p>${body[i].location}</p>
            <div class="card-actions justify-end">
            <button onClick="window.location.href = '/StoreOrders?storeName=${body[i].name.replace("'", "\\'")}'" class="btn btn-primary">Προβολή Παραγγελιών</button>
            <button onClick="window.location.href = '/StoreItems?storeName=${body[i].name.replace("'", "\\'")}'" class="btn btn-primary">Προσθαφαίρεση Προϊόντων</button>
            <button onClick="window.location.href = '/RemoveStore?StoreName=${body[i].name.replace("'", "\\'")}&location=${body[i].location.replace("'", "\\'")}'" class="btn btn-primary">Αφαίρεση Μαγαζιού</button>
            </div>
          </div>
        </div>
        `
    }
    res.send(storesList);
});


app.get('/getProducts', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/product/getproducts`).send({ Storename: `${req.query.name}` });

    if (body.length < 1) return res.send("Αυτό το μαγαζί δεν έχει προϊόντα ακόμα.");

    let productsList = ``;

    for (let i = 0; i < body.length; i++) {
        productsList += `
        <div class="card bg-base-100 w-full shadow-xl">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].productname}</h2>
            <p>${body[i].price}€</p>
            <div class="card-actions justify-end">
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart') || ''; localStorage.setItem('myCart', cart + '${body[i].productname.replace("'", "\\'")}|${body[i].price}|${req.query.name.replace("'", "\\'")},'); document.location.reload(true) })() }" class="btn btn-primary">+1</button>
            </div>
          </div>
        </div>
        `
    }

    res.send(productsList);
});

app.get('/getProductsStore', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.query.uuid}`);
    isOwner = isOwner._body;

    if (isOwner) {

        const { body } = await superagent
            .get(`http://${process.env.API_IP}:5145/product/getproducts`).send({ Storename: `${req.query.Storename}` });

        if (body.length < 1) return res.send("Αυτό το μαγαζί δεν έχει προϊόντα ακόμα.");

        let productsList = ``;

        for (let i = 0; i < body.length; i++) {
            productsList += `
        <div class="card bg-base-100 w-full shadow-xl">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].productname}</h2>
            <p>${body[i].price}€</p>
            <div class="card-actions justify-end">
            <button onClick="window.location.href = '/RemoveProduct?StoreName=${req.query.Storename.replace("'", "\\'")}&ProductName=${body[i].productname.replace("'", "\\'")}'" class="btn btn-primary">Αφαίρεση Προϊόντος</button>
            </div>
          </div>
        </div>
        `
        }

        res.send(productsList);
    }
});


app.get('/getOrdersUser', async (req, res) => {
    const { body } = await superagent
        .get(`http://${process.env.API_IP}:5145/order/getOrdersUser?uuid=${req.query.uuid}`);

    if (body.length < 1) return res.send("Δεν υπάρχει καμία παραγγελία.")

    // For sanitizing text
    function sanitize(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    }

    let orders = "";
    let products = "";

    for (let i = body.length - 1; i >= 0; i--) {

        let productList = body[i].productList.split(",");

        for (let j = 0; j < productList.length - 1; j++) {
            products += `<p>• x${productList[j].split("|")[1]} ${productList[j].split("|")[0]}</p>`;
        }

        orders += `<div class="card bg-base-100 w-full shadow-xl container mx-auto mx-32">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${body[i].storeName}</h2>
            ${products}
            <hr/>
            <p>Διεύθυνση: ${sanitize(body[i].address)}, ${sanitize(body[i].postNumber)}</p>
            <p>Τηλέφωνο: ${sanitize(body[i].telNumber)}</p>
            <p>Σημειώσεις για Delivery: <div class="bg-white-100 px-4 py-3 mr-64" role="alert"><p class="text-sm">${sanitize(body[i].deliveryOrders)}</p></div></p>
            <p>Κατάσταση Παραγγελίας: ${body[i].isCompleted ? "Ολοκληρωμένη ✅" : "Στον Δρόμο 🚚"}</p>
            <div class="card-actions justify-end">
                <p>Σύνολο: ${body[i].orderValue}€</p>
            </div>
          </div>
        </div>`

        products = "";

    }

    return res.send(orders);
});


app.get('/getOrdersStore', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.query.uuid}`);
    isOwner = isOwner._body;

    if (isOwner) {

        const { body } = await superagent
            .get(`http://${process.env.API_IP}:5145/order/getOrdersStore`).send(
                {
                    storeName: req.query.Storename,
                    uuid: req.query.uuid
                }
            );

        if (body.length < 1) return res.send("Δεν υπάρχει καμία παραγγελία.")

        // For sanitizing text
        function sanitize(s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        }

        let orders = "";
        let products = "";
        let completeButton;
        let orderStatus;

        for (let i = body.length - 1; i >= 0; i--) {

            let productList = body[i].productList.split(", ");

            for (let j = 0; j < productList.length - 1; j++) {
                products += `<p>• x${productList[j].split("|")[1]} ${productList[j].split("|")[0]}</p>`;
            }

            if (body[i].isCompleted) {
                completeButton = ``;
                orderStatus = "Ολοκληρωμένη ✅";
            } else {
                completeButton = `<button onClick="window.location.href = '/CompleteOrder?id=${body[i].id}'" class="btn btn-primary">Ολοκλήρωση Παραγγελίας</button>`;
                orderStatus = "Στον Δρόμο 🚚";
            }

            orders += `<div class="card bg-base-100 w-full shadow-xl container mx-auto mx-32">
          <div class="card-body">
            <h2 id="order${i}" class="card-title">${body[i].storeName}</h2>
            ${products}
            <hr/>
            <p>Διεύθυνση: ${sanitize(body[i].address)}, ${sanitize(body[i].postNumber)}</p>
            <p>Τηλέφωνο: ${sanitize(body[i].telNumber)}</p>
            <p>Σημειώσεις για Delivery: <div class="bg-white-100 px-4 py-3 mr-64" role="alert"><p class="text-sm">${sanitize(body[i].deliveryOrders)}</p></div></p>
            <p>Αριθμός Παραγγελίας: ${body[i].id}</p>
            <p>Κατάσταση Παραγγελίας: ${orderStatus}</p>
            <div class="card-actions justify-end">
                <p>Σύνολο: ${body[i].orderValue}€</p>
                ${completeButton}
            </div>
          </div>
        </div>`

            products = "";

        }

        return res.send(orders);
    }
});


app.post('/register', async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    password = Buffer.from(`${password}`, 'utf8').toString('base64');

    if (req.body.password != req.body.confirmPass) return res.send("badPass");

    // For sanitizing usernames
    function sanitize(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    }

    await superagent
        .post(`http://${process.env.API_IP}:5145/register`)
        .send({ Username: sanitize(username), Password: password })
        .set('Accept', 'application/json')
        .then(async registerRes => {

            if (registerRes.status === 200) {

                await superagent
                    .post(`http://${process.env.API_IP}:5145/management/getuuid`)
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
        .post(`http://${process.env.API_IP}:5145/login`)
        .send({ Username: username, Password: password })
        .set('Accept', 'application/json')
        .then(async loginRes => {

            if (loginRes.status === 200) {

                await superagent
                    .post(`http://${process.env.API_IP}:5145/management/getuuid`)
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

    let isAdmin = await superagent.get(`http://${process.env.API_IP}:5145/management/isAdmin?uuid=${req.body.c}`);
    isAdmin = isAdmin._body;

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.body.c}`);
    isOwner = isOwner._body;

    await superagent
        .post(`http://${process.env.API_IP}:5145/management/getUsername?uuid=${req.body.c}`)
        .set('Accept', 'application/json')
        .then(r => {
            let html;
            if (isAdmin) {
                html = `<div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">${r._body}</div>
                <ul
                  tabindex="0"
                  class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                  <li><a href="/myorders">Οι παραγγελείες μου</a></li>
                  <li><a href="/management">Διαχείριση FoodNet</a></li>
                  <li><a href="/logout">Αποσύνδεση</a></li>
                </ul>
              </div>`;
            } else if (isOwner) {
                html = `<div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">${r._body}</div>
                <ul
                  tabindex="0"
                  class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                  <li><a href="/myorders">Οι παραγγελείες μου</a></li>
                  <li><a href="/storeadmin">Διαχείριση Μαγαζιών</a></li>
                  <li><a href="/logout">Αποσύνδεση</a></li>
                </ul>
              </div>`;
            } else {
                html = `<div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">${r._body}</div>
        <ul
          tabindex="0"
          class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
          <li><a href="/myorders">Οι παραγγελείες μου</a></li>
          <li><a href="/logout">Αποσύνδεση</a></li>
        </ul>
      </div>`;
            }
            res.send({ name: r._body, content: html });
        }).catch(err => res.send({ err }));
});


app.post('/getUUID', async (req, res) => {

    let isAdmin = await superagent.get(`http://${process.env.API_IP}:5145/management/isAdmin?uuid=${req.body.c}`);
    isAdmin = isAdmin._body;

    if (isAdmin) {

        await superagent
            .post(`http://${process.env.API_IP}:5145/management/getuuid`)
            .send({ Username: req.body.name })
            .set('Accept', 'application/json')
            .then(r => {
                res.send(r);
            }).catch(err => res.send({ err }));

    }
});


app.post('/addOrder', async (req, res) => {
    await superagent
        .post(`http://${process.env.API_IP}:5145/order/addOrder`)
        .send(req.body)
        .set('Accept', 'application/json')
        .then(r => {
            console.log("order added")
            console.log(req.body);
            res.send("OK");
        }).catch(err => res.send({ err }));
});


app.post('/addStore', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.body.ownerUUID}`);
    isOwner = isOwner._body;

    if (isOwner) {

        await superagent
            .post(`http://${process.env.API_IP}:5145/store/addStore`)
            .send(req.body)
            .set('Accept', 'application/json')
            .then(r => {
                console.log("store added")
                console.log(req.body);
                res.send("OK");
            }).catch(err => res.send({ err }));

    }
});


app.post('/addProduct', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.body.ownerUUID}`);
    isOwner = isOwner._body;

    if (isOwner) {

        await superagent
            .post(`http://${process.env.API_IP}:5145/product/addProduct`)
            .send(req.body)
            .set('Accept', 'application/json')
            .then(r => {
                console.log("product added")
                console.log(req.body);
                res.send("OK");
            }).catch(err => res.send({ err }));

    }
});

app.post('/removeProduct', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.query.ownerUUID}`);
    isOwner = isOwner._body;

    if (isOwner) {
        await superagent
            .post(`http://${process.env.API_IP}:5145/product/removeProduct`)
            .send(req.query)
            .set('Accept', 'application/json')
            .then(r => {
                console.log("product removed");
                console.log(req.query);
                res.send("OK");
            }).catch(err => res.send({ err }));
    }
});

app.post('/removeStore', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.query.ownerUUID}`);
    isOwner = isOwner._body;

    if (isOwner) {
        await superagent
            .post(`http://${process.env.API_IP}:5145/store/removeStore`)
            .send(req.query)
            .set('Accept', 'application/json')
            .then(r => {
                console.log("store removed");
                console.log(req.query);
                res.send("OK");
            }).catch(err => res.send({ err }));
    }
});


app.post('/completeOrder', async (req, res) => {

    let isOwner = await superagent.get(`http://${process.env.API_IP}:5145/management/isOwner?uuid=${req.query.ownerUUID}`);
    isOwner = isOwner._body;

    if (isOwner) {
        await superagent
            .post(`http://${process.env.API_IP}:5145/order/completeOrder?id=${parseInt(req.query.id)}`)
            .set('Accept', 'application/json')
            .then(r => {
                console.log("order with ID " + req.query.id + " completed");
                res.send("OK");
            }).catch(err => res.send({ err }));
    }
});


app.post('/makeAccOwner', async (req, res) => {

    let isAdmin = await superagent.get(`http://${process.env.API_IP}:5145/management/isAdmin?uuid=${req.body.c}`);
    isAdmin = isAdmin._body;

    if (isAdmin) {

        let uuid = JSON.parse(req.body.name.text).uuid;

        await superagent
            .post(`http://${process.env.API_IP}:5145/management/makeaccowner?uuid=${uuid}`)
            .set('Accept', 'application/json')
            .then(r => {
                res.send("OK");
            }).catch(err => res.send({ err }));

    }
});


app.post('/removeUser', async (req, res) => {

    let isAdmin = await superagent.get(`http://${process.env.API_IP}:5145/management/isAdmin?uuid=${req.body.c}`);
    isAdmin = isAdmin._body;

    if (isAdmin) {

        await superagent
            .post(`http://${process.env.API_IP}:5145/Register/removeUser`)
            .send({ Username: req.body.name })
            .set('Accept', 'application/json')
            .then(r => {
                res.send("OK");
            }).catch(err => res.send({ err }));

    }
});


app.listen(port, () => {
    console.log('server listening on port ' + port);
});