import Sidebar from "../../components/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EditReading from "../../components/EditReading";

const MeterReading = () => {
  const [meterReadings, setMeterReadings] = useState([]);
  const [filteredMeterReadings, setFilteredMeterReadings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [readingPerPage] = useState(9);
  const [selectedReading, setSelectedReading] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

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
        `${BASE_URL}/api/auth/admin-get-all-meter-readings`,
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

  const handleDelete = async (readingId) => {
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
          `${BASE_URL}/api/auth/admin-delete-meter-reading/${readingId}`,
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
          const updatedReadings = meterReadings.filter(
            (reading) => reading.reading_id !== readingId
          );
          setMeterReadings(updatedReadings);
          setFilteredMeterReadings(updatedReadings);

          toast.success("Reading deleted successful.", {
            position: "top-center",
          });
        } else {
          toast.error("Failed to delete reading. Please try again.", {
            position: "top-center",
          });
          console.error("Failed to delete reading. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting reading:", error);
      }
    }
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
              Meter Readings
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer w-1/7"
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
                    className="px-6 py-3 w-1/7 cursor-pointer"
                    onClick={() => sortData("reading_date")}
                  >
                    Date
                    {sortConfig.key === "reading_date" ? (
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
                    className="px-6 py-3 w-1/7 cursor-pointer"
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
                  <th scope="col" className="px-6 py-3 w-1/7">
                    Consumption (kWh)
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/7">
                    Bill Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/7">
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
                      className="bg-white border-b  hover:bg-gray-50 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {formatName(reading.username)}
                      </th>
                      <td className="px-6 py-2">
                        {formatDate(reading.reading_date)}
                      </td>
                      <td className="px-6 py-2">{reading.meter_number}</td>
                      <td className="px-6 py-2">{reading.consumption}</td>
                      <td className="px-6 py-2">
                        {reading.is_bill_paid === 1 ? "Paid" : "Unpaid"}
                      </td>

                      <td className="flex px-6 py-2 text-center">
                        {!modalOpen && (
                          <EditReading
                            reading={selectedReading}
                            modalOpen={modalOpen}
                            refreshReadingList={refreshReadingList}
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
                        <button
                          type="button"
                          onClick={() => handleDelete(reading.reading_id)}
                          className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                          <MdDelete />
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

export default MeterReading;
