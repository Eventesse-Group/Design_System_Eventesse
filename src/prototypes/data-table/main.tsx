import React from "react";
import ReactDOM from "react-dom/client";
import { DataTablePrototype } from "./DataTablePrototype";
import "../../styles/tokens.css";
import "./prototype.css";

ReactDOM.createRoot(document.getElementById("prototype-root")!).render(
  <React.StrictMode><DataTablePrototype /></React.StrictMode>,
);
