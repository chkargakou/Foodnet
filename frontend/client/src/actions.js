import axios from "axios";
export const port = 8081;

// Username and timestamp from cookie
let c = decodeURIComponent(getCookie("SessionID")).split("|");
// Export username for use in baskets
export let cUser = c[1];
let cStamp = c[2];

export const getCart = () => {
    let total = 0;
    let len = 0;
    let items = localStorage.getItem('myCart');
    items = items.split(",");
    items = items.slice(0, -1) || 0;

    if (items !== 0) {
        len = items.length;

        for (let i = 0; i < len; i++) {
            total += parseFloat(items[i].split("|")[1]);
            items[i] = items[i].split("|");
        }

        total = Math.round(total * 100) / 100

        return { total, len, items }
    } else {
        return { total, len, items }
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Replace login/register button with cart and username
if (cUser) {
    const check = setInterval(() => {
        if (document.getElementById("LoginButton")) {
            clearInterval(check);
            if (cStamp < Date.now() + 120 * 60 * 1000) {
                let cartInfo = getCart();
                const userButton = document.createElement("div");
                userButton.id = "userButton"
                userButton.innerHTML = `<div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">${cUser}</div>
        <ul
          tabindex="0"
          class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
          <li><a href="/logout">Αποσύνδεση</a></li>
        </ul>
      </div>`
                const cart = document.createElement("div");
                cart.innerHTML = `
      <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <div class="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span id="itemSize" class="badge badge-sm indicator-item">${cartInfo.len}</span>
        </div>
    </div>
    <div tabindex="0" class="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
        <div class="card-body">
            <span id="itemSizeBig" class="text-lg font-bold">${cartInfo.len} Προϊόντα</span>
            <span id="itemTotal" class="text-info">Σύνολο: ${cartInfo.total}€</span>
            <div class="card-actions">
                <a href="/Cart" class="btn btn-primary btn-block">Καλάθι</a>
            </div>
        </div>
    </div>
</div>
      `;
                document.getElementsByClassName("navbar-end")[0].appendChild(cart);
                document.getElementById("LoginButton").replaceWith(userButton);
            }
        }
    }, 100);
}

// get a single product
const getProduct = async (storeName, productName) => {
    await axios.get(`http://${window.location.hostname}:${port}/getProduct?name=${storeName}&q=${productName}`).then(data => {
        // this is the product object from server/index.js:157
        return data.data;
    });
}

// Register
export const register = async (e) => {
    e.preventDefault();
    let username = document.getElementsByName("regusername")[0].value;
    let password = document.getElementsByName("regpassword")[0].value;
    let confirmPass = document.getElementsByName("passConfirm")[0].value;

    const delay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    await axios.post(`http://${window.location.hostname}:${port}/register`,
        {
            username: username,
            password: password,
            confirmPass: confirmPass,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            let res = response.data;

            if (res === "OK") return window.location.href = "/"
            else if (res === "badPass") {
                // θερμοσίφωνας
                document.getElementById("passErr").classList.remove("hidden");
                document.getElementById("passErr").classList.add("err-visible");
                document.getElementById("passErr").classList.remove("err-hidden");
                await delay(2000);
                // fade out
                document.getElementById("passErr").classList.add("err-hidden");
                document.getElementById("passErr").classList.remove("err-visible");
                return;
            } else if (res.err.status !== undefined) {
                return alert("Error: " + res.err.response.text);
            } else if (res.err) {
                return alert("Error: " + res.err.code);
            }

        });
};

// Login
export const login = async (e) => {
    e.preventDefault();
    let username = document.getElementsByName("username")[0].value;
    let password = document.getElementsByName("password")[0].value;

    await axios.post(`http://${window.location.hostname}:${port}/login`,
        {
            username: username,
            password: password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            let res = response.data;

            if (res === "OK") return window.location.href = "/"
            else if (res.err && res.err.status !== undefined) {
                return alert("Error: " + res.err.response.text);
            } else if (res.err) {
                return alert("Error: " + res.err.code);
            }

        });
};

// getUUID. TODO: use for auth
async function getUUID() {

    await axios.post(`http://${window.location.hostname}:${port}/getUUID`,
        {
            username: cUser,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            let res = response.data;

            console.log(res);

            // if (res === "OK") return window.location.href = "/"
            // else if (res.err && res.err.status !== undefined) {
            //     return alert("Error: " + res.err.response.text);
            // } else if (res.err) {
            //     return alert("Error: " + res.err.code);
            // }

        });
};