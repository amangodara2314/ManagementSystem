import React, { useContext } from "react";
import { MainContext } from "./Context/Main";

function Home(props) {
  const { batch, setBatch } = useContext(MainContext);
  return (
    <div className="h-full w-full image">
      <div className="w-full h-full" style={{ background: "rgba(0,0,0,0.8)" }}>
        <div className="h-full w-full flex flex-col gap-2 items-center justify-center text-white font-bold text-5xl tracking-wider">
          <div className="">FRANKLIN GIRLS P.G. COLLEGE</div>
          <div className="text-sm">MANAGEMENT SYSTEM</div>
          <div className="flex mt-2 items-center gap-3 text-lg">
            <label htmlFor="" className="block mb-2 font-semibold text-xl">
              Select Batch :
            </label>
            <select
              id=""
              className="px-2 py-1 border border-gray-300 rounded-md text-black font-normal"
              onChange={(e) => {
                if (e.target.value == "0") {
                  return;
                }
                setBatch(e.target.value);
              }}
            >
              <option value="0">select</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
