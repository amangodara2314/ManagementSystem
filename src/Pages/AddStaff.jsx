import React, { useContext, useRef, useState } from "react";
import { MainContext } from "../Context/Main";
import axios from "axios";

function AddStaff(props) {
  const { API, fetchStaff, openToast, batch } = useContext(MainContext);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("aadhar", e.target.aadhar.value);
    formData.append("pan", e.target.pan.value);
    formData.append("fatherName", e.target.fatherName.value);
    formData.append("contactPhone", e.target.contactPhone.value);
    formData.append("batchYear", batch);
    formData.append("salary", e.target.salary.value);
    formData.append("category", e.target.category.value);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    axios
      .post(API + `/staff/add`, formData)
      .then((success) => {
        if (success.data.status === 1) {
          e.target.reset();
          fetchStaff();
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
            Add Staff
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
                  htmlFor="pan"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pan
                </label>
                <input
                  type="text"
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
                  id="contactPhone"
                  name="contactPhone"
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

export default AddStaff;
