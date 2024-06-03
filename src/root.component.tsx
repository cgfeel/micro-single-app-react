import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";

export default function Root(props) {
  return (
    <BrowserRouter basename="/react">
      <h1>Hellow React!</h1>
      <nav>
        <Link to="/">Go to Home</Link> | <Link to="/about">Go to About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home name={props.name} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
