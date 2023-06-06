import React, { useState } from "react";
import SalaryList from "./SalaryList";

export function Main(){  
  const [currentView, setCurrentViwe] = useState(<SalaryList/>)
  
  return (
    <>
      <div>{currentView}</div>
    </>
  );
}

export default Main;
