import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import { Toaster, toast } from "react-hot-toast";
import {
  FaUpload,
  FaPaperPlane,
  FaTrash,
  FaImage,
  FaTimes,
  FaEdit,
  FaCheck,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { AdminCalendarSkeleton } from "../../components/adminDashboard/AdminSkeletons";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Calendar = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({ month: "", year: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ month: "", year: "" });
  const [editSaving, setEditSaving] = useState(false);

  const [showPreviewModal, setShowPreviewModal] = useState(false);  // Preview modal (before publish) 

 const fetchCalendarData = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .schema("me_dataspace")
      .from("event_calendars")
      .select("*")
      .order("published_at", { ascending: false });

    if (!error) setCalendars(data || []);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchCalendarData(); }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Choose a calendar image first");
    const monthNum = parseInt(form.month);
    const yearNum = parseInt(form.year);
    if (!form.month || isNaN(monthNum) || monthNum < 1 || monthNum > 12)
      return toast.error("Please enter a valid month (1-12)");
    if (!form.year || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100)
      return toast.error("Please enter a valid year");

    try {
      setUploading(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("calendars")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("calendars").getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .schema("me_dataspace")
        .from("event_calendars")
        .insert([{
          cal_url: publicUrl,
          published_at: new Date().toISOString(),
          cal_month: monthNum,
          cal_year: yearNum,
        }]);
      if (dbError) throw dbError;

      setFile(null);
      setPreview(null);
      setForm({ month: "", year: "" });
      fetchCalendarData();
      toast.success("Calendar uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const { error } = await supabase
      .schema("me_dataspace")
      .from("event_calendars")
      .delete()
      .eq("id", confirmDeleteId);

    if (!error) {
      toast.success("Calendar deleted");
      fetchCalendarData();
    } else {
      toast.error("Failed to delete calendar");
    }
    setConfirmDeleteId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ month: String(item.cal_month), year: String(item.cal_year) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ month: "", year: "" });
  };

  const saveEdit = async (id) => {
    const monthNum = parseInt(editForm.month);
    const yearNum = parseInt(editForm.year);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12)
      return toast.error("Month must be between 1 and 12");
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100)
      return toast.error("Please enter a valid year");

    setEditSaving(true);
    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("event_calendars")
        .update({ cal_month: monthNum, cal_year: yearNum })
        .eq("id", id);
      if (error) throw error;

      toast.success("Calendar updated!");
      setEditingId(null);
      fetchCalendarData();
    } catch (err) {
      toast.error("Update failed: " + err.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handlePreviewClick = () => {
    const monthNum = parseInt(form.month);
    const yearNum = parseInt(form.year);

    if (!file) {
      toast.error("Choose a calendar image first");
      return;
    }
    if (!form.month || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      toast.error("Enter a valid month (1–12) before previewing");
      return;
    }
    if (!form.year || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      toast.error("Enter a valid year before previewing");
      return;
    }

    setShowPreviewModal(true);
  };

  return (
  <div className="bg-[#F5F0E8] min-h-screen p-4 sm:p-8">
    <Toaster position="top-right" />
    {loading ? (
      <AdminCalendarSkeleton />
    ) : (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Upload Section */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-5 text-[#5A2E0C]">Upload Calendar</h2>

              <label className="border-2 border-dashed border-[#D8C7B5] rounded-2xl h-[280px] flex flex-col justify-center items-center cursor-pointer hover:border-[#C1622A] transition">
                {preview ? (
                  <img src={preview} alt="preview" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <FaUpload className="text-5xl text-[#C1622A] mb-4" />
                    <p className="text-lg font-medium text-gray-700">Click to upload calendar</p>
                    <p className="text-sm text-gray-400 mt-2">JPG PNG supported</p>
                  </>
                )}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>

              {file && (
                <div className="mt-5 bg-[#FAF6F1] p-4 rounded-xl space-y-4">
                  {/* Month/Year Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Month (1–12)</label>
                      <input
                        type="number" name="month" min="1" max="12"
                        value={form.month}
                        onChange={(e) => setForm({ ...form, month: e.target.value })}
                        placeholder="e.g. 6"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
                      <input
                        type="number" name="year"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        placeholder="e.g. 2025"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40"
                      />
                    </div>
                  </div>

                  {/* File info + actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-700 text-sm break-all">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleCancel}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2.5 rounded-lg transition"
                        title="Remove"
                      >
                        <FaTimes size={14} />
                      </button>
                      {/* Preview before publish */}
                      <button
                        onClick={handlePreviewClick}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                      >
                        <FaEye size={13} /> Preview
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-[#C1622A] hover:bg-[#a24f21] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                      >
                        <FaPaperPlane size={13} />
                        {uploading ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#5A2E0C]">Recent Calendars</h2>
              <span className="text-sm text-gray-400">{calendars.length} total</span>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[60vh]">
              {calendars.length === 0 ? (
                <div className="text-center py-12">
                  <FaImage className="mx-auto text-5xl text-gray-300 mb-4" />
                  <p className="text-gray-500">No calendars uploaded yet</p>
                </div>
              ) : (
                calendars.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.cal_url}
                          alt="calendar"
                          className="w-20 h-20 object-contain rounded-lg border border-gray-100"
                        />
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition"
                          title="Delete"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        {editingId === item.id ? (
                          /* ── Inline Edit Form ── */
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-[#C1622A] mb-1">Edit Month / Year</p>
                            <div className="flex gap-2">
                              <input
                                type="number" min="1" max="12"
                                value={editForm.month}
                                onChange={e => setEditForm(f => ({ ...f, month: e.target.value }))}
                                placeholder="Month"
                                className="w-20 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40"
                              />
                              <input
                                type="number"
                                value={editForm.year}
                                onChange={e => setEditForm(f => ({ ...f, year: e.target.value }))}
                                placeholder="Year"
                                className="w-24 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40"
                              />
                              <button
                                onClick={() => saveEdit(item.id)}
                                disabled={editSaving}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition disabled:opacity-60"
                              >
                                <FaCheck size={11} /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Display Mode ── */
                          <div>
                            <p className="font-semibold text-gray-800">
                              {MONTHS[item.cal_month - 1] || item.cal_month} {item.cal_year}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Uploaded {new Date(item.published_at).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        )}
                      </div>

                      {editingId !== item.id && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => startEdit(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition"
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <a
                            href={item.cal_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#C1622A] text-white rounded-lg text-sm hover:bg-[#a24f21] transition"
                          >
                            View
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={!!confirmDeleteId}
          title="Delete Calendar?"
          message="Are you sure you want to permanently delete this calendar entry?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />

        {/* ── Pre-publish Preview Modal ── */}
        {showPreviewModal && preview && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white/10 border-b border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <FaEye className="text-white hidden sm:block" />
                <div>
                  <p className="text-white font-bold text-base sm:text-lg">Preview Calendar</p>
                  <p className="text-white/60 text-xs sm:text-sm truncate max-w-[250px] sm:max-w-none">
                    {MONTHS[(parseInt(form.month) || 1) - 1]} {form.year} · {file?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  <FaTimes size={13} /> Close
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#C1622A] hover:bg-[#a24f21] text-white rounded-xl text-xs sm:text-sm font-bold transition disabled:opacity-60 shadow-lg"
                >
                  <FaCheckCircle size={14} />
                  {uploading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-auto">
              <img
                src={preview}
                alt="Calendar preview"
                className="max-w-full max-h-[70vh] sm:max-h-full rounded-xl sm:rounded-2xl shadow-2xl object-contain"
              />
            </div>
          </div>
        )}
      </>
    )}
  </div>
);
};

export default Calendar;
