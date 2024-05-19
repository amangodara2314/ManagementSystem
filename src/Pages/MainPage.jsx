import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { MainContext } from "../Context/Main";

function MainPage(props) {
  const navigate = useNavigate();
  const { setBatch, batch } = useContext(MainContext);

  useEffect(() => {
    const lsBatch = JSON.parse(localStorage.getItem("batch"));

    if (!lsBatch) {
      navigate("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-5 h-screen">
      <Sidebar />
      <div className="col-span-4 h-full overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}

export default MainPage;
