import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../Context/Main";
import axios from "axios";

function Staff(props) {
  const {
    staff,
    API,
    getSalary,
    fetchStaff,
    openToast,
    staffDetails,
    setStaffDetails,
    batch,
  } = useContext(MainContext);
  const [pay, setPay] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [del, setDel] = useState(false);

  const paySalary = (e) => {
    e.preventDefault();
    const data = {
      amount: e.target.amount.value,
      staffId: staffDetails._id,
      batch: batch,
      method: e.target.method.value,
    };
    axios
      .post(API + "/salary/add", data)
      .then((success) => {
        if (success.data.status == 1) {
          getSalary();
          fetchStaff();
          openToast(success.data.msg, "success");
          setPay(false);
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
      });
  };

  const onDelete = (e) => {
    axios
      .delete(API + "/staff/delete/" + staffDetails._id)
      .then((success) => {
        if (success.data.status == 1) {
          fetchStaff();
          openToast(success.data.msg, "success");
          setDel(false);
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("aadhar", e.target.aadhar.value);
    formData.append("pan", e.target.pan.value);
    formData.append("fatherName", e.target.fatherName.value);
    formData.append("contactPhone", e.target.contactPhone.value);
    formData.append("batchYear", e.target.batchYear.value);
    formData.append("salary", e.target.salary.value);
    formData.append("category", e.target.category.value);

    if (imageFile) {
      formData.append("image", imageFile);
    }
    console.log(formData);

    axios
      .put(API + `/staff/update/${staffDetails._id}`, formData)
      .then((success) => {
        if (success.data.status === 1) {
          fetchStaff();
          setToggle(false);
          setStaffDetails(null);
          openToast(success.data.msg, "success");
        } else {
          openToast(success.data.msg, "error");
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
      });
  };
  return (
    <>
      {toggle && (
        <div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="bg-white rounded-lg p-8 shadow">
            <h1 className="text-3xl font-semibold mb-4 flex justify-between">
              Edit Student Details
              <span
                className="font-normal text-xl cursor-pointer"
                onClick={() => {
                  setStaffDetails(null);
                  setToggle(false);
                }}
              >
                X
              </span>
            </h1>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={staffDetails.name}
                    id="name"
                    name="name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father's Name
                  </label>
                  <input
                    type="text"
                    defaultValue={staffDetails.fatherName}
                    id="fatherName"
                    name="fatherName"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="aadhar"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Aadhar
                  </label>
                  <input
                    type="text"
                    defaultValue={staffDetails.aadhar}
                    id="aadhar"
                    name="aadhar"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pan"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pan
                  </label>
                  <input
                    type="text"
                    defaultValue={staffDetails.pan}
                    id="pan"
                    name="pan"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    defaultValue={staffDetails.contactPhone}
                    id="contactPhone"
                    name="contactPhone"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="batchYear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Batch Year
                  </label>
                  <input
                    type="text"
                    defaultValue={staffDetails.batchYear}
                    id="batchYear"
                    name="batchYear"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Salary
                  </label>
                  <input
                    type="number"
                    defaultValue={staffDetails.salary}
                    id="salary"
                    name="salary"
                    min={0}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    required={true}
                    id="category"
                    name="category"
                    defaultValue={staffDetails.category}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  >
                    <option value="">Select</option>

                    <option value="teacher">Teacher</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  defaultValue={staffDetails}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {pay && (
        <div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="bg-white rounded-lg p-8 shadow">
            <h1 className="text-3xl font-semibold mb-4 flex justify-between">
              Pay {staffDetails.name} Salary
              <span
                className="font-normal text-xl cursor-pointer"
                onClick={() => {
                  setStaffDetails(null);
                  setPay(false);
                }}
              >
                X
              </span>
            </h1>
            <form onSubmit={paySalary} className="space-y-2">
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
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {del && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <p>Are you sure you want to remove?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                onClick={onDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => {
                  setDel(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="text-center tracking-wider text-lg uppercase font-bold">
          College Staff
        </div>
        <hr className="my-2" />
        <strong className="tracking-wider">Teachers</strong>
        <div className="p-2 rounded">
          {staff
            ?.filter((s) => s.category == "teacher")
            .map((stf, index) => {
              return (
                <div
                  onClick={() => {
                    setStaffDetails(stf);
                  }}
                  key={index}
                  className="bg-gray-100 p-4 rounded-md my-2 flex justify-between items-center cursor-pointer hover:bg-gray-200"
                >
                  <Link to={"/teacher-details"}>
                    <h3 className="text-lg font-bold">{stf.name}</h3>
                    <div className="flex gap-16">
                      <div className="flex gap-8 mt-2">
                        <div className="font-bold text-sm text-gray-600 text-center">
                          {stf.image == undefined ? (
                            <>
                              <div className="">Image</div>
                              <span>Unavailable</span>
                            </>
                          ) : (
                            <img
                              src={API + "/staff/" + stf.image}
                              alt=""
                              width={62}
                              className="rounded"
                            />
                          )}
                        </div>
                        <div className="">
                          <p>Aadhar Number: {stf.aadhar}</p>
                          <p>Pan Number: {stf.pan}</p>
                        </div>
                        <div className="">
                          <p>Father Name: {stf.fatherName}</p>
                          <p>Contact: {stf.contactPhone}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setStaffDetails(stf);
                        setPay(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => {
                        setStaffDetails(stf);
                        setToggle(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setStaffDetails(stf);
                        setDel(true);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <hr className="my-2" />
        <strong className="tracking-wider">Drivers</strong>
        <div className="p-2 rounded">
          {staff
            ?.filter((s) => s.category == "driver")
            .map((stf, index) => {
              return (
                <div
                  onClick={() => {
                    setStaffDetails(stf);
                  }}
                  key={index}
                  className="bg-gray-100 p-4 rounded-md my-2 flex justify-between items-center cursor-pointer hover:bg-gray-200"
                >
                  <Link to={"/driver-details"}>
                    <h3 className="text-lg font-bold">{stf.name}</h3>
                    <div className="flex gap-16">
                      <div className="">
                        <div className="flex gap-6 mt-2">
                          <div className="font-bold text-sm text-gray-600 text-center">
                            {stf.image == undefined ? (
                              <>
                                <div className="">Image</div>
                                <span>Unavailable</span>
                              </>
                            ) : (
                              <img
                                src={API + "/staff/" + stf.image}
                                alt=""
                                width={62}
                                className="rounded"
                              />
                            )}
                          </div>
                          <div className="">
                            <p>Father Name: {stf.fatherName}</p>
                            <p>Contact: {stf.contactPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setStaffDetails(stf);
                        setPay(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => {
                        setStaffDetails(stf);
                        setToggle(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setStaffDetails(stf);
                        setDel(true);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Staff;
