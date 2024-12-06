import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const Navigate = useNavigate();
  const [isLoding, setIsLoding] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name ", name, " ", "value ", value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoding(true);
    e.preventDefault();
    setErrors({
      email: "",
      password: "",
    });

    try {
      loginSchema.parse(formData);

      const response = await fetch(
        "http://192.168.0.160:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setIsLoding(false);
        const data = await response.json();

        const showSuccessMessage = () => {
          toast.success(data.message, {
            position: "top-center",
          });
        };

        showSuccessMessage();

        setTimeout(() => {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("roleId", data.role_id);
          Navigate("/dashboard");
        }, 800);

      } else {
        setIsLoding(false);
        const errorData = await response.json();

        const showSuccessMessage = () => {
          toast.error(errorData.message, {
            position: "top-center",
            autoClose: 1500,
          });
        };
        showSuccessMessage();
      }
    } catch (err) {
      setIsLoding(false);
      // const showSuccessMessage = () => {
      //   toast.error('Invalid credentials', {
      //     position: "top-center",
      //   });
      // };

      // showSuccessMessage();
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
    <>
      <ToastContainer />
      <div className="flex flex-col gap-4 items-center mt-10">
        <div>
          <img
            src="public/favicon.png"
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
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-600 "
                >
                  Email Address
                </label>
              </div>
              <div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="john.doe@gmail.com"
            />
          </div>

          <div className="mb-5">
            <div className="flex justify-between">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-600 "
                >
                  Password
                </label>
              </div>
              <div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto sm:w-1/3 px-5 py-2.5 text-center "
            >
              {isLoding && (
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
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
