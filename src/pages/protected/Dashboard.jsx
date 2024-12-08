import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardChart from "../../utils/DashboardChart";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fileValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "text/csv", {
      message: "Only CSV files are allowed",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
});

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [totalUsers, setTotalUsers] = useState();
  const [totalConsumption, setTotalConsumption] = useState();
  const [totalMeters, setTotalMeters] = useState();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUser = async () => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}/api/auth/admin-getAllUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "6024",
      },
    });
    const newData = await response.json();
    setTotalUsers(newData.users.length);
  };

  const fetchConsumption = async () => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(
      `${BASE_URL}/api/auth/yearly_consumption_chart`,
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
    const totalConsumption = newData.yearlyData.reduce(
      (acc, data) => acc + data.totalConsumption,
      0
    );
    setTotalConsumption(totalConsumption);
  };

  const fetchMeters = async () => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}/api/auth/yearly_meter_chart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "6024",
      },
    });
    const newData = await response.json();
    const totalMeters = newData.yearlyData.reduce(
      (acc, data) => acc + data.totalMeters,
      0
    );

    setTotalMeters(totalMeters);
  };

  useEffect(() => {
    fetchUser();
    fetchConsumption();
    fetchMeters();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    try {
      fileValidationSchema.parse({ file: selectedFile });
      setFile(selectedFile);
      const showSuccessMessage = () => {
        toast.success("File successfully uploaded!", {
          position: "top-center",
        });
      };
      showSuccessMessage();
    } catch (err) {
      const showSuccessMessage = () => {
        toast.error(err.errors[0].message, {
          position: "top-center",
        });
      };
      showSuccessMessage();
    }
  };

  return (
    <div>
      <Sidebar />
      <ToastContainer />
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-12">
          <div className="flex justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-700 pl-[0.7rem] pb-2">
                Dashboard
              </p>
            </div>
            <div className="pb-3 pr-3">
              <label
                htmlFor="uploadFile1"
                className="flex bg-green-800 hover:bg-green-700 text-white text-base px-4 py-1.5 outline-none rounded-lg w-max cursor-pointer mx-auto font-[sans-serif]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 mr-2 fill-white inline"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                    data-original="#000000"
                  />
                  <path
                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                    data-original="#000000"
                  />
                </svg>
                Upload CSV
                <input
                  type="file"
                  id="uploadFile1"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* CARDS START*/}
          <div className="flex justify-around">
            <div className="block max-w-80 h-24 w-80  text-left p-4 bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="mb-1 text-lg  font-bold tracking-tight text-gray-900">
                    Total Users
                  </h5>
                  <p className="font-normal text-gray-700 ">
                    {totalUsers ? totalUsers : 0}
                  </p>
                </div>
                <div>
                  <img
                    className="size-10"
                    alt="group image"
                    src="public/group.png"
                  />
                </div>
              </div>
            </div>
            <div className="block max-w-80 h-24 w-80 text-left p-4 bg-white border border-gray-200 rounded-lg shadow ">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                    Total Consumption
                  </h5>
                  <p className="font-normal text-gray-700 ">
                    {totalConsumption ? totalConsumption : 0} kWh
                  </p>
                </div>
                <div>
                  <img
                    className="size-10"
                    alt="image"
                    src="public/energy-consumption.png"
                  />
                </div>
              </div>
            </div>
            <div className="block max-w-80 h-24 w-80 text-left p-4 bg-white border border-gray-200 rounded-lg shadow ">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="mb-1 text-lg  font-bold tracking-tight text-gray-900 ">
                    Total Meter Units
                  </h5>
                  <p className="font-normal text-gray-700 ">
                    {totalMeters ? totalMeters : 0}
                  </p>
                </div>
                <div>
                  <img alt="image" className="size-10" src="public/group.png" />
                </div>
              </div>
            </div>
          </div>
          {/* CARDS END*/}
          <DashboardChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
