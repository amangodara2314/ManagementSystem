import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../Context/Main";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import formatDate from "../utils/dateOfBirthFormat";
import { Pencil, Trash2 } from "lucide-react";

function StaffDetails({}) {
  const { staffDetails, API, setStaffDetails } = useContext(MainContext);
  const componentRef = useRef();
  const [showPopup, setShowPopup] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDelete = (item) => {
    setShowPopup({ type: "delete", item });
  };

  const handleEdit = (item) => {
    setShowPopup({ type: "edit", item });
  };

  useEffect(() => {
    if (staffDetails)
      localStorage.setItem("teacher-details", JSON.stringify(staffDetails));
  }, [staffDetails]);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("teacher-details"));
    if (details) setStaffDetails(details);
  }, []);

  const confirmDelete = async () => {
    setShowPopup(null);
    try {
      const response = await fetch(
        `${API}/salary/delete/${showPopup.item._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.status === 1) {
        alert(data.msg);
        setStaffDetails((prevDetails) => ({
          ...prevDetails,
          salaryPaid: prevDetails.salaryPaid.filter(
            (s) => s._id !== showPopup.item._id
          ),
        }));
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    setShowPopup(null);
    try {
      const response = await fetch(`${API}/salary/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salaryId: showPopup.item._id,
          amount: e.target.amount.value,
          method: e.target.method.value,
          date: e.target.date.value,
          remarks: e.target.remarks.value,
        }),
      });
      const data = await response.json();
      if (data.status === 1) {
        alert(data.msg);
        setStaffDetails((prevDetails) => ({
          ...prevDetails,
          salaryPaid: prevDetails.salaryPaid.map((s) => {
            if (s._id === showPopup.item._id) {
              return data.salary;
            }
            return s;
          }),
        }));
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  const calculateRemainingSalary = (salaryPaid, totalSalary) => {
    const totalPaid = salaryPaid?.reduce((sum, s) => sum + s.amount, 0);
    return totalSalary - totalPaid;
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            {showPopup.type === "delete" ? (
              <>
                <p>Are you sure you want to delete this record?</p>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4 mt-4"
                >
                  Confirm
                </button>
              </>
            ) : (
              <>
                <form action="" onSubmit={confirmEdit}>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Amount
                      </label>
                      <input
                        type="number"
                        id="amount"
                        defaultValue={showPopup.item.amount}
                        name="amount"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="method"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Method
                      </label>
                      <select
                        defaultValue={showPopup?.item?.method || "cash"}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                        name="method"
                        id=""
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                        <option value="cheque">Cheque</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="remarks"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Remarks{" "}
                        <span className="text-xs text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        id="remarks"
                        name="remarks"
                        defaultValue={showPopup.item?.remarks || ""}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                      />
                    </div>

                    <div className="">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        defaultValue={
                          new Date(showPopup.item.date)
                            .toISOString()
                            .split("T")[0]
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 mr-4 mb-2"
                  >
                    Save
                  </button>
                </form>
              </>
            )}
            <button
              onClick={() => setShowPopup(null)}
              className="border px-4 py-2 rounded-lg mr-4 mb-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {staffDetails == null ? (
        <div className="flex justify-center items-center h-screen">
          <div className="inline-block animate-spin ease duration-300 w-8 h-8 border-t-4 border-b-4 border-gray-900 rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="p-4 rounded w-full" ref={componentRef}>
            <div className="space-y-2 w-full">
              <div className="text-xl font-bold mb-1x text-center tracking-widest">
                FRANKLIN (P.G.) COLLEGE
                <div className="text-gray-600 font-semibold text-sm">
                  THALARKA, TEHSIL-NOHAR, DIST. HANUMANGARH <br />
                  <span>9829142314,9413642314</span>
                </div>
              </div>
              <hr className="my-1" />
              <div className="flex gap-16 w-full items-center px-4">
                {staffDetails.image == undefined ? (
                  <>
                    <div className="font-bold bg-gray-50 border h-32 w-32 flex justify-center text-center items-center">
                      <span>Image Unavailable</span>
                    </div>
                  </>
                ) : (
                  <img
                    src={API + "/staff/" + staffDetails.image}
                    alt=""
                    width={100}
                    className="rounded"
                  />
                )}
                <div className="space-y-3">
                  <p>
                    <strong>Name:</strong> {staffDetails?.name}
                  </p>
                  <p>
                    <strong>Aadhar Number:</strong> {staffDetails?.aadhar}
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong>Father's Name:</strong> {staffDetails?.fatherName}
                  </p>
                  <p>
                    <strong>Pan Number:</strong> {staffDetails?.pan}
                  </p>
                </div>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="space-y-2 mt-4">
              <h2 className="text-xl font-bold mb-4">Salary Details</h2>
              <div className="flex gap-2">
                <table className="min-w-full divide-y divide-gray-200">
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
                      <td className="px-6 py-4 whitespace-nowrap w-[40%]">
                        <strong>Salary Paid</strong>
                      </td>
                      {staffDetails.salaryPaid.length == 0 ? (
                        <td className="px-6 py-4 whitespace-nowrap  flex flex-col gap-2">
                          Rs.0
                        </td>
                      ) : (
                        staffDetails?.salaryPaid.map((f, i) => {
                          console.log(f);
                          return (
                            <td
                              key={i}
                              className="px-6 py-2 whitespace-nowrap flex items-center justify-between"
                            >
                              <p className="w-[70%] text-wrap">
                                Rs.{f.amount} - {formatDate(f.date)} - Payment
                                Method -{" "}
                                {f.method ? f.method.toUpperCase() : "N/A"} -{" "}
                                {f.remarks ? "Remarks : " + f.remarks : null}
                              </p>
                              <span className="space-x-6 no-print">
                                <button
                                  onClick={() => handleDelete(f)}
                                  className="text-red-600"
                                >
                                  <Trash2 />
                                </button>
                                <button
                                  onClick={() => handleEdit(f)}
                                  className=""
                                >
                                  <Pencil className="size-5" />
                                </button>
                              </span>
                            </td>
                          );
                        })
                      )}
                    </tr>
                    {/* <tr>
                      {staffDetails.salaryPaid.length != 0 && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <strong>Total Fees Paid</strong>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">Rs.0</td>
                        </>
                      )}
                    </tr> */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap w-[40%]">
                        <strong>Total Salary</strong>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rs.
                        {staffDetails?.salary}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap w-[40%]">
                        <strong>Remaining Salary</strong>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rs.{" "}
                        {calculateRemainingSalary(
                          staffDetails?.salaryPaid,
                          staffDetails?.salary
                        )}
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

export default StaffDetails;
