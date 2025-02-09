import React from "react";
import { login, port } from "../actions";
import axios from "axios";

const checkProductsDiv = setInterval(async () => {
    if (document.getElementById("productsList")) {
        clearInterval(checkProductsDiv);
        await axios.get(`http://${window.location.hostname}:${port}/getProducts${window.location.search}`).then(data => {
            document.getElementById("productsList").innerHTML = `${data.data}`;
        });
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

      <div id="productsList" className="place-items-center py-16 grid gap-8 columns-3"></div>

    </div>
  );
};

export default App;
