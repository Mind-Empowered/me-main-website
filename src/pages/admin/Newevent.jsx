import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { supabase } from "../../services/supabase-client";
import { sendNotification } from "../../services/notificationService";
import toast from "react-hot-toast";

const AddEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    agenda: "",
    eventURL: "",
    bannerAltText: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venues: [{ venue: "", mapUrl: "" }],
    maxParticipants: "",
    registrationDeadline: "",
    volunteersNeeded: "",
    food: false,
    female_only: false,
  });

  const [errors, setErrors] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        banner: "Please upload a valid image file.",
      }));
      return;
    }
    // Validate file size (max 5MB)
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
  const handleVenueChange = (index, field, value) => {
    const updated = [...form.venues];
    updated[index][field] = value;
    setForm({ ...form, venues: updated });
  };

  const addVenue = () => {
    if (form.venues.length >= 5) return;
    setForm({ ...form, venues: [...form.venues, { venue: "", mapUrl: "" }] });
  };

  const removeVenue = (index) => {
    const updated = form.venues.filter((_, i) => i !== index);
    setForm({ ...form, venues: updated });
  };
  const isValidURL = (url) => {
    if (!url) return true; // optional fields
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isValidGoogleMapsURL = (url) => {
    if (!url) return true; // optional
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

  // ── Step 1 Validation ──
  const validateStep1 = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Event name is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Event name must be at least 3 characters.";
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

  // ── Step 2 Validation ──
  const validateStep2 = () => {
    const newErrors = {};
    const now = new Date();

    // Banner
    if (!bannerFile) {
      newErrors.banner = "Please upload a banner image.";
    }

    // Start Date & Time
    if (!form.startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!form.startTime) {
      newErrors.startTime = "Start time is required.";
    }

    // End Date & Time
    if (!form.endDate) {
      newErrors.endDate = "End date is required.";
    }
    if (!form.endTime) {
      newErrors.endTime = "End time is required.";
    }

    // Start must be in the future
    if (form.startDate && form.startTime) {
      const startDT = new Date(`${form.startDate}T${form.startTime}`);
      if (startDT <= now) {
        newErrors.startDate = "Start date & time must be in the future.";
      }

      // End must be after start
      if (form.endDate && form.endTime) {
        const endDT = new Date(`${form.endDate}T${form.endTime}`);
        if (endDT <= startDT) {
          newErrors.endDate = "End date & time must be after the start.";
        }
      }

      // Registration deadline must be before start and end
      if (form.registrationDeadline) {
        const regDT = new Date(form.registrationDeadline);
        if (regDT >= startDT) {
          newErrors.registrationDeadline =
            "Registration deadline must be before the event start.";
        } else if (
          form.endDate &&
          form.endTime &&
          regDT >= new Date(`${form.endDate}T${form.endTime}`)
        ) {
          newErrors.registrationDeadline =
            "Registration deadline must be before the event end.";
        }
      }
    }

    // Venue URL (Google Maps)
    form.venues.forEach((v, i) => {
      if (v.mapUrl && !isValidURL(v.mapUrl)) {
        newErrors[`mapUrl_${i}`] =
          "Enter a valid URL (must start with http:// or https://).";
      } else if (v.mapUrl && !isValidGoogleMapsURL(v.mapUrl)) {
        newErrors[`mapUrl_${i}`] = "Please enter a valid Google Maps URL.";
      }
    });

    // Max Participants
    if (form.maxParticipants) {
      const val = parseInt(form.maxParticipants);
      if (isNaN(val) || val < 1) {
        newErrors.maxParticipants = "Must be a positive number.";
      } else if (val > 100000) {
        newErrors.maxParticipants = "Value seems too large.";
      }
    }

    // Volunteers Needed
    if (form.volunteersNeeded) {
      const val = parseInt(form.volunteersNeeded);
      if (isNaN(val) || val < 1) {
        newErrors.volunteersNeeded = "Must be a positive number.";
      }
      if (form.maxParticipants && val > parseInt(form.maxParticipants)) {
        newErrors.volunteersNeeded =
          "Volunteers needed cannot exceed max participants.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (status) => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const fromDateTime = new Date(
        `${form.startDate}T${form.startTime}`,
      ).toISOString();
      const toDateTime = new Date(
        `${form.endDate}T${form.endTime}`,
      ).toISOString();

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

      const { data: insertedData, error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .insert({
          title: form.title.trim(),
          description: form.description.trim(),
          agenda: form.agenda.trim() || null,
          eventURL: form.eventURL.trim() || null,
          fromDateTime,
          toDateTime,
          venue:
            form.venues
              .map((v) => v.venue.trim())
              .filter(Boolean)
              .join(" | ") || null,
          max_participants: form.maxParticipants
            ? parseInt(form.maxParticipants)
            : null,
          reg_deadline: form.registrationDeadline
            ? new Date(form.registrationDeadline).toISOString()
            : null,
          max_volunteers: form.volunteersNeeded
            ? parseInt(form.volunteersNeeded)
            : null,
          bannerURL,
          bannerAltText: form.bannerAltText.trim() || form.title.trim(),
          is_food_available: form.food,
          female_only: form.female_only,
          venue_url:
            form.venues
              .map((v) => v.mapUrl.trim())
              .filter(Boolean)
              .join(" | ") || null,
          status: status === "publish" ? "published" : "draft",
        })
        .select();

      setLoading(false);

      if (!error) {
        const { logActivity } = await import("../../services/activityLog");
        await logActivity({
          action: "CREATE_EVENT",
          description: `Created new event: ${form.title.trim()}${status === "publish" ? " (published)" : " (draft)"}`,
          entity_type: "event",
          entity_id: insertedData?.[0]?.eventID,
        });

        if (status === "publish") {
          const eventDate = new Date(form.startDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const {
            data: { user },
          } = await supabase.auth.getUser();
          await sendNotification({
            title: `New Event: ${form.title.trim()}`,
            body: `A new event "${form.title.trim()}" has been scheduled for ${eventDate}. Register now to participate!`,
            type: "event_reminder",
            priority: "normal",
            target: form.female_only ? "all_female" : "all",
            metadata: { event_id: insertedData?.[0]?.eventID, event_date: form.startDate },
            createdBy: user?.email || "Admin",
          });
        }

        toast.success(
          status === "publish"
            ? "Event published successfully!"
            : "Event saved as draft!",
        );
        navigate("/admin/events");
      } else {
        console.error(error);
        if (error.code === "23505" && error.message?.includes("eventURL")) {
          setStep(1);
          toast.error("This Event URL is already used by another event.");
          setErrors((prev) => ({
            ...prev,
            eventURL:
              "This Event URL is already used by another event. Please use a different URL.",
          }));
        } else {
          toast.error("Failed to create event: " + error.message);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error("Error:", err);
      toast.error("Something went wrong: " + err.message);
    }
  };

  // Helper: error message component
  const ErrMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  // Helper: input border class
  const inputCls = (field) =>
    `w-full border ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"} rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]`;

  return (
    <div className="h-screen bg-[#F5F0E8] overflow-auto">
      {/* Topbar */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Create New Event
          </h1>
          <p className="text-gray-400 text-sm">
            Fill in the details below to publish a new event for your community.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#C1622A] text-white text-sm px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 py-4 bg-white border-b border-gray-100">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? "bg-[#C1622A] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {s}
            </div>
            <span
              className={`text-sm ${step >= s ? "text-[#C1622A] font-medium" : "text-gray-400"}`}
            >
              {s === 1 ? "Event Details" : "Date, Time & Location"}
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
          {/* ── Step 1: Event Details ── */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold text-gray-700 mb-4">
                Event Details
              </h2>

              {/* Title */}
              <label className="text-sm text-gray-500">Event Name *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Starlet"
                className={inputCls("title")}
              />
              <ErrMsg field="title" />

              {/* Description */}
              <label className="text-sm text-gray-500 mt-4 block">
                Short Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description shown on the event card..."
                rows={3}
                className={`${inputCls("description")} resize-none`}
              />
              <ErrMsg field="description" />

              {/* Agenda */}
              <label className="text-sm text-gray-500 mt-4 block">
                Full Details / Agenda
              </label>
              <textarea
                name="agenda"
                value={form.agenda}
                onChange={handleChange}
                placeholder="Full event details, schedule, rules, etc."
                rows={4}
                className={`${inputCls("agenda")} resize-none`}
              />
              <ErrMsg field="agenda" />

              {/* Event URL */}
              <label className="text-sm text-gray-500 mt-4 block">
                Event URL
              </label>
              <input
                name="eventURL"
                value={form.eventURL}
                onChange={handleChange}
                placeholder="https://example.com/event"
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

          {/* ── Step 2: Date, Time & Location ── */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6">
              {/* Banner Upload */}
              <label className="text-sm text-gray-500">Event Banner *</label>
              <div className="mt-1 mb-1">
                <label
                  className={`inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition ${errors.banner ? "ring-2 ring-red-400" : ""}`}
                >
                  <FaUpload size={12} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                </label>
                {bannerFile && (
                  <p className="text-xs text-gray-400 mt-1">
                    {bannerFile.name}
                  </p>
                )}
              </div>
              <ErrMsg field="banner" />

              {bannerPreview && (
                <div className="mb-4 mt-2 relative">
                  <p className="text-xs text-gray-400 mb-1">Preview</p>
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview(null);
                    }}
                    className="absolute top-6 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow"
                    title="Remove banner"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              <label className="text-sm text-gray-500 mt-2 block">
                Banner Alt Text <span className="text-gray-300">optional</span>
              </label>
              <input
                name="bannerAltText"
                value={form.bannerAltText}
                onChange={handleChange}
                placeholder="Short description of the banner image"
                className={inputCls("bannerAltText")}
              />

              {/* Date, Time & Location header */}
              <div className="flex items-center gap-2 mt-5 mb-4">
                <span className="text-lg">📅</span>
                <h2 className="font-semibold text-gray-700">
                  Date, Time & Location
                </h2>
              </div>

              {/* Start + End Date Time */}
              <div className="grid grid-cols-4 gap-4 mb-1">
                <div>
                  <label className="text-xs text-gray-500">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={inputCls("startDate")}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className={inputCls("startTime")}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className={inputCls("endDate")}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className={inputCls("endTime")}
                  />
                </div>
              </div>
              {/* Date/time errors */}
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="col-span-2">
                  <ErrMsg field="startDate" />
                </div>
                <div className="col-span-2">
                  <ErrMsg field="endDate" />
                </div>
              </div>

              {/* Venue + Map URL */}
              {form.venues.map((v, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-4 mb-2 items-start"
                >
                  <div>
                    <label className="text-xs text-gray-500">
                      Venue / Location{" "}
                      <span className="text-gray-300">optional</span>
                    </label>
                    <input
                      value={v.venue}
                      onChange={(e) =>
                        handleVenueChange(i, "venue", e.target.value)
                      }
                      placeholder="e.g. Community Hall, Kochi"
                      className={inputCls(`venue_${i}`)}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">
                        Map URL <span className="text-gray-300">optional</span>
                      </label>
                      <input
                        value={v.mapUrl}
                        onChange={(e) =>
                          handleVenueChange(i, "mapUrl", e.target.value)
                        }
                        placeholder="https://maps.google.com/..."
                        className={inputCls(`mapUrl_${i}`)}
                      />
                      {errors[`mapUrl_${i}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`mapUrl_${i}`]}
                        </p>
                      )}
                    </div>
                    {form.venues.length > 1 && (
                      <button
                        onClick={() => removeVenue(i)}
                        className="mb-2 text-red-400 hover:text-red-600"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {form.venues.length < 5 && (
                <button
                  onClick={addVenue}
                  className="text-sm text-[#C1622A] hover:underline mt-1 mb-3"
                >
                  + Add another venue
                </button>
              )}
              {/* Registration Deadline */}
              <label className="text-xs text-gray-500 mt-3 block">
                Registration Deadline{" "}
                <span className="text-gray-300">optional</span>
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={form.registrationDeadline}
                onChange={handleChange}
                className={inputCls("registrationDeadline")}
              />
              <ErrMsg field="registrationDeadline" />

              {/* Max Participants + Volunteers */}
              <div className="grid grid-cols-3 gap-4 mt-3 mb-1">
                <div>
                  <label className="text-xs text-gray-500">
                    Volunteers Needed
                  </label>
                  <input
                    name="volunteersNeeded"
                    value={form.volunteersNeeded}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className={inputCls("volunteersNeeded")}
                  />
                  <ErrMsg field="volunteersNeeded" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Max Participants
                  </label>
                  <input
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className={inputCls("maxParticipants")}
                  />
                  <ErrMsg field="maxParticipants" />
                </div>
              </div>

              {/* Food & Female Only checkboxes */}
              <div className="flex items-center gap-6 mt-4 mb-5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="food"
                    checked={form.food}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#C1622A] cursor-pointer"
                  />
                  <label className="text-sm text-gray-500 cursor-pointer select-none">
                    Food Provided
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="female_only"
                    checked={form.female_only}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#C1622A] cursor-pointer"
                  />
                  <label className="text-sm text-gray-500 cursor-pointer select-none">
                    Female Only
                  </label>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-between gap-2">
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
                    {loading ? "Publishing..." : "Publish Event"}
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

export default AddEvent;
