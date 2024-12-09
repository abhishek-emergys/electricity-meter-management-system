import { useState, useEffect } from "react";
import Chart from "./Charts";

const DashboardChart = () => {
  const [usersData, setUsersData] = useState(null);
  const [consumptionData, setConsumptionData] = useState(null);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchUserData = async (period) => {
    const token = localStorage.getItem("userToken");
    const endpoint =
      period === "monthly"
        ? `${BASE_URL}/api/auth/monthly-user-chart`
        : `${BASE_URL}/api/auth/yearly-user-chart`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "6024",
        },
      });
      const newData = await response.json();
      if (period === "monthly") {
        setUsersData(newData.monthlyData);
      } else {
        setUsersData(newData.yearlyData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchConsumptionData = async (period) => {
    const token = localStorage.getItem("userToken");
    const endpoint =
      period === "monthly"
        ? `${BASE_URL}/api/auth/monthly-consumption-chart`
        : `${BASE_URL}/api/auth/yearly-consumption-chart`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "6024",
        },
      });
      const newData = await response.json();
      if (period === "monthly") {
        setConsumptionData(newData.monthlyData);
      } else {
        setConsumptionData(newData.yearlyData);
      }
    } catch (error) {
      console.error("Error fetching consumption data:", error);
    }
  };

  const processMonthlyData = (data, valueField) => {
    return data.map((dataItem) => ({
      month: monthNames[dataItem.month - 1],
      year: dataItem.year,
      [valueField]: dataItem[valueField],
    }));
  };

  const processYearlyData = (data, valueField) => {
    return data.map((dataItem) => ({
      year: dataItem.year,
      [valueField]: dataItem[valueField],
    }));
  };

  useEffect(() => {
    fetchUserData(timePeriod);
    fetchConsumptionData(timePeriod);
  }, [timePeriod]);

  const noUserDataFound = !usersData || usersData.length === 0;
  const noConsumptionDataFound =
    !consumptionData || consumptionData.length === 0;

  return (
    <div className="flex flex-col border-gray-200 rounded-lg shadow pt-2 mt-4 gap-2 mx-3">
      <div className="flex justify-end pr-3 gap-3 items-center">
        <label
          htmlFor="timePeriod"
          className="text-sm font-medium text-gray-700"
        >
          {noUserDataFound} Filter
        </label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="block w-36 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="flex px-3 pb-4 gap-3 justify-between">
        {noUserDataFound ? (
          <div className="bg-gray-100 p-4 rounded-lg w-1/2 h-[50vh]">
            <p className="text-center font-semibold">No Data Found</p>
          </div>
        ) : (
          <Chart
            data={
              usersData
                ? timePeriod === "monthly"
                  ? processMonthlyData(usersData, "totalUsers")
                  : processYearlyData(usersData, "totalUsers")
                : []
            }
            chartType="bar"
            chartId="barChartDiv"
            valueField="totalUsers"
            tooltipText="Month: {month} {year}\nUsers Gained: [bold]{valueY}[/]"
            seriesName="Users Gained"
            chartTitle="Users"
            categoryTitle={timePeriod === "monthly" ? "Month" : "Year"}
          />
        )}

        {noConsumptionDataFound ? (
          <div className="bg-gray-100 p-4 rounded-lg w-1/2 h-[50vh]">
            <p className="text-center font-semibold">No Data Found</p>
          </div>
        ) : (
          <Chart
            data={
              consumptionData
                ? timePeriod === "monthly"
                  ? processMonthlyData(consumptionData, "totalConsumption")
                  : processYearlyData(consumptionData, "totalConsumption")
                : []
            }
            chartType="line"
            chartId="lineChartDiv"
            valueField="totalConsumption"
            tooltipText="Month: {month} {year}\nConsumption: [bold]{valueY}[/]"
            seriesName="Consumption"
            chartTitle="Consumption (kWh)"
            categoryTitle={timePeriod === "monthly" ? "Month" : "Year"}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
