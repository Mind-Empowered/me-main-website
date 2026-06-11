import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase-client";
import {
  FaSpinner,
  FaTimes,
  FaUsers,
  FaClock,
  FaCheck,
  FaSearch,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import { AdminStatsSkeleton, AdminTableSkeleton } from "../../components/adminDashboard/AdminSkeletons";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import toast from "react-hot-toast";
import { logActivity } from "../../services/activityLog";

const AdminProjects = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [volunteerCounts, setVolunteerCounts] = useState({});
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // admin_status filter
  const [statusUpdating, setStatusUpdating] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Projects states
  const [deleteProjectAll, setDeleteProjectAll] = useState(false);
  const [applyToAllOccurrences, setApplyToAllOccurrences] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchVolunteerCounts = async (eventsList) => {
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("event_id")
        .in("registered_as", ["registered", "volunteer", "attended"]);
      if (error) throw error;
      const counts = {};
      eventsList.forEach((event) => {
        counts[event.eventID] = (data || []).filter(
          (r) => r.event_id === event.eventID,
        ).length;
      });
      setVolunteerCounts(counts);
    } catch (err) {
      console.error("Error fetching volunteer counts:", err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .select("*")
        .eq("is_project", true)
        .order("fromDateTime", { ascending: true });
      if (error) throw error;
      setEvents(data || []);
      if (data) fetchVolunteerCounts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const eventToDelete = events.find((e) => e.eventID === confirmDeleteId);
    if (!eventToDelete) return;

    try {
      if (eventToDelete.is_project && eventToDelete.parent_project_id && deleteProjectAll) {
        const { error } = await supabase
          .schema("me_dataspace")
          .from("events")
          .delete()
          .eq("parent_project_id", eventToDelete.parent_project_id);

        if (error) throw error;
        toast.success("All project dates deleted");
        await logActivity({
          action: 'DELETE_EVENT',
          description: `Deleted all occurrences of project: ${eventToDelete.title}`,
          entity_type: 'event',
          entity_id: eventToDelete.parent_project_id,
        });
        setEvents(events.filter((e) => e.parent_project_id !== eventToDelete.parent_project_id));
      } else {
        const { error } = await supabase
          .schema("me_dataspace")
          .from("events")
          .delete()
          .eq("eventID", confirmDeleteId);

        if (error) throw error;
        toast.success("Project date deleted");
        await logActivity({
          action: 'DELETE_EVENT',
          description: `Deleted project occurrence of: ${eventToDelete.title}`,
          entity_type: 'event',
          entity_id: confirmDeleteId,
        });
        setEvents(events.filter((e) => e.eventID !== confirmDeleteId));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project: " + err.message);
    }
    setConfirmDeleteId(null);
    setDeleteProjectAll(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setApplyToAllOccurrences(false);
    const pad = (n) => String(n).padStart(2, "0");
    const toDateStr = (d) =>
      d
        ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
        : "";
    const toTimeStr = (d) =>
      d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "";
    const fromDT = event.fromDateTime ? new Date(event.fromDateTime) : null;
    const toDT = event.toDateTime ? new Date(event.toDateTime) : null;

    let reg_deadline = "";
    if (event.reg_deadline) {
      const d = new Date(event.reg_deadline);
      reg_deadline = `${toDateStr(d)}T${toTimeStr(d)}`;
    }

    setEditFormData({
      title: event.title || "",
      description: event.description || "",
      agenda: event.agenda || "",
      venue: event.venue || "",
      venue_url: event.venue_url || "",
      max_participants: event.max_participants ?? "",
      max_volunteers: event.max_volunteers ?? "",
      bannerURL: event.bannerURL || "",
      bannerFile: null,
      reg_deadline,
      fromDate: toDateStr(fromDT),
      fromTime: toTimeStr(fromDT),
      toDate: toDateStr(toDT),
      toTime: toTimeStr(toDT),
      is_food_available: event.is_food_available ?? false,
      eventURL: event.eventURL || "",
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditInput = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditFormData((p) => ({
        ...p,
        bannerURL: ev.target.result,
        bannerFile: file,
      }));
    reader.readAsDataURL(file);
  };

  const uploadBanner = async (file, eventID) => {
    const ext = file.name.split(".").pop();
    const fileName = `event_banner_${eventID}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("events")
      .upload(fileName, file);
    if (error) throw new Error("Upload failed: " + error.message);
    return supabase.storage.from("events").getPublicUrl(fileName).data
      .publicUrl;
  };

  const isValidURL = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isValidGoogleMapsURL = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      const validHosts = [
        "maps.google.com",
        "www.google.com",
        "goo.gl",
        "maps.app.goo.gl",
      ];
      return validHosts.some(
        (h) => u.hostname === h || u.hostname.endsWith("." + h),
      );
    } catch {
      return false;
    }
  };

  const validateEditForm = () => {
    const errs = [];
    if (!editFormData.title.trim()) errs.push("Project name is required.");
    else if (editFormData.title.trim().length < 3)
      errs.push("Project name must be at least 3 characters.");

    if (!editFormData.description.trim())
      errs.push("Short description is required.");
    else if (editFormData.description.trim().length < 10)
      errs.push("Description must be at least 10 characters.");

    if (editFormData.eventURL && !isValidURL(editFormData.eventURL))
      errs.push("Project URL must start with http:// or https://.");

    if (!editFormData.fromDate || !editFormData.fromTime)
      errs.push("Start date and time are required.");
    if (!editFormData.toDate || !editFormData.toTime)
      errs.push("End date and time are required.");

    if (
      editFormData.fromDate &&
      editFormData.fromTime &&
      editFormData.toDate &&
      editFormData.toTime
    ) {
      const startDT = new Date(
        `${editFormData.fromDate}T${editFormData.fromTime}`,
      );
      const endDT = new Date(`${editFormData.toDate}T${editFormData.toTime}`);
      if (endDT <= startDT)
        errs.push("End date & time must be after the start.");
      if (editFormData.reg_deadline) {
        const regDT = new Date(editFormData.reg_deadline);
        if (regDT >= startDT)
          errs.push("Registration deadline must be before the project start.");
        if (regDT >= endDT)
          errs.push("Registration deadline must be before the project end.");
      }
    }

    if (editFormData.venue_url && !isValidURL(editFormData.venue_url))
      errs.push("Map URL must start with http:// or https://.");
    else if (
      editFormData.venue_url &&
      !isValidGoogleMapsURL(editFormData.venue_url)
    )
      errs.push("Map URL must be a valid Google Maps link.");

    if (editFormData.max_participants !== "") {
      const val = parseInt(editFormData.max_participants);
      if (isNaN(val) || val < 1)
        errs.push("Max participants must be a positive number.");
    }

    if (
      editFormData.max_volunteers !== "" &&
      isNaN(parseInt(editFormData.max_volunteers))
    )
      errs.push("Volunteers needed must be a number.");

    return errs;
  };

  const handleSaveEdit = async () => {
    const validationErrors = validateEditForm();
    if (validationErrors.length > 0) {
      setEditError(validationErrors.join("\n"));
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      let bannerURL = editingEvent.bannerURL || null;
      if (editFormData.bannerFile)
        bannerURL = await uploadBanner(
          editFormData.bannerFile,
          editingEvent.eventID,
        );
      else if (
        editFormData.bannerURL &&
        !editFormData.bannerURL.startsWith("data:")
      )
        bannerURL = editFormData.bannerURL;

      const fromDateTime = new Date(
        `${editFormData.fromDate}T${editFormData.fromTime}`,
      ).toISOString();
      const toDateTime = new Date(
        `${editFormData.toDate}T${editFormData.toTime}`,
      ).toISOString();

      const updates = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        agenda: editFormData.agenda.trim() || null,
        venue: editFormData.venue.trim() || null,
        venue_url: editFormData.venue_url.trim() || null,
        max_participants:
          editFormData.max_participants !== ""
            ? parseInt(editFormData.max_participants)
            : null,
        max_volunteers:
          editFormData.max_volunteers !== ""
            ? parseInt(editFormData.max_volunteers)
            : null,
        bannerURL,
        reg_deadline: editFormData.reg_deadline
          ? new Date(editFormData.reg_deadline).toISOString()
          : null,
        fromDateTime,
        toDateTime,
        is_food_available: editFormData.is_food_available,
        eventURL: editFormData.eventURL.trim() || null,
      };

      const { error } = await (async () => {
        if (editingEvent.is_project && editingEvent.parent_project_id && applyToAllOccurrences) {
          const { fromDateTime, toDateTime, reg_deadline, ...commonUpdates } = updates;
          const { error: bulkError } = await supabase
            .schema("me_dataspace")
            .from("events")
            .update(commonUpdates)
            .eq("parent_project_id", editingEvent.parent_project_id);
          if (bulkError) return { error: bulkError };

          const { error: selfError } = await supabase
            .schema("me_dataspace")
            .from("events")
            .update({ fromDateTime, toDateTime, reg_deadline })
            .eq("eventID", editingEvent.eventID);
          return { error: selfError };
        } else {
          return await supabase
            .schema("me_dataspace")
            .from("events")
            .update(updates)
            .eq("eventID", editingEvent.eventID);
        }
      })();

      if (error) throw error;

      if (editingEvent.is_project && editingEvent.parent_project_id && applyToAllOccurrences) {
        const { fromDateTime, toDateTime, reg_deadline, ...commonUpdates } = updates;
        setEvents(
          events.map((e) => {
            if (e.parent_project_id === editingEvent.parent_project_id) {
              if (e.eventID === editingEvent.eventID) {
                return { ...e, ...updates };
              }
              return { ...e, ...commonUpdates };
            }
            return e;
          })
        );
      } else {
        setEvents(
          events.map((e) =>
            e.eventID === editingEvent.eventID ? { ...e, ...updates } : e
          )
        );
      }

      setShowEditModal(false);
      toast.success("Project updated");
      await logActivity({ action: 'EDIT_EVENT', description: `Updated project: ${editFormData.title}`, entity_type: 'event', entity_id: editingEvent.eventID });
    } catch (err) {
      if (err.code === "23505" && err.message?.includes("eventURL"))
        setEditError(
          "This Project URL is already used by another project/event. Please use a different URL.",
        );
      else setEditError(err.message || "Failed to update");
    } finally {
      setEditLoading(false);
    }
  };



  const ADMIN_STATUSES = [
    { value: "published",  label: "Published",  color: "bg-green-100 text-green-700 border-green-200" },
    { value: "draft",      label: "Draft",       color: "bg-gray-100 text-gray-600 border-gray-200" },
    { value: "postponed",  label: "Postponed",   color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { value: "cancelled",  label: "Cancelled",   color: "bg-red-100 text-red-600 border-red-200" },
    { value: "completed",  label: "Completed",   color: "bg-purple-100 text-purple-700 border-purple-200" },
  ];

  const getAdminStatusStyle = (statusVal) =>
    ADMIN_STATUSES.find(s => s.value === statusVal)?.color || "bg-gray-100 text-gray-600 border-gray-200";

  const handleUpdateAdminStatus = async (eventID, newStatus) => {
    setStatusUpdating(prev => ({ ...prev, [eventID]: true }));
    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .update({ admin_status: newStatus })
        .eq("eventID", eventID);
      if (error) throw error;
      setEvents(prev => prev.map(e => e.eventID === eventID ? { ...e, admin_status: newStatus } : e));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status: " + err.message);
    } finally {
      setStatusUpdating(prev => ({ ...prev, [eventID]: false }));
    }
  };

  const getStatus = (from, to) => {
    const now = new Date();
    if (new Date(from) > now) return "Upcoming";
    if (new Date(from) <= now && new Date(to) >= now) return "Ongoing";
    return "Completed";
  };

  const getDay = (dt) => (dt ? new Date(dt).getDate() : "");
  const getMonth = (dt) =>
    dt ? new Date(dt).toLocaleString("default", { month: "short" }) : "";
  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  const formatDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString(undefined, { dateStyle: "medium" })
      : "—";
  const statusStyle = (s) =>
    s === "Ongoing"
      ? "text-green-600"
      : s === "Upcoming"
        ? "text-yellow-500"
        : "text-gray-400";

  // Filter based on admin status
  const filteredEvents = events.filter((e) => {
    const passesAdminFilter = statusFilter === "All" || (e.admin_status || "published") === statusFilter;
    return passesAdminFilter;
  });

  // ── Project Grouping Logic ──
  const projectGroups = {};
  filteredEvents.forEach((event) => {
    if (event.parent_project_id) {
      if (!projectGroups[event.parent_project_id]) {
        projectGroups[event.parent_project_id] = [];
      }
      projectGroups[event.parent_project_id].push(event);
    }
  });

  const getProjectStatus = (occurrences) => {
    const now = new Date();
    const start = new Date(occurrences[0].fromDateTime);
    const end = new Date(occurrences[occurrences.length - 1].toDateTime);
    if (start > now) return "Upcoming";
    if (end < now) return "Completed";
    return "Ongoing";
  };

  const groupedProjects = Object.keys(projectGroups).map((pId) => {
    const occurrences = projectGroups[pId];
    occurrences.sort((a, b) => new Date(a.fromDateTime) - new Date(b.fromDateTime));
    return {
      parent_project_id: pId,
      data: occurrences[0],
      occurrences,
    };
  });

  // Stats calculation based on all projects
  const totalProjectsCount = groupedProjects.length;
  const ongoingProjectsCount = groupedProjects.filter(p => getProjectStatus(p.occurrences) === "Ongoing").length;
  const upcomingProjectsCount = groupedProjects.filter(p => getProjectStatus(p.occurrences) === "Upcoming").length;
  const completedProjectsCount = groupedProjects.filter(p => getProjectStatus(p.occurrences) === "Completed").length;

  // Filter time-based status
  const finalGroupedProjects = groupedProjects.filter((item) => {
    const projStatus = getProjectStatus(item.occurrences);
    return filter === "All" || projStatus === filter;
  });

  finalGroupedProjects.sort((a, b) => new Date(a.data.fromDateTime) - new Date(b.data.fromDateTime));

  const toggleProjectExpanded = (pId) => {
    setExpandedProjects((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C97736]";

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects Management</h1>
          <p className="text-gray-500 text-sm">Create, edit, and manage multi-day prolonged programs.</p>
        </div>
        <button
          onClick={() => navigate("/admin/newproject")}
          className="bg-[#C1622A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#a8521f] transition-all duration-200 shadow-md flex items-center gap-2"
        >
          <FaPlus size={12} /> Add Project
        </button>
      </div>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project occurrence? This action cannot be undone."
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading projects</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-5 mt-5">
          <AdminStatsSkeleton cards={4} />
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="h-10 w-full max-w-sm rounded-full bg-gradient-to-r from-[#e7ddd4] via-white to-[#e7ddd4] bg-[length:200%_100%] animate-pulse mb-4" />
            <AdminTableSkeleton rows={3} columns={4} />
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          {[
            {
              label: "Total Projects",
              count: totalProjectsCount,
              color: "border-orange-400",
            },
            { label: "Ongoing", count: ongoingProjectsCount, color: "border-blue-400" },
            {
              label: "Upcoming",
              count: upcomingProjectsCount,
              color: "border-green-400",
            },
            {
              label: "Completed",
              count: completedProjectsCount,
              color: "border-purple-400",
            },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className={`bg-white p-4 rounded-xl border-t-4 ${color}`}
            >
              <p className="text-sm text-gray-500">{label}</p>
              <h1 className="text-3xl font-bold">{count}</h1>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && (
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex gap-2 bg-white rounded-xl px-4 py-2 border border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="text-xs text-gray-400 self-center mr-1 font-medium">Schedule:</span>
            {["All", "Ongoing", "Upcoming", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${filter === f ? "bg-[#F7F2EC] text-gray-700 border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 bg-white rounded-xl px-4 py-2 border border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="text-xs text-gray-400 self-center mr-1 font-medium">Status:</span>
            {["All", ...ADMIN_STATUSES.map(s => s.value)].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition border ${
                  statusFilter === s
                    ? "bg-[#C97736] text-white border-[#C97736]"
                    : "border-gray-200 text-gray-500 hover:border-[#C97736] hover:text-[#C97736]"
                }`}
              >
                {s === "All" ? "All" : ADMIN_STATUSES.find(x => x.value === s)?.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && finalGroupedProjects.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 mt-5">
          <p className="text-gray-500">
            No {filter !== "All" ? filter.toLowerCase() + " " : ""}projects found
          </p>
        </div>
      )}

      {/* Grid listing */}
      {!loading && finalGroupedProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-5 mt-5 overflow-y-auto max-h-[60vh] pr-1">
          {finalGroupedProjects.map((item) => {
            const isExpanded = expandedProjects.includes(item.parent_project_id);
            const overallStatus = getProjectStatus(item.occurrences);
            return (
              <div key={item.parent_project_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-orange-50/20 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center bg-[#C97736] rounded-lg w-12 h-12 flex-shrink-0">
                      <span className="text-xs font-bold text-white uppercase leading-none">PRJ</span>
                      <span className="text-[9px] font-bold text-white mt-1 uppercase">
                        {item.occurrences.length} DAYS
                      </span>
                    </div>
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full inline-block">
                          Prolonged Project
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${statusStyle(overallStatus)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block"></span>
                          {overallStatus}
                        </span>
                      </div>
                      <h2 className="font-bold text-gray-800 text-base leading-tight">
                        {item.data.title}
                      </h2>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleProjectExpanded(item.parent_project_id)}
                    className="px-4 py-2 border border-gray-200 hover:border-[#C97736] text-gray-700 hover:text-[#C97736] text-xs font-semibold rounded-lg bg-white shadow-sm transition"
                  >
                    {isExpanded ? "Hide Dates" : `View Dates (${item.occurrences.length})`}
                  </button>
                </div>

                <div className="flex gap-3 p-4 bg-[#FAF8F5]/30">
                  {item.data.bannerURL ? (
                    <img
                      src={item.data.bannerURL}
                      alt={item.data.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300 text-xs">
                      No image
                    </div>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 flex-1">
                    {item.data.description}
                  </p>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100 bg-[#FAF9F6]/20">
                    {item.occurrences.map((occ, idx) => {
                      const occStatus = getStatus(occ.fromDateTime, occ.toDateTime);
                      const volunteerCount = volunteerCounts[occ.eventID] || 0;
                      return (
                        <div
                          key={occ.eventID}
                          onClick={() => navigate(`/admin/events/${occ.eventID}/volunteers`)}
                          className="flex flex-col md:grid md:grid-cols-[160px_1fr_110px_140px_220px] p-3 items-start md:items-center gap-3 text-sm text-gray-700 hover:bg-orange-50/20 cursor-pointer transition"
                        >
                          <div className="font-semibold text-gray-800">
                            Day {idx + 1}: {new Date(occ.fromDateTime).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock size={10} />
                            <span>{formatTime(occ.fromDateTime)} - {formatTime(occ.toDateTime)}</span>
                          </div>
                          <div>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${statusStyle(occStatus)}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block"></span>
                              {occStatus}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="relative">
                              {statusUpdating[occ.eventID] ? (
                                <span className="text-xs text-gray-400 flex items-center gap-1"><FaSpinner className="animate-spin" size={10} /> Saving...</span>
                              ) : (
                                <select
                                  value={occ.admin_status || "published"}
                                  onChange={(e) => { e.stopPropagation(); handleUpdateAdminStatus(occ.eventID, e.target.value); }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer appearance-none pr-5 ${getAdminStatusStyle(occ.admin_status || "published")}`}
                                >
                                  {ADMIN_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <FaUsers size={9} />
                              {volunteerCount}{occ.max_volunteers ? `/${occ.max_volunteers}` : ""} vols
                            </span>
                          </div>
                          <div className="flex gap-1.5 w-full md:w-auto md:justify-end">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(occ); }}
                              className="px-2 py-1 text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium transition rounded-md flex items-center gap-1 bg-white"
                              title="Edit"
                            >
                              <FaEdit size={10} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(occ.eventID); }}
                              className="px-2 py-1 text-xs text-red-600 border border-red-100 hover:bg-red-50 font-medium transition rounded-md flex items-center gap-1 bg-white"
                              title="Delete"
                            >
                              <FaTrash size={9} />
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/admin/events/${occ.eventID}/volunteers`); }}
                              className="px-2 py-1 text-xs text-white bg-[#C97736] hover:bg-[#a85f27] font-medium transition rounded-md flex items-center gap-1"
                              title="View Volunteers"
                            >
                              <FaUsers size={10} />
                              <span>Vols</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Project
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Sticky error banner */}
            {editError && (
              <div className="px-5 py-3 bg-red-50 border-b border-red-200">
                <p className="text-red-700 text-xs font-semibold mb-1">
                  Please fix the following:
                </p>
                <ul className="space-y-0.5">
                  {editError.split("\n").map((e, i) => (
                    <li
                      key={i}
                      className="text-red-600 text-xs flex items-start gap-1.5"
                    >
                      <span className="flex-shrink-0 mt-0.5">•</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Banner */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Banner
                </label>
                {editFormData.bannerURL && (
                  <img
                    src={editFormData.bannerURL}
                    alt="preview"
                    className="w-full h-28 object-cover rounded-lg border border-gray-200 mb-2"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg cursor-pointer hover:bg-gray-200">
                  Change Banner
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerFileChange}
                  />
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Project Name *
                </label>
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInput}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Agenda */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full Details / Agenda
                </label>
                <textarea
                  name="agenda"
                  value={editFormData.agenda}
                  onChange={handleEditInput}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Event URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Project URL
                </label>
                <input
                  name="eventURL"
                  value={editFormData.eventURL}
                  onChange={handleEditInput}
                  placeholder="https://example.com/project"
                  className={inputCls}
                />
              </div>

              {/* Start Date & Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="fromDate"
                    value={editFormData.fromDate}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="time"
                    name="fromTime"
                    value={editFormData.fromTime}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="toDate"
                    value={editFormData.toDate}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="time"
                    name="toTime"
                    value={editFormData.toTime}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="reg_deadline"
                  value={editFormData.reg_deadline}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Venue
                </label>
                <input
                  name="venue"
                  value={editFormData.venue}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>

              {/* Venue Map URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Venue Map URL
                </label>
                <input
                  name="venue_url"
                  value={editFormData.venue_url}
                  onChange={handleEditInput}
                  placeholder="https://maps.google.com/..."
                  className={inputCls}
                />
              </div>

              {/* Max Participants & Volunteers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={editFormData.max_participants}
                    onChange={handleEditInput}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Volunteers Needed
                  </label>
                  <input
                    type="number"
                    name="max_volunteers"
                    value={editFormData.max_volunteers}
                    onChange={handleEditInput}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Food checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_food_available"
                  name="is_food_available"
                  checked={editFormData.is_food_available}
                  onChange={handleEditInput}
                  className="w-4 h-4 accent-[#C97736] cursor-pointer"
                />
                <label
                  htmlFor="is_food_available"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Food Provided
                </label>
              </div>

              {/* Projects: Apply changes to all dates */}
              {editingEvent.is_project && editingEvent.parent_project_id && (
                <div className="flex items-center gap-3 bg-orange-50/50 p-2.5 rounded-lg border border-orange-100 mt-4">
                  <input
                    type="checkbox"
                    id="applyToAllOccurrences"
                    checked={applyToAllOccurrences}
                    onChange={(e) => setApplyToAllOccurrences(e.target.checked)}
                    className="w-5 h-5 accent-[#C97736] cursor-pointer"
                  />
                  <label
                    htmlFor="applyToAllOccurrences"
                    className="text-xs font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    Apply common updates (Title, Description, Venue, Banner) to all dates of this project
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 py-2.5 bg-[#C97736] text-white rounded-lg text-sm font-medium hover:bg-[#a85f27] transition disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Group occurrence delete confirmation modal */}
      {confirmDeleteId && events.find(e => e.eventID === confirmDeleteId)?.is_project && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 animate-slide-up-fast">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Project Date?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this occurrence: <span className="font-semibold text-gray-800">{new Date(events.find(e => e.eventID === confirmDeleteId).fromDateTime).toLocaleDateString()}</span>?
              </p>
              
              <div className="flex items-center gap-2 justify-center mb-6 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="deleteProjectAll"
                  checked={deleteProjectAll}
                  onChange={(e) => setDeleteProjectAll(e.target.checked)}
                  className="w-4 h-4 accent-red-600 cursor-pointer"
                />
                <label htmlFor="deleteProjectAll" className="text-xs text-gray-700 font-semibold select-none cursor-pointer">
                  Delete all dates of this project
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { setConfirmDeleteId(null); setDeleteProjectAll(false); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
