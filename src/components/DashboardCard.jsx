import React from "react";

const totals = [
  {
    title: "Total Users",
    totalUsers: 4000,
    img: "public/group.png",
  },

  {
    title: "Total Consumption",
    totalUsers: 4000,
    img: "public/energy-consumption.png",
  },

  {
    title: "Total Users",
    totalUsers: 4000,
    img: "public/group.png",
  },
];

const DashboardCard = () => {
    return (
        <>
        {totals.map(function(value, index) {
          return (
            <div key={index} className="flex gap-8 justify-around">
            <div className="block max-w-72 w-72 h-32 text-left p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                <h5 className="mb-1 text-xl  font-bold tracking-tight text-gray-900 dark:text-white">
                  {value.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                {value.title}
                </p>
                </div>
                <div>
                  <img className="size-10" src="public/group.png"/>
                </div>
              </div>
            </div>
            <div className="block max-w-72 w-72 text-left p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center">
                <div>
                <h5 className="mb-1 text-xl  font-bold tracking-tight text-gray-900 dark:text-white">
                  Total Consumption
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  4000
                </p>
                </div>
                <div>
                  <img className="size-10" src="public/energy-consumption.png"/>
                </div>
              </div>
            </div>
            <div className="block max-w-72 w-72 text-left p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center">
                <div>
                <h5 className="mb-1 text-xl  font-bold tracking-tight text-gray-900 dark:text-white">
                  Total Users
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  4000
                </p>
                </div>
                <div>
                  <img className="size-10" src="public/group.png"/>
                </div>
              </div>
            </div>
          </div>
          )
        })}
        </>
      );
};

export default DashboardCard;
