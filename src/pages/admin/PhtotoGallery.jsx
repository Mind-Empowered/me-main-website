import { useEffect, useState } from "react";
import {
  FaUpload,
  FaTrash,
  FaImage,
  FaCalendarAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { supabase } from "../../services/supabase-client";
import UploadPhotoModal from "../../components/adminDashboard/UploadPhotoModal";
import { AdminGallerySkeleton, AdminStatsSkeleton } from "../../components/adminDashboard/AdminSkeletons";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import toast from "react-hot-toast";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [uploadedThisMonth, setUploadedThisMonth] = useState(0);
  const [albumCount, setAlbumCount] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 18;
  const fromIndex = page * PAGE_SIZE;
  const toIndex = fromIndex + PAGE_SIZE - 1;
  
  const [confirmDeleteData, setConfirmDeleteData] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ).toISOString();

      // Run queries concurrently
      const [
        { data, count },
        { count: monthCount },
        { data: distinctEventsCount }
      ] = await Promise.all([
        supabase
          .schema("me_dataspace")
          .from("gallery")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(fromIndex, toIndex),
          
        supabase
          .schema("me_dataspace")
          .from("gallery")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth),
          
        supabase.rpc("get_distinct_album_count")
      ]);

      setPhotos(data || []);
      setTotalCount(count || 0);
      setUploadedThisMonth(monthCount || 0);
      setAlbumCount(distinctEventsCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [page]);

  const confirmDelete = async () => {
    if (!confirmDeleteData) return;
    const { itemID, storageURL } = confirmDeleteData;

    try {
      // extract filename from URL
      const fileName = storageURL.split("/").pop();

      // delete from storage
      await supabase.storage.from("gallery").remove([fileName]);

      // delete from table
      const { error } = await supabase
        .schema("me_dataspace")
        .from("gallery")
        .delete()
        .eq("itemID", itemID);
        
      if (error) throw error;

      toast.success("Photo deleted");
      fetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete photo");
    }
    setConfirmDeleteData(null);
  };

  return (
    <div className="p-6 bg-[#F5F0E8] min-h-screen">
      {loading ? (
        <div className="space-y-6">
          <AdminStatsSkeleton cards={2} />
          <div className="bg-white rounded-xl p-6 space-y-5">
            <div className="h-5 w-32 rounded-full bg-gradient-to-r from-[#e7ddd4] via-white to-[#e7ddd4] bg-[length:200%_100%] animate-pulse" />
            <AdminGallerySkeleton items={12} />
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 flex items-center gap-4">
              <FaImage className="text-[#C1622A] text-2xl opacity-60" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{totalCount}</p>
                <p className="text-xs text-gray-400">Total Photos</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 flex items-center gap-4">
              <FaCloudUploadAlt className="text-[#C1622A] text-2xl opacity-60" />
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {uploadedThisMonth}
                </p>
                <p className="text-xs text-gray-400">Uploaded This Month</p>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="bg-white rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">All Photos</h3>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-[#C1622A] text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <FaUpload size={10} /> Upload Photo
              </button>
            </div>

            {photos.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">
                No photos yet. Upload your first one!
              </p>
            ) : (
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-auto min-h-[50vh] pb-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.itemID}
                      className="relative group rounded-lg overflow-hidden aspect-square"
                    >
                      <img
                        src={photo.storageURL}
                        alt={photo.alt_text || photo.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                        <p className="text-white text-xs font-medium px-2 text-center">
                          {photo.title}
                        </p>
                        <button
                          onClick={() => setConfirmDeleteData({ itemID: photo.itemID, storageURL: photo.storageURL })}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalCount > PAGE_SIZE && (
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-auto">
                    <span className="text-sm text-gray-500">
                      Showing {Math.min(fromIndex + 1, totalCount)} to {Math.min(toIndex + 1, totalCount)} of {totalCount} photos
                    </span>
                    <div className="flex gap-2">
                      <button 
                        disabled={page === 0} 
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm disabled:opacity-50 font-medium transition text-gray-700"
                      >
                        Previous
                      </button>
                      <button 
                        disabled={(page + 1) * PAGE_SIZE >= totalCount} 
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm disabled:opacity-50 font-medium transition text-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {showUpload && (
            <UploadPhotoModal
              onClose={() => setShowUpload(false)}
              onSuccess={fetchPhotos}
            />
          )}

          <ConfirmModal 
            isOpen={!!confirmDeleteData}
            title="Delete Photo?"
            message="Are you sure you want to permanently delete this photo? This cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setConfirmDeleteData(null)}
          />
        </>
      )}
    </div>
  );
};

export default PhotoGallery;
