import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.svg";

function Login() {
  const [authUser, setAuthUser] = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    // console.log(userInfo);
    axios
      .post("/api/user/login", userInfo)
      .then((response) => {
        if (response.data) {
          toast.success("Login successful");
        }
        localStorage.setItem("ChatApp", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Error: " + error.response.data.error);
        }
      });
  };
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-[var(--border-subtle)] px-6 py-8 rounded-2xl space-y-3 w-96 bg-[var(--card-bg)] shadow-xl"
        >
          <div className="flex flex-col items-center gap-2 mb-4">
            <img src={logo} alt="CircleUp Logo" className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-[var(--accent-primary)]">
              CircleUp
            </h1>
          </div>
          <h2 className="text-xl text-[var(--text-secondary)] font-medium text-center mb-4">Login to your account</h2>

          {/* Email */}
          <label className="input input-bordered flex items-center gap-2 bg-[var(--bg-secondary)] border-[var(--border-subtle)] focus-within:border-[var(--accent-primary)] text-[var(--text-primary)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow placeholder-[var(--text-secondary)]"
              placeholder="Email"
              {...register("email", { required: true })}
            />
          </label>
          {errors.email && (
            <span className="text-red-500 text-sm font-semibold">
              This field is required
            </span>
          )}
          {/* Password */}
          <label className="input input-bordered flex items-center gap-2 bg-[var(--bg-secondary)] border-[var(--border-subtle)] focus-within:border-[var(--accent-primary)] text-[var(--text-primary)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow placeholder-[var(--text-secondary)]"
              placeholder="password"
              {...register("password", { required: true })}
            />
          </label>
          {errors.password && (
            <span className="text-red-500 text-sm font-semibold">
              This field is required
            </span>
          )}
          {/* Text & Button */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-[var(--text-secondary)]">
              New user?
              <Link
                to="/signup"
                className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] underline cursor-pointer ml-1 transition-colors"
              >
                Signup
              </Link>
            </p>
            <input
              type="submit"
              value="Login"
              className="text-white px-6 py-2 cursor-pointer rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
