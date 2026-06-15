import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase-client";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "../services/notificationService";
import { FaProjectDiagram } from "react-icons/fa";
import Header from "../components/profile/Header";
import toast from "react-hot-toast";
import {
  FaBell,
  FaBullhorn,
  FaCalendarCheck,
  FaTasks,
  FaNewspaper,
  FaTrophy,
  FaCheckDouble,
  FaArrowLeft,
  FaEnvelopeOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// ─── Notification type config ─────────────────────────────
const NOTIFICATION_TYPES = {
  broadcast: {
    label: "Broadcast",
    icon: FaBullhorn,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badgeBg: "bg-orange-100",
  },
  event_reminder: {
    label: "Event",
    icon: FaCalendarCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badgeBg: "bg-blue-100",
  },
  task_assignment: {
    label: "Task",
    icon: FaTasks,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeBg: "bg-emerald-100",
  },
  newsletter: {
    label: "Newsletter",
    icon: FaNewspaper,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badgeBg: "bg-purple-100",
  },
  recognition: {
    label: "Recognition",
    icon: FaTrophy,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badgeBg: "bg-amber-100",
  },
};

const PRIORITY_CONFIG = {
  urgent: {
    badge: "bg-red-50 text-red-600 border-red-100",
    label: "Urgent",
    pulse: true,
  },
  high: {
    badge: "bg-orange-50 text-orange-600 border-orange-100",
    label: "High",
    pulse: false,
  },
  normal: {
    badge: "bg-gray-50 text-gray-500 border-gray-100",
    label: "Normal",
    pulse: false,
  },
  low: {
    badge: "bg-gray-50 text-gray-400 border-gray-100",
    label: "Low",
    pulse: false,
  },
};

// ─── Relative time helper ─────────────────────────────────
const getRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Event date formatter helper ──────────────────────────
const getEventDateBadge = (dateStr) => {
  if (!dateStr) return null;
  
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Parse the date string - handle both "YYYY-MM-DD" and full ISO formats
    const eventDate = new Date(dateStr);
    
    // Set all times to midnight for accurate date comparison
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowMidnight = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const eventDateMidnight = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    if (eventDateMidnight.getTime() === todayMidnight.getTime()) {
      return "Today";
    } else if (eventDateMidnight.getTime() === tomorrowMidnight.getTime()) {
      return "Tomorrow";
    } else {
      return eventDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: eventDate.getFullYear() === today.getFullYear() ? undefined : "numeric",
      });
    }
  } catch (err) {
    console.error("Error formatting event date:", err);
    return null;
  }
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  // ─── Load user & notifications ────────────────────────
  useEffect(() => {
    let channel = null;

    const init = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser?.email) {
          navigate("/signin");
          return;
        }

        // Fetch profile info to pass to Header
        const { data: userData } = await supabase
          .schema("me_dataspace")
          .from("users")
          .select("*")
          .eq("emailID", authUser.email)
          .single();

        if (userData) setUser(userData);

        // Fetch notifications
        const data = await fetchNotifications(authUser.email);
        setNotifications(data || []);
        setLoading(false);

        // Subscribe to real-time notifications
        channel = subscribeToNotifications((newNotification) => {
          if (
            newNotification.target === "all" ||
            newNotification.target === authUser.email
          ) {
            setNotifications((prev) => [
              { ...newNotification, is_read: false },
              ...prev,
            ]);
          }
        });
      } catch (err) {
        console.error("Error loading notifications:", err);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (channel) unsubscribeFromNotifications(channel);
    };
  }, [navigate]);

  // ─── Actions ──────────────────────────────────────────
  const handleMarkAsRead = async (notificationId) => {
    if (!user?.emailID) return;
    const success = await markAsRead(notificationId, user.emailID);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    if (!user?.emailID || markingAll) return;
    setMarkingAll(true);
    const success = await markAllAsRead(user.emailID);
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    }
    setMarkingAll(false);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    setExpandedId((prev) =>
      prev === notification.id ? null : notification.id,
    );
  };

  // ─── Filtering ────────────────────────────────────────
  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : activeFilter === "project"
        ? notifications.filter((n) => n.metadata?.parent_project_id)
        : activeFilter === "event"
          ? notifications.filter((n) => n.metadata?.event_id)
          : notifications.filter((n) => n.type === activeFilter);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filterTabs = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "project",
      label: "Project",
      count: notifications.filter((n) => n.metadata?.parent_project_id).length,
    },
    {
      key: "event",
      label: "Event",
      count: notifications.filter((n) => n.metadata?.event_id).length,
    },
    ...Object.entries(NOTIFICATION_TYPES)
      .filter(([key]) => key !== "event_reminder")
      .map(([key, config]) => ({
        key,
        label: config.label,
        count: notifications.filter((n) => n.type === key).length,
      })),
  ];

  return (
    <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <Header
        user={user}
        bgcolour="bg-[#FAF7F2]"
        tcolour="text-[#A64200]"
        logout="block"
        logo="block"
      />

      {/* Scrollable Content Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* ─── Premium Main Content Card ─────────────────── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col gap-6 w-full">
            {/* Title Header Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/volunteer-profile")}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-[#7A3A00] hover:bg-[#FAF7F2] active:scale-95 transition shadow-sm bg-white"
                  title="Back to Profile"
                >
                  <FaArrowLeft size={14} />
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#8A7060]">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                      : "You are all caught up!"}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markingAll}
                  className="px-5 py-2.5 bg-white text-[#7A3A00] border border-[#7A3A00] rounded-full hover:bg-[#FAF7F2] active:scale-95 transition font-semibold text-xs shadow-sm flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
                >
                  <FaCheckDouble size={12} />
                  {markingAll ? "Marking..." : "Mark all as read"}
                </button>
              )}
            </div>

            {/* Premium Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-50">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-gradient-to-r from-[#7A4310] to-[#E49E5F] text-white border-transparent shadow-md scale-102"
                        : "bg-white text-[#8A7060] border-gray-200 hover:border-[#E49E5F] hover:text-[#7A4310]"
                    }`}
                  >
                    {tab.key !== "all" &&
                      (() => {
                        if (tab.key === "project")
                          return <FaProjectDiagram size={12} />;
                        if (tab.key === "event")
                          return <FaCalendarCheck size={12} />;
                        const TypeIcon = NOTIFICATION_TYPES[tab.key]?.icon;
                        return TypeIcon ? <TypeIcon size={12} /> : null;
                      })()}
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-gray-100 text-[#8A7060]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notification List Area */}
            {loading ? (
              <div className="space-y-4 py-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                  <FaBell className="text-2xl text-[#E49E5F]" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">
                  No notifications
                </h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  {activeFilter === "all"
                    ? "When announcements or alerts are posted, they'll appear here."
                    : `No ${NOTIFICATION_TYPES[activeFilter]?.label?.toLowerCase() || ""} notifications at this time.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((noti) => {
                  const typeCfg =
                    NOTIFICATION_TYPES[noti.type] ||
                    NOTIFICATION_TYPES.broadcast;
                  const priCfg =
                    PRIORITY_CONFIG[noti.priority] || PRIORITY_CONFIG.normal;
                  const TypeIcon = typeCfg.icon;
                  const isExpanded = expandedId === noti.id;

                  return (
                    <div
                      key={noti.id}
                      onClick={() => handleNotificationClick(noti)}
                      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                        noti.is_read
                          ? "bg-[#FAF8F5]/80 border-gray-100 hover:border-gray-200"
                          : "bg-white border-l-4 border-l-[#E49E5F] border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.005]"
                      }`}
                    >
                      <div className="p-4 md:p-5 flex gap-4 items-start">
                        {/* Left: Icon in a gorgeous colored ring */}
                        <div
                          className={`flex-shrink-0 w-11 h-11 rounded-xl ${typeCfg.bg} flex items-center justify-center border ${typeCfg.border} transition-transform duration-300 group-hover:scale-105`}
                        >
                          <TypeIcon className={`text-base ${typeCfg.color}`} />
                        </div>

                        {/* Middle/Right: Info & Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {/* Unread Indicator dot */}
                            {!noti.is_read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
                            )}

                            {/* Title */}
                            <h4
                              className={`text-sm sm:text-base font-bold ${
                                noti.is_read ? "text-gray-600" : "text-gray-900"
                              }`}
                            >
                              {noti.title}
                            </h4>

                            {/* Type/Category Badge */}
                            {noti.metadata?.parent_project_id ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                                <FaProjectDiagram size={8} />
                                Project
                              </span>
                            ) : noti.metadata?.event_id ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                                <FaCalendarCheck size={8} />
                                Event
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${typeCfg.badgeBg} ${typeCfg.color}`}
                              >
                                {typeCfg.label}
                              </span>
                            )}

                            {/* Priority Badge */}
                            {noti.priority !== "normal" && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border flex items-center gap-1 ${priCfg.badge}`}
                              >
                                {priCfg.pulse && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                                )}
                                {priCfg.label}
                              </span>
                            )}

                            {/* Event/Project Date Badge */}
                            {(() => {
                              const eventDate = noti.metadata?.event_date || noti.metadata?.project_date;
                              const dateText = getEventDateBadge(eventDate);
                              if (!dateText) return null;
                              return (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                                  📅 {dateText}
                                </span>
                              );
                            })()}
                          </div>

                          {/* Message Body */}
                          <p
                            className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${
                              noti.is_read
                                ? "text-gray-400"
                                : "text-gray-600 font-medium"
                            } ${isExpanded ? "" : "line-clamp-2"}`}
                          >
                            {noti.body}
                          </p>

                          {/* Read More / Action row */}
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50/50">
                            <span className="text-[10px] text-gray-400 font-semibold">
                              {getRelativeTime(noti.created_at)}
                            </span>

                            {noti.body.length > 120 && (
                              <span className="text-xs text-[#7A3A00] font-bold inline-flex items-center gap-1 hover:underline">
                                {isExpanded ? (
                                  <>
                                    Show Less <FaChevronUp size={8} />
                                  </>
                                ) : (
                                  <>
                                    Read More <FaChevronDown size={8} />
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
