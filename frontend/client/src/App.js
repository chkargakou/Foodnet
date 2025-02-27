import "./App.css";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Success from "./components/Success";
import Stores from "./components/Stores";
import Store from "./components/Store";
import Cart from "./components/Cart";
import About from "./components/About";

function App() {
    return (
        <>
            <Router>
                <Routes>

                    <Route
                        exact
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/stores"
                        element={<Stores />}
                    />

                    <Route
                        path="/store"
                        element={<Store />}
                    />

                    <Route
                        path="/Cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/logout"
                        element={<Logout />}
                    />

                    <Route
                        path="/success"
                        element={<Success />}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;