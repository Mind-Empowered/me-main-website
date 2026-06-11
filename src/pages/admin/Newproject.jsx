import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTimes, FaChevronLeft, FaChevronRight, FaPlus, FaTrash } from "react-icons/fa";
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
    venue: "",
    maxParticipants: "",
    volunteersNeeded: "",
    food: false,
    mapUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calendar multi-select state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]); // Array of 'YYYY-MM-DD' strings
  const [sameTime, setSameTime] = useState(true);
  const [defaultStartTime, setDefaultStartTime] = useState("10:00");
  const [defaultEndTime, setDefaultEndTime] = useState("12:00");
  const [individualTimes, setIndividualTimes] = useState({}); // { 'YYYY-MM-DD': { startTime: "10:00", endTime: "12:00" } }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, banner: "Please upload a valid image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, banner: "Image must be smaller than 5MB." }));
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
      newErrors.eventURL = "Enter a valid URL (must start with http:// or https://).";
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
    if (form.mapUrl && !isValidURL(form.mapUrl)) {
      newErrors.mapUrl = "Enter a valid URL (must start with http:// or https://).";
    } else if (form.mapUrl && !isValidGoogleMapsURL(form.mapUrl)) {
      newErrors.mapUrl = "Please enter a valid Google Maps URL.";
    }
    if (form.maxParticipants) {
      const val = parseInt(form.maxParticipants);
      if (isNaN(val) || val < 1) newErrors.maxParticipants = "Must be a positive number.";
    }
    if (form.volunteersNeeded) {
      const val = parseInt(form.volunteersNeeded);
      if (isNaN(val) || val < 1) newErrors.volunteersNeeded = "Must be a positive number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  // ── Calendar Helper Logic ──
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
  };

  const toggleDateSelection = (dateStr) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
      // Clean up individual times if exist
      const updatedTimes = { ...individualTimes };
      delete updatedTimes[dateStr];
      setIndividualTimes(updatedTimes);
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
      [dateStr]: {
        ...prev[dateStr],
        [field]: value,
      },
    }));
  };

  // Generate Calendar Days Grid
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const monthLabel = currentCalendarDate.toLocaleString("default", { month: "long" });

  const calendarDays = [];
  // Padding cells
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(<div key={`pad-${i}`} className="w-10 h-10" />);
  }
  // Actual calendar days
  for (let day = 1; day <= totalDays; day++) {
    const pad = (n) => String(n).padStart(2, "0");
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    const isSelected = selectedDates.includes(dateStr);
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));

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
      </button>
    );
  }

  // ── Submission ──
  const handleSubmit = async (status) => {
    if (!validateStep2()) return;
    setLoading(true);

    try {
      let bannerURL = null;
      if (bannerFile) {
        const safeName = bannerFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `banner_${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(fileName, bannerFile, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("events").getPublicUrl(fileName);
        bannerURL = data.publicUrl;
      }

      // Generate Parent Project UUID
      const parentProjectId = crypto.randomUUID();

      // Construct Event insertions for each selected day
      const insertRows = selectedDates.map((dateStr) => {
        let startT = defaultStartTime;
        let endT = defaultEndTime;

        if (!sameTime && individualTimes[dateStr]) {
          startT = individualTimes[dateStr].startTime;
          endT = individualTimes[dateStr].endTime;
        }

        const fromDateTime = new Date(`${dateStr}T${startT}`).toISOString();
        const toDateTime = new Date(`${dateStr}T${endT}`).toISOString();

        return {
          title: form.title.trim(),
          description: form.description.trim(),
          agenda: form.agenda.trim() || null,
          eventURL: form.eventURL.trim() || null,
          fromDateTime,
          toDateTime,
          venue: form.venue.trim() || null,
          max_participants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
          max_volunteers: form.volunteersNeeded ? parseInt(form.volunteersNeeded) : null,
          bannerURL,
          bannerAltText: form.bannerAltText.trim() || form.title.trim(),
          is_food_available: form.food,
          venue_url: form.mapUrl.trim() || null,
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

      // Broadcast single notification for Option 1
      if (status === "publish") {
        const firstDateObj = new Date(selectedDates[0]);
        const formattedDate = firstDateObj.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });

        // Fetch current logged-in user for created_by
        const { data: { user } } = await supabase.auth.getUser();

        await sendNotification({
          title: `New Project: ${form.title}`,
          body: `We are starting a new project: "${form.title}" beginning on ${formattedDate}. Check details and register for individual dates now!`,
          type: "broadcast",
          priority: "normal",
          target: "all",
          metadata: { parent_project_id: parentProjectId },
          createdBy: user?.email || "Admin",
        });
      }

      toast.success("Project created successfully with " + selectedDates.length + " dates!");
      navigate("/admin/projects");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const ErrMsg = ({ field }) =>
    errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  const inputCls = (field) =>
    `w-full border ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"} rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] transition`;

  return (
    <div className="h-screen bg-[#F5F0E8] overflow-auto">
      {/* Topbar */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Create New Project</h1>
          <p className="text-gray-400 text-sm">Create a multi-day prolonged program with multiple dates.</p>
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
                step >= s ? "bg-[#C1622A] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-[#C1622A] font-medium" : "text-gray-400"}`}>
              {s === 1 ? "Project Info" : "Project Dates & Times"}
            </span>
            {s < 2 && <div className={`w-10 h-0.5 mx-1 ${step > s ? "bg-[#C1622A]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-center">
        <div className="w-full flex flex-col gap-6">
          {/* Step 1: Info */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Project Details</h2>

              <label className="text-sm text-gray-500">Project Name *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Saturday Literacy Drive"
                className={inputCls("title")}
              />
              <ErrMsg field="title" />

              <label className="text-sm text-gray-500 mt-4 block">Short Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief summary shown on the project card..."
                rows={3}
                className={`${inputCls("description")} resize-none`}
              />
              <ErrMsg field="description" />

              <label className="text-sm text-gray-500 mt-4 block">Full Details / Agenda</label>
              <textarea
                name="agenda"
                value={form.agenda}
                onChange={handleChange}
                placeholder="Full details, weekly targets, rules..."
                rows={4}
                className={`${inputCls("agenda")} resize-none`}
              />

              <label className="text-sm text-gray-500 mt-4 block">Project Website URL</label>
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

          {/* Step 2: Calendar, Venue, Times */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 space-y-6">
              {/* Banner */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">Project Banner *</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                    <FaUpload size={12} /> Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                  </label>
                  {bannerFile && <p className="text-xs text-gray-400">{bannerFile.name}</p>}
                </div>
                <ErrMsg field="banner" />
                {bannerPreview && (
                  <div className="mt-3 relative w-full max-w-md">
                    <img src={bannerPreview} alt="Preview" className="w-full h-36 object-cover rounded-lg border" />
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
                <label className="text-xs text-gray-400 mt-2 block">Banner Alt Text</label>
                <input
                  name="bannerAltText"
                  value={form.bannerAltText}
                  onChange={handleChange}
                  placeholder="Image alt description"
                  className={inputCls("bannerAltText")}
                />
              </div>

              {/* Venue & Maps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Venue / Location</label>
                  <input
                    name="venue"
                    value={form.venue}
                    onChange={handleChange}
                    placeholder="e.g. Government School, Ernakulam"
                    className={inputCls("venue")}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Map URL</label>
                  <input
                    name="mapUrl"
                    value={form.mapUrl}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                    className={inputCls("mapUrl")}
                  />
                  <ErrMsg field="mapUrl" />
                </div>
              </div>

              {/* Volunteers and Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Volunteers Needed Per Day</label>
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
                  <label className="text-xs text-gray-500">Max Participants Per Day</label>
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
                <label htmlFor="food" className="text-sm text-gray-500 select-none cursor-pointer">
                  Food Provided
                </label>
              </div>

              <hr className="border-gray-100" />

              {/* Calendar Selector Section */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Project Schedule</h3>
                <p className="text-xs text-gray-400 mb-4">Click dates on the calendar to select the days this project will run.</p>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Calendar Render */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 w-fit">
                    <div className="flex justify-between items-center mb-3">
                      <button type="button" onClick={handlePrevMonth} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full">
                        <FaChevronLeft size={10} />
                      </button>
                      <span className="font-bold text-gray-800 text-sm">
                        {monthLabel} {year}
                      </span>
                      <button type="button" onClick={handleNextMonth} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full">
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

                  {/* Selected Days Lists & Time Configurations */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sameTime"
                        checked={sameTime}
                        onChange={(e) => setSameTime(e.target.checked)}
                        className="w-4 h-4 accent-[#C1622A] cursor-pointer"
                      />
                      <label htmlFor="sameTime" className="text-sm text-gray-600 select-none cursor-pointer font-medium">
                        All dates share the same start & end time
                      </label>
                    </div>

                    {/* Default Times Input */}
                    {sameTime && (
                      <div className="grid grid-cols-2 gap-4 max-w-xs bg-gray-50 p-3 rounded-lg border">
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Start Time</label>
                          <input
                            type="time"
                            value={defaultStartTime}
                            onChange={(e) => setDefaultStartTime(e.target.value)}
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs mt-1 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-bold">End Time</label>
                          <input
                            type="time"
                            value={defaultEndTime}
                            onChange={(e) => setDefaultEndTime(e.target.value)}
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs mt-1 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Selected Dates Display list */}
                    <div>
                      <h4 className="text-xs uppercase text-gray-400 font-bold mb-2">Selected Dates ({selectedDates.length})</h4>
                      <ErrMsg field="dates" />
                      {selectedDates.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No dates selected yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {selectedDates.map((dateStr) => {
                            const dateObj = new Date(dateStr);
                            const formatted = dateObj.toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              weekday: "short",
                            });

                            return (
                              <div key={dateStr} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 gap-2">
                                <span className="text-xs font-semibold text-gray-700">{formatted}</span>
                                <div className="flex items-center gap-3">
                                  {!sameTime && individualTimes[dateStr] && (
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="time"
                                        value={individualTimes[dateStr].startTime}
                                        onChange={(e) => handleIndividualTimeChange(dateStr, "startTime", e.target.value)}
                                        className="border rounded px-1.5 py-0.5 text-xs outline-none w-20"
                                      />
                                      <span className="text-xs text-gray-400">to</span>
                                      <input
                                        type="time"
                                        value={individualTimes[dateStr].endTime}
                                        onChange={(e) => handleIndividualTimeChange(dateStr, "endTime", e.target.value)}
                                        className="border rounded px-1.5 py-0.5 text-xs outline-none w-20"
                                      />
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => toggleDateSelection(dateStr)}
                                    className="text-red-500 hover:text-red-700 p-1.5"
                                    title="Remove Date"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
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
