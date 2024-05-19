import React, { useContext, useState } from "react";
import { MainContext } from "../Context/Main";
import formatDate from "../utils/dateOfBirthFormat";
import { Link } from "react-router-dom";

function Revenue(props) {
  const { students, fees, setStudentDetails } = useContext(MainContext);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const getFees = (e) => {
    if (!selectedEndDate || !selectedStartDate) {
      return fees;
    } else {
      const filter = fees.filter((exp) => {
        if (
          formatDate(exp.date) >= formatDate(selectedStartDate) &&
          formatDate(exp.date) <= formatDate(selectedEndDate)
        ) {
          return true;
        } else {
          return false;
        }
      });
      return filter;
    }
  };

  return (
    <>
      {students == null ? (
        <div className="flex justify-center items-center h-screen">
          <div className="inline-block animate-spin ease duration-300 w-8 h-8 border-t-4 border-b-4 border-gray-900 rounded-full"></div>
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-2 mt-4">
            <h2 className="text-xl font-bold">Fees Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Class
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Revenue Generated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span>B.A. First</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      Rs.
                      {students
                        .filter((s) => s.class === "ba-first")
                        .reduce((total, student) => {
                          return (
                            total +
                            student.feesPaid.reduce(
                              (acc, fee) => acc + fee.amount,
                              0
                            )
                          );
                        }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span>B.A. Second</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      Rs.
                      {students
                        .filter((s) => s.class === "ba-second")
                        .reduce((total, student) => {
                          return (
                            total +
                            student.feesPaid.reduce(
                              (acc, fee) => acc + fee.amount,
                              0
                            )
                          );
                        }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span>B.A. Third</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      Rs.
                      {students
                        .filter((s) => s.class === "ba-third")
                        .reduce((total, student) => {
                          return (
                            total +
                            student.feesPaid.reduce(
                              (acc, fee) => acc + fee.amount,
                              0
                            )
                          );
                        }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span>M.A. Pre</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      Rs.
                      {students
                        .filter((s) => s.class === "ma-pre")
                        .reduce((total, student) => {
                          return (
                            total +
                            student.feesPaid.reduce(
                              (acc, fee) => acc + fee.amount,
                              0
                            )
                          );
                        }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span>M.A. Final</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      Rs.
                      {students
                        .filter((s) => s.class === "ma-final")
                        .reduce((total, student) => {
                          return (
                            total +
                            student.feesPaid.reduce(
                              (acc, fee) => acc + fee.amount,
                              0
                            )
                          );
                        }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <strong>Total Revenue</strong>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rs.
                      {students.reduce((total, student) => {
                        return (
                          total +
                          student.feesPaid.reduce(
                            (acc, fee) => acc + fee.amount,
                            0
                          )
                        );
                      }, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex justify-between">
              Recent Fees
              <div className="flex space-x-8 items-center">
                <div className="space-x-2">
                  <label htmlFor="">From</label>
                  <input
                    type="date"
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    className="border py-1 px-2"
                  />
                </div>
                <div className="space-x-2">
                  <label htmlFor="">To</label>

                  <input
                    type="date"
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                    className="border py-1 px-2"
                  />
                </div>
              </div>
            </h3>
            <div className="mt-4">
              {/* <div className="text-lg font-bold mb-4">
                Fees Paid on Selected Date
              </div> */}
              {getFees()?.length == 0 ? (
                <div
                  className={`font-bold text-red-400 text-2xl text-center ${
                    selectedStartDate && selectedEndDate ? "" : "hidden"
                  } `}
                >
                  No Fees Were Paid On The Selected Date
                </div>
              ) : (
                getFees()?.map((stu, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-gray-100 shadow-md rounded-lg p-4 mb-4 cursor-pointer"
                    >
                      <div
                        onClick={() => {
                          setStudentDetails(stu.studentId);
                        }}
                        className="flex justify-between items-center"
                      >
                        <Link to={"/student-details"} className="flex flex-col">
                          <p className="text-lg font-semibold">
                            {stu.studentId.name}
                          </p>
                          <p className="text-md text-gray-800 my-1">
                            Father: {stu.studentId.fatherName}
                          </p>
                          <p className="text-md text-gray-800">
                            Class: {stu.studentId.class}
                          </p>
                        </Link>
                        <div className="text-green-700 font-normal text-2xl flex flex-col">
                          Amount Paid: Rs.{stu.amount}
                          <p className="text-sm font-normal text-black">
                            Paid On: {formatDate(stu.date)}
                          </p>
                          <p className="text-sm font-normal text-black">
                            Remaining Fees: Rs.
                            {stu.studentId?.transportFees +
                              stu.studentId.other +
                              stu.studentId.admissionFees +
                              stu.studentId.lastYearDueFees +
                              stu.studentId.fees -
                              stu.studentId.feesPaid.reduce((total, amount) => {
                                return total + amount.amount;
                              }, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Revenue;
