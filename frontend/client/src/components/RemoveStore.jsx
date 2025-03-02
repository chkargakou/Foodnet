import React from "react";
import axios from "axios";
import { isOwner, port, c } from "../utils/actions";

function removeStore() {
    const rDiv = setInterval(async () => {
        if (document.getElementById("rDiv")) {
            clearInterval(rDiv);
            isOwner();

            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());

            await axios.post(`http://${window.location.hostname}:${port}/removeStore?StoreName=${params.StoreName}&location=${params.location}&ownerUUID=${c}`);

            return window.location.href = "/storeadmin"
        }
    }, 100);
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {removeStore()}
                <div id="rDiv"></div>
            </header>
        </div>
    );
}

export default App;