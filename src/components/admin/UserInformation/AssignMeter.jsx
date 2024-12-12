import { useState } from "react";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

const userSchema = z.object({
  username: z.string().min(1, "Name is required"),
  meter_number: z.string().min(1, "Meter number is required"),
  reading_date: z.string(),
  consumption: z.string(),
});

const AssignMeter = ({ user, refreshUsersList, modalOpen, setModalOpen }) => {
  const userRole = localStorage.getItem("roleId");

  const token = localStorage.getItem("userToken");
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    username: user?.username || "",
    meter_number: "",
    reading_date: "",
    consumption: "",
  });

  const clearFormData = () =>
    setFormData({
      username: "",
      meter_number: "",
      reading_date: "",
      consumption: "",
    });

  const [errors, setErrors] = useState({
    username: "",
    meter_number: "",
    reading_date: "",
    consumption: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);

    e.preventDefault();
    console.log("e ", e);

    setErrors({
      username: "",
      meter_number: "",
      reading_date: "",
      consumption: "",
    });

    try {
      userSchema.parse(formData);
      console.log("formData ", formData);

      const updatedFormData = {
        consumption: formData.consumption,
        meter_number: formData.meter_number,
        reading_date: formData.reading_date,
      };

      const response = await fetch(
        `${BASE_URL}/api/auth/admin-create-meter-reading/${user.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.ok) {
        toast.success("Meter Assign Successful.")
        toggleModal();
        setIsLoading(false);
        const data = await response.json();        
        toast.info(data.message);

        setTimeout(() => {
          toggleModal();
          clearFormData();
          refreshUsersList();
        }, 800);
      } else {
        setIsLoading(false);
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (err) {
      setIsLoading(false);

      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
      }
    }
  };

  const toggleModal = () => {
    if (!modalOpen) {
      setErrors({
        username: "",
        meter_number: "",
        reading_date: "",
        consumption: "",
      });
      clearFormData();
    }
    setModalOpen((prevState) => !prevState);
  };

  return (
    <div>
      {!modalOpen && (
        <div className="flex backdrop-blur-sm justify-center items-center overflow-y-auto overflow-x-hidden fixed z-50 md:inset-1 h-[calc(100%-1rem)] max-h-full">
          <div className="relative p-4 w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assign Meter
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                  onClick={toggleModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="flex justify-between">
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          User Name
                        </label>
                      </div>
                      <div>
                        {errors.username && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.username}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      disabled
                      name="username"
                      id="name"
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-not-allowed"
                      placeholder="john.doe"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex justify-between">
                      <div>
                        <label
                          htmlFor="meter_number"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Meter Number
                        </label>
                      </div>
                      <div>
                        {errors.meter_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.meter_number}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      name="meter_number"
                      id="meter_number"
                      value={formData.meter_number}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="MTR-001"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex justify-between">
                      <div>
                        <label
                          htmlFor="date"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Date
                        </label>
                      </div>
                      <div>
                        {errors.reading_date && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.reading_date}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      type="date"
                      name="reading_date"
                      id="date"
                      value={formData.reading_date}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="MTR-001"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex justify-between">
                      <div>
                        <label
                          htmlFor="consumption"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Consumption (kWh)
                        </label>
                      </div>
                      <div>
                        {errors.consumption && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.consumption}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      name="consumption"
                      id="consumption"
                      placeholder="100"
                      value={formData.consumption}
                      onChange={handleChange}
                      className="bg-gray-50 border resize-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 w-[40%] justify-center focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                  >
                    {isLoading && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    Assign Meter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AssignMeter;
