import Sidebar from "../../components/Sidebar";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import AddUser from "../../components/AddUser";

const UserInfo = () => {
  const [getUsers, setGetUsers] = useState([]);

  const fetchAllUsers = async () => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(
      "http://192.168.0.160:8080/api/auth/admin-getAllUsers",
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
    // console.log("newData ", newData);
    setGetUsers(newData.users);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-14"></div>
        <div className="flex justify-between">
          <div>
            <p className="text-xl font-semibold text-gray-700 pl-4 pb-2">
              User Information
            </p>
          </div>
          <div>
            <input
              type="search"
              placeholder="Search"
              className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500"
            />
          </div>
          <div className="pb-3">
            <AddUser />
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  User name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Consumtion (kWh)
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getUsers.map((user) => (
                <tr
                  key={user.user_id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.username}
                  </th>
                  <td className="px-6 py-2">{user.email}</td>
                  <td className="px-6 py-2">{user.address}</td>
                  <td className="px-6 py-2"> 100 </td>
                  <td className="px-6 py-2">{user.role_name}</td>
                  <td className="px-6 py-2 text-center">
                    <button
                      type="button"
                      className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
