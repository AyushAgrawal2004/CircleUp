
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Messages from "../../home/Rightpart/Messages";
import Typesend from "../../home/Rightpart/Typesend";
import useConversation from "../../zustand/useConversation";
import { useAuth } from "../../context/AuthProvider";
import { useSocketContext } from "../../context/SocketContext";
import CreateEventModal from "../../components/events/CreateEventModal";
import StatusList from "../../components/status/StatusList";
import { toast } from "react-hot-toast";

const GroupPage = () => {
    const { id } = useParams();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const [group, setGroup] = useState(null);
    const [events, setEvents] = useState([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const { socket } = useSocketContext();
    const [authUser] = useAuth();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const res = await axios.get(`/api/group/${id}`);
                setGroup(res.data);
                setSelectedConversation({ ...res.data, isGroup: true, _id: res.data._id });
            } catch (error) {
                console.error("Error fetching group:", error);
                toast.error("Failed to load group");
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await axios.get(`/api/event/group/${id}`);
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchGroupDetails();
        fetchEvents();

        if (socket) {
            socket.emit("joinGroup", id);
        }

        return () => {
            setSelectedConversation(null);
        };
    }, [id, setSelectedConversation, socket]);

    const handleJoinEvent = async (eventId) => {
        try {
            await axios.post(`/api/event/join/${eventId}`);
            toast.success("Joined event!");
            const res = await axios.get(`/api/event/group/${id}`);
            setEvents(res.data);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to join event");
        }
    }

    if (!group) return <div className="flex h-screen items-center justify-center text-[var(--text-secondary)]">Loading community...</div>;

    return (
        <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden font-inter">
            {/* Left Side - Chat */}
            <div className="flex-1 flex flex-col border-r border-[var(--border-subtle)] relative">
                <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex justify-between items-center z-10 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">&larr;</Link>
                            {group.name}
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)] ml-7">{group.members.length} members</p>
                    </div>
                </div>

                {/* Status Section */}
                <StatusList groupId={id} />

                <div className="flex-1 overflow-hidden relative bg-[var(--bg-primary)] flex flex-col">
                    <Messages />
                </div>

                <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
                    <Typesend />
                </div>
            </div>

            {/* Right Side - Events & Info */}
            <div className="w-80 lg:w-96 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] p-6 overflow-y-auto hidden md:block">
                <div className="mb-10 text-center">
                    <div className="w-20 h-20 mx-auto bg-[var(--card-bg)] rounded-2xl flex items-center justify-center text-3xl font-bold text-[var(--accent-primary)] mb-4 border border-[var(--border-subtle)] shadow-lg">
                        {group.name[0]}
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{group.name}</h2>
                    <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed">{group.description}</p>
                </div>

                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--text-secondary)]">Upcoming Events</h3>
                        <button onClick={() => setIsEventModalOpen(true)} className="text-xs text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--accent-primary)' }}>
                            + Plan Event
                        </button>
                    </div>

                    <div className="space-y-4">
                        {events.length > 0 ? events.map(event => (
                            <div key={event._id} className="bg-[var(--card-bg)] p-5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors group">
                                <h4 className="font-bold text-[var(--text-primary)] mb-1">{event.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-3">
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{event.location || "Online"}</span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{event.description}</p>
                                <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)]">
                                    <span className="text-xs text-[var(--text-secondary)]">{event.attendees.length} attending</span>
                                    <button
                                        onClick={() => handleJoinEvent(event._id)}
                                        disabled={event.attendees.map(a => a._id || a).includes(authUser.user._id)}
                                        className="text-xs font-medium disabled:text-[var(--text-secondary)] hover:opacity-80 transition-opacity"
                                        style={{ color: event.attendees.map(a => a._id || a).includes(authUser.user._id) ? 'var(--text-secondary)' : 'var(--accent-primary)' }}
                                    >
                                        {event.attendees.map(a => a._id || a).includes(authUser.user._id) ? "Attending" : "Join Event"}
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 border border-dashed border-[var(--border-subtle)] rounded-xl">
                                <p className="text-[var(--text-secondary)] text-sm">No upcoming events.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-4">Members</h3>
                    <div className="space-y-1">
                        {group.members.slice(0, 10).map(member => (
                            <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors group">
                                <div className="w-8 h-8 bg-[var(--card-bg)] rounded-full flex items-center justify-center text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                                    {member.fullname ? member.fullname[0] : "?"}
                                </div>
                                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{member.fullname}</span>
                            </div>
                        ))}
                        {group.members.length > 10 && <p className="text-xs text-[var(--text-secondary)] pl-2 mt-2">and {group.members.length - 10} more...</p>}
                    </div>
                </div>
            </div>

            {isEventModalOpen && (
                <CreateEventModal
                    groupId={id}
                    onClose={() => setIsEventModalOpen(false)}
                    onSuccess={() => {
                        const fetchEvents = async () => {
                            const res = await axios.get(`/api/event/group/${id}`);
                            setEvents(res.data);
                        };
                        fetchEvents();
                    }}
                />
            )}
        </div>
    );
};

export default GroupPage;
