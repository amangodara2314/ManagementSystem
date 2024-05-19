import React, { useContext, useRef, useState } from "react";
import { MainContext } from "../Context/Main";
import axios from "axios";

function AddStudent(props) {
  const { API, fetchStudents, openToast, batch } = useContext(MainContext);
  const totalRef = useRef();
  const admissionRef = useRef();
  const transportRef = useRef();
  const feesRef = useRef();
  const otherRef = useRef();

  const calcFees = () => {
    totalRef.current.value =
      parseInt(admissionRef.current.value) +
      parseInt(transportRef.current.value) +
      parseInt(feesRef.current.value) +
      parseInt(otherRef.current.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      studentId: e.target.studentId.value,
      aadhar: e.target.aadhar.value,
      Rollnumber: e.target.rollnumber.value,
      name: e.target.name.value,
      dateOfBirth: e.target.dateOfBirth.value,
      gender: e.target.gender.value,
      category: e.target.category.value,
      contactPhone: e.target.contactPhone.value,
      contactEmail: e.target.contactEmail.value,
      address: e.target.address.value,
      batchYear: batch,
      class: e.target.class.value,
      subject: e.target.subject.value,
      fatherName: e.target.fatherName.value,
      motherName: e.target.motherName.value,
      guardianContact: e.target.guardianContact.value,
      admissionFees: e.target.admissionFees.value,
      transportFees: e.target.transportFees.value,
      other: e.target.other.value,
      fees: e.target.fees.value,
      totalFees: e.target.totalFees.value,
    };
    axios
      .post(API + `/students/add`, data)
      .then((success) => {
        if (success.data.status == 1) {
          fetchStudents();
          e.target.reset();
          openToast(success.data.msg, "success");
        } else {
          openToast(success.data.msg, "error");
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
        console.log(err);
      });
  };

  return (
    <>
      <div className="flex w-full">
        <div className="bg-white rounded-lg p-8 w-full">
          <h1 className="text-3xl font-semibold mb-4 flex justify-between">
            Add Student
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
                  id="name"
                  name="name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="rollnumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rollnumber
                </label>
                <input
                  type="text"
                  id="rollnumber"
                  name="rollnumber"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enrollment Number
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
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
                  id="aadhar"
                  name="aadhar"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
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
                  id="fatherName"
                  name="fatherName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="motherName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mother's Name
                </label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="guardianContact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Guardian Contact
                </label>
                <input
                  type="text"
                  id="guardianContact"
                  name="guardianContact"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                >
                  <option value="">Select</option>
                  <option value="SC">SC</option>
                  <option value="OBC">OBC</option>
                  <option value="ST">ST</option>
                  <option value="GENERAL">GENERAL</option>
                  <option value="SBC">SBC</option>
                </select>
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
                  id="contactPhone"
                  name="contactPhone"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-gray-700"
                >
                  Class
                </label>
                <select
                  id="class"
                  name="class"
                  required={true}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                >
                  <option value="">Select</option>
                  <option value="ba-first">B.A. First</option>
                  <option value="ba-second">B.A. Second</option>
                  <option value="ba-third">B.A. Third</option>
                  <option value="ma-pre">M.A. Pre</option>
                  <option value="ma-final">M.A. Final</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject For M.A.
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                >
                  <option value="">Select</option>
                  <option value="hindi">Hindi</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="admissionFees"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admission Fees
                </label>
                <input
                  min={0}
                  ref={admissionRef}
                  type="number"
                  id="admissionFees"
                  defaultValue={0}
                  name="admissionFees"
                  onChange={calcFees}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="transportFees"
                  className="block text-sm font-medium text-gray-700"
                >
                  Transport Fees
                </label>
                <input
                  min={0}
                  ref={transportRef}
                  type="number"
                  id="transportFees"
                  onChange={calcFees}
                  defaultValue={0}
                  name="transportFees"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="other"
                  className="block text-sm font-medium text-gray-700"
                >
                  Other
                </label>
                <input
                  min={0}
                  ref={otherRef}
                  type="number"
                  id="other"
                  onChange={calcFees}
                  defaultValue={0}
                  name="other"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="fees"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fees
                </label>
                <input
                  min={0}
                  ref={feesRef}
                  type="number"
                  id="fees"
                  onChange={calcFees}
                  defaultValue={0}
                  name="fees"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="totalFees"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Fees
                </label>
                <input
                  ref={totalRef}
                  readOnly
                  type="number"
                  defaultValue={0}
                  id="totalFees"
                  name="totalFees"
                  className="mt-1 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                />
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
    </>
  );
}

export default AddStudent;
