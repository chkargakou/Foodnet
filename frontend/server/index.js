const express = require("express");
const superagent = require("superagent")
const app = express();
const cors = require("cors");
const port = 80;

// env variables
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

app.use(cors())
console.log(process.env.API_IP);
app.get('/', async (req, res) => {
    let body = await superagent.get(`http://${process.env.API_IP}:5145`);
    res.send(body.text);
});

app.listen(port, () => {
      console.log('server listening on port 80')
});