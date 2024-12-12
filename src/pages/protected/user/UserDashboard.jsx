import { useEffect, useState } from "react";
import UserSidebar from "../../../layouts/UserSidebar";
import UserDashboardChart from "../../../components/user/Dashboard/UserDashboardChart";
import toast, { Toaster } from "react-hot-toast";

const UserDashboard = () => {
  const [userId, setUserId] = useState("");

  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalMeters, setTotalMeters] = useState(0);
  const [chartData, setChartData] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUserInfo = async () => {
    toast.loading("Waiting...");
    const token = localStorage.getItem("userToken");
    const response = await fetch(
      `${BASE_URL}/api/auth/user-dashboard-readings/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "6024",
        },
      }
    );
    toast.dismiss();
    const newData = await response.json();

    if (response.ok && newData.data) {
      const totalAmount = newData.data.reduce(
        (total, item) => total + item.bill_amount,
        0
      );

      const totalConsumpUnit = newData.data.reduce(
        (total, item) => total + item.consumption,
        0
      );

      const meterNumbers = newData.data.map((item) => item.meter_number);
      const uniqueMeterNumbers = new Set(meterNumbers);
      const totalUniqueMeters = uniqueMeterNumbers.size;

      setTotalBillAmount(totalAmount);
      setTotalConsumption(totalConsumpUnit);
      setTotalMeters(totalUniqueMeters);
      setChartData(newData.data);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  return (
    <div>
      <UserSidebar setUserId={setUserId} />
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-12">
          <div className="flex justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-700 pl-[0.7rem] pb-2">
                Dashboard
              </p>
            </div>
          </div>
          <div className="gap-4">
            <div className="flex justify-around">
              <div className="block max-w-80 h-24 w-80  text-left p-4 bg-white border border-gray-200 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="mb-1 text-lg  font-bold tracking-tight text-gray-900">
                      Total Bill Amount
                    </h5>
                    <p className="font-normal text-gray-700 ">
                      ₹ {totalBillAmount ? totalBillAmount : 0}
                    </p>
                  </div>
                  <div>
                    <img
                      className="size-10"
                      alt="group image"
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

            {/* <DashboardChart /> */}
            <div className="flex px-3 pb-4 gap-3 justify-between">
              {!chartData ? (
                <div className="flex w-full gap-2 mt-4">
                  <div className="bg-gray-100 p-4 rounded-lg w-1/2 h-[50vh]">
                    <p className="text-center font-semibold">No Data Found</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg w-1/2 h-[50vh]">
                    <p className="text-center font-semibold">No Data Found</p>
                  </div>
                </div>
              ) : (
                <UserDashboardChart data={chartData} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UserDashboard;
