import React, { useContext, useEffect, useRef } from "react";
import { MainContext } from "../Context/Main";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import formatDate from "../utils/dateOfBirthFormat";

function DriverDetails({}) {
  const { staffDetails, API, setStaffDetails } = useContext(MainContext);
  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (staffDetails)
      localStorage.setItem("teacher-details", JSON.stringify(staffDetails));
  }, []);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("teacher-details"));
    if (details) setStaffDetails(details);
  }, []);

  return (
    <>
      {staffDetails == null ? (
        <div className="flex justify-center items-center h-screen">
          <div className="inline-block animate-spin ease duration-300 w-8 h-8 border-t-4 border-b-4 border-gray-900 rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="p-4 rounded w-full" ref={componentRef}>
            <div className="space-y-2 w-full">
              <div className="text-xl font-bold mb-1x text-center tracking-widest">
                FRANKLIN GIRLS P.G. COLLEGE
                <div className="text-gray-600 font-semibold text-sm">
                  THALARKA, TEHSIL-NOHAR, DISTT. HANUMANGARH <br />
                  <span>9829142314,9413642314</span>
                </div>
              </div>
              <hr className="my-1" />

              <div className="grid grid-cols-4 w-full items-center px-4">
                <div className="col-span-1 space-y-3">
                  {staffDetails.image == undefined ? (
                    <>
                      <div className="font-bold text-gray-500 flex items-center justify-center w-36 border h-36">
                        Image Unavailable
                      </div>
                    </>
                  ) : (
                    <img
                      src={API + "/staff/" + staffDetails.image}
                      alt=""
                      width={150}
                      className="rounded"
                    />
                  )}
                  <div className="">
                    <p>
                      <strong>Name:</strong> {staffDetails?.name}
                    </p>
                    <p>
                      <strong>Contact Number:</strong>{" "}
                      {staffDetails?.contactPhone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 col-span-3">
                  <table className="divide-y w-full divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Salary Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <strong>Salary Paid</strong>
                        </td>
                        {staffDetails.salaryPaid.length == 0 ? (
                          <td className="px-6 py-4 whitespace-nowrap  flex flex-col gap-2">
                            Rs.0
                          </td>
                        ) : (
                          staffDetails?.salaryPaid.map((f, i) => {
                            return (
                              <td
                                key={i}
                                className="px-6 py-2 whitespace-nowrap flex flex-col gap-2"
                              >
                                Rs.{f.amount} - {formatDate(f.date)}
                              </td>
                            );
                          })
                        )}
                      </tr>
                      <tr>
                        {staffDetails.salaryPaid.length != 0 && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <strong>Total Fees Paid</strong>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Rs.0
                            </td>
                          </>
                        )}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <strong>Total Salary</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Rs.
                          {staffDetails?.salary}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <strong>Remaining Salary</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Rs.
                          {staffDetails?.salary}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="space-y-2 mt-4">
              <div className="flex justify-between font-bold mx-2">
                <div className="mt-16">Principal Signature</div>
                <div className="mt-16">Cashier Signature</div>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-blue-500 rounded-lg text-white font-bold mx-5 my-2"
          >
            Print
          </button>
        </>
      )}
    </>
  );
}

export default DriverDetails;
