import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import useSendMessage from "../../context/useSendMessage.js";

function Typesend() {
  const [message, setMessage] = useState("");
  const { loading, sendMessages } = useSendMessage();

  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    await sendMessages(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-1 h-[8vh] bg-[var(--bg-secondary)] items-center px-4">
        <div className="w-[90%]">
          <input
            type="text"
            placeholder="Type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-white rounded-xl outline-none focus:border-[var(--accent-primary)] px-4 py-3 w-full transition-colors"
          />
        </div>
        <button className="flex items-center justify-center w-[10%]">
          <IoSend className="text-3xl text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors" />
        </button>
      </div>
    </form>
  );
}

export default Typesend;
