import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
// import musicTracks from "../../utils/musicConfig";
import { saveAudio } from "../../utils/db";

const UploadStatusModal = ({ groupId, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [selectedMusic, setSelectedMusic] = useState("");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select a file");

        setLoading(true);
        let musicTrackId = "";

        // Handle local music upload
        if (selectedMusic && typeof selectedMusic === 'object') {
            try {
                musicTrackId = await saveAudio(selectedMusic);
            } catch (err) {
                console.error("Failed to save audio locally", err);
                toast.error("Failed to process audio file");
                setLoading(false);
                return;
            }
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);
        formData.append("musicTrack", musicTrackId);
        formData.append("groupId", groupId);

        try {
            await axios.post("/api/status/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Status uploaded!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-bg)] w-full max-w-md p-6 rounded-2xl relative border border-[var(--border-subtle)] max-h-[90vh] overflow-y-auto flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Add to Status</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {preview ? (
                        <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                            {file?.type?.startsWith("video") ? (
                                <video src={preview} className="w-full h-full object-contain" controls />
                            ) : (
                                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                            )}
                            <button
                                type="button"
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-xl h-48 flex flex-col items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <p>Click to upload photo or video</p>
                        </div>
                    )}

                    {/* Music Selector */}
                    <div className="space-y-2">
                        <label className="text-xs text-[var(--text-secondary)] font-medium uppercase">Background Music (Local Only)</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setSelectedMusic(e.target.files[0])}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                        {selectedMusic && <span className="text-xs text-[var(--accent-primary)] truncate block mt-1">{selectedMusic.name}</span>}
                    </div>

                    <input
                        type="text"
                        placeholder="Add a caption..."
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                        {loading ? "Uploading..." : "Share Status"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadStatusModal;
