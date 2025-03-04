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
import Management from "./components/Management";
import StoreAdmin from "./components/StoreAdmin";
import StoreItems from "./components/StoreItems";
import StoreOrders from "./components/StoreOrders";
import RemoveStore from "./components/RemoveStore";
import RemoveProduct from "./components/RemoveProduct";
import CompleteOrder from "./components/CompleteOrder";
import MyOrders from "./components/MyOrders";
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
                        path="/Stores"
                        element={<Stores />}
                    />

                    <Route
                        path="/Store"
                        element={<Store />}
                    />

                    <Route
                        path="/Cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/About"
                        element={<About />}
                    />

                    <Route
                        path="/Register"
                        element={<Register />}
                    />

                    <Route
                        path="/Logout"
                        element={<Logout />}
                    />

                    <Route
                        path="/Success"
                        element={<Success />}
                    />

                    <Route
                        path="/MyOrders"
                        element={<MyOrders />}
                    />

                    <Route
                        path="/Management"
                        element={<Management />}
                    />

                    <Route
                        path="/StoreAdmin"
                        element={<StoreAdmin />}
                    />

                    <Route
                        path="/StoreOrders"
                        element={<StoreOrders />}
                    />

                    <Route
                        path="/StoreItems"
                        element={<StoreItems />}
                    />

                    <Route
                        path="/RemoveStore"
                        element={<RemoveStore />}
                    />

                    <Route
                        path="/RemoveProduct"
                        element={<RemoveProduct />}
                    />

                    <Route
                        path="/CompleteOrder"
                        element={<CompleteOrder />}
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