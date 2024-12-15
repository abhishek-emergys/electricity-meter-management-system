import { useEffect, useState } from "react";
import DashboardChart from "../../../components/Charts/DashboardChart";
import Upload from "../../../assets/images/icons/Dashboard/Upload";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../../../layouts/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalMeters,
  fetchTotalConsumption,
  fetchTotalUsers,
  uploadCSVFile,
  clearUploadMessage,
} from "../../../services/redux/slices/admin/dashboardSlice";

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
  const dispatch = useDispatch();
  const { totalUsers, totalConsumption, totalMeters } = useSelector(
    (state) => state.dashboard
  );

  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchTotalUsers());
    dispatch(fetchTotalConsumption());
    dispatch(fetchTotalMeters());
    dispatch(clearUploadMessage());
  }, [dispatch]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    try {
      fileValidationSchema.parse({ file: selectedFile });

      const action = await dispatch(uploadCSVFile({ file: selectedFile }));

      if (uploadCSVFile.fulfilled.match(action)) {
        toast.success(action.payload || "File uploaded successfully!");
      } else if (uploadCSVFile.rejected.match(action)) {
        toast.error(action.payload || "Failed to upload the file");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message || "Invalid file format.");
      } else {
        toast.error("An unexpected error occurred.");
      }
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
            <div className="block max-w-80 h-24 w-80 text-left p-4 bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                    Total Users
                  </h5>
                  <p className="font-normal text-gray-700">{totalUsers || 0}</p>
                </div>
                <div>
                  <img
                    className="size-10"
                    alt="group"
                    src="src/assets/images/group.png"
                  />
                </div>
              </div>
            </div>
            <div className="block max-w-80 h-24 w-80 text-left p-4 bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                    Total Consumption
                  </h5>
                  <p className="font-normal text-gray-700">
                    {totalConsumption || 0} kWh
                  </p>
                </div>
                <div>
                  <img
                    className="size-10"
                    alt="energy consumption"
                    src="src/assets/images/energy-consumption.png"
                  />
                </div>
              </div>
            </div>
            <div className="block max-w-80 h-24 w-80 text-left p-4 bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                    Total Meter Units
                  </h5>
                  <p className="font-normal text-gray-700">
                    {totalMeters || 0}
                  </p>
                </div>
                <div>
                  <img
                    alt="meters"
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
