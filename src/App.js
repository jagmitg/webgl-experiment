// src/App.js
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import WebGLCube from "./WebGLCube";
import D3Library from "./D3Library";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/webgl" element={<WebGLCube />} />
            <Route path="/d3" element={<D3Library />} />
        </Routes>
    );
}

export default App;
