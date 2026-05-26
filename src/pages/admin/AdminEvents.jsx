import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import { FaSpinner, FaTimes } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volunteerCounts, setVolunteerCounts] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [showAddVolunteersModal, setShowAddVolunteersModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availableVolunteers, setAvailableVolunteers] = useState([]);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);
  const [volunteersLoading, setVolunteersLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchVolunteerCounts = async (eventsList) => {
    try {
      // FIXED: Changed 'data: participation' to 'data: participations' (plural)
      // This matches the forEach loop below which expects an array
      const { data: participations, error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("event_id");

      if (error) throw error;

      // Count volunteers for each event
      const counts = {};
      eventsList.forEach((event) => {
        // FIXED: Changed event.id to event.eventID (correct column name)
        counts[event.eventID] = 0;
      });

      participations?.forEach((participation) => {
        if (participation.event_id) {
          counts[participation.event_id] =
            (counts[participation.event_id] || 0) + 1;
        }
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
        .order("fromDateTime", { ascending: true });

      if (error) throw error;

      setEvents(data || []);
      if (data) {
        fetchVolunteerCounts(data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // DELETE EVENT
  const handleDelete = async (eventID) => {
    // FIXED: Changed parameter name from 'id' to 'eventID' for clarity
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      // FIXED: Changed .eq("id", id) to .eq("eventID", eventID) - correct column name
      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .delete()
        .eq("eventID", eventID);

      if (error) throw error;

      // FIXED: Changed e.id to e.eventID for filtering
      setEvents(events.filter((e) => e.eventID !== eventID));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event: " + err.message);
    }
  };

  // EDIT EVENT
  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title || "",
      description: event.description || "",
      venue: event.venue || "",
      max_participants: event.max_participants || "",
      max_volunteers: event.max_volunteers || "",
      bannerURL: event.bannerURL || null,
      bannerFile: null,
      reg_deadline: event.reg_deadline ? event.reg_deadline.split("T")[0] : "",
      fromDateTime: event.fromDateTime
        ? event.fromDateTime.split("T")
        : ["", ""],
      toDateTime: event.toDateTime ? event.toDateTime.split("T") : ["", ""],
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditFormData((prev) => ({
          ...prev,
          bannerURL: event.target.result,
          bannerFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadBannerToStorage = async (file, id) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `event_banner_${id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("events").getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      console.error("Error uploading banner:", err);
      throw new Error("Failed to upload banner: " + err.message);
    }
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      // Use existing database URL, only upload if new file selected
      let bannerURL = editingEvent.bannerURL || null;

      if (editFormData.bannerFile) {
        // FIXED: Changed editingEvent.id to editingEvent.eventID
        bannerURL = await uploadBannerToStorage(
          editFormData.bannerFile,
          editingEvent.eventID,
        );
      }

      const fromDateTime = new Date(
        `${editFormData.fromDateTime[0]}T${editFormData.fromDateTime[1]}`,
      ).toISOString();
      const toDateTime = new Date(
        `${editFormData.toDateTime[0]}T${editFormData.toDateTime[1]}`,
      ).toISOString();

      // FIXED: Changed .eq("id", editingEvent.id) to .eq("eventID", editingEvent.eventID)
      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .update({
          title: editFormData.title.trim(),
          description: editFormData.description.trim(),
          venue: editFormData.venue.trim() || null,
          max_participants: editFormData.max_participants
            ? parseInt(editFormData.max_participants)
            : null,
          max_volunteers: editFormData.max_volunteers
            ? parseInt(editFormData.max_volunteers)
            : null,
          bannerURL: bannerURL,
          reg_deadline: editFormData.reg_deadline || null,
          fromDateTime: fromDateTime,
          toDateTime: toDateTime,
        })
        .eq("eventID", editingEvent.eventID);

      if (error) throw error;

      // Update local state
      // FIXED: Changed e.id to e.eventID and editingEvent.id to editingEvent.eventID
      setEvents(
        events.map((e) =>
          e.eventID === editingEvent.eventID
            ? {
                ...e,
                title: editFormData.title.trim(),
                description: editFormData.description.trim(),
                venue: editFormData.venue.trim() || null,
                max_participants: editFormData.max_participants
                  ? parseInt(editFormData.max_participants)
                  : null,
                max_volunteers: editFormData.max_volunteers
                  ? parseInt(editFormData.max_volunteers)
                  : null,
                bannerURL: bannerURL,
                reg_deadline: editFormData.reg_deadline || null,
                fromDateTime: fromDateTime,
                toDateTime: toDateTime,
              }
            : e,
        ),
      );

      setShowEditModal(false);
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      setEditError(err.message || "Failed to update event");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setEditFormData({});
    setEditError(null);
  };

  // VIEW VOLUNTEERS FOR EVENT
  const handleViewVolunteersClick = async (event) => {
    // FIXED: Changed !event?.id to !event?.eventID (correct property name)
    if (!event?.eventID) {
      alert("Event ID is missing");
      return;
    }

    setSelectedEvent(event);
    setAvailableVolunteers([]);
    setVolunteersLoading(true);

    try {
      // FIXED: Changed parseInt(event.id) to parseInt(event.eventID)
      const eventId = parseInt(event.eventID);
      const { data: participations, error: participationError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("participant_id")
        .eq("event_id", eventId);

      if (participationError) throw participationError;

      // No volunteers registered
      if (!participations || participations.length === 0) {
        setAvailableVolunteers([]);
        setShowAddVolunteersModal(true);
        return;
      }

      // Get volunteer UUIDs
      const volunteerIds = participations.map((p) => p.participant_id);

      // Fetch volunteer details
      const { data: volunteers, error: volunteersError } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select(
          `
          userID,
          firstName,
          lastName,
          emailID,
          photo
        `,
        )
        .in("userID", volunteerIds);

      if (volunteersError) throw volunteersError;

      setAvailableVolunteers(volunteers || []);
      setShowAddVolunteersModal(true);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      alert("Failed to fetch volunteers: " + err.message);
    } finally {
      setVolunteersLoading(false);
    }
  };
  const closeAddVolunteersModal = () => {
    setShowAddVolunteersModal(false);
    setSelectedEvent(null);
    setAvailableVolunteers([]);
    setSelectedVolunteerIds([]);
  };

  // EVENT STATUS
  const getStatus = (fromDate, toDate) => {
    const now = new Date();
    if (new Date(fromDate) > now) return "Upcoming";
    if (new Date(fromDate) <= now && new Date(toDate) >= now) return "Ongoing";
    return "Completed";
  };

  const formatDateTime = (dt) =>
    dt
      ? new Date(dt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const formatDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString(undefined, { dateStyle: "medium" })
      : "—";

  // COUNTS
  const totalEvents = events.length;
  const ongoingCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Ongoing",
  ).length;
  const upcomingCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Upcoming",
  ).length;
  const completedCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Completed",
  ).length;

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading events</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-[#A64200] text-3xl" />
        </div>
      )}

      {/* Statistics */}
      {!loading && (
        <div className="grid grid-cols-4 gap-4 mt-5">
          <div className="bg-white p-4 rounded-xl border-t-4 border-orange-400">
            <p className="text-sm text-gray-500">Total Events</p>
            <h1 className="text-3xl font-bold">{totalEvents}</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-t-4 border-blue-400">
            <p className="text-sm text-gray-500">Ongoing</p>
            <h1 className="text-3xl font-bold">{ongoingCount}</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-t-4 border-green-400">
            <p className="text-sm text-gray-500">Upcoming</p>
            <h1 className="text-3xl font-bold">{upcomingCount}</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-t-4 border-purple-400">
            <p className="text-sm text-gray-500">Completed</p>
            <h1 className="text-3xl font-bold">{completedCount}</h1>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 mt-5">
          <p className="text-gray-500 text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-1">
            Events will appear here once you create them
          </p>
        </div>
      )}

      {/* Events List */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-2 gap-5 mt-6 overflow-auto max-h-[70vh]">
          {events.map((event) => {
            const status = getStatus(event.fromDateTime, event.toDateTime);
            const isRegistrationOpen =
              event.reg_deadline && new Date(event.reg_deadline) > new Date();

            return (
              <div
                key={event.eventID}
                className="bg-white rounded-xl overflow-hidden border border-gray-200"
              >
                {/* Top */}
                <div className="flex justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-lg">{event.title}</h2>
                      {/* enabled badge */}
                      {event.enabled !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            event.enabled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {event.enabled ? "Active" : "Disabled"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDateTime(event.fromDateTime)} →{" "}
                      {formatDateTime(event.toDateTime)}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === "Ongoing"
                          ? "bg-green-100 text-green-700"
                          : status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
                <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {/* Banner */}
                  <img
                    src={event.bannerURL}
                    alt={event.bannerAltText}
                    className="w-full h-44 object-cover"
                  />

                  {/* Meta details grid */}
                  <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {/* Venue */}
                    {event.venue && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Venue
                        </span>
                        <p className="text-gray-700 font-medium truncate">
                          {event.venue}
                        </p>
                      </div>
                    )}

                    {/* Registration Deadline */}
                    {event.reg_deadline && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Reg. Deadline
                        </span>
                        <p
                          className={`font-medium ${isRegistrationOpen ? "text-gray-700" : "text-red-500"}`}
                        >
                          {formatDate(event.reg_deadline)}
                          {!isRegistrationOpen && (
                            <span className="ml-1 text-xs font-normal text-red-400">
                              (Closed)
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Max Participants */}
                    {event.max_participants != null && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Max Participants
                        </span>
                        <p className="text-gray-700 font-medium">
                          {event.max_participants}
                        </p>
                      </div>
                    )}

                    {/* Max Volunteers */}
                    {event.max_volunteers != null && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Volunteers
                        </span>
                        <p className="text-gray-700 font-medium">
                          {volunteerCounts[event.eventID] || 0}/
                          {event.max_volunteers}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-3 p-4 pt-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 border rounded-lg py-2 hover:bg-blue-100 text-blue-600 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.eventID)}
                    className="flex-1 border rounded-lg py-2 hover:bg-red-100 text-red-600 font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewVolunteersClick(event)}
                    className="flex-1 bg-[#C97736] text-white rounded-lg py-2 hover:bg-[#a85f27] font-medium"
                  >
                    View Volunteers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Event
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {editError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {editError}
                </div>
              )}

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Banner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Banner
                  </label>
                  <div className="flex flex-col items-center gap-3">
                    {editFormData.bannerURL && (
                      <img
                        src={editFormData.bannerURL}
                        alt="Banner preview"
                        className="w-full h-32 rounded-lg object-cover border border-gray-300"
                      />
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                      <span className="px-4 py-2 bg-[#C97736] text-white rounded-lg hover:bg-[#a85f27] transition text-sm font-medium cursor-pointer">
                        Change Banner
                      </span>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    placeholder="Event title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736] resize-none"
                    placeholder="Event description"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={editFormData.venue}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    placeholder="Event venue"
                  />
                </div>

                {/* Start Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={editFormData.fromDateTime[0]}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          fromDateTime: [e.target.value, prev.fromDateTime[1]],
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    />
                    <input
                      type="time"
                      value={editFormData.fromDateTime[1]}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          fromDateTime: [prev.fromDateTime[0], e.target.value],
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    />
                  </div>
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={editFormData.toDateTime[0]}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          toDateTime: [e.target.value, prev.toDateTime[1]],
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    />
                    <input
                      type="time"
                      value={editFormData.toDateTime[1]}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          toDateTime: [prev.toDateTime[0], e.target.value],
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    />
                  </div>
                </div>

                {/* Registration Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    name="reg_deadline"
                    value={editFormData.reg_deadline}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={editFormData.max_participants}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    placeholder="Max participants"
                  />
                </div>

                {/* Max Volunteers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Volunteers
                  </label>
                  <input
                    type="number"
                    name="max_volunteers"
                    value={editFormData.max_volunteers}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                    placeholder="Max volunteers"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-[#C97736] text-white rounded-lg hover:bg-[#a85f27] transition font-medium flex items-center justify-center gap-2"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Volunteers Modal */}
      {showAddVolunteersModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Volunteers Registered for {selectedEvent.title}
              </h2>
              <button
                onClick={closeAddVolunteersModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {volunteersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-[#C97736] text-2xl" />
                </div>
              ) : availableVolunteers.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No volunteers registered for this event
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {availableVolunteers.map((volunteer) => (
                    <div
                      key={volunteer.userID}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-green-50 hover:shadow-md transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#C97736] text-white flex items-center justify-center text-sm font-bold">
                        {volunteer.firstName.charAt(0)}
                        {volunteer.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-700">
                            {volunteer.firstName} {volunteer.lastName}
                          </p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            ✓ Registered
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {volunteer.emailID}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeAddVolunteersModal}
                className="flex-1 px-4 py-2 bg-[#C97736] text-white rounded-lg hover:bg-[#a85f27] transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
