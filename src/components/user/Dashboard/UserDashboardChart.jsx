import { useEffect, useState } from "react";
import { create } from "@amcharts/amcharts4/core";
import {
  XYChart,
  CategoryAxis,
  ValueAxis,
  ColumnSeries,
  PieChart,
  PieSeries,
  Legend,
} from "@amcharts/amcharts4/charts";

const UserDashboardChart = ({ data }) => {
  const [chart, setChart] = useState(null);
  const [meterChart, setMeterChart] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const monthlyConsumption = {};

      data.forEach((entry) => {
        const date = new Date(entry.reading_date);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

        if (!monthlyConsumption[monthYear]) {
          monthlyConsumption[monthYear] = 0;
        }

        monthlyConsumption[monthYear] += entry.consumption;
      });

      const labels = Object.keys(monthlyConsumption);
      const consumptionData = Object.values(monthlyConsumption);

      let chart = create("chartdiv", XYChart);
      chart.paddingRight = 20;

      let categoryAxis = chart.xAxes.push(new CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.title.text = "Month";

      let valueAxis = chart.yAxes.push(new ValueAxis());
      valueAxis.title.text = "Consumption (kWh)";
      valueAxis.renderer.minGridDistance = 50;

      let consumptionSeries = chart.series.push(new ColumnSeries());
      consumptionSeries.dataFields.valueY = "consumption";
      consumptionSeries.dataFields.categoryX = "date";
      consumptionSeries.name = "Consumption (kWh)";
      consumptionSeries.columns.template.tooltipText =
        "{categoryX}: {valueY} kWh";

      chart.data = labels.map((month, index) => ({
        date: month,
        consumption: consumptionData[index],
      }));

      setChart(chart);

      const meterConsumption = {};

      data.forEach((entry) => {
        const meterNumber = entry.meter_number;

        if (!meterConsumption[meterNumber]) {
          meterConsumption[meterNumber] = 0;
        }

        meterConsumption[meterNumber] += entry.consumption;
      });

      const meterLabels = Object.keys(meterConsumption);
      const meterData = Object.values(meterConsumption);

      let meterChart = create("meterChartdiv", PieChart);
      meterChart.paddingRight = 20;
      meterChart.paddingLeft = 20;

      let meterConsumptionSeries = meterChart.series.push(new PieSeries());
      meterConsumptionSeries.dataFields.value = "consumption";
      meterConsumptionSeries.dataFields.category = "meter";
      meterConsumptionSeries.slices.template.tooltipText =
        "{category}: \n{value} kWh";
      meterConsumptionSeries.slices.template.fillOpacity = 0.6;
      meterConsumptionSeries.labels.template.text = "{category}";
      meterConsumptionSeries.labels.template.fontSize = 12;

      meterChart.data = meterLabels.map((meter, index) => ({
        meter: meter,
        consumption: meterData[index],
      }));

      setMeterChart(meterChart);

      return () => {
        if (chart) {
          chart.dispose();
        }
        if (meterChart) {
          meterChart.dispose();
        }
      };
    }
  }, [data]);

  return (
    <div className="flex w-full shadow-md rounded-lg mt-2 p-2 justify-between gap-2">
      <div
        className="bg-gray-100 p-4 rounded-lg w-1/2 h-[60vh]"
        id="chartdiv"
      ></div>
      <div
        id="meterChartdiv"
        className="bg-gray-100 p-4 rounded-lg w-1/2 h-[60vh]"
      ></div>
    </div>
  );
};

export default UserDashboardChart;
