import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageRequestsModal = ({ event, onClose, onSuccess }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`/api/event/requests/${event._id}`);
            setRequests(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load requests");
            setLoading(false);
        }
    };

    const handleAction = async (userId, status) => {
        try {
            await axios.post(`/api/event/handle-request/${event._id}`, {
                userId,
                status
            });
            toast.success(status === "approved" ? "User approved" : "User rejected");
            // Refresh list
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.error || "Action failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] w-full max-w-lg p-8 relative rounded-2xl shadow-2xl h-[80vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    ✕
                </button>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Manage Requests</h2>
                    <p className="text-sm text-[var(--text-secondary)]">For event: <span className="font-medium text-[var(--text-primary)]">{event.title}</span></p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-center text-[var(--text-secondary)] py-10">Loading requests...</p>
                    ) : requests.length > 0 ? (
                        requests.map((req) => (
                            <div key={req._id} className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)]">{req.userId.fullname}</h3>
                                        <p className="text-xs text-[var(--text-secondary)]">{req.userId.email}</p>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">Pending</span>
                                </div>
                                <div className="bg-[var(--card-bg)] p-3 rounded-lg text-sm text-[var(--text-secondary)] mb-4 italic border border-[var(--border-subtle)]">
                                    "{req.reason}"
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAction(req.userId._id, "approved")}
                                        className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.userId._id, "rejected")}
                                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] border border-dashed border-[var(--border-subtle)] rounded-xl">
                            <p>No pending requests</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={() => {
                            onSuccess(); // Close and refresh parent
                        }}
                        className="w-full py-3 bg-[var(--text-primary)] text-[var(--card-bg)] rounded-xl font-bold hover:opacity-90 transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageRequestsModal;
