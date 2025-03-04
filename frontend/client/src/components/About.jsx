import React from "react";
import { login } from "../utils/actions.js";

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
            <a href="/" className="btn btn-ghost text-xl"><img src="./assets/logo.png" className="h-10 p-1" alt="Foodnet Logo" />
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
      <section class="py-24 relative xl:mr-0 lg:mr-5 mr-0">
        <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
          <div class="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div class="w-full flex-col justify-center items-start gap-8 flex">
                <div class="flex-col justify-start lg:items-start items-center gap-4 flex">
                  <h6 class="text-white-400 text-base font-normal leading-relaxed">Σχετικά με εμάς</h6>
                  <div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2
                      class="text-white-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                      Ο θρύλος του FoodNet</h2>
                    <p
                      class="text-white-100 text-base font-normal leading-relaxed lg:text-start text-center">
                      Η εξής εργασία είναι πάρα μόνο μια <b>φθηνή απομίμηση του e-food.gr</b>, τα οποιαδήποτε πνευματικά δικαιώματα (π.χ. λογότυπο) ανήκουν εκεί.</p>
                  </div>
                </div>
                <div class="w-full flex-col justify-center items-start gap-6 flex">
                  <div class="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div
                      class="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                      <h4 class="text-white-900 text-2xl font-bold font-manrope leading-9">Χρύσα Καργάκου</h4>
                      <p class="text-gray-500 text-base font-normal leading-relaxed">23390039</p>
                    </div>
                    <div
                      class="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                      <h4 class="text-white-900 text-2xl font-bold font-manrope leading-9">Χριστίνα Ρόμπου</h4>
                      <p class="text-gray-500 text-base font-normal leading-relaxed">
                        20390201</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="sm:w-fit w-full group px-3.5 py-2 bg-white-50 hover:bg-white-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex">
                <a href="https://github.com/chkargakou/ergasia-eithtl-foodnet"><span
                  class="px-1.5 text-white-600 text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">Github Repository</span></a>
                <svg class="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F46E5" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div class="w-full lg:justify-start justify-center items-start flex">
              <div
                class="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                <img class="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                  src="./assets/foodnet-stock.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;