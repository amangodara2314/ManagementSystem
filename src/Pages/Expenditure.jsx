import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../Context/Main";
import axios from "axios";
import formatDate from "../utils/dateOfBirthFormat";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Expenditure(props) {
  const {
    API,
    openToast,
    fetchExpenditure,
    expenditure,
    students,
    batch,
    salary,
    fees,
  } = useContext(MainContext);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    generateChartData();
  }, [selectedStartDate, selectedEndDate, expenditure, fees]);

  const addExpense = (e) => {
    e.preventDefault();
    const data = {
      comment: e.target.comment.value,
      amount: e.target.amount.value,
      category: e.target.category.value,
      batch: batch,
    };
    axios
      .post(API + "/expenditure/add", data)
      .then((success) => {
        if (success.data.status == 1) {
          openToast(success.data.msg, "success");
          fetchExpenditure();
          e.target.reset();
          setToggle(false);
        }
      })
      .catch((error) => {
        openToast("Client Side Error", "error");
      });
  };

  const filterExpenses = () => {
    if (!selectedEndDate || !selectedStartDate) {
      return expenditure;
    } else {
      const filter = expenditure.filter((exp) => {
        if (
          formatDate(exp.date) >= formatDate(selectedStartDate) &&
          formatDate(exp.date) <= formatDate(selectedEndDate)
        ) {
          return true;
        } else {
          return false;
        }
      });
      return filter;
    }
  };

  const generateChartData = () => {
    if (!selectedStartDate || !selectedEndDate) {
      const monthlyData = [];
      const revenueByMonth = {};
      const expensesByMonth = {};

      fees?.forEach((fee) => {
        const month = formatDate(fee.date).slice(0, 7);
        if (!revenueByMonth[month]) revenueByMonth[month] = 0;
        revenueByMonth[month] += fee.amount;
      });

      expenditure?.forEach((exp) => {
        const month = formatDate(exp.date).slice(0, 7);
        if (!expensesByMonth[month]) expensesByMonth[month] = 0;
        expensesByMonth[month] += exp.amount;
      });

      const months = Object.keys({ ...revenueByMonth, ...expensesByMonth });

      months?.forEach((month) => {
        monthlyData.push({
          date: month,
          revenue: revenueByMonth[month] || 0,
          expenses: expensesByMonth[month] || 0,
        });
      });

      setChartData(monthlyData);
    } else {
      // Aggregate data day-wise within selected dates
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);
      const data = [];

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateString = formatDate(currentDate);
        const dailyRevenue = fees
          .filter((fee) => formatDate(fee.date) === dateString)
          .reduce((total, fee) => total + fee.amount, 0);
        const dailyExpenses = expenditure
          .filter((exp) => formatDate(exp.date) === dateString)
          .reduce((total, exp) => total + exp.amount, 0);

        data.push({
          date: dateString,
          revenue: dailyRevenue,
          expenses: dailyExpenses,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setChartData(data);
    }
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
              Add Expense
              <span
                className="font-normal text-xl cursor-pointer"
                onClick={() => {
                  setToggle(false);
                }}
              >
                X
              </span>
            </h1>
            <form onSubmit={addExpense}>
              <div className="mb-6 grid grid-cols-2 gap-2">
                <div className="">
                  <label htmlFor="category" className="block mb-2">
                    Category:
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full p-2 border rounded"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="vehicel">Vehicel Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="">
                  <label htmlFor="amount" className="block mb-2">
                    Amount:
                  </label>
                  <input
                    required={true}
                    min={0}
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="comment" className="block mb-2">
                  Comment:
                </label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  className="w-full p-2 border rounded"
                />
              </div>
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="max-w-full mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4 flex justify-between">
          Expense Tracker
          <span
            className="font-semibold text-3xl cursor-pointer"
            onClick={() => {
              setToggle(true);
            }}
          >
            +
          </span>
        </h2>
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">
                  <span>Total Revenue</span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap">
                  Rs.
                  {students?.reduce((total, student) => {
                    return (
                      total +
                      student.feesPaid.reduce((acc, fee) => acc + fee.amount, 0)
                    );
                  }, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">
                  <span>Total Expenses</span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap">
                  Rs.
                  {expenditure?.reduce((total, expense) => {
                    return total + expense.amount;
                  }, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">
                  <span>Salary Paid</span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap">
                  Rs.
                  {!salary || salary?.length == 0
                    ? 0
                    : salary?.reduce((total, expense) => {
                        return total + expense.amount;
                      }, 0)}
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <strong>Total Income</strong>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold">
                  Rs.
                  {fees?.reduce((acc, fee) => acc + fee.amount, 0) -
                    (expenditure?.reduce((total, expense) => {
                      return total + expense.amount;
                    }, 0) +
                      salary?.reduce((total, expense) => {
                        return total + expense.amount;
                      }, 0))}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex space-x-8 items-center my-4 justify-center">
            <div className="space-x-2">
              <label htmlFor="">From</label>
              <input
                type="date"
                onChange={(e) => setSelectedStartDate(e.target.value)}
                className="border py-1 px-2"
              />
            </div>
            <div className="space-x-2">
              <label htmlFor="">To</label>

              <input
                type="date"
                onChange={(e) => setSelectedEndDate(e.target.value)}
                className="border py-1 px-2"
              />
            </div>
          </div>
        </div>

        <div className="">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#008000"
                fill="#008000"
                stackId={1}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#FF0000"
                fill="#FF0000"
                stackId={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8">
          {expenditure == null ? (
            <div className="flex justify-center mt-8 h-screen">
              <div className="inline-block animate-spin ease duration-300 w-8 h-8 border-t-4 border-b-4 border-gray-900 rounded-full"></div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4 flex justify-between">
                Recent Expenses
              </h3>
              <ul>
                {filterExpenses()?.map((exp, index) => {
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div className="font-medium w-[70%]">
                        <div className="">
                          {exp.comment} ({exp.category})
                        </div>
                        <div className="text-sm text-gray-700 mt-2 font-normal">
                          {formatDate(exp.date)}
                        </div>
                      </div>
                      <span className="font-medium">₹{exp.amount}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Expenditure;
