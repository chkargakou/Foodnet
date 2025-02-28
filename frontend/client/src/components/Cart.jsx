import React from "react";
import { login, getCart, addOrder } from "../actions";

// For a single order
const checkOrdersDiv = setInterval(async () => {
    if (document.getElementById("orderList")) {

        // Check if cart in storage is empty
        if (!localStorage.getItem("myCart")) return window.location.replace("/");
        
        clearInterval(checkOrdersDiv);

        let cart = getCart().items;
        let unique = [];
        let res = "";
        let total = 0;

        for (let i = 0; i < cart.length; i++) {
            if (!unique.includes(cart[i][0])) unique.push(cart[i][0]);
        }

        for (let i = 0; i < unique.length; i++) {
            // Initialization
            unique[i, "cost"] = 0;
            unique[i, "count"] = 0;

            // Cost of a single one (used in removing items from cart)
            unique[i, "singleCost"] = cart[i][1];

            for (let j = 0; j < cart.length; j++) {
                if (unique[i] === cart[j][0]) {
                    unique[i, "cost"] += parseFloat(cart[j][1]);
                    unique[i, "count"]++;
                }
            }

            let storeName = cart[0][2];

            res += ` 
                <div class="card bg-base-100 w-full shadow-xl container mx-auto mx-32">
          <div class="card-body">
            <h2 id="${i}title" class="card-title">${unique[i]}</h2>
            <p>x${unique[i, "count"]}</p>
            <div class="card-actions justify-end">
                <p>${Math.round(unique[i, "cost"] * 100) / 100}€</p>
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart') || ''; localStorage.setItem('myCart', cart + '${unique[i]}|${unique[i, 'singleCost']}|${storeName},'); document.location.reload(true) })() }" class="btn btn-primary">+1</button>
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart'); localStorage.setItem('myCart', cart.replace('${unique[i]}|${unique[i, 'singleCost']}|${storeName},', '')); document.location.reload(true) })() }" class="btn btn-primary">-1</button>
            </div>
          </div>
        </div>`;
            total += Math.round(unique[i, "cost"] * 100) / 100;
        }

        document.getElementById("orderList").innerHTML = res;
        document.getElementById("storeName").innerHTML = cart[0][2];
        document.getElementById("totalCost").innerText = `Σύνολο: ${total}€`;
    }
}, 100);

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="navbar bg-base-100">
                    <div className="navbar-start">
                        <details className="dropdown">
                            <summary tabIndex={0} role="button" className="btn btn-circle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </summary>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li><a href="/">Αρχική</a></li>
                                <li><a href="/stores">Μαγαζιά</a></li>
                                <li><a href="/about">Σχετικά με εμάς</a></li>
                            </ul>
                        </details>
                    </div>
                    <div className="navbar-center">
                        <a href="/" className="btn btn-ghost text-xl"><img src="./logo.png" className="h-10 p-1" alt="Foodnet Logo" />
                            FoodNet</a>
                    </div>
                    <div className="navbar-end">
                        <button id="LoginButton" className="btn btn-ghost" onClick={() => document.getElementById('loginModal').showModal()}>
                            Σύνδεση/Εγγραφή
                        </button>
                        <dialog id="loginModal" className="modal">
                            <div className="modal-box">
                                <h2 className="card-title text-2xl font-bold mb-6">Σύνδεση</h2>
                                <form>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Όνομα Χρήστη</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                            <input name="username" type="text" className="grow" placeholder="Όνομα Χρήστη" required />
                                        </label>
                                    </div>
                                    <div className="form-control mt-4">
                                        <label className="label">
                                            <span className="label-text">Κωδικός</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                            <input name="password" type="password" className="grow" placeholder="Κωδικός" />
                                        </label>
                                    </div>
                                    <div className="form-control mt-6">
                                        <button onClick={login} className="btn btn-primary">
                                            Σύνδεση
                                        </button>
                                    </div>
                                </form>
                                <div className="divider">OR</div>
                                <div className="text-center">
                                    <p>Δεν έχεις λογαριασμό;</p>
                                    <a href="/register" className="link link-primary">Εγγραφή</a>
                                </div>
                                <div className="modal-action">
                                    <form method="dialog">
                                        <button className="btn">Κλείσιμο</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
                <hr />
            </header>

            <h2 id="storeName" className="text-center py-10 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white"></h2>

            <div id="orderList" className="place-items-center py-16 grid"></div>

            <h2 id="totalCost" className="text-center mb-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white"></h2>

            <div className="container mx-auto px-32">
                <div className="grid gap-6 mb-6 md:grid-cols-1">
                    <div>
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Διεύθυνση</label>
                        <input type="text" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Διεύθυνση" required />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Τηλέφωνο</label>
                        <input type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="6981234567" pattern="[0-9]{10}" required />
                    </div>
                    <div>
                        <label htmlFor="postal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Τ.Κ.</label>
                        <input type="number" id="postal" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="12345" required />
                    </div>
                    <div>
                        <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Σημειώσεις για Delivery</label>
                        <input type="text" id="note" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" />
                    </div>
                </div>
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                        <input id="pos" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
                    </div>
                    <label htmlFor="pos" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Θέλω POS.</label>
                </div>
                <button onClick={addOrder} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ολοκλήρωση Παραγγελείας</button>
            </div>



        </div>
    );
};

export default App;
