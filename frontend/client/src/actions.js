import axios from "axios";
export const port = 8081;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Username and timestamp from cookie
let c = decodeURIComponent(getCookie("SessionID")).split("|");
let cUser = c[1];
let cStamp = c[2];

// Check for cookie
const check = setInterval(() => {
    if (document.getElementById("LoginButton")) {
        clearInterval(check);
        if (cStamp < Date.now() + 20 * 60 * 1000) {
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
            document.getElementById("LoginButton").replaceWith(userButton);
        }
    }
}, 100);

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