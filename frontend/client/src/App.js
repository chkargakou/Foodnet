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
import Stores from "./components/Stores";
import Store from "./components/Store";
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
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;