import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Home from "./Home";
import Students from "./Pages/Students";
import Class from "./Pages/Class";
import AddStudent from "./Pages/AddStudent";
import StudentDetails from "./Pages/StudentDetails";
import Revenue from "./Pages/Revenue";
import Staff from "./Pages/Staff";
import AddStaff from "./Pages/AddStaff";
import DriverDetails from "./Pages/DriverDetails";
import Expenditure from "./Pages/Expenditure";
import Attendance from "./Pages/Attendance";
import DownloadAttendance from "./Pages/DownloadAttendance";
import StaffDetails from "./Pages/StaffDetails";

function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: <MainPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/class",
          element: <Class />,
        },
        {
          path: "/students/:classname",
          element: <Students />,
        },
        {
          path: "/add-student",
          element: <AddStudent />,
        },
        {
          path: "/student-details",
          element: <StudentDetails />,
        },
        {
          path: "/revenue",
          element: <Revenue />,
        },
        {
          path: "/staff",
          element: <Staff />,
        },
        {
          path: "/add-staff",
          element: <AddStaff />,
        },
        {
          path: "/attendance",
          element: <Attendance />,
        },
        {
          path: "/download-attendance",
          element: <DownloadAttendance />,
        },

        {
          path: "/staff-details",
          element: <StaffDetails />,
        },
        {
          path: "/driver-details",
          element: <DriverDetails />,
        },
        {
          path: "/expenditure",
          element: <Expenditure />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
