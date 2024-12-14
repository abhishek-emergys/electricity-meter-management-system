import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../services/redux/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import Loader from "../assets/images/icons/utils/Loader";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

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
    setValidationErrors({});

    try {
      loginSchema.parse(formData);

      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        const { role_id, token, message } = resultAction.payload;

        localStorage.setItem("userToken", token);

        toast.success(message, {
          position: "top-center",
        });

        if (role_id === 1) {
          localStorage.setItem("roleId", "admin");
          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
        } else if (role_id === 2) {
          localStorage.setItem("roleId", "user");
          setTimeout(() => {
            navigate("/user-dashboard");
          }, 800);
        } else if (role_id === 3) {
          localStorage.setItem("roleId", "superadmin");
          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
        }
      } else if (loginUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Login failed!", {
          position: "top-center",
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errors);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center mt-10">
        <div>
          <img
            src="src/assets/images/favicon.png"
            className="h-16"
            alt="Meter Wise Logo"
          />
        </div>
        <div className="text-center gap-10 mb-8">
          <p className="text-3xl font-bold">Sign in to your account</p>
          <span className="text-blue-500">
            Or{" "}
            <Link to="/register">
              <span className="text-lg font-semibold">
                create a new user account
              </span>
            </Link>
          </span>
        </div>
      </div>
      <div>
        <form
          className="max-w-lg mx-auto shadow-lg border-gray-200 border-solid rounded-lg p-8 border"
          onSubmit={handleSubmit}
        >
          <div className="mb-5">
            <div className="flex justify-between">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="john.doe@gmail.com"
            />
          </div>

          <div className="mb-5">
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Password
              </label>
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/3 px-5 py-2.5 text-center"
            >
              <div className="flex justify-center">
                {isLoading && <Loader />}Login
              </div>
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  );
};

export default Login;
