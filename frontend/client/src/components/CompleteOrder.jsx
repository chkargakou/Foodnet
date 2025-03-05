import React from "react";
import axios from "axios";
import { isOwner, port, c, host, protocol } from "../utils/actions.js";

function completeOrder() {
    const oDiv = setInterval(async () => {
        if (document.getElementById("oDiv")) {
            clearInterval(oDiv);
            isOwner();

            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());

            await axios.post(`${protocol}://${host}:${port}/completeOrder?id=${params.id}&ownerUUID=${c}`);

            return window.location.href = "/storeadmin";
        }
    }, 100);
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {completeOrder()}
                <div id="oDiv"></div>
            </header>
        </div>
    );
}

export default App;