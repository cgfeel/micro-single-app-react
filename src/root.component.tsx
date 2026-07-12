import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import About from "./pages/About";
import Home, {HomeProps} from "./pages/Home";

export default function Root({name, basename = "/react"}: RootProps) {
  return (
    <BrowserRouter
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <h1>Hellow React!</h1>
      <nav>
        <Link to="/">Go to Home</Link> | <Link to="/about">Go to About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home name={name} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export interface RootProps extends HomeProps {
  basename?: string;
}
