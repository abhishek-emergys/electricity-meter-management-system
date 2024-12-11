import { useEffect } from "react";
import { create } from "@amcharts/amcharts4/core";
import {
  XYChart,
  CategoryAxis,
  ValueAxis,
  ColumnSeries,
  LineSeries,
} from "@amcharts/amcharts4/charts";

const Chart = ({
  data,
  chartType,
  chartId,
  valueField,
  tooltipText,
  seriesName,
  chartTitle,
  categoryTitle,
}) => {
  useEffect(() => {
    if (!data) return;

    const chart = create(chartId, XYChart);
    chart.data = data;

    const categoryAxis = chart.xAxes.push(new CategoryAxis());
    if (categoryTitle === "Month") {
      categoryAxis.dataFields.category = "month";
    } else {
      categoryAxis.dataFields.category = "year";
    }
    categoryAxis.title.text = categoryTitle;

    const valueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = chartTitle;

    let series;
    if (chartType === "bar") {
      series = chart.series.push(new ColumnSeries());
      
      series.dataFields.valueY = valueField;
      series.dataFields.categoryX =
        categoryTitle === "Month" ? "month" : "year";
      series.name = seriesName;
      series.columns.template.tooltipText = tooltipText;
      // series.tooltipText = tooltipText;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = "#000000";
      series.tooltip.background.opacity = 0.75;
      series.columns.template.fill = "#2EB4E8";
      series.columns.template.stroke = "#5788C7";
    } else if (chartType === "line") {
      series = chart.series.push(new LineSeries());
      console.log("series ", series.tooltip);
      
      series.dataFields.valueY = valueField;
      series.dataFields.categoryX =
        categoryTitle === "Month" ? "month" : "year";
      series.name = seriesName;
      series.tooltipText = tooltipText;
      series.strokeWidth = 2;
      series.stroke = "#FF5733";
    }

    return () => {
      chart.dispose();
    };
  }, [
    data,
    chartId,
    chartType,
    valueField,
    tooltipText,
    seriesName,
    chartTitle,
    categoryTitle,
  ]);

  return (
    <div id={chartId} className="bg-gray-100 p-4 rounded-lg w-1/2 h-[50vh]" />
  );
};

export default Chart;
