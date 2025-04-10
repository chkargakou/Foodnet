import React from "react";
import axios from "axios";
import { isOwner, port, c, host, protocol } from "../utils/actions.js";

function removeProduct() {
    const rpDiv = setInterval(async () => {
        if (document.getElementById("rpDiv")) {
            clearInterval(rpDiv);
            isOwner();

            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());

            await axios.post(`${protocol}://${host}:${port}/removeProduct?StoreName=${params.StoreName}&ProductName=${params.ProductName}&ownerUUID=${c}`);

            return window.location.href = `/StoreItems?storeName=${params.StoreName}`;
        }
    }, 100);
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {removeProduct()}
                <div id="rpDiv"></div>
            </header>
        </div>
    );
}

export default App;