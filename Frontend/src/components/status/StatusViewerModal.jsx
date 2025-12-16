import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-hot-toast";

const StatusViewerModal = ({ statuses, initialIndex, onClose, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [viewerListOpen, setViewerListOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = React.useRef(new Audio());
    const [authUser] = useAuth();

    const status = statuses[currentIndex];
    const isOwner = status?.userId?._id === authUser.user._id;

    console.log("StatusViewerModal status:", status);

    useEffect(() => {
        if (status) {
            // Mark as viewed
            axios.post(`/api/status/view/${status._id}`).catch(err => console.error(err));

            // Handle Music
            if (status.musicTrack) {
                audioRef.current.src = status.musicTrack;
                audioRef.current.loop = true;
                audioRef.current.muted = isMuted;
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            } else {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        }

        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
        };
    }, [status]); // Effect runs when status changes

    useEffect(() => {
        audioRef.current.muted = isMuted;
    }, [isMuted]);

    const handleNext = () => {
        if (currentIndex < statuses.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setViewerListOpen(false);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setViewerListOpen(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/status/delete/${status._id}`);
            toast.success("Status deleted");
            onDelete(); // Refresh parent
            onClose();
        } catch (error) {
            toast.error("Failed to delete status");
        }
    };

    if (!status) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
            {/* Top Bar */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500">
                        {/* Placeholder avatar if no user image */}
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold">
                            {status?.userId?.fullname ? status.userId.fullname[0] : "?"}
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-bold">{status?.userId?.fullname || "Unknown User"}</p>
                        <p className="text-gray-300 text-xs">{formatDistanceToNow(new Date(status.createdAt))} ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {status.musicTrack && (
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition-colors">
                            {isMuted ? "🔇" : "🔊"}
                        </button>
                    )}
                    <button onClick={onClose} className="text-white text-2xl px-4">✕</button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 w-full max-w-3xl flex items-center justify-center relative">
                {/* Navigation Areas */}
                <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" onClick={handlePrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer" onClick={handleNext}></div>

                {status.mediaType === "video" ? (
                    <video src={status.mediaUrl} className="max-h-full max-w-full object-contain" autoPlay controls={false} onEnded={handleNext} />
                ) : (
                    <img src={status.mediaUrl} alt="Status" className="max-h-full max-w-full object-contain" />
                )}

                {status.caption && (
                    <div className="absolute bottom-20 bg-black/50 px-4 py-2 rounded-full text-white text-md">
                        {status.caption}
                    </div>
                )}
            </div>

            {/* Bottom Bar (Owner Actions) */}
            {isOwner && (
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center gap-4 z-20">
                    <div
                        className="flex items-center gap-2 text-white cursor-pointer hover:bg-white/10 px-4 py-2 rounded-full transition-all"
                        onClick={() => setViewerListOpen(!viewerListOpen)}
                    >
                        <span>👁 {status.viewers.length} views</span>
                        <svg className={`w-4 h-4 transition-transform ${viewerListOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {viewerListOpen && (
                        <div className="w-full max-w-sm bg-[var(--card-bg)] rounded-xl p-4 max-h-48 overflow-y-auto custom-scrollbar border border-[var(--border-subtle)] animate-slide-up">
                            <h4 className="text-[var(--text-secondary)] text-xs uppercase mb-2">Viewed by</h4>
                            {status.viewers.length > 0 ? (
                                status.viewers.map(viewer => (
                                    <div key={viewer._id || Math.random()} className="flex items-center gap-3 py-2 border-b border-[var(--border-subtle)] last:border-0">
                                        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs text-[var(--text-primary)]">
                                            {viewer?.fullname ? viewer.fullname[0] : "?"}
                                        </div>
                                        <span className="text-[var(--text-primary)] text-sm">{viewer?.fullname || "Unknown User"}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[var(--text-secondary)] text-sm text-center">No views yet</p>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleDelete}
                        className="text-red-500 text-sm hover:underline mt-2"
                    >
                        Delete Status
                    </button>
                </div>
            )}
        </div>
    );
};

export default StatusViewerModal;
