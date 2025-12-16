import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadStatusModal from "./UploadStatusModal";
import StatusViewerModal from "./StatusViewerModal";
import { useAuth } from "../../context/AuthProvider";
import { CiCirclePlus } from "react-icons/ci";

const StatusList = ({ groupId }) => {
    const [statuses, setStatuses] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [viewingUserStatuses, setViewingUserStatuses] = useState(null); // { statuses: [], initialIndex: 0 }
    const [authUser] = useAuth();

    useEffect(() => {
        fetchStatuses();
    }, [groupId]);

    const fetchStatuses = async () => {
        try {
            const res = await axios.get(`/api/status/group/${groupId}`);
            setStatuses(res.data);
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };

    // Group statuses by user
    const groupedStatuses = statuses.reduce((acc, status) => {
        if (!status?.userId) return acc; // Skip orphan statuses
        const uid = status.userId._id;
        if (!acc[uid]) {
            acc[uid] = {
                user: status.userId,
                statuses: []
            };
        }
        acc[uid].statuses.push(status);
        return acc;
    }, {});

    const myId = authUser.user._id;
    const myStatuses = groupedStatuses[myId]?.statuses || [];
    const otherUsers = Object.values(groupedStatuses).filter(g => g.user._id !== myId);

    const handleView = (userStatuses) => {
        setViewingUserStatuses({
            statuses: userStatuses,
            initialIndex: 0 // Always start from first for now, could optimize to first unviewed
        });
    };

    return (
        <div className="flex items-center gap-4 py-4 px-4 border-b border-[var(--border-subtle)] overflow-x-auto custom-scrollbar bg-[var(--bg-primary)]">
            {/* My Status */}
            <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => myStatuses.length > 0 ? handleView(myStatuses) : setIsUploadOpen(true)}>
                <div className={`w-14 h-14 rounded-full p-[2px] ${myStatuses.length > 0 ? 'border-2 border-[var(--accent-primary)]' : 'border-2 border-dashed border-[var(--text-secondary)]'}`}>
                    <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden relative">
                        {myStatuses.length > 0 ? (
                            myStatuses[0].mediaType === 'video' ? (
                                <video src={myStatuses[0].mediaUrl} className="w-full h-full object-cover" />
                            ) : (
                                <img src={myStatuses[0].mediaUrl} alt="My Status" className="w-full h-full object-cover" />
                            )
                        ) : (
                            <CiCirclePlus className="text-2xl text-[var(--text-secondary)]" />
                        )}
                    </div>
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-medium">My Status</span>
            </div>

            {/* Add Status Button (if I have statuses already, show a separate plus) */}
            {myStatuses.length > 0 && (
                <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => setIsUploadOpen(true)}>
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[var(--text-secondary)] flex items-center justify-center hover:border-[var(--text-primary)] transition-colors">
                        <CiCirclePlus className="text-2xl text-[var(--text-primary)]" />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">Add</span>
                </div>
            )}

            <div className="w-[1px] h-10 bg-[var(--border-subtle)] mx-2"></div>

            {/* Other Users */}
            {otherUsers.map((group) => {
                const hasUnviewed = group.statuses.some(s => !s.viewers.some(v => v._id === myId));
                const latestStatus = group.statuses[0]; // Assuming sorted by newest first from backend

                return (
                    <div key={group.user._id} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => handleView(group.statuses)}>
                        <div className={`w-14 h-14 rounded-full p-[2px] ${hasUnviewed ? 'border-2 border-green-500' : 'border-2 border-[var(--border-subtle)]'}`}>
                            <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden relative">
                                {latestStatus.mediaType === 'video' ? (
                                    <video src={latestStatus.mediaUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={latestStatus.mediaUrl} alt="User Status" className="w-full h-full object-cover" />
                                )}
                            </div>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] w-16 truncate text-center">
                            {group.user?.fullname ? group.user.fullname.split(' ')[0] : "User"}
                        </span>
                    </div>
                )
            })}

            {/* Modals */}
            {isUploadOpen && (
                <UploadStatusModal
                    groupId={groupId}
                    onClose={() => setIsUploadOpen(false)}
                    onSuccess={fetchStatuses}
                />
            )}

            {viewingUserStatuses && (
                <StatusViewerModal
                    statuses={viewingUserStatuses.statuses}
                    initialIndex={viewingUserStatuses.initialIndex}
                    onClose={() => setViewingUserStatuses(null)}
                    onDelete={fetchStatuses}
                />
            )}
        </div>
    );
};

export default StatusList;
