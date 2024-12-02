import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-14">
          <div className="flex gap-8 justify-around">
            <div className="block max-w-72 w-72 h-32 text-left p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
