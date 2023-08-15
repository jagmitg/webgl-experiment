import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="homepage">
            <Link to="/">Home</Link>
            <Link to="/webgl">WebGL Example</Link>
            <Link to="/d3">D3 Graph Example</Link>
        </div>
    );
}

export default Home;
