import React from "react";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";
import ThemeToggle from "../../components/ThemeToggle";
import About from "../../components/About";
import { FaInfoCircle } from "react-icons/fa";

import logo from "../../assets/logo.svg";

function Left() {
  return (
    <div className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CircleUp Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-[var(--accent-primary)]">CircleUp</h1>
          <button
            onClick={() => document.getElementById('about_modal').showModal()}
            className="btn btn-ghost btn-circle btn-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
            title="About Us"
          >
            <FaInfoCircle />
          </button>
        </div>
        <ThemeToggle />
      </div>
      <About />
      <Search />
      <div
        className=" flex-1  overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <Users />
      </div>
      <Logout />
    </div>
  );
}

export default Left;
