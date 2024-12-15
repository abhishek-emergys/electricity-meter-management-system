import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserSidebar from "../../../layouts/UserSidebar";
import { TbUserQuestion } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  fetchMeterReadings,
  filterReadings,
  sortReadings,
} from "../../../services/redux/slices/user/readingsSlice";

const UserReadings = () => {
  const dispatch = useDispatch();
  const { meterReadings, filteredMeterReadings } = useSelector(
    (state) => state.readings
  );
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeter, setSelectedMeter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const readingsPerPage = 9;

  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchMeterReadings(userId));
    }
  }, [userId, dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    dispatch(filterReadings({ query: e.target.value, meter: selectedMeter }));
  };

  const filterByMeter = (meter) => {
    setSelectedMeter(meter);
    dispatch(filterReadings({ query: searchQuery, meter }));
  };

  // console.log("filteredMeterReadings ", filteredMeterReadings);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "";
      key = "";
    }
    setSortConfig({ key, direction });
    dispatch(sortReadings({ key, direction }));
  };

  const indexOfLastReading = currentPage * readingsPerPage;
  const indexOfFirstReading = indexOfLastReading - readingsPerPage;
  const currentReadings = filteredMeterReadings.slice(
    indexOfFirstReading,
    indexOfLastReading
  );

  const totalPages = Math.ceil(filteredMeterReadings.length / readingsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (query.length === 0) {
      toast.error("Add a query");
      return;
    }

    if (query.length > 5) {
      toast.success("Query submitted successfully");
      setShowModal(false);
      setQuery("");
      return;
    }
  };

  return (
    <div>
      <UserSidebar setUserId={setUserId} />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Report Issue</h2>
            <form onSubmit={handleQuerySubmit}>
              <div>
                <label
                  htmlFor="query"
                  className="block mb-2 text-sm text-gray-700"
                >
                  Describe your issue
                </label>
                <textarea
                  id="query"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="p-4 sm:ml-52">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-10">
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
              <div className="flex flex-col border-gray-200 rounded-lg">
                <select
                  value={selectedMeter}
                  onChange={(e) => filterByMeter(e.target.value)}
                  className="block w-36 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Meters</option>
                  {[
                    ...new Set(
                      meterReadings.map((reading) => reading.meter_number)
                    ),
                  ].map((meter) => (
                    <option key={meter} value={meter}>
                      {meter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="relative mt-3 h-[69vh] overflow-hidden shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      User ID
                    </th>
                    <th
                      scope="col"
                      onClick={() => sortData("meter_number")}
                      className="px-6 py-3 cursor-pointer"
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
                    <th
                      scope="col"
                      className="px-6 py-3"
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
                    <th scope="col" className="px-6 py-3">
                      Consumption (kWh)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Bill Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Query
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentReadings && currentReadings.length > 0 ? (
                    currentReadings.map((reading) => (
                      <tr
                        key={reading.user_meter_map_id}
                        className="bg-white border-b hover:bg-gray-50 "
                      >
                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {reading.user_id}
                        </td>
                        <td className="px-6 py-2">{reading.meter_number}</td>
                        <td className="px-6 py-2">
                          {formatDate(reading.reading_date)}
                        </td>
                        <td className="px-6 py-2">{reading.consumption}</td>
                        <td className="px-6 py-2">
                          {reading.is_bill_paid ? "Paid" : "Not Paid"}
                        </td>
                        <td className="px-6 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowModal(true);
                            }}
                            className="mx-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                          >
                            <TbUserQuestion className="font-bold" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No readings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

export default UserReadings;
