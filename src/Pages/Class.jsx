import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../Context/Main";

function Class(props) {
  const { setClassStudents } = useContext(MainContext);
  const BA = [
    { id: "ba-first", name: "B.A. First" },
    { id: "ba-second", name: "B.A. Second" },
    { id: "ba-third", name: "B.A. Third" },
  ];
  const MA = [
    { id: "ma-first", name: "M.A. Pre" },
    { id: "ma-final", name: "M.A. Final" },
  ];

  return (
    <>
      <div className="container mx-auto px-5 pt-8">
        {/* Display classes */}
        <div className="font-semibold text-2xl">Bachelor of Arts</div>
        <hr className="my-3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 uppercase">
          {BA.map((cls, index) => (
            <Link
              onClick={() => {
                setClassStudents(null);
              }}
              to={`/students/${cls.id}`}
              key={index}
              className="hover:bg-gray-200 bg-gray-100 p-4 cursor-pointer rounded-md"
            >
              <h3 className="text-lg font-bold">{cls.name}</h3>
            </Link>
          ))}
        </div>
      </div>
      <div className="container mx-auto p-4 mt-4">
        {/* Display classes */}
        <div className="font-semibold text-2xl">Master of Arts</div>
        <hr className="my-3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 uppercase">
          {MA.map((cls, index) => (
            <Link
              onClick={() => {
                setClassStudents(null);
              }}
              to={`/students/${cls.id}`}
              key={index}
              className="hover:bg-gray-200 bg-gray-100 p-4 cursor-pointer rounded-md"
            >
              <h3 className="text-lg font-bold">{cls.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
// State for selected fees filter and search queries

export default Class;
