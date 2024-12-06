import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Sidebar from "../../components/Sidebar";

const MeterReading = () => {
  const [meterReadings, setMeterReadings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://192.168.0.160:8080/api/auth/admin-get-all-meter-readings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "6024"
          },
        }
      );
      const newData = await response.json();
      // console.log("newData ", newData.data);

      if (newData.data.length > 0) {
        setMeterReadings((prevData) => [...prevData, ...newData.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const filteredReadings = meterReadings.filter(
    (reading) =>
      reading.user_meter_map_id.meter_id.toString().includes(searchTerm.toLowerCase()) ||
      reading.reading_id.toString().includes(searchTerm.toLowerCase())
  );

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <div>
        <Sidebar />
        <div className="p-4 sm:ml-52">
          <div className="p-2 rounded-lg dark:border-gray-700 mt-14"></div>
          <div className="flex justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-700 pl-4 pb-2">
                Meter Readings
              </p>
            </div>
            <div>
              {/* <input
                type="search"
                placeholder="Search"
                className="px-2 py-1 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              /> */}
              {/* <input
              type="search"
              placeholder="Search"
              className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}
            </div>
            <div className="pb-3 flex gap-3">
            <input
              type="search"
              placeholder="Search"
              className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <label
                htmlFor="uploadFile1"
                className="flex bg-green-800 hover:bg-green-700 text-white text-base px-4 py-1.5 outline-none rounded-lg w-max cursor-pointer mx-auto font-[sans-serif]"
              >
                <div className="text-center mt-1 mr-1 font-medium">
                  <IoMdAdd />
                </div>
                Add Reading
                <input type="button" id="uploadFile1" className="hidden" />
              </label>
            </div>
          </div>
          <div
            className="relative overflow-x-auto shadow-md sm:rounded-lg"
            onScroll={handleScroll}
          >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Meter ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Meter Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Consumption (kWh)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Bill Paid
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.length > 0 ? (
                  filteredReadings.map((reading) => (
                    <tr
                      key={reading.reading_id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {reading.user_meter_map_id.meter_id}
                      </th>
                      <td className="px-6 py-2">
                        {reading.meter_number}
                      </td>
                      <td className="px-6 py-2">{reading.consumption}</td>
                      <td className="px-6 py-2">
                        {reading.is_bill_paid === 1 ? "True" : "False"}
                      </td>
                      <td className="px-6 py-2 text-center">
                        <button
                          type="button"
                          className="mx-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="mx-1 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {loading && (
              <p className="text-center text-gray-600 mt-4">Loading...</p>
            )}
            {!hasMore && (
              <p className="text-center text-gray-600 mt-4">
                No more data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeterReading;
