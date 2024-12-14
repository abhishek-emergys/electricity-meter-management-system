import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../services/redux/slices/authSlice";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../assets/images/icons/utils/Loader";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "User name is required")
    .min(2, "User name must be at least 2 characters")
    .max(30, "User name must be at most 30 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  address: z.string().min(1, "Address is required"),
  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    setErrors({});

    try {
      registerSchema.parse(formData);

      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        return;
      }

      const { confirmPassword, ...userData } = formData;

      const resultAction = await dispatch(registerUser(userData));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload.message, {
          position: "top-center",
        });

        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else if (registerUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Registration failed", {
          position: "top-center",
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 items-center 0">
        <div>
          <img
            src="src/assets/images/favicon.png"
            className="h-16 pt-2"
            alt="Meter Wise Logo"
          />
        </div>
        <div className="text-center gap-10 mb-8">
          <p className="text-3xl font-bold">Create a new account</p>
          <span className="text-blue-500">
            Or{" "}
            <Link to="/login">
              <span className="text-lg font-semibold">
                login to your account
              </span>
            </Link>
          </span>
        </div>
      </div>
      <div>
        <form
          className="max-w-2xl mx-auto shadow-lg border-gray-200 border-solid rounded-lg p-8 border"
          onSubmit={handleSubmit}
        >
          {/* USER_NAME */}
          <div className="flex w-full justify-between">
            <div className="mb-5">
              <label
                htmlFor="user-name"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                User Name
              </label>
              <input
                type="text"
                id="user-name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[22vw] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John Doe"
              />
              {errors.username && (
                <p className="text-red-500 text-sm ">{errors.username}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                Email Address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[22vw] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="john.doe@gmail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm ">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[22vw] p-2.5 "
              />
              {errors.password && (
                <p className="text-red-500 text-sm ">{errors.password}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[22vw] p-2.5"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm ">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="mb-5">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-600 "
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[22vw] p-2.5"
                placeholder="Pune city"
              />
              {errors.address && (
                <p className="text-red-500 text-sm ">{errors.address}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="pincode"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[22vw] p-2.5 "
                placeholder="411001"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm ">{errors.pincode}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center text-center">
            <button
              type="submit"
              className="my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/3 px-5 py-2.5 text-center"
            >
              <div className="flex justify-center">
                {isLoading && <Loader />} Create Account
              </div>
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;
