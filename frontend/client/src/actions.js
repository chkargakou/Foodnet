import axios from "axios";
export const port = 8081;

// Export UUID from cookie
export let c = decodeURIComponent(getCookie("SessionID"));

// Export username/Get user contents
const fetchUserContents = await axios.post(`http://${window.location.hostname}:${port}/getUsername`,
    { c },
    {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "include",
    })
    .then(async (response) => {
        let name = response.data;
        let content = response.html
        return { name, content }
    });

let cRes = fetchUserContents;
export let cUser = cRes.name.name;
let divContent = cRes.name.content;

// Replace login/register button with cart and username
if (cUser) {
    const check = setInterval(() => {
        if (document.getElementById("LoginButton")) {
            clearInterval(check);
            let cartInfo = getCart();
            let len = 0;
            let total = 0;

            if (cartInfo !== null) { len = cartInfo.len; total = cartInfo.total; }

            const userButton = document.createElement("div");
            userButton.id = "userButton"
            userButton.innerHTML = `${divContent}`
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
            <span id="itemSize" class="badge badge-sm indicator-item">${len}</span>
        </div>
    </div>
    <div tabindex="0" class="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
        <div class="card-body">
            <span id="itemSizeBig" class="text-lg font-bold">${len} Προϊόν(τα)</span>
            <span id="itemTotal" class="text-info">Σύνολο: ${total}€</span>
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
    }, 100);
}

export async function isAdmin() {
    await axios.get(`http://${window.location.hostname}:${port}/isAdmin?uuid=${c}`).then((res) => {
        if (!res.data) return window.location.replace("/");
    });
}

export const getCart = () => {
    let items = localStorage.getItem('myCart');
    if (!items) return null;

    items = items.split(",");
    items = items.slice(0, -1) || 0;

    // Reset cart in case of store change
    if (items.length > 1 && (items[items.length - 2].split("|")[2] !== items[items.length - 1].split("|")[2])) {
        localStorage.setItem('myCart', `${items[items.length - 1]},`);
    }

    let total = 0;
    let len = 0;

    len = items.length;

    for (let i = 0; i < len; i++) {
        total += parseFloat(items[i].split("|")[1]);
        items[i] = items[i].split("|");
    }

    total = Math.round(total * 100) / 100

    return { total, len, items }
}

export async function addOrder() {
    let cart = getCart().items;
    let unique = [];
    let ProductList = "";
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        if (!unique.includes(cart[i][0])) unique.push(cart[i][0]);
    }

    for (let i = 0; i < unique.length; i++) {
        // Initialization
        unique[i, "cost"] = 0;
        unique[i, "count"] = 0;

        for (let j = 0; j < cart.length; j++) {
            if (unique[i] === cart[j][0]) {
                unique[i, "cost"] += parseFloat(cart[j][1]);
                unique[i, "count"]++;
            }
        }

        ProductList += `${unique[i]}|${unique[i, "count"]}, `
        total += Math.round(unique[i, "cost"] * 100) / 100;
    }

    let order = {
        StoreName: document.getElementById("storeName").innerText,
        ProductList: ProductList,
        OrderValue: total,
        UUID: c,
        Address: document.getElementById("address").value,
        TelNumber: document.getElementById("phone").value,
        DeliveryOrders: document.getElementById("note").value,
        PostNumber: document.getElementById("postal").value,
        POSOption: document.getElementById("pos").checked
    };

    await axios.post(`http://${window.location.hostname}:${port}/addOrder`,
        order,
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            let res = response.data;

            if (res === "OK") return window.location.href = "/success"
            else
                return alert("Error: " + res.err.code);
        });

}

export const getOrdersUser = async () => {
    await axios.get(`http://${window.location.hostname}:${port}/getOrdersUser?uuid=${c}`).then((res) => {
        document.getElementById("ordersList").innerHTML = res.data;
    });
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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

