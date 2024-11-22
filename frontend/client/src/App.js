import axios from 'axios';
import './App.css';

const apiCall = () => {
  axios.get(`http://${window.location.hostname}`).then((data) => {
    console.log(data);
    document.getElementById('apiRes').innerText = data.data;
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
                <li><a href="/">Home</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </details>
          </div>
          <div className="navbar-center">
            <img src="./logo.png" className="h-10 p-1" alt="Foodnet Logo" />
            <a className="btn btn-ghost text-xl">FoodNet</a>
          </div>
          <div className="navbar-end">
            <button className="btn btn-ghost btn-circle">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="btn" onClick={() => document.getElementById('modal').showModal()}><div className="indicator">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div></button>
            <dialog id="modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg"></h3>
                <p id="apiRes" className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                    <button onClick={apiCall} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Close</button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        <hr />
      </header>
    </div>
  );
};

export default App;
