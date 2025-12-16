import React from "react";

function Message({ message }) {
  const authUser = JSON.parse(localStorage.getItem("ChatApp"));
  // console.log("Message Debug:", message.senderId);
  const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
  const itsMe = senderId === authUser.user._id;
  const senderName = typeof message.senderId === 'object' ? message.senderId.fullname : null;

  const chatName = itsMe ? " chat-end" : "chat-start";
  // const chatColor = itsMe ? "bg-blue-500" : "";
  const chatColor = itsMe ? "bg-[var(--accent-primary)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)]";

  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div>
      <div className="p-4">
        <div className={`chat ${chatName}`}>
          <div className={`chat-bubble ${chatColor} shadow-md`}>
            {senderName && (
              <div className={`text-xs font-bold mb-1 opacity-90 block ${itsMe ? "text-white/80" : "text-[var(--accent-primary)]"}`}>
                {senderName} {itsMe && "(You)"}
              </div>
            )}
            {message.message}
          </div>
          <div className="chat-footer text-xs opacity-50 mt-1 text-[var(--text-secondary)]">{formattedTime}</div>
        </div>
      </div>
    </div>
  );
}

export default Message;
