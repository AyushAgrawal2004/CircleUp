import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateEventModal = ({ groupId, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [limit, setLimit] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/event/create", {
                title,
                description,
                date,
                location,
                groupId,
                limit
            });
            toast.success("Event created successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create event");
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
                <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">Plan an Event</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Event Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-secondary)]"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
                        <textarea
                            required
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-secondary)] resize-none h-24"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Member Limit</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0 for unlimited"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-secondary)]"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                        <input
                            type="text"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-secondary)]"
                            placeholder="Online or Address"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-4 text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;
