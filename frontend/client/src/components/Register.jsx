import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const apiCall = async (e) => {
  e.preventDefault();
  let username = document.getElementsByName("username")[0].value;
  let password = document.getElementsByName("password")[0].value;
  let confirmPass = document.getElementsByName("passConfirm")[0].value;

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  await axios.post(`http://${window.location.hostname}/register`,
    {
      username: username,
      password: password,
      confirmPass: confirmPass,
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(async (response) => {
      let res = response.data;

      if (res === "badPass") {
        console.log("ok")
        document.getElementById('passErr').classList.remove("hidden");
        document.getElementById('passErr').classList.add("err-visible");
        document.getElementById('passErr').classList.remove("err-hidden");
        await delay(2000);
        // fade out
        document.getElementById('passErr').classList.add("err-hidden");
        document.getElementById('passErr').classList.remove("err-visible");
        return;
      }

      console.log(res);
    });
};

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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </details>
          </div>
          <div className="navbar-center">
            <Link to="/" className="btn btn-ghost text-xl"><img src="./logo.png" className="h-10 p-1" alt="Foodnet Logo" />
              FoodNet</Link>
          </div>
          <div className="navbar-end">
            <button className="btn btn-ghost" onClick={() => document.getElementById('loginModal').showModal()}>
              Log-in/Register
            </button>
            <dialog id="loginModal" className="modal">
              <div className="modal-box">
                <h2 className="card-title text-2xl font-bold mb-6">Login</h2>
                <form>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                      <input type="email" className="grow" placeholder="email@example.com" />
                    </label>
                  </div>
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                      <input type="password" className="grow" placeholder="Enter password" />
                    </label>
                  </div>
                  <div className="form-control mt-6">
                    <button className="btn btn-primary">
                      Login
                    </button>
                  </div>
                </form>
                <div className="divider">OR</div>
                <div className="text-center">
                  <p>Don't have an account?</p>
                  <Link to="/register" className="link link-primary">Register now</Link>
                </div>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        <hr />
      </header>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
              <input name="username" type="text" className="grow" placeholder="Username" required />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
              <input name="password" type="password" className="grow" placeholder="Enter password" required />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
              <input name="passConfirm" type="password" className="grow" placeholder="Enter password" required />
            </label>
          </div>
          <div className="form-control mt-6">
            <button onClick={apiCall} className="btn btn-primary">
              Register
            </button>
          </div>
          <div id="passErr" role="alert" className="py-2 my-8 hidden alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Passwords do not match</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;