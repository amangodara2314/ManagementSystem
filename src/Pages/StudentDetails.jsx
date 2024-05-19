import React, { useContext, useEffect, useRef } from "react";
import { MainContext } from "../Context/Main";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import formatDate from "../utils/dateOfBirthFormat";

function StudentDetails({}) {
  const { studentDetails, setStudentDetails } = useContext(MainContext);
  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (studentDetails)
      localStorage.setItem("details", JSON.stringify(studentDetails));
  }, []);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("details"));
    if (details) setStudentDetails(details);
  }, []);

  let total = 0;
  if (studentDetails?.feesPaid?.length != 0) {
    studentDetails?.feesPaid.map((f) => {
      total = f.amount + total;
    });
  }

  // useEffect(() => {
  //   if (!studentDetails) {
  //     navigate("/class");
  //   }
  // }, [studentDetails]);
  return (
    <>
      {studentDetails == null ? (
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
              <div className="grid grid-cols-2 gap-y-2 w-full">
                <p>
                  <strong>Name:</strong> {studentDetails?.name}
                </p>
                <p>
                  <strong>Father's Name:</strong> {studentDetails?.fatherName}
                </p>
                <p>
                  <strong>Student ID:</strong> {studentDetails?.Id}
                </p>
                <p>
                  <strong>Roll Number:</strong> {studentDetails?.Rollnumber}
                </p>
                <p>
                  <strong>Class:</strong> {studentDetails?.class}
                </p>
                <p>
                  <strong>Batch:</strong> {studentDetails?.batchYear}
                </p>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="space-y-2 mt-4">
              <h2 className="text-xl font-bold">Fees Details</h2>
              <div className="flex gap-2">
                <table className="min-w-[50%] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fee Type
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
                      <td className="px-6 py-2 whitespace-nowrap">
                        <strong>Admission Fees</strong>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        Rs.{studentDetails?.admissionFees}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <strong>Fees</strong>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        Rs.{studentDetails?.fees}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <strong>Other</strong>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        Rs.{studentDetails?.other}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <strong>Transport Fees</strong>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        Rs.{studentDetails?.transportFees}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="min-w-[50%] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fee Type
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
                        <strong>Last Year Due Fees</strong>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rs.
                        {studentDetails.lastYearDueFees
                          ? studentDetails.lastYearDueFees
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <strong>Fees Paid</strong>
                      </td>
                      {studentDetails.feesPaid.length == 0 ? (
                        <td className="px-6 py-4 whitespace-nowrap  flex flex-col gap-2">
                          Rs.0
                        </td>
                      ) : (
                        studentDetails?.feesPaid.map((f, i) => {
                          return (
                            <td className="px-6 py-2 whitespace-nowrap flex flex-col gap-2">
                              Rs.{f.amount} - {formatDate(f.date)}{" "}
                              {f?.type ? `- ${f.type}` : ""}
                            </td>
                          );
                        })
                      )}
                    </tr>
                    <tr>
                      {studentDetails.feesPaid.length != 0 && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <strong>Total Fees Paid</strong>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Rs.{total}
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <strong>Total Fees</strong>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rs.
                        {studentDetails.totalFees}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <strong>Remaining Fees</strong>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rs.
                        {studentDetails?.transportFees +
                          studentDetails.other +
                          studentDetails.admissionFees +
                          studentDetails.fees +
                          studentDetails?.lastYearDueFees -
                          studentDetails.feesPaid.reduce((total, amount) => {
                            return total + amount.amount;
                          }, 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

export default StudentDetails;
