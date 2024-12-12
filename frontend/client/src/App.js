import "./App.css";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Products from "./components/Products";
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
                        path="/products"
                        element={<Products />}
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
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;