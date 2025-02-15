import React from "react";
import { login, basket, cUser } from "../actions";

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
      </header>
      <div className="content-center hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://batumidutyfree.com/wp-content/uploads/2024/02/camel-blue-20s-004.jpg"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="qigaro" />
          <div className="px-40">
            <h1 className="text-5xl font-bold">Νέες Επιλογές!</h1>
            <p className="py-6">
              Κάντε κλικ <a href="/stores" className="link link-primary">εδώ</a> για να δείτε τα νέα είδη προϊόντων.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
