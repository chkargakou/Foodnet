const express = require("express");
const superagent = require("superagent")
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser')
const port = 80;

// env variables
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

app.use(cors())
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    let body = await superagent.get(`http://${process.env.API_IP}:5145`);
    res.send(body.text);
});

app.post('/register', async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    if (req.body.password != req.body.confirmPass) return res.send("badPass");
    await superagent
        .post(`http://${process.env.API_IP}:5145/register`)
        .send({ Username: username, Password: password })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        // .then(res => {
        //     res.send('yay got ' + JSON.stringify(res.body));
        // });
});

app.listen(port, () => {
    console.log('server listening on port 80')
});