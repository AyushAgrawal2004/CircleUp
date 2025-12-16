import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CreateGroupModal from "../../components/groups/CreateGroupModal";
import RequestJoinModal from "../../components/events/RequestJoinModal";
import ManageRequestsModal from "../../components/events/ManageRequestsModal";
import { useAuth } from "../../context/AuthProvider";
import { CiSearch, CiCirclePlus } from "react-icons/ci";
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("communities"); // 'communities' or 'events'
    const [myGroups, setMyGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [requestEvent, setRequestEvent] = useState(null); // Event triggering request modal
    const [manageEvent, setManageEvent] = useState(null); // Event triggering management modal
    const [authUser] = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [myRes, allRes, eventsRes] = await Promise.all([
                axios.get("/api/group/my"),
                axios.get("/api/group/all"),
                axios.get("/api/event/all")
            ]);
            setMyGroups(myRes.data);
            setAllGroups(allRes.data);
            setAllEvents(eventsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const filteredExploreGroups = allGroups.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredEvents = allEvents.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                        Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Welcome back, <span className="text-[var(--accent-primary)] font-medium">{authUser?.user?.fullname}</span>.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-secondary)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {activeTab === 'communities' && (
                        <button
                            onClick={() => setIsGroupModalOpen(true)}
                            className="px-5 py-2.5 rounded-full text-sm flex items-center gap-2 whitespace-nowrap text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                            <CiCirclePlus className="text-lg" />
                            Create
                        </button>
                    )}
                </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-12 border-b border-[var(--border-subtle)]">
                <button
                    onClick={() => setActiveTab("communities")}
                    className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'communities' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    Communities
                    {activeTab === 'communities' && <span className="absolute bottom-0 left-0 w-full h-[2px]" style={{ backgroundColor: 'var(--accent-primary)' }}></span>}
                </button>
                <button
                    onClick={() => setActiveTab("events")}
                    className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'events' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    Explore Events
                    {activeTab === 'events' && <span className="absolute bottom-0 left-0 w-full h-[2px]" style={{ backgroundColor: 'var(--accent-primary)' }}></span>}
                </button>
            </div>

            {activeTab === 'communities' ? (
                <>
                    {/* My Communities */}
                    <section className="mb-20">
                        <h2 className="text-lg font-medium text-[var(--text-secondary)] mb-6 uppercase tracking-wider text-xs">My Communities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {myGroups.length > 0 ? (
                                myGroups.map((group) => (
                                    <Link to={`/group/${group._id}`} key={group._id} className="group relative bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl p-6 hover:border-[var(--accent-primary)] transition-all hover:translate-y-[-2px] shadow-sm">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-lg font-bold text-[var(--text-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-colors">
                                                {group.name[0]}
                                            </div>
                                            <span className="text-[10px] bg-[var(--bg-secondary)] px-2 py-1 rounded-full text-[var(--text-secondary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-colors">{group.members.length} members</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{group.name}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{group.description}</p>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-12 border border-dashed border-[var(--border-subtle)] rounded-xl flex flex-col items-center justify-center text-[var(--text-secondary)]">
                                    <p>You haven't joined any communities yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Explore Section */}
                    <section>
                        <div className="flex justify-between items-end mb-8 border-b border-[var(--border-subtle)] pb-4">
                            <h2 className="text-lg font-medium text-[var(--text-secondary)] uppercase tracking-wider text-xs">Explore</h2>
                            <span className="text-xs text-[var(--text-secondary)]">{allGroups.length} total communities</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExploreGroups.length > 0 ? (
                                filteredExploreGroups.map((group) => {
                                    const isMember = myGroups.some(mg => mg._id === group._id);
                                    return (
                                        <div key={group._id} className="flex gap-6 p-6 rounded-xl hover:bg-[var(--bg-secondary)] transition-all border border-transparent hover:border-[var(--border-subtle)] group">
                                            <div className="w-16 h-16 rounded-xl bg-[var(--card-bg)] flex-shrink-0 flex items-center justify-center text-2xl font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors">
                                                {group.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-[var(--text-primary)] truncate pr-4">{group.name}</h3>
                                                    {isMember ? (
                                                        <Link to={`/group/${group._id}`} className="text-xs font-medium text-white bg-[var(--text-secondary)] px-3 py-1.5 rounded-full hover:bg-[var(--accent-primary)] transition-colors">Open</Link>
                                                    ) : (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await axios.post(`/api/group/join/${group._id}`);
                                                                    fetchData();
                                                                    toast.success("Joined group!");
                                                                } catch (e) { console.error(e); }
                                                            }}
                                                            className="text-xs font-medium text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                                                            style={{ backgroundColor: 'var(--accent-primary)' }}
                                                        >
                                                            Join
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] mb-3">by {group.admin?.fullname}</p>
                                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{group.description}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-[var(--text-secondary)]">No communities match your search.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            ) : (
                /* Events Tab */
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => {
                                const isAttending = event.attendees.some(a => a._id === authUser.user._id);
                                const isFull = event.limit > 0 && event.attendees.length >= event.limit;
                                const isCreator = event.createdBy === authUser.user._id;
                                const hasPendingRequest = event.requests.some(r => r.userId === authUser.user._id);
                                const pendingCount = event.requests.length;

                                return (
                                    <div key={event._id} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl p-6 hover:border-[var(--accent-primary)] transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-medium text-[var(--accent-primary)] bg-[var(--bg-secondary)] px-2 py-1 rounded">{event.group?.name || "Community Event"}</span>
                                            {isFull && !isAttending && !isCreator && <span className="text-xs font-bold text-red-500">FULL</span>}
                                            {isCreator && pendingCount > 0 && <span className="text-xs font-bold text-yellow-500">{pendingCount} Requests</span>}
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{event.title}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">{event.description}</p>

                                        <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-6">
                                            <div className="flex justify-between">
                                                <span>Date</span>
                                                <span className="text-[var(--text-primary)]">{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Location</span>
                                                <span className="text-[var(--text-primary)]">{event.location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Attendees</span>
                                                <span className="text-[var(--text-primary)]">
                                                    {event.attendees.length}
                                                    {event.limit > 0 && ` / ${event.limit} `}
                                                </span>
                                            </div>
                                        </div>

                                        {isCreator ? (
                                            <button
                                                onClick={() => setManageEvent(event)}
                                                className="w-full py-2.5 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
                                                style={{ backgroundColor: 'var(--accent-primary)' }}
                                            >
                                                Manage Requests {pendingCount > 0 && `(${pendingCount})`}
                                            </button>
                                        ) : isAttending ? (
                                            <button disabled className="w-full py-2.5 rounded-lg bg-green-50 text-green-600 text-sm font-medium cursor-default border border-green-200">
                                                Attending
                                            </button>
                                        ) : hasPendingRequest ? (
                                            <button disabled className="w-full py-2.5 rounded-lg bg-yellow-50 text-yellow-600 text-sm font-medium cursor-default border border-yellow-200">
                                                Request Sent
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setRequestEvent(event)}
                                                disabled={isFull}
                                                className="w-full py-2.5 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ backgroundColor: 'var(--accent-primary)' }}
                                            >
                                                {isFull ? "Event Full" : "Request to Join"}
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-[var(--text-secondary)]">No events found.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {isGroupModalOpen && (
                <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} onSuccess={fetchData} />
            )}

            {requestEvent && (
                <RequestJoinModal
                    event={requestEvent}
                    onClose={() => setRequestEvent(null)}
                    onSuccess={() => {
                        fetchData();
                        setRequestEvent(null);
                    }}
                />
            )}

            {manageEvent && (
                <ManageRequestsModal
                    event={manageEvent}
                    onClose={() => setManageEvent(null)}
                    onSuccess={() => {
                        fetchData();
                        setManageEvent(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
