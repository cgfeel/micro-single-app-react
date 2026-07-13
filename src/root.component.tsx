import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import About from "./pages/About";
import Home, {HomeProps} from "./pages/Home";

const ROOT_CONFIG_URL = process.env.DEPLOY_BASE ?? "/micro-single-app-react";
const isProduction = process.env.NODE_ENV === "production";
const namePath = process.env.STANDALONE ? "/" : "/react";

export default function Root({name, basename = namePath}: RootProps) {
  return (
    <BrowserRouter
      basename={isProduction ? `${ROOT_CONFIG_URL}${basename}` : basename}
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
