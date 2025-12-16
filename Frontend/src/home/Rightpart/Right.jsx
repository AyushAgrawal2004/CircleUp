import React, { useEffect } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Typesend from "./Typesend";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../context/AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";
import logo from "../../assets/logo.svg";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return setSelectedConversation(null);
  }, [setSelectedConversation]);
  return (
    <div className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div>
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <>
            <Chatuser />
            <div
              className=" flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(92vh - 8vh)" }}
            >
              <Messages />
            </div>
            <Typesend />
          </>
        )}
      </div>
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="relative">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden absolute left-5"
        >
          <CiMenuFries className="text-[var(--accent-primary)] text-xl" />
        </label>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-center text-[var(--text-primary)]">
              Welcome{" "}
              <span className="font-bold text-2xl text-[var(--accent-primary)]">
                {authUser.user.fullname}
              </span>
              <br />
              <span className="text-[var(--text-secondary)]">No chat selected, please start conversation by selecting anyone to
                your contacts</span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};
