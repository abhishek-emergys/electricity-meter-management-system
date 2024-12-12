import { useEffect, useState } from "react";
import DashboardChart from "../../../components/Charts/DashboardChart";
import Upload from "../../../assets/images/icons/Dashboard/Upload";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../../../layouts/Sidebar";

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

  const token = localStorage.getItem("userToken");

  const fetchUser = async () => {
    // const token = localStorage.getItem("userToken");
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
    // const token = localStorage.getItem("userToken");
    const response = await fetch(
      `${BASE_URL}/api/auth/yearly-consumption-chart`,
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
    const response = await fetch(`${BASE_URL}/api/auth/yearly-meter-chart`, {
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    try {
      fileValidationSchema.parse({ file: selectedFile });

      setFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);

      // const token = localStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/api/auth/upload-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (
          responseData.validationErrors &&
          responseData.validationErrors.length > 0
        ) {
          toast.error(`Validation failed`, {
            position: "top-center",
          });
        } else {
          toast.success("File successfully uploaded!", {
            position: "top-center",
          });
        }
      } else {
        toast.error(`Upload failed`, {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <Sidebar />
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
                <Upload />
                Upload CSV File
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
                    alt="image"
                    src="src/assets/images/group.png"
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
                    src="src/assets/images/energy-consumption.png"
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
                  <img
                    alt="image"
                    className="size-12"
                    src="src/assets/images/meter.png"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* CARDS END*/}
          <DashboardChart />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;
