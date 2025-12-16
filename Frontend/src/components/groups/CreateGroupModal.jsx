import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateGroupModal = ({ onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/group/create", { name, description });
            toast.success("Group created successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create group");
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
                <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">Create Community</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Group Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                            placeholder="e.g. Hikers"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                        <textarea
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all text-[var(--text-primary)] h-32 resize-none placeholder:text-[var(--text-secondary)]"
                            placeholder="What's this group about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                        {loading ? "Creating..." : "Create Group"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
