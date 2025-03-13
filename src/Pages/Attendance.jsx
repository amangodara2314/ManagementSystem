import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MainContext } from "../Context/Main";
import { toast } from "react-toastify";

const Attendance = () => {
  const { API, batch } = useContext(MainContext);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStudent, setUpdatingStudent] = useState(false); // Track student being updated

  // Fetch students when class & date are selected
  useEffect(() => {
    if (!selectedClass || !date) return;

    setLoading(true);
    axios
      .get(`${API}/students/class-students`, {
        params: { className: selectedClass, batch, date },
      })
      .then((response) => {
        console.log(response.data);
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedClass, date, batch]);

  // Mark Attendance for Unmarked Students
  const markAttendance = async (status) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/attendance/mark`, {
        date,

        students: students.map((s) => {
          return { id: s._id, status: status };
        }),
      });

      toast(response.data.message);
      setStudents((prev) =>
        prev.map((s) => {
          return { ...s, attendanceStatus: status };
        })
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast("Error marking attendance");
    } finally {
      setLoading(false);
    }
  };
  const updateSingleStudent = async (studentId, newStatus) => {
    setUpdatingStudent(studentId);
    try {
      const response = await axios.post(`${API}/attendance/mark`, {
        date,
        students: [{ id: studentId, status: newStatus }],
      });

      alert(response.data.msg);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, attendanceStatus: newStatus } : s
        )
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    } finally {
      setUpdatingStudent(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Attendance System</h1>

      {/* Class & Date Selection */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <select
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          <option value="ba-first">B.A. First</option>
          <option value="ba-second">B.A. Second</option>
          <option value="ba-third">B.A. Third</option>
          <option value="ma-first">M.A. Pre</option>
          <option value="ma-final">M.A. Final</option>
        </select>

        <input
          type="date"
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => markAttendance("Present")}
          className="w-full sm:w-1/3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:opacity-50"
          disabled={loading && students.length == 0 && updatingStudent == true}
        >
          Mark All Present
        </button>
        <button
          onClick={() => markAttendance("Absent")}
          className="w-full sm:w-1/3 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition disabled:opacity-50"
          disabled={loading && students.length == 0 && updatingStudent == true}
        >
          Mark All Absent
        </button>
        <button
          onClick={() => markAttendance("Holiday")}
          className="w-full sm:w-1/3 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg transition disabled:opacity-50"
          disabled={loading && students.length == 0 && updatingStudent == true}
        >
          Mark as Holiday
        </button>
      </div>

      {/* Show message if class & date are not selected */}
      {!selectedClass || !date ? (
        <div className="w-full p-4 text-center bg-yellow-100 text-yellow-800 rounded-lg">
          Please select a class and date to view students.
        </div>
      ) : loading ? (
        <div className="w-full flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full">
          {/* Attendance Table */}
          <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 border">Name</th>
                <th className="p-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-600">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr
                    key={s._id}
                    className="text-center bg-white hover:bg-gray-100"
                  >
                    <td className="p-4 border">{s.name}</td>
                    <td className="p-4 border">
                      <select
                        className="p-2 border rounded"
                        value={s.attendanceStatus}
                        disabled={updatingStudent == true}
                        onChange={(e) =>
                          updateSingleStudent(s._id, e.target.value)
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Not Marked">Not-Marked</option>
                        <option value="Absent">Absent</option>
                        <option value="Holiday">Holiday</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mark Attendance Buttons */}
        </div>
      )}
    </div>
  );
};

export default Attendance;
