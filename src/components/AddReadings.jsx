import { useState, useEffect } from "react";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Sidebar from "./Sidebar";
import toast, { Toaster } from "react-hot-toast";
import AddReadingModal from "./AddReadingModal";

const AddReadings = () => {
  const [meterReadings, setMeterReadings] = useState([]);
  const [filteredMeterReadings, setFilteredMeterReadings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [readingPerPage] = useState(9);
  const [selectedReading, setSelectedReading] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const formatName = (username) => {
    return username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const fetchAllReadings = async () => {
    const token = localStorage.getItem("userToken");
    try {
      toast.loading("Waiting...");
      const response = await fetch(
        `${BASE_URL}/api/auth/admin-get-all-user-meter-mapping-data`,
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

      setMeterReadings(newData.data);
      setFilteredMeterReadings(newData.data);
    } catch (error) {
      toast.dismiss();
      console.error("Failed to fetch users:", error);
    }
  };

  const refreshReadingList = () => {
    fetchAllReadings();
  };

  useEffect(() => {
    fetchAllReadings();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = meterReadings.filter(
      (reading) =>
        reading.meter_number?.toLowerCase().includes(query) ||
        reading.username?.toLowerCase().includes(query)
    );

    setFilteredMeterReadings(filtered);
    setCurrentPage(1);
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "";
      key = "";
    }

    let sortedUsers = [...meterReadings];
    if (direction && key) {
      sortedUsers = [...filteredMeterReadings].sort((a, b) => {
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
    }

    setFilteredMeterReadings(sortedUsers);
    setSortConfig({ key, direction });
  };

  const indexOfLastUser = currentPage * readingPerPage;
  const indexOfFirstUser = indexOfLastUser - readingPerPage;
  const currentReading = filteredMeterReadings.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredMeterReadings.length / readingPerPage);

  const [modalOpen, setModalOpen] = useState(true);

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-10"></div>
        <div className="flex justify-between">
          <div>
            <p className="text-xl font-semibold text-gray-700 pl-1 pb-2">
              Add Readings
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
              {/* <AddMeter refreshReadingList={refreshReadingList} /> */}
            </div>
          </div>
        </div>

        <div>
          <div className="relative mt-3 h-[69vh] overflow-hidden shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer w-1/3"
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
                  <th
                    scope="col"
                    className="px-6 py-3 w-1/3 cursor-pointer"
                    onClick={() => sortData("meter_number")}
                  >
                    Meter Number
                    {sortConfig.key === "meter_number" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp className="inline-block ml-2" />
                      ) : (
                        <FaSortDown className="inline-block ml-2 mb-1" />
                      )
                    ) : (
                      <FaSort className="inline-block ml-2" />
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center w-1/3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentReading.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No readings found
                    </td>
                  </tr>
                ) : (
                  currentReading.map((reading) => (
                    <tr
                      key={reading.reading_id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {formatName(reading.username)}
                      </th>
                      <td className="px-6 py-2">{reading.meter_number}</td>

                      <td className="flex justify-center px-6 py-2 text-center">
                        {!modalOpen && (
                          <AddReadingModal
                            reading={selectedReading}
                            refreshReadingList={refreshReadingList}
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                          />
                        )}
                        <button
                          onClick={() => {
                            setSelectedReading(reading);
                            toggleModal();
                          }}
                          data-modal-target="crud-modal"
                          data-modal-toggle="crud-modal"
                          className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                          type="button"
                        >
                          <FaEdit />
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
      </div>
      <Toaster />
    </div>
  );
};

export default AddReadings;
