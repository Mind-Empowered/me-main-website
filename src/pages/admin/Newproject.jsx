import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { supabase } from "../../services/supabase-client";
import { sendNotification } from "../../services/notificationService";
import toast from "react-hot-toast";

const AddProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    agenda: "",
    eventURL: "",
    bannerAltText: "",
    maxParticipants: "",
    volunteersNeeded: "",
    food: false,
  });

  const [errors, setErrors] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Multiple venues state
  // Each venue: { id, label, venue, mapUrl }
  const [venues, setVenues] = useState([
    { id: crypto.randomUUID(), label: "Primary Venue", venue: "", mapUrl: "" },
  ]);

  // Whether per-date venue assignment is enabled
  const [perDateVenue, setPerDateVenue] = useState(false);
  // { 'YYYY-MM-DD': venueId }
  const [dateVenueMap, setDateVenueMap] = useState({});

  // Calendar multi-select state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [sameTime, setSameTime] = useState(true);
  const [defaultStartTime, setDefaultStartTime] = useState("10:00");
  const [defaultEndTime, setDefaultEndTime] = useState("12:00");
  const [individualTimes, setIndividualTimes] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Venue Helpers ──
  const addVenue = () => {
    setVenues((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", venue: "", mapUrl: "" },
    ]);
  };

  const removeVenue = (id) => {
    if (venues.length === 1) return; // always keep at least one
    setVenues((prev) => prev.filter((v) => v.id !== id));
    // Remove any date assignments to this venue
    setDateVenueMap((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        if (updated[date] === id) delete updated[date];
      });
      return updated;
    });
    if (errors.venues) setErrors((prev) => ({ ...prev, venues: "" }));
  };

  const updateVenue = (id, field, value) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
    if (errors.venues) setErrors((prev) => ({ ...prev, venues: "" }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        banner: "Please upload a valid image file.",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        banner: "Image must be smaller than 5MB.",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, banner: "" }));
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
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

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Project name is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Project name must be at least 3 characters.";
    }
    if (!form.description.trim()) {
      newErrors.description = "Short description is required.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    if (form.eventURL && !isValidURL(form.eventURL)) {
      newErrors.eventURL =
        "Enter a valid URL (must start with http:// or https://).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!bannerFile) {
      newErrors.banner = "Please upload a project banner image.";
    }
    if (selectedDates.length === 0) {
      newErrors.dates = "Please select at least one project date.";
    }

    // Validate all venue URLs
    let venueError = false;
    venues.forEach((v) => {
      if (v.mapUrl && !isValidURL(v.mapUrl)) venueError = true;
      if (v.mapUrl && !isValidGoogleMapsURL(v.mapUrl)) venueError = true;
    });
    if (venueError)
      newErrors.venues =
        "One or more Map URLs are invalid. Use a valid Google Maps link.";

    if (form.maxParticipants) {
      const val = parseInt(form.maxParticipants);
      if (isNaN(val) || val < 1)
        newErrors.maxParticipants = "Must be a positive number.";
    }
    if (form.volunteersNeeded) {
      const val = parseInt(form.volunteersNeeded);
      if (isNaN(val) || val < 1)
        newErrors.volunteersNeeded = "Must be a positive number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  // ── Calendar Helper Logic ──
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () =>
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1,
        1,
      ),
    );

  const handleNextMonth = () =>
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1,
        1,
      ),
    );

  const toggleDateSelection = (dateStr) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
      const updatedTimes = { ...individualTimes };
      delete updatedTimes[dateStr];
      setIndividualTimes(updatedTimes);
      setDateVenueMap((prev) => {
        const updated = { ...prev };
        delete updated[dateStr];
        return updated;
      });
    } else {
      setSelectedDates((prev) => [...prev, dateStr].sort());
      setIndividualTimes((prev) => ({
        ...prev,
        [dateStr]: { startTime: defaultStartTime, endTime: defaultEndTime },
      }));
    }
    if (errors.dates) setErrors((prev) => ({ ...prev, dates: "" }));
  };

  const handleIndividualTimeChange = (dateStr, field, value) => {
    setIndividualTimes((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], [field]: value },
    }));
  };

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const monthLabel = currentCalendarDate.toLocaleString("default", {
    month: "long",
  });

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(<div key={`pad-${i}`} className="w-10 h-10" />);
  }
  for (let day = 1; day <= totalDays; day++) {
    const pad = (n) => String(n).padStart(2, "0");
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    const isSelected = selectedDates.includes(dateStr);
    const isPast =
      new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
    calendarDays.push(
      <button
        key={dateStr}
        type="button"
        disabled={isPast}
        onClick={() => toggleDateSelection(dateStr)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition ${
          isSelected
            ? "bg-[#C1622A] text-white shadow-md hover:bg-[#a8521f]"
            : isPast
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-orange-50 text-gray-700"
        }`}
      >
        {day}
      </button>,
    );
  }

  // ── Submission ──
  const handleSubmit = async (status) => {
    if (!validateStep2()) return;
    setLoading(true);

    try {
      let bannerURL = null;
      if (bannerFile) {
        const safeName = bannerFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `banner_${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(fileName, bannerFile, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("events").getPublicUrl(fileName);
        bannerURL = data.publicUrl;
      }

      const parentProjectId = crypto.randomUUID();
      const defaultVenue = venues[0];

      const insertRows = selectedDates.map((dateStr) => {
        let startT = defaultStartTime;
        let endT = defaultEndTime;
        if (!sameTime && individualTimes[dateStr]) {
          startT = individualTimes[dateStr].startTime;
          endT = individualTimes[dateStr].endTime;
        }

        // Determine which venue applies to this date
        let assignedVenue = defaultVenue;
        if (perDateVenue && dateVenueMap[dateStr]) {
          assignedVenue =
            venues.find((v) => v.id === dateVenueMap[dateStr]) || defaultVenue;
        }

        return {
          title: form.title.trim(),
          description: form.description.trim(),
          agenda: form.agenda.trim() || null,
          eventURL: form.eventURL.trim() || null,
          fromDateTime: new Date(`${dateStr}T${startT}`).toISOString(),
          toDateTime: new Date(`${dateStr}T${endT}`).toISOString(),
          venue: assignedVenue.venue.trim() || null,
          max_participants: form.maxParticipants
            ? parseInt(form.maxParticipants)
            : null,
          max_volunteers: form.volunteersNeeded
            ? parseInt(form.volunteersNeeded)
            : null,
          bannerURL,
          bannerAltText: form.bannerAltText.trim() || form.title.trim(),
          is_food_available: form.food,
          venue_url: assignedVenue.mapUrl.trim() || null,
          enabled: status === "publish",
          admin_status: status,
          is_project: true,
          parent_project_id: parentProjectId,
        };
      });

      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .insert(insertRows);
      if (error) throw error;

      if (status === "publish") {
        const firstDateObj = new Date(selectedDates[0]);
        const formattedDate = firstDateObj.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const {
          data: { user },
        } = await supabase.auth.getUser();
        await sendNotification({
          title: `New Project: ${form.title}`,
          body: `We are starting a new project: "${form.title}" beginning on ${formattedDate}. Check details and register for individual dates now!`,
          type: "broadcast",
          priority: "normal",
          target: "all",
          metadata: {
            parent_project_id: parentProjectId,
            project_date: selectedDates[0], // e.g. "2025-07-10"
          },
          createdBy: user?.email || "Admin",
        });
      }

      toast.success(
        "Project created successfully with " + selectedDates.length + " dates!",
      );
      navigate("/admin/projects");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const ErrMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  const inputCls = (field) =>
    `w-full border ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"} rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] transition`;

  return (
    <div className="h-screen bg-[#F5F0E8] overflow-auto">
      {/* Topbar */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Create New Project
          </h1>
          <p className="text-gray-400 text-sm">
            Create a multi-day prolonged program with multiple dates.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#C1622A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#a8521f] transition"
        >
          Back
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 py-4 bg-white border-b border-gray-100">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s
                  ? "bg-[#C1622A] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            <span
              className={`text-sm ${step >= s ? "text-[#C1622A] font-medium" : "text-gray-400"}`}
            >
              {s === 1 ? "Project Info" : "Project Dates & Times"}
            </span>
            {s < 2 && (
              <div
                className={`w-10 h-0.5 mx-1 ${step > s ? "bg-[#C1622A]" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-center">
        <div className="w-full flex flex-col gap-6">
          {/* Step 1: Info */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold text-gray-700 mb-4">
                Project Details
              </h2>

              <label className="text-sm text-gray-500">Project Name *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Saturday Literacy Drive"
                className={inputCls("title")}
              />
              <ErrMsg field="title" />

              <label className="text-sm text-gray-500 mt-4 block">
                Short Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief summary shown on the project card..."
                rows={3}
                className={`${inputCls("description")} resize-none`}
              />
              <ErrMsg field="description" />

              <label className="text-sm text-gray-500 mt-4 block">
                Full Details / Agenda
              </label>
              <textarea
                name="agenda"
                value={form.agenda}
                onChange={handleChange}
                placeholder="Full details, weekly targets, rules..."
                rows={4}
                className={`${inputCls("agenda")} resize-none`}
              />

              <label className="text-sm text-gray-500 mt-4 block">
                Project Website URL
              </label>
              <input
                name="eventURL"
                value={form.eventURL}
                onChange={handleChange}
                placeholder="https://example.com/project"
                className={inputCls("eventURL")}
              />
              <ErrMsg field="eventURL" />

              <div className="flex justify-end mt-5">
                <button
                  onClick={handleNextStep}
                  className="bg-[#C1622A] text-white text-sm px-6 py-2 rounded-lg hover:bg-[#a8521f] transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 space-y-6">
              {/* Banner */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  Project Banner *
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                    <FaUpload size={12} /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerChange}
                    />
                  </label>
                  {bannerFile && (
                    <p className="text-xs text-gray-400">{bannerFile.name}</p>
                  )}
                </div>
                <ErrMsg field="banner" />
                {bannerPreview && (
                  <div className="mt-3 relative w-full max-w-md">
                    <img
                      src={bannerPreview}
                      alt="Preview"
                      className="w-full h-36 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => {
                        setBannerFile(null);
                        setBannerPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                <label className="text-xs text-gray-400 mt-2 block">
                  Banner Alt Text
                </label>
                <input
                  name="bannerAltText"
                  value={form.bannerAltText}
                  onChange={handleChange}
                  placeholder="Image alt description"
                  className={inputCls("bannerAltText")}
                />
              </div>

              {/* ── Venues Section ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Venues / Locations
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Add one or more venues. If the project runs across
                      multiple locations, add each one separately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVenue}
                    className="inline-flex items-center gap-1.5 text-xs bg-orange-50 border border-[#C1622A] text-[#C1622A] px-3 py-1.5 rounded-lg hover:bg-orange-100 transition font-medium"
                  >
                    <FaPlus size={10} /> Add Venue
                  </button>
                </div>

                <ErrMsg field="venues" />

                <div className="space-y-3">
                  {venues.map((v, idx) => (
                    <div
                      key={v.id}
                      className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative"
                    >
                      {/* Venue header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#C1622A] text-white text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={v.label}
                            onChange={(e) =>
                              updateVenue(v.id, "label", e.target.value)
                            }
                            placeholder={`Venue ${idx + 1} label (e.g. Main Hall)`}
                            className="text-sm font-medium text-gray-700 bg-transparent border-b border-dashed border-gray-300 outline-none focus:border-[#C1622A] pb-0.5 w-48"
                          />
                        </div>
                        {venues.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVenue(v.id)}
                            className="text-red-400 hover:text-red-600 p-1 transition"
                            title="Remove venue"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                            <FaMapMarkerAlt size={9} /> Location Name
                          </label>
                          <input
                            type="text"
                            value={v.venue}
                            onChange={(e) =>
                              updateVenue(v.id, "venue", e.target.value)
                            }
                            placeholder="e.g. Government School, Ernakulam"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] transition bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase font-bold">
                            Map URL
                          </label>
                          <input
                            type="text"
                            value={v.mapUrl}
                            onChange={(e) =>
                              updateVenue(v.id, "mapUrl", e.target.value)
                            }
                            placeholder="https://maps.google.com/..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] transition bg-white"
                          />
                          {v.mapUrl && !isValidGoogleMapsURL(v.mapUrl) && (
                            <p className="text-red-500 text-xs mt-1">
                              Enter a valid Google Maps URL.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Per-date venue assignment (shown only when >1 venue) */}
                {venues.length > 1 && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="perDateVenue"
                      checked={perDateVenue}
                      onChange={(e) => setPerDateVenue(e.target.checked)}
                      className="w-4 h-4 accent-[#C1622A] cursor-pointer"
                    />
                    <label
                      htmlFor="perDateVenue"
                      className="text-sm text-gray-600 select-none cursor-pointer font-medium"
                    >
                      Assign different venues to individual dates
                    </label>
                  </div>
                )}
              </div>

              {/* Volunteers and Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    Volunteers Needed Per Day
                  </label>
                  <input
                    name="volunteersNeeded"
                    value={form.volunteersNeeded}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className={inputCls("volunteersNeeded")}
                  />
                  <ErrMsg field="volunteersNeeded" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Max Participants Per Day
                  </label>
                  <input
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    className={inputCls("maxParticipants")}
                  />
                  <ErrMsg field="maxParticipants" />
                </div>
              </div>

              {/* Food checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="food"
                  name="food"
                  checked={form.food}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#C1622A] cursor-pointer"
                />
                <label
                  htmlFor="food"
                  className="text-sm text-gray-500 select-none cursor-pointer"
                >
                  Food Provided
                </label>
              </div>

              <hr className="border-gray-100" />

              {/* Calendar Selector Section */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Project Schedule
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Click dates on the calendar to select the days this project
                  will run.
                </p>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Calendar */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 w-fit">
                    <div className="flex justify-between items-center mb-3">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full"
                      >
                        <FaChevronLeft size={10} />
                      </button>
                      <span className="font-bold text-gray-800 text-sm">
                        {monthLabel} {year}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full"
                      >
                        <FaChevronRight size={10} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div key={d} className="w-10">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
                  </div>

                  {/* Time & Venue config for selected dates */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sameTime"
                        checked={sameTime}
                        onChange={(e) => setSameTime(e.target.checked)}
                        className="w-4 h-4 accent-[#C1622A] cursor-pointer"
                      />
                      <label
                        htmlFor="sameTime"
                        className="text-sm text-gray-600 select-none cursor-pointer font-medium"
                      >
                        All dates share the same start & end time
                      </label>
                    </div>

                    {sameTime && (
                      <div className="grid grid-cols-2 gap-4 max-w-xs bg-gray-50 p-3 rounded-lg border">
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-bold">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={defaultStartTime}
                            onChange={(e) =>
                              setDefaultStartTime(e.target.value)
                            }
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs mt-1 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-bold">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={defaultEndTime}
                            onChange={(e) => setDefaultEndTime(e.target.value)}
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs mt-1 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Selected Dates list */}
                    <div>
                      <h4 className="text-xs uppercase text-gray-400 font-bold mb-2">
                        Selected Dates ({selectedDates.length})
                      </h4>
                      <ErrMsg field="dates" />
                      {selectedDates.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">
                          No dates selected yet.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {selectedDates.map((dateStr) => {
                            const dateObj = new Date(dateStr);
                            const formatted = dateObj.toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                weekday: "short",
                              },
                            );

                            return (
                              <div
                                key={dateStr}
                                className="flex flex-col p-2.5 bg-gray-50 rounded-lg border border-gray-100 gap-2"
                              >
                                {/* Date row */}
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-700">
                                    {formatted}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    {!sameTime && individualTimes[dateStr] && (
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="time"
                                          value={
                                            individualTimes[dateStr].startTime
                                          }
                                          onChange={(e) =>
                                            handleIndividualTimeChange(
                                              dateStr,
                                              "startTime",
                                              e.target.value,
                                            )
                                          }
                                          className="border rounded px-1.5 py-0.5 text-xs outline-none w-20"
                                        />
                                        <span className="text-xs text-gray-400">
                                          to
                                        </span>
                                        <input
                                          type="time"
                                          value={
                                            individualTimes[dateStr].endTime
                                          }
                                          onChange={(e) =>
                                            handleIndividualTimeChange(
                                              dateStr,
                                              "endTime",
                                              e.target.value,
                                            )
                                          }
                                          className="border rounded px-1.5 py-0.5 text-xs outline-none w-20"
                                        />
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleDateSelection(dateStr)
                                      }
                                      className="text-red-500 hover:text-red-700 p-1.5"
                                      title="Remove Date"
                                    >
                                      <FaTrash size={12} />
                                    </button>
                                  </div>
                                </div>

                                {/* Per-date venue selector */}
                                {venues.length > 1 && perDateVenue && (
                                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                                    <FaMapMarkerAlt
                                      size={10}
                                      className="text-[#C1622A] flex-shrink-0"
                                    />
                                    <select
                                      value={
                                        dateVenueMap[dateStr] || venues[0].id
                                      }
                                      onChange={(e) =>
                                        setDateVenueMap((prev) => ({
                                          ...prev,
                                          [dateStr]: e.target.value,
                                        }))
                                      }
                                      className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-[#C1622A] bg-white flex-1"
                                    >
                                      {venues.map((v, i) => (
                                        <option key={v.id} value={v.id}>
                                          {v.label || `Venue ${i + 1}`}
                                          {v.venue ? ` — ${v.venue}` : ""}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-2 border-t pt-5">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-gray-700 text-sm px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  ← Previous
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={loading}
                    className="border border-gray-300 text-gray-600 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleSubmit("publish")}
                    disabled={loading}
                    className="bg-[#C1622A] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#a8521f] transition"
                  >
                    {loading ? "Publishing..." : "Publish Project"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProject;
