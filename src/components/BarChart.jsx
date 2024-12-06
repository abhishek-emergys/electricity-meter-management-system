import { Bar } from "react-chartjs-2";

export const BarChart = ({ chartData }) => {
  return (
    <div className="mb-[5rem] w-[90%]">
      {/* <h2 style={{ textAlign: "center" }}>Bar Chart</h2> */}
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: false
            }
          }          
        }
      }
      />
    </div>
  );
};
