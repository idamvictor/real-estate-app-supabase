import Header from "../components/Header";
import React from "react";

export default function Provider({children}) {
  return (
    <div>
      <Header /> 
      {children}
    </div>
  );
}
