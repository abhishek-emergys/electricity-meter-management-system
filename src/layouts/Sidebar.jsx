import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
import { MdAssignmentAdd } from "react-icons/md";
import Navbar from "./Navbar";
import DashboardSVG from "../assets/images/icons/Sidebar/DashboardSVG.jsx";
import UserInfoSVG from "../assets/images/icons/Sidebar/UserInfoSVG.jsx";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <Navbar />
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-52 h-screen pt-[4.3rem] transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-2 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  location.pathname === "/dashboard"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
              >
                <DashboardSVG />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/users-info"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  location.pathname === "/users-info"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
              >
                <UserInfoSVG />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  User Information
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/add-reading"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  location.pathname === "/add-reading"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
              >
                <MdAssignmentAdd className="text-gray-500 text-xl group-hover:text-gray-900 " />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Add Readings
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/meter-reading"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  location.pathname === "/meter-reading"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
              >
                <FaTachometerAlt className="text-gray-500 text-xl group-hover:text-gray-900 " />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Update Readings
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
