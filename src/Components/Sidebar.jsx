import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../Context/Main";

const Sidebar = () => {
  const { batch } = useContext(MainContext);
  return (
    <>
      <div className="bg-[#212121] text-white h-screen col-span-1 overflow-y-auto relative">
        {!batch && (
          <div
            className="absolute w-full h-full flex pt-72 font-semibold text-2xl text-center justify-center"
            style={{ background: "rgba(0,0,0,0.9)" }}
          >
            Please Select A Batch <br /> To Continue
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold text-center">Sidebar</h2>
          <ul className="mt-4">
            <li className="hover:bg-gray-900 duration-100 rounded px-4">
              <Link
                to="/"
                className="block w-full py-3 text-gray-300 hover:text-white"
              >
                Home
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/class"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Classes
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/staff"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Staff
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/add-staff"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Add Staff
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/add-student"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Add Student
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/attendance"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Attendance
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/download-attendance"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Download Attendance
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/revenue"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Revenue
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/expenditure"
                className="block py-3 w-full text-gray-300 hover:text-white hover:bg-gray-900 duration-100 rounded px-4"
              >
                Expenditure
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
