import React from "react";
import ReactDOM from "react-dom/client";
import { NavigationShellPrototype } from "./NavigationShellPrototype";
import "../../styles/tokens.css";
import "./navigation.css";

ReactDOM.createRoot(document.getElementById("prototype-root")!).render(
  <React.StrictMode><NavigationShellPrototype /></React.StrictMode>,
);
