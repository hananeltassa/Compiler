import logo from "./logo.svg";
import "./styles/App.css";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Compiler from "./pages/Compiler";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="compiler" element={<Compiler />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
