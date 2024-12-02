import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
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
        <form className="max-w-lg mx-auto shadow-lg border-gray-200 border-solid rounded-lg p-8 border">
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="john.doe@gmail.com"
              required
            />
          </div>
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto sm:w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
