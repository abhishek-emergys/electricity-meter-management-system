import { useState, useEffect } from "react";
import { create } from "@amcharts/amcharts4/core";
import {
  XYChart,
  CategoryAxis,
  ValueAxis,
  ColumnSeries,
} from "@amcharts/amcharts4/charts";

const DashboardChart = () => {
  const [chart, setChart] = useState(null);
  const [usersMonthlyData, setUsersMonthlyData] = useState(null);

  const fetchUserMonthWiseData = async () => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(
      "http://192.168.0.160:8080/api/auth/monthly_user_chart",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "6024",
        },
      }
    );
    const newData = await response.json();
    // console.log("newData ", newData);
    setUsersMonthlyData(newData.monthlyData);
  };

  useEffect(() => {
    fetchUserMonthWiseData();
  }, []);

  useEffect(() => {
    if (!usersMonthlyData) return;

    if (chart) {
      chart.dispose();
    }

    const newChart = create("barChartDiv", XYChart);

    newChart.data = usersMonthlyData.map((data) => ({
      month: data.month,
      totalUsers: data.totalUsers,
    }));

    const categoryAxis = newChart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.title.text = "Month";

    const valueAxis = newChart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "Total Users";

    const columnSeries = newChart.series.push(new ColumnSeries());
    columnSeries.dataFields.valueY = "totalUsers";
    columnSeries.dataFields.categoryX = "month";
    columnSeries.name = "Users Gained";

    columnSeries.tooltipText =
      "Month: {categoryX}\nUsers Gained: [bold]{valueY}[/]\nTotal Users: [bold]{totalUsers}[/]";

    columnSeries.tooltip.getFillFromObject = false;
    columnSeries.tooltip.background.fill = "#000000";
    columnSeries.tooltip.background.opacity = 0.75;

    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.dispose();
      }
    };
  }, [usersMonthlyData]);

  return (
    <div className="flex flex-col">
      <div className="flex p-4 gap-2">
        <div id="barChartDiv" style={{ width: "100%", height: "400px" }}></div>
      </div>
    </div>
  );
};

export default DashboardChart;
