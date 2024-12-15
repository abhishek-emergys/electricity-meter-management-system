import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsersChartData,
  fetchConsumptionChartData,
} from "../../services/redux/slices/admin/chartSlice";
import Chart from "./Charts";

const DashboardChart = () => {
  const dispatch = useDispatch();
  const { usersData, consumptionData, error } = useSelector(
    (state) => state.chart
  );

  const [timePeriod, setTimePeriod] = useState("monthly");

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

  useEffect(() => {
    dispatch(fetchUsersChartData());
    dispatch(fetchConsumptionChartData());
  }, [dispatch]);

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

  const noUserDataFound =
    !usersData[timePeriod] || usersData[timePeriod].length === 0;
  const noConsumptionDataFound =
    !consumptionData[timePeriod] || consumptionData[timePeriod].length === 0;

  return (
    <div className="flex flex-col border-gray-200 rounded-lg shadow pt-2 mt-4 gap-2 mx-3">
      <div className="flex justify-end pr-3 gap-3 items-center">
        <label
          htmlFor="timePeriod"
          className="text-sm font-medium text-gray-700"
        >
          Filter
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

      {error ? (
        <div className="p-4 rounded-lg w-full h-[330px]">
          <p className="text-center font-medium text-gray-600">{`Error: ${error}`}</p>
        </div>
      ) : (
        <div className="flex px-3 pb-4 gap-3 justify-between">
          {noUserDataFound ? (
            <div className="bg-gray-100 p-4 rounded-lg w-1/2 h-[50vh]">
              <p className="text-center font-semibold">No Data Found</p>
            </div>
          ) : (
            <Chart
              data={
                usersData[timePeriod]
                  ? timePeriod === "monthly"
                    ? processMonthlyData(usersData[timePeriod], "totalUsers")
                    : processYearlyData(usersData[timePeriod], "totalUsers")
                  : []
              }
              chartType="bar"
              chartId="barChartDiv"
              valueField="totalUsers"
              tooltipText="Month: [bold]{month} 
              [normal]Users Gained: [bold]{valueY}[/]"
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
                consumptionData[timePeriod]
                  ? timePeriod === "monthly"
                    ? processMonthlyData(
                        consumptionData[timePeriod],
                        "totalConsumption"
                      )
                    : processYearlyData(
                        consumptionData[timePeriod],
                        "totalConsumption"
                      )
                  : []
              }
              chartType="line"
              chartId="lineChartDiv"
              valueField="totalConsumption"
              tooltipText=" {month} {year} 
              Consumption: [bold]{valueY}[/]"
              seriesName="Consumption"
              chartTitle="Consumption (kWh)"
              categoryTitle={timePeriod === "monthly" ? "Month" : "Year"}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardChart;
