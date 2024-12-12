import Sidebar from "../../components/Sidebar";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import AddUser from "../../components/AddUser";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import EditUser from "../../components/EditUser";
import AssignMeter from "../../components/AssignMeter";

const UserInfo = () => {
  const [getUsers, setGetUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(9);
  const [selectedUser, setSelectedUser] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "asc",
  });

  const formatName = (username) => {
    return username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("userToken");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/auth/admin-deleteUser/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "6024",
            },
          }
        );

        if (response.ok) {
          const updatedUsers = getUsers.filter(
            (user) => user.user_id !== userId
          );
          setGetUsers(updatedUsers);
          setFilteredUsers(updatedUsers);

          toast.success("User deleted successfully!", {
            position: "top-center",
          });
        } else {
          toast.error("Failed to delete user. Please try again.", {
            position: "top-center",
          });
          console.error("Failed to delete user. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user. Please try again.");
      }
    }
  };

  const fetchAllUsers = async () => {
    const token = localStorage.getItem("userToken");
    try {
      toast.loading("Waiting...");
      const response = await fetch(`${BASE_URL}/api/auth/admin-getAllUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "6024",
        },
      });
      toast.dismiss();
      const newData = await response.json();
      setGetUsers(newData.users);
      setFilteredUsers(newData.users);
    } catch (error) {
      toast.dismiss();
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users. Please try again.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = getUsers.filter(
      (user) =>
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.address?.toLowerCase().includes(query) ||
        user.role_name?.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const aValue = a[key]?.trim().toLowerCase() || "";
      const bValue = b[key]?.trim().toLowerCase() || "";

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(sortedUsers);
    setSortConfig({ key, direction });
    // setCurrentPage(1);
  };

  const refreshUsersList = () => {
    fetchAllUsers();
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const [modalOpen, setModalOpen] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(true);

  const toggleModal = (modalName) => {
    if (modalName === "edit") {
      setModalOpen((prevState) => !prevState);
    } else if (modalName === "assign") {
      setAssignModalOpen((prevState) => !prevState);
    }
  };

  return (
    <div>
      {/* <ToastContainer /> */}
      <Sidebar />
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-10"></div>
        <div className="flex justify-between">
          <div>
            <p className="text-xl font-semibold text-gray-700 pl-1 pb-2">
              User Information
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="px-2 py-1 rounded-lg bg-gray-50 border"
              />
            </div>
            <div className="pb-3">
              <AddUser refreshUsersList={refreshUsersList} />
            </div>
          </div>
        </div>

        <div className="relative h-[69vh] overflow-hidden shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer w-1/6"
                  onClick={() => sortData("username")}
                >
                  User name
                  {sortConfig.key === "username" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp className="inline-block ml-2" />
                    ) : (
                      <FaSortDown className="inline-block ml-2 mb-1" />
                    )
                  ) : (
                    <FaSort className="inline-block ml-2" />
                  )}
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 w-1/5">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Assign Meter
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    className="bg-white border-b  hover:bg-gray-50 "
                  >
                    <th
                      scope="row"
                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {formatName(user.username)}
                    </th>
                    <td className="px-6 py-2">{user.email}</td>
                    <td className="px-6 py-2 truncate">{user.address}</td>
                    <td className="flex px-6 py-2">
                      {!modalOpen && (
                        <EditUser
                          user={selectedUser}
                          modalOpen={modalOpen}
                          setModalOpen={setModalOpen}
                          refreshUsersList={refreshUsersList}
                        />
                      )}

                      {!assignModalOpen && (
                        <AssignMeter
                          user={selectedUser}
                          modalOpen={assignModalOpen}
                          setModalOpen={setAssignModalOpen}
                          refreshUsersList={refreshUsersList}
                        />
                      )}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          toggleModal("edit");
                        }}
                        data-modal-target="crud-modal"
                        data-modal-toggle="crud-modal"
                        className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center "
                        type="button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.user_id)}
                        className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center "
                      >
                        <MdDelete />
                      </button>
                    </td>
                    <td className="px-6 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          toggleModal("assign");
                        }}
                        className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center "
                      >
                        <IoMdAdd />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UserInfo;
