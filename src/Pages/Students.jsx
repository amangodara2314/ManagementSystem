import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../Context/Main";
import { Link, useParams } from "react-router-dom";
import formatDate from "../utils/dateOfBirthFormat";
import axios from "axios";
import { parse, unparse } from "papaparse";

function Students(props) {
  const {
    students,
    API,
    fetchStudents,
    openToast,
    setStudentDetails,
    batch,
    classStudents,
    setClassStudents,
    getFees,
  } = useContext(MainContext);

  const [feesFilter, setFeesFilter] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [del, setDel] = useState(false);
  const [promote, setPromote] = useState(false);
  const [promoClass, setPromoClass] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalRef = useRef();
  const admissionRef = useRef();
  const transportRef = useRef();
  const feesRef = useRef();
  const otherRef = useRef();
  const dueRef = useRef();

  const { classname } = useParams();

  useEffect(() => {
    if (students) {
      setClassStudents(students?.filter((s) => s.class == classname));
    }
  }, [students, classname]);

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
      batchYear: e.target.batchYear.value,
      class: e.target.class.value,
      subject: e.target.subject.value,
      fatherName: e.target.fatherName.value,
      motherName: e.target.motherName.value,
      guardianContact: e.target.guardianContact.value,
      admissionFees: e.target.admissionFees.value,
      transportFees: e.target.transportFees.value,
      other: e.target.other.value,
      fees: e.target.fees.value,
      feesStatus: e.target.feesStatus.value,
      totalFees: e.target.totalFees.value,
      lastYearDueFees: e.target.lastYearDueFees.value,
    };
    axios
      .put(API + `/students/update/` + selectedStudent._id, data)
      .then((success) => {
        if (success.data.status == 1) {
          fetchStudents();
          setToggle(false);
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

  const [pay, setPay] = useState(false);

  let paid = 0;
  selectedStudent?.feesPaid?.forEach((element) => {
    paid = element.amount + paid;
  });

  let filteredStudents;

  const calcFees = () => {
    totalRef.current.value =
      parseInt(admissionRef.current.value) +
      parseInt(transportRef.current.value) +
      parseInt(feesRef.current.value) +
      parseInt(otherRef.current.value) +
      parseInt(dueRef.current.value);
  };

  filteredStudents = classStudents?.filter((student) => {
    if (feesFilter !== "" && student.feesStatus !== feesFilter) {
      return false;
    }
    if (
      searchName !== "" &&
      !student.name.toLowerCase().includes(searchName.toLowerCase())
    ) {
      return false;
    }
    if (
      searchRollNumber !== "" &&
      !student.Rollnumber.toLowerCase().includes(searchRollNumber.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openPopup = (student) => {
    setSelectedStudent(student);
    setToggle(true);
  };
  const payFees = (e) => {
    e.preventDefault();
    const data = {
      amount: e.target.amount.value,
      studentId: selectedStudent._id,
      type: e.target.type.value,
      batch: batch,
    };
    axios
      .post(API + "/fees/add", data)
      .then((success) => {
        if (success.data.status == 1) {
          getFees();
          fetchStudents();
          openToast(success.data.msg, "success");
          setPay(false);
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
      });
  };
  const downloadCSV = () => {
    const csvData = unparse(
      filteredStudents.map((student) => {
        return {
          Name: student.name,
          Rollnumber: student.Rollnumber,
          EnrollmentNumber: student.studentId,
          Aadhar: student.aadhar,
          DateOfBirth: formatDate(student.dateOfBirth),
          Gender: student.gender,
          Category: student.category,
          ContactPhone: student.contactPhone,
          ContactEmail: student.contactEmail,
          Address: student.address,
          BatchYear: student.batchYear,
          Class: student.class,
          Subject: student.subject,
          FatherName: student.fatherName,
          MotherName: student.motherName,
          GuardianContact: student.guardianContact,
          AdmissionFees: student.admissionFees,
          TransportFees: student.transportFees,
          Other: student.other,
          Fees: student.fees,
          FeesStatus: student.feesStatus,
          FeesPaid: student.feesPaid.map((fee) => fee.amount).join(","),
          TotalFees: student.totalFees,
        };
      })
    );

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "student_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const promoteClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const batchYear = e.target.batch.value;
      const newClass = e.target.class.value;
      for (const student of filteredStudents) {
        await promoteStudent(student, batchYear, newClass);
      }
      openToast("Class promoted successfully!", "success");
      setLoading(false);
      setPromoClass(false);
    } catch (error) {
      setLoading(false);

      openToast("Error promoting class!", "error");
    }
  };

  const promoteStudent = async (student, batchYear, newClass) => {
    const data = {
      studentId: student.studentId,
      aadhar: student.aadhar,
      Rollnumber: student.rollnumber,
      name: student.name,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      category: student.category,
      contactPhone: student.contactPhone,
      contactEmail: student.contactEmail,
      address: student.address,
      batchYear: batchYear,
      class: newClass,
      subject: student.subject,
      fatherName: student.fatherName,
      motherName: student.motherName,
      guardianContact: student.guardianContact,
      admissionFees: student.admissionFees,
      transportFees: student.transportFees,
      lastYearDueFees:
        student.feesStatus == "pending"
          ? student.feesPaid.length == 0
            ? student.totalFees
            : student.totalFees -
              student.feesPaid.reduce((a, c) => a + c.amount, 0)
          : 0,
      other: student.other,
      fees: student.fees,
      totalFees: student.totalFees,
    };

    await axios.post(API + "/students/promote", data);
  };

  const onPromote = (e) => {
    e.preventDefault();

    const data = {
      studentId: selectedStudent.studentId,
      aadhar: selectedStudent.aadhar,
      Rollnumber: selectedStudent.rollnumber,
      name: selectedStudent.name,
      dateOfBirth: selectedStudent.dateOfBirth,
      gender: selectedStudent.gender,
      category: selectedStudent.category,
      contactPhone: selectedStudent.contactPhone,
      contactEmail: selectedStudent.contactEmail,
      address: selectedStudent.address,
      batchYear: e.target.batch.value,
      class: e.target.class.value,
      subject: selectedStudent.subject,
      fatherName: selectedStudent.fatherName,
      motherName: selectedStudent.motherName,
      guardianContact: selectedStudent.guardianContact,
      admissionFees: selectedStudent.admissionFees,
      transportFees: selectedStudent.transportFees,
      other: selectedStudent.other,
      fees: selectedStudent.fees,
      lastYearDueFees:
        selectedStudent.feesStatus == "pending"
          ? selectedStudent.feesPaid.length == 0
            ? selectedStudent.totalFees
            : selectedStudent.totalFees -
              selectedStudent.feesPaid.reduce((a, c) => a + c.amount, 0)
          : 0,
      totalFees: selectedStudent.totalFees,
    };

    axios
      .post(API + "/students/promote", data)
      .then((success) => {
        if (success.data.status == 1) {
          openToast(success.data.msg, "success");
          setPromote(false);
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
      });
  };

  const onDelete = (e) => {
    axios
      .delete(API + "/students/delete/" + selectedStudent._id)
      .then((success) => {
        if (success.data.status == 1) {
          fetchStudents();
          openToast(success.data.msg, "success");
          setDel(false);
        }
      })
      .catch((err) => {
        openToast("Client Side Error", "error");
      });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-2 items-center justify-center bg-gray-800 bg-opacity-90 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          <div className="text-white">
            <p className="text-lg font-semibold mb-4">
              Please do not close the application or perform any actions while
              the students are being promoted.
            </p>
            <p className="text-white">
              This process may take some time to complete. Closing the
              application or performing actions may disrupt the process.
            </p>
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
      {promote && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <p className="flex justify-between items-center">
              Promote to{" "}
              <span
                className="text-xl cursor-pointer border rounded-full px-3 bg-gray-500 text-white py-1"
                onClick={() => {
                  setSelectedStudent(null);
                  setPromote(false);
                }}
              >
                X
              </span>
            </p>
            <form
              onSubmit={onPromote}
              className="mt-4 grid grid-cols-2 gap-2 gap-y-8"
            >
              <div className="">
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Batch :
                </label>
                <select
                  id="batch"
                  name="batch"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-4 py-3"
                >
                  <option value="2023-24">2023-24</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                </select>
              </div>
              <div className="">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-4 py-3"
                >
                  <option value="">Select</option>
                  <option value="ba-first">B.A. First</option>
                  <option value="ba-second">B.A. Second</option>
                  <option value="ba-third">B.A. Third</option>
                  <option value="ma-pre">M.A. Pre</option>
                  <option value="ma-final">M.A. Final</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mr-4"
              >
                Promote
              </button>
            </form>
          </div>
        </div>
      )}
      {promoClass && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <p className="flex justify-between items-center">
              Promote Class to{" "}
              <span
                className="text-xl cursor-pointer border rounded-full px-3 bg-gray-500 text-white py-1"
                onClick={() => {
                  setPromote(false);
                }}
              >
                X
              </span>
            </p>
            <form
              onSubmit={promoteClass}
              className="mt-4 grid grid-cols-2 gap-2 gap-y-8"
            >
              <div className="">
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Batch :
                </label>
                <select
                  id="batch"
                  name="batch"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-4 py-3"
                >
                  <option value="2023-24">2023-24</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                </select>
              </div>
              <div className="">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-4 py-3"
                >
                  <option value="">Select</option>
                  <option value="ba-first">B.A. First</option>
                  <option value="ba-second">B.A. Second</option>
                  <option value="ba-third">B.A. Third</option>
                  <option value="ma-pre">M.A. Pre</option>
                  <option value="ma-final">M.A. Final</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mr-4"
              >
                Promote
              </button>
            </form>
          </div>
        </div>
      )}
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
                  setSelectedStudent(null);
                  setToggle(false);
                }}
              >
                X
              </span>
            </h1>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-4 gap-3">
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
                    defaultValue={selectedStudent.name}
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
                    defaultValue={selectedStudent.Rollnumber}
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
                    defaultValue={selectedStudent.studentId}
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
                    defaultValue={selectedStudent.aadhar}
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
                    defaultValue={selectedStudent.dateOfBirth}
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
                    defaultValue={selectedStudent.fatherName}
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
                    defaultValue={selectedStudent.motherName}
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
                    defaultValue={selectedStudent.guardianContact}
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
                    defaultValue={selectedStudent.gender}
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
                    id="category"
                    name="category"
                    defaultValue={selectedStudent.category}
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
                    defaultValue={selectedStudent.contactPhone}
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
                    defaultValue={selectedStudent.contactEmail}
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
                    defaultValue={selectedStudent.address}
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
                    id="batchYear"
                    name="batchYear"
                    defaultValue={selectedStudent.batchYear}
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
                  <input
                    type="text"
                    id="class"
                    name="class"
                    defaultValue={selectedStudent.class}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    defaultValue={selectedStudent.subject}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastYearDueFees"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Year Due Fees
                  </label>
                  <input
                    ref={dueRef}
                    onChange={calcFees}
                    type="number"
                    id="lastYearDueFees"
                    name="lastYearDueFees"
                    defaultValue={selectedStudent.lastYearDueFees}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admissionFees"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admission Fees
                  </label>
                  <input
                    ref={admissionRef}
                    onChange={calcFees}
                    type="number"
                    id="admissionFees"
                    name="admissionFees"
                    defaultValue={selectedStudent.admissionFees}
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
                    ref={transportRef}
                    onChange={calcFees}
                    type="number"
                    id="transportFees"
                    name="transportFees"
                    defaultValue={selectedStudent.transportFees}
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
                    ref={otherRef}
                    onChange={calcFees}
                    type="number"
                    id="other"
                    name="other"
                    defaultValue={selectedStudent.other}
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
                    ref={feesRef}
                    onChange={calcFees}
                    type="number"
                    id="fees"
                    name="fees"
                    defaultValue={selectedStudent.fees}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="feesStatus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fees Status
                  </label>
                  <select
                    id="feesStatus"
                    name="feesStatus"
                    defaultValue={selectedStudent.feesStatus}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="feesPaid"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fees Paid
                  </label>
                  <input
                    readOnly
                    type="number"
                    id="feesPaid"
                    name="feesPaid"
                    value={paid}
                    className="mt-1 block w-full bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
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
                    onChange={calcFees}
                    type="number"
                    id="totalFees"
                    name="totalFees"
                    defaultValue={selectedStudent.totalFees}
                    className="mt-1 block w-full bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
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
      )}
      {pay && (
        <div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="bg-white rounded-lg p-8 shadow">
            <h1 className="text-3xl font-semibold mb-4 flex justify-between">
              Pay Student Fees
              <span
                className="font-normal text-xl cursor-pointer"
                onClick={() => {
                  setSelectedStudent(null);
                  setPay(false);
                }}
              >
                X
              </span>
            </h1>
            <form onSubmit={payFees} className="space-y-2">
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fee Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-2 py-3"
                  >
                    <option value="">Select</option>
                    <option value="Admission Fees">Admission Fees</option>
                    <option value="Transport Fees">Transport Fee</option>
                    <option value="Fees">Fees</option>
                    <option value="Other">Other</option>
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
      {classStudents == null ? (
        <div className="flex justify-center items-center h-screen">
          <div className="inline-block animate-spin ease duration-300 w-8 h-8 border-t-4 border-b-4 border-gray-900 rounded-full"></div>
        </div>
      ) : classStudents.length == 0 ? (
        <div className="text-2xl font-semibold text-black text-center mt-28">
          No Students Available
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex gap-2">
            <div className="mb-4 flex-grow">
              <label htmlFor="feesFilter" className="block mb-2 font-bold">
                Select Fees Status:
              </label>
              <select
                id="feesFilter"
                className="px-4 w-full p-2 border border-gray-300 rounded-md"
                value={feesFilter}
                onChange={(e) => setFeesFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Roll Number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchRollNumber}
              onChange={(e) => setSearchRollNumber(e.target.value)}
            />
          </div>
          <button
            onClick={downloadCSV}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded"
          >
            Download CSV
          </button>
          <button
            type="submit"
            onClick={() => {
              setPromoClass(true);
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-4 rounded"
          >
            Promote Class
          </button>
          <div className="">
            {filteredStudents.map((student) => (
              <div
                onClick={() => {
                  setStudentDetails(student);
                }}
                key={student._id}
                className="bg-gray-100 p-4 rounded-md my-2 flex justify-between items-center cursor-pointer hover:bg-gray-200"
              >
                <Link to={"/student-details"}>
                  <h3 className="text-lg font-bold">{student.name}</h3>
                  <div className="flex gap-16">
                    <div className="">
                      <p>Enrollment Number: {student.studentId}</p>
                      <p>DOB: {formatDate(student.dateOfBirth)}</p>
                    </div>
                    <div className="">
                      <p>Father Name: {student.fatherName}</p>
                      <p>Guardian Contact: {student.guardianContact}</p>
                    </div>
                  </div>
                </Link>
                <div className="flex gap-2 items-center">
                  <div className="px-4 py-2 flex gap-2 items-center text-black font-semibold rounded-md">
                    Fees Status
                    <div
                      className={`dot ${
                        student.feesStatus === "paid" ? "dot-green" : "dot-red"
                      }`}
                    ></div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setPay(true);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Pay
                  </button>
                  <button
                    onClick={() => {
                      openPopup(student);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setPromote(true);
                    }}
                    className="px-4 py-2 bg-yellow-400 text-white rounded-md"
                  >
                    Promote
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setDel(true);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Students;
