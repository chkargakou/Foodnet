import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <footer className="footer footer-center bg-base-20 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <a href="/About" className="link link-hover">Σχετικά με εμάς</a>
        <a href="mailto:chkargakos@gmail.com" className="link link-hover">Επικοινωνία</a>
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All ups and downs reserved by FoodNet Ltd</p>
      </aside>
    </footer>
  </React.StrictMode>
);
