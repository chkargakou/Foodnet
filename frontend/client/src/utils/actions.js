import axios from "axios";

// Get host and port from .env at "client/.env"
export const protocol = process.env.REACT_APP_PROTOCOL;
export const host = process.env.REACT_APP_HOST;
export const port = process.env.REACT_APP_PORT;

// Export UUID from cookie
export let c = decodeURIComponent(getCookie("SessionID"));

// Export username/Get user contents
const fetchUserContents = await axios.post(`${protocol}://${host}:${port}/getUsername`,
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

const cRes = fetchUserContents;
export let cUser = cRes.name.name;
let divContent = cRes.name.content;

// Replace login/register button with cart and username
export const checkUser = setInterval(async () => {
    if (cUser) {
        clearInterval(checkUser);
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
            <svg xmlns="${protocol}://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
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
}, 100);

async function isAdmin() {
    await axios.get(`${protocol}://${host}:${port}/isAdmin?uuid=${c}`).then((res) => {
        if (!res.data) return window.location.replace("/");
    });
}

export async function isOwner() {
    await axios.get(`${protocol}://${host}:${port}/isOwner?uuid=${c}`).then((res) => {
        if (!res.data) return window.location.replace("/");
    });
}

// Check if user is admin in site management 
export const checkAddOwnerDiv = setInterval(async () => {
    if (document.getElementById("addOwnerDiv")) {
        isAdmin();
        clearInterval(checkAddOwnerDiv);
    }
}, 100);

// Check if user is admin in site management 
export const checkRMOwnerDiv = setInterval(async () => {
    if (document.getElementById("rmOwnerDiv")) {
        isAdmin();
        clearInterval(checkRMOwnerDiv);
    }
}, 100);

// Check if user is owner in store management 
export const checkAddStoreDiv = setInterval(async () => {
    if (document.getElementById("addStoreDiv")) {
        isOwner();
        clearInterval(checkAddStoreDiv);
    }
}, 100);

// Owner's stores page
export const checkUserStoresDiv = setInterval(async () => {
    if (document.getElementById("userStoresList")) {
        isOwner();
        clearInterval(checkUserStoresDiv);
        await axios.get(`${protocol}://${host}:${port}/getStoresOwned?uuid=${c}`)
            .then(data => {
                document.getElementById("userStoresList").innerHTML = `${data.data}`;
            });
    }
}, 100);

// For all orders from the store's side
export const checkStoreOrdersDiv = setInterval(async () => {
    if (document.getElementById("storeOrdersList")) {
        isOwner();
        clearInterval(checkStoreOrdersDiv);
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        await axios.get(`${protocol}://${host}:${port}/getOrdersStore?Storename=${params.storeName}&uuid=${c}`)
            .then(data => {
                document.getElementById("storeOrdersList").innerHTML = `${data.data}`;
            });
    }
}, 100);

// Get all items from the store's side
export const checkStoreItemsDiv = setInterval(async () => {
    if (document.getElementById("storeItemsList")) {
        isOwner();
        clearInterval(checkStoreItemsDiv);
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        await axios.get(`${protocol}://${host}:${port}/getProductsStore?Storename=${params.storeName}&uuid=${c}`)
            .then(data => {
                document.getElementById("storeItemsList").innerHTML = `${data.data}`;
            });
    }
}, 100);

// Stores page from the user's side
export const checkStoresDiv = setInterval(async () => {
    if (document.getElementById("storesList")) {
        clearInterval(checkStoresDiv);
        await axios.get(`${protocol}://${host}:${port}/getStores`).then(data => {
            document.getElementById("storesList").innerHTML = `${data.data}`;
        });
    }
}, 100);

// Get store products from the user's side
export const checkProductsDiv = setInterval(async () => {
    if (document.getElementById("productsList")) {
        clearInterval(checkProductsDiv);
        await axios.get(`${protocol}://${host}:${port}/getProducts${window.location.search}`).then(data => {
            document.getElementById("productsList").innerHTML = `${data.data}`;
        });
    }
}, 100);

// For checking a user's current unfinished order
export const checkCartDiv = setInterval(async () => {
    if (document.getElementById("orderList")) {

        // Check if cart in storage is empty
        if (!localStorage.getItem("myCart")) return window.location.replace("/");
        clearInterval(checkCartDiv);

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
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart') || ''; localStorage.setItem('myCart', cart + '${unique[i].replace("'", "\\'")}|${unique[i, 'singleCost']}|${storeName.replace("'", "\\'")},'); document.location.reload(true) })() }" class="btn btn-primary">+1</button>
                <button id="${i}button" onClick="{(() => { let cart = localStorage.getItem('myCart'); localStorage.setItem('myCart', cart.replace('${unique[i].replace("'", "\\'")}|${unique[i, 'singleCost']}|${storeName.replace("'", "\\'")},', '')); document.location.reload(true) })() }" class="btn btn-primary">-1</button>
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

// For all orders from the user's side
export const checkOrdersDiv = setInterval(async () => {
    if (document.getElementById("ordersList")) {
        // Check if cart in storage is empty
        if (!cUser) return window.location.replace("/");

        clearInterval(checkOrdersDiv);

        await getOrdersUser();
    }
}, 100);

export const getCart = () => {
    let items = localStorage.getItem('myCart');
    if (!items) return null;

    items = items.split(",");
    items = items.slice(0, -1) || 0;

    // Reset cart in case of store change
    if (items.length > 1 && (items[items.length - 2].split("|")[2] !== items[items.length - 1].split("|")[2])) {
        localStorage.setItem('myCart', `${items[items.length - 1].replace("'", "\\'")},`);
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

    if (!order.Address || !order.TelNumber || !order.PostNumber) return alert("Έχεις άδεια κενά στην φόρμα παραγγελίας!");

    await axios.post(`${protocol}://${host}:${port}/addOrder`,
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

export async function addStore() {

    isOwner();

    let store = {
        StoreName: document.getElementsByName("storeName")[0].value,
        Location: document.getElementsByName("storeLocation")[0].value,
        ownerUUID: c,
    };

    if (!store.StoreName || !store.Location) return alert("Έχεις άδεια κενά στην φόρμα προσθήκης!");

    // For sanitizing text
    function sanitize(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    }

    store.StoreName = sanitize(store.StoreName);
    store.Location = sanitize(store.Location);

    await axios.post(`${protocol}://${host}:${port}/addStore`,
        store,
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            let res = response.data;

            if (res === "OK") { alert("Προστέθηκε!"); window.location.reload(); }
            else if (res.err.status !== undefined) {
                return alert("Error: " + res.err.response.text);
            } else if (res.err) {
                return alert("Error: " + res.err.code);
            }
        });

}

export async function addProduct() {

    isOwner();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let product = {
        StoreName: params.storeName,
        ProductName: document.getElementsByName("productName")[0].value,
        ProductPrice: document.getElementsByName("productPrice")[0].value,
        ownerUUID: c,
    };

    if (!product.StoreName) return window.location.replace("/");
    else if (!product.ProductName || !product.ProductPrice) return alert("Έχεις κενά στην φόρμα προσθήκης!");

    // For sanitizing text
    function sanitize(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    }

    product.ProductName = sanitize(product.ProductName);
    product.ProductPrice = sanitize(product.ProductPrice);

    await axios.post(`${protocol}://${host}:${port}/addProduct`,
        product,
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            let res = response.data;

            if (res === "OK") { alert("Προστέθηκε!"); window.location.reload(); }
            else if (res.err.status !== undefined) {
                return alert("Error: " + res.err.response.text);
            } else if (res.err) {
                return alert("Error: " + res.err.code);
            }
        });

}

export async function makeAccOwner() {

    isAdmin();

    let name = document.getElementsByName("ownerName")[0].value;

    await axios.post(`${protocol}://${host}:${port}/getUUID`,
        { name, c },
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })
        .then(async (response) => {
            name = response.data;

            await axios.post(`${protocol}://${host}:${port}/makeAccOwner`,
                { name, c },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                    credentials: "include",
                })
                .then(async (response) => {
                    let res = response.data;

                    if (res === "OK") { alert("Προστέθηκε!"); window.location.reload(); }
                    else { alert("Error: " + res.err.code); return window.location.reload(); }
                });

        });


}

export async function removeUser() {

    isAdmin();

    let name = document.getElementsByName("userName")[0].value;

    await axios.post(`${protocol}://${host}:${port}/removeUser`,
        { name, c },
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
        })

        .then(async (response) => {
            let res = response.data;

            if (res === "OK") { alert("Αφαιρέθηκε!"); window.location.reload(); }
            else { alert("Error: " + res.err.code); return window.location.reload(); }
        });


}

export const getOrdersUser = async () => {
    await axios.get(`${protocol}://${host}:${port}/getOrdersUser?uuid=${c}`).then((res) => {
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

    await axios.post(`${protocol}://${host}:${port}/register`,
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
                // fade in
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

    await axios.post(`${protocol}://${host}:${port}/login`,
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

