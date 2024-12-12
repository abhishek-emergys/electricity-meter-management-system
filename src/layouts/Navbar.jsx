import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const Navbar = ({ setUserId }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();
  const userRole = localStorage.getItem("roleId");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}/api/auth/user-profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "6024",
      },
    });
    const newData = await response.json();
    setName(newData.profile[0].username);
    setEmail(newData.profile[0].email);
    setUserId(newData.profile[0].user_id);
  };

  useEffect(() => {
    fetchUser();

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const confirm = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to do logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    });

    if (confirm.isConfirmed) {
      const showSuccessMessage = () => {
        toast.success("Logout successful.", {
          position: "top-center",
        });
      };

      showSuccessMessage();
      localStorage.removeItem("userToken");
      setTimeout(() => {
        Navigate("/login");
      }, 800);
    }
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
          <Link
            to={userRole === "user" ? "/user-dashboard" : "/dashboard"}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="src/assets/images/favicon.png"
              className="h-8"
              alt="MeterWise Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Meter Wise
            </span>
          </Link>

          <div
            ref={avatarButtonRef}
            className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
            id="avatarButton"
            onClick={toggleDropdown}
          >
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
          </div>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              id="userDropdown"
              className="z-20 mt-[11rem] mr-4 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>{name}</div>
                <div className="font-medium truncate">{email}</div>
              </div>
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="avatarButton"
              >
                <li>
                  {/* <Link className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link> */}
                </li>
              </ul>
              <div className="py-1">
                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                  onClick={handleSignOut}
                >
                  Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Toaster />
    </div>
  );
};

export default Navbar;
