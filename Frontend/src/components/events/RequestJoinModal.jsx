import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const RequestJoinModal = ({ event, onClose, onSuccess }) => {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`/api/event/request/${event._id}`, { reason });
            toast.success("Request sent successfully!");
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] w-full max-w-md p-8 relative rounded-2xl shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Join Event</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Request to join <span className="text-[var(--text-primary)] font-semibold">{event.title}</span></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Why do you want to join?</label>
                        <textarea
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all text-[var(--text-primary)] h-32 resize-none placeholder:text-[var(--text-secondary)]"
                            placeholder="I'm interested because..."
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                        {loading ? "Sending..." : "Send Request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestJoinModal;
