import React, { useState, useContext } from "react";
import { MainContext } from "../Context/Main";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB"; // Fix for month-year picker formatting

registerLocale("en-GB", enGB);

const DownloadAttendance = () => {
  const { API, batch } = useContext(MainContext);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // Month-Year picker
  const [format, setFormat] = useState("excel");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!selectedClass || !selectedDate || !format) {
      toast.error("Please select all required fields!");
      return;
    }

    setLoading(true);

    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"); // 01-12
    const year = selectedDate.getFullYear().toString();

    try {
      const response = await axios.get(`${API}/attendance/download`, {
        params: { cls: selectedClass, batch, month, year, format },
        responseType: "blob",
      });
      if (response.data.success === false) {
        toast.error(response.data.msg);
        return;
      }

      const fileExtension = format === "pdf" ? "pdf" : "xlsx";
      const fileName = `Attendance_${selectedClass}_${month}_${year}.${fileExtension}`;

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${fileName}`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Download Attendance
        </h1>

        <div className="grid gap-4 w-full">
          {/* Class Selection */}
          <label className="font-medium">Class:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
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

          {/* Month-Year Picker */}
          <label className="font-medium">Select Month & Year:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="w-full p-3 border border-gray-300 rounded-lg"
            locale="en-GB"
            placeholderText="Select Month & Year"
          />

          {/* Format Selection */}
          <label className="font-medium">Download Format:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadAttendance;
