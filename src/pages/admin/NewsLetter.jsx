import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import {
  FaUpload,
  FaPaperPlane,
  FaTrash,
  FaEnvelope,
  FaImage,
  FaTimes,
  FaEye,
  FaCheckCircle,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import { AdminNewsletterSkeleton } from "../../components/adminDashboard/AdminSkeletons";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import { Toaster, toast } from "react-hot-toast";
import { logActivity } from "../../services/activityLog";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Newsletter = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [form, setForm] = useState({ month: "", year: "" });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ month: "", year: "" });
  const [editSaving, setEditSaving] = useState(false);

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("newsletters")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error) setNewsletters(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNewsletters(); }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setForm({ month: "", year: "" });
  };
const handleUpload = async () => {
  if (!file) return toast.error("Choose a newsletter image first");
  const monthNum = parseInt(form.month);
  const yearNum = parseInt(form.year);
  if (!form.month || isNaN(monthNum) || monthNum < 1 || monthNum > 12)
    return toast.error("Please enter a valid month (1–12)");
  if (!form.year || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100)
    return toast.error("Please enter a valid year");

  try {
    setUploading(true);
    setShowPreviewModal(false);

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("newsletters")
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("newsletters")
      .getPublicUrl(fileName);


    const { data: insertedData, error: dbError } = await supabase
      .schema("me_dataspace")
      .from("newsletters")
      .insert([{
        newsletter_url: publicUrl,
        published_at: new Date().toISOString(),
        publish_month: monthNum,
        publish_yr: yearNum,
      }])
      .select(); 
    if (dbError) throw dbError;

    setFile(null);
    setPreview(null);
    setForm({ month: "", year: "" });
    fetchNewsletters();
    toast.success("Newsletter published!");
    
    await logActivity({
      action: 'UPLOAD_NEWSLETTER',
      description: `Uploaded newsletter for ${MONTHS[monthNum - 1]} ${yearNum}`,
      entity_type: 'newsletter',
      entity_id: insertedData?.[0]?.id  // ✅ THIS WORKS NOW
    });
  } catch (err) {
    console.error(err);
    toast.error("Upload failed: " + err.message);
  } finally {
    setUploading(false);
  }
};

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const newsletterToDelete = newsletters.find(n => n.id === confirmDeleteId);
    const { error } = await supabase
      .schema("me_dataspace")
      .from("newsletters")
      .delete()
      .eq("id", confirmDeleteId);

    if (!error) {
      toast.success("Newsletter deleted");
      await logActivity({
      action: 'DELETE_NEWSLETTER',
      description: `Deleted newsletter: ${MONTHS[newsletterToDelete?.publish_month - 1]} ${newsletterToDelete?.publish_yr}`,
      entity_type: 'newsletter',
      entity_id: confirmDeleteId
    });
      fetchNewsletters();
    } else {
      toast.error("Failed to delete newsletter");
    }
    setConfirmDeleteId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ month: String(item.publish_month), year: String(item.publish_yr) });
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
       const oldNewsletter = newsletters.find(n => n.id === id);
      const { error } = await supabase
        .schema("me_dataspace")
        .from("newsletters")
        .update({ publish_month: monthNum, publish_yr: yearNum })
        .eq("id", id);
      if (error) throw error;

      toast.success("Newsletter updated!");
       await logActivity({
      action: 'EDIT_NEWSLETTER',
      description: `Updated newsletter from ${MONTHS[oldNewsletter?.publish_month - 1]} ${oldNewsletter?.publish_yr} to ${MONTHS[monthNum - 1]} ${yearNum}`,
      entity_type: 'newsletter',
      entity_id: id
    });
      setEditingId(null);
      fetchNewsletters();
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
      toast.error("Choose a newsletter image first");
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
      {loading ? (
        <AdminNewsletterSkeleton />
      ) : (
        <>
          <Toaster position="top-right" />
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Newsletters</p>
                  <h2 className="text-4xl font-bold text-[#C1622A] mt-2">{newsletters.length}</h2>
                </div>
                <FaEnvelope className="text-3xl text-[#C1622A]/40" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Uploaded This Month</p>
                  <h2 className="text-4xl font-bold text-[#C1622A] mt-2">
                    {newsletters.filter(n => new Date(n.published_at).getMonth() === new Date().getMonth()).length}
                  </h2>
                </div>
                <FaImage className="text-3xl text-[#C1622A]/40" />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-5 text-[#5A2E0C]">Upload Newsletter</h2>

              <label className="border-2 border-dashed border-[#D8C7B5] rounded-2xl h-[225px] flex flex-col justify-center items-center cursor-pointer hover:border-[#C1622A] transition">
                {preview ? (
                  <img src={preview} alt="preview" className="h-full w-full object-cover rounded-2xl" loading="lazy" />
                ) : (
                  <>
                    <FaUpload className="text-5xl text-[#C1622A] mb-4" />
                    <p className="text-lg font-medium text-gray-700">Click to upload newsletter</p>
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
                        onChange={e => setForm({ ...form, month: e.target.value })}
                        placeholder="e.g. 6"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
                      <input
                        type="number" name="year"
                        value={form.year}
                        onChange={e => setForm({ ...form, year: e.target.value })}
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
                        onClick={handleRemoveImage}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2.5 rounded-lg transition"
                        title="Remove"
                      >
                        <FaTimes size={14} />
                      </button>
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

            {/* Recent Uploads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm overflow-y-auto max-h-[70vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#5A2E0C]">Recent Newsletters</h2>
                <span className="text-sm text-gray-400">{newsletters.length} total</span>
              </div>

              <div className="space-y-4">
                {newsletters.length === 0 ? (
                  <div className="text-center py-12">
                    <FaImage className="mx-auto text-5xl text-gray-300 mb-4" />
                    <p className="text-gray-500">No newsletters uploaded yet</p>
                  </div>
                ) : (
                  newsletters.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={item.newsletter_url}
                            alt="newsletter"
                            className="w-20 h-20 object-contain rounded-lg border border-gray-100 cursor-pointer hover:opacity-80 transition"
                            onClick={() => setLightboxUrl(item.newsletter_url)}
                            loading="lazy"
                            decoding="async"
                            title="Click to preview"
                          />
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition"
                            title="Delete Newsletter"
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
                                {MONTHS[item.publish_month - 1] || item.publish_month} {item.publish_yr}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Published {new Date(item.published_at).toLocaleDateString("en-GB")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {editingId !== item.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition"
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => setLightboxUrl(item.newsletter_url)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition"
                          >
                            <FaEye size={12} /> Preview
                          </button>

                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Pre-publish Preview Modal ── */}
      {showPreviewModal && preview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white/10 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3">
              <FaEye className="text-white hidden sm:block" />
              <div>
                <p className="text-white font-bold text-base sm:text-lg">Preview Newsletter</p>
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
                <FaTimes size={13} /> Close Preview
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
              alt="Newsletter preview"
              className="max-w-full max-h-[70vh] sm:max-h-full rounded-xl sm:rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* ── Existing Newsletter Lightbox ── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-3.5 rounded-full transition z-10 shadow-lg"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
          <img
            src={lightboxUrl}
            alt="Newsletter"
            className="max-w-full max-h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Delete Newsletter?"
        message="Are you sure you want to permanently delete this newsletter? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default Newsletter;