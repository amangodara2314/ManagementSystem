import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MainContext = createContext();
function Main(props) {
  const API = "http://localhost:5000";
  const [students, setStudents] = useState(null);
  const [staff, setStaff] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [staffDetails, setStaffDetails] = useState(null);
  const [classStudents, setClassStudents] = useState(null);
  const [expenditure, setExpenditure] = useState(null);
  const [salary, setSalary] = useState(null);
  const [fees, setFees] = useState(null);
  const [batch, setBatch] = useState(null);

  const openToast = (msg, flag) => {
    toast(msg, { type: flag });
  };

  useEffect(() => {
    const lsBatch = JSON.parse(localStorage.getItem("batch"));

    if (lsBatch) {
      setBatch(lsBatch);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("batch", JSON.stringify(batch));
  }, [batch]);

  const fetchStudents = () => {
    axios
      .get(API + "/students/get-students/" + batch)
      .then((success) => {
        if (success.data.status == 1) {
          setStudents(success.data.students);
        }
      })
      .catch((err) => openToast("Client Side Error", "error"));
  };

  const fetchExpenditure = () => {
    axios
      .get(API + "/expenditure/get/" + batch)
      .then((success) => {
        setExpenditure(success.data.expenditure);
      })
      .catch((err) => openToast("Client Side Error", "error"));
  };

  const getFees = () => {
    axios
      .get(API + "/fees/get/" + batch)
      .then((success) => {
        setFees(success.data.fees);
      })
      .catch((err) => openToast("Client Side Error", "error"));
  };

  const fetchStaff = () => {
    axios
      .get(API + "/staff/get/" + batch)
      .then((success) => {
        if (success.data.status == 1) {
          setStaff(success.data.staff);
        }
      })
      .catch((err) => openToast("Client Side Error", "error"));
  };

  const getSalary = () => {
    axios
      .get(API + "/salary/get/" + batch)
      .then((success) => {
        if (success.data.status == 1) {
          setSalary(success.data.salary);
        }
      })
      .catch((err) => openToast("Client Side Error", "error"));
  };

  useEffect(() => {
    if (batch) {
      fetchStaff();
      getFees();
      fetchStudents();
      fetchExpenditure();
    }
  }, [batch]);
  return (
    <MainContext.Provider
      value={{
        API,
        openToast,
        fetchStudents,
        students,
        setStudentDetails,
        studentDetails,
        classStudents,
        setClassStudents,
        fees,
        getFees,
        fetchStaff,
        staff,
        staffDetails,
        setStaffDetails,
        getSalary,
        salary,
        fetchExpenditure,
        expenditure,
        setBatch,
        batch,
      }}
    >
      <ToastContainer />
      {props.children}
    </MainContext.Provider>
  );
}

export default Main;
