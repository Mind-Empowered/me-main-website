import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import {
	sendNotification,
	fetchAllNotifications,
	deleteNotification,
} from "../../services/notificationService";
import {
	FaBell,
	FaBullhorn,
	FaCalendarCheck,
	FaTasks,
	FaNewspaper,
	FaTrophy,
	FaPaperPlane,
	FaTrash,
	FaSearch,
	FaUsers,
	FaTimes,
	FaSpinner,
	FaExclamationTriangle
} from "react-icons/fa";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import toast from "react-hot-toast";
import { logActivity } from "../../services/activityLog";

// ─── Notification type options ────────────────────────────
const TYPE_OPTIONS = [
	{ value: "broadcast", label: "Broadcast", icon: FaBullhorn, color: "text-orange-600 bg-orange-50 border-orange-200" },
	{ value: "event_reminder", label: "Event Reminder", icon: FaCalendarCheck, color: "text-blue-600 bg-blue-50 border-blue-200" },
	{ value: "task_assignment", label: "Task Assignment", icon: FaTasks, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
	{ value: "newsletter", label: "Newsletter", icon: FaNewspaper, color: "text-purple-600 bg-purple-50 border-purple-200" },
	{ value: "recognition", label: "Recognition", icon: FaTrophy, color: "text-amber-600 bg-amber-50 border-amber-200" },
];

const PRIORITY_OPTIONS = [
	{ value: "low", label: "Low", color: "text-gray-600 bg-gray-50 border-gray-200" },
	{ value: "normal", label: "Normal", color: "text-blue-600 bg-blue-50 border-blue-200" },
	{ value: "high", label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
	{ value: "urgent", label: "Urgent", color: "text-red-600 bg-red-50 border-red-200" },
];

const AdminNotifications = () => {
	// ─── Form state ───────────────────────────────────────
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [type, setType] = useState("broadcast");
	const [priority, setPriority] = useState("normal");
	const [target, setTarget] = useState("all");
	const [sending, setSending] = useState(false);

	// ─── Volunteer list for targeting ─────────────────────
	const [volunteers, setVolunteers] = useState([]);
	const [volunteerSearch, setVolunteerSearch] = useState("");
	const [showVolunteerDropdown, setShowVolunteerDropdown] = useState(false);

	// ─── Sent history ─────────────────────────────────────
	const [sentNotifications, setSentNotifications] = useState([]);
	const [historyLoading, setHistoryLoading] = useState(true);
	const [deleteConfirmId, setDeleteConfirmId] = useState(null);

	// ─── Admin email ──────────────────────────────────────
	const [adminEmail, setAdminEmail] = useState("");

	// ─── Init ─────────────────────────────────────────────
	useEffect(() => {
		const init = async () => {
			try {
				// Get admin email
				const { data: { user } } = await supabase.auth.getUser();
				if (user?.email) setAdminEmail(user.email);

				// Fetch volunteers
				const { data: users } = await supabase
					.schema("me_dataspace")
					.from("users")
					.select("emailID, firstName, lastName")
					.ilike("role", "volunteer")
					.order("firstName");

				if (users) {
					// Map to standard name property
					const mappedVolunteers = users.map(u => ({
						emailID: u.emailID,
						name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.emailID
					}));
					setVolunteers(mappedVolunteers);
				}

				// Fetch sent notifications
				const notifications = await fetchAllNotifications();
				setSentNotifications(notifications || []);
			} catch (err) {
				console.error("Error initializing notifications:", err);
			} finally {
				setHistoryLoading(false);
			}
		};

		init();
	}, []);

	// ─── Filtered volunteers for search ───────────────────
	const filteredVolunteers = volunteers.filter(
		(v) =>
			v.name?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
			v.emailID?.toLowerCase().includes(volunteerSearch.toLowerCase())
	);

	// ─── Send handler ─────────────────────────────────────
	const handleSend = async () => {
		if (!title.trim() || !body.trim()) {
			toast.error("Please fill in title and message.");
			return;
		}

		setSending(true);
		try {
			const { data, error } = await sendNotification({
				title: title.trim(),
				body: body.trim(),
				type,
				priority,
				target,
				createdBy: adminEmail,
			});

			if (error) throw error;

			toast.success("Notification sent successfully!");
			// Reset form
			setTitle("");
			setBody("");
			setType("broadcast");
			setPriority("normal");
			setTarget("all");
			
			// Log activity
			await logActivity({
				action: 'SEND_NOTIFICATION',
				description: `Sent ${type} notification: ${title}`,
				entity_type: 'notification',
				entity_id: data?.id || 'new'
			});

			// Add to history list
			if (data) {
				setSentNotifications((prev) => [data, ...prev]);
			}
		} catch (err) {
			toast.error("Failed to send notification: " + err.message);
		} finally {
			setSending(false);
		}
	};

	// ─── Delete handler ───────────────────────────────────
	const handleDelete = async () => {
		if (!deleteConfirmId) return;
		
		const success = await deleteNotification(deleteConfirmId);
		if (success) {
			setSentNotifications((prev) => prev.filter((n) => n.id !== deleteConfirmId));
			toast.success("Notification deleted.");
			await logActivity({
				action: 'DELETE_NOTIFICATION',
				description: `Deleted notification`,
				entity_type: 'notification',
				entity_id: deleteConfirmId
			});
		} else {
			toast.error("Failed to delete notification.");
		}
		setDeleteConfirmId(null);
	};

	// ─── Helpers ──────────────────────────────────────────
	const getTypeConfig = (typeValue) =>
		TYPE_OPTIONS.find((t) => t.value === typeValue) || TYPE_OPTIONS[0];

	const getPriorityConfig = (priorityValue) =>
		PRIORITY_OPTIONS.find((p) => p.value === priorityValue) || PRIORITY_OPTIONS[1];

	return (
		<div className="h-screen bg-[#F5F0E8] overflow-auto flex flex-col">
			{/* Topbar */}
			<div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
				<div>
					<h1 className="text-xl font-bold text-gray-800">
						Notifications Center
					</h1>
					<p className="text-gray-400 text-sm">
						Send announcements and targeted messages to volunteers.
					</p>
				</div>
			</div>

			{/* Main Scrollable Content */}
			<div className="p-6 bg-[#F7F2EC] flex-1 overflow-auto space-y-6">
				
				{/* ─── Composer Form Card ────────────────────────── */}
				<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
					<h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
						<FaPaperPlane className="text-[#C1622A] text-sm" />
						Compose Notification
					</h2>

					<div className="space-y-4">
						{/* Title */}
						<div>
							<label className="text-sm text-gray-500 font-medium">Notification Title *</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. Meeting on Saturday / New Event Posted"
								className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] focus:ring-2 focus:ring-[#C1622A]/20 transition"
								maxLength={120}
							/>
							<div className="flex justify-end text-[10px] text-gray-400 mt-0.5">
								{title.length}/120
							</div>
						</div>

						{/* Body */}
						<div>
							<label className="text-sm text-gray-500 font-medium">Message Body *</label>
							<textarea
								value={body}
								onChange={(e) => setBody(e.target.value)}
								placeholder="Type details for volunteers here..."
								rows={3}
								className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] focus:ring-2 focus:ring-[#C1622A]/20 transition resize-none"
								maxLength={500}
							/>
							<div className="flex justify-end text-[10px] text-gray-400 mt-0.5">
								{body.length}/500
							</div>
						</div>

						{/* Options Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Type Selector */}
							<div>
								<label className="text-sm text-gray-500 font-medium block">Type</label>
								<select
									value={type}
									onChange={(e) => setType(e.target.value)}
									className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] bg-white text-gray-700 cursor-pointer"
								>
									{TYPE_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							{/* Priority Selector */}
							<div>
								<label className="text-sm text-gray-500 font-medium block">Priority</label>
								<select
									value={priority}
									onChange={(e) => setPriority(e.target.value)}
									className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A] bg-white text-gray-700 cursor-pointer"
								>
									{PRIORITY_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							{/* Target Selector */}
							<div>
								<label className="text-sm text-gray-500 font-medium block">Send To</label>
								<div className="relative mt-1">
									{target === "all" ? (
										<div className="flex gap-2">
											<button
												type="button"
												onClick={() => setShowVolunteerDropdown(true)}
												className="w-full text-left border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 flex justify-between items-center"
											>
												<span>All Volunteers</span>
												<span className="text-xs text-[#C1622A] font-semibold">Change</span>
											</button>
										</div>
									) : (
										<div className="flex gap-2">
											<button
												type="button"
												onClick={() => { setTarget("all"); setVolunteerSearch(""); }}
												className="flex-1 text-left border border-[#C1622A] rounded-lg px-3 py-2 text-sm bg-orange-50 text-gray-800 font-medium flex justify-between items-center"
											>
												<span className="truncate">{target}</span>
												<FaTimes className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-1" />
											</button>
										</div>
									)}

									{/* Dropdown Overlay */}
									{showVolunteerDropdown && (
										<div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-lg border border-gray-200 shadow-xl z-10 max-h-48 overflow-y-auto">
											<div className="p-2 border-b border-gray-100 flex items-center sticky top-0 bg-white">
												<FaSearch className="text-gray-400 mr-2 ml-1 text-xs" />
												<input
													type="text"
													value={volunteerSearch}
													onChange={(e) => setVolunteerSearch(e.target.value)}
													placeholder="Search email/name..."
													className="w-full text-xs outline-none py-1 text-gray-700"
												/>
												<button 
													onClick={() => setShowVolunteerDropdown(false)}
													className="text-gray-400 hover:text-gray-600 p-1"
												>
													<FaTimes size={10} />
												</button>
											</div>
											<button
												onClick={() => {
													setTarget("all");
													setShowVolunteerDropdown(false);
													setVolunteerSearch("");
												}}
												className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF7F2] font-semibold text-[#C1622A] border-b border-gray-50 flex items-center gap-1.5"
											>
												<FaUsers size={12} /> Send to All Volunteers
											</button>
											{filteredVolunteers.map((v) => (
												<button
													key={v.emailID}
													onClick={() => {
														setTarget(v.emailID);
														setShowVolunteerDropdown(false);
														setVolunteerSearch("");
													}}
													className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF7F2] transition block border-b border-gray-50"
												>
													<p className="font-semibold text-gray-700 truncate">{v.name}</p>
													<p className="text-[10px] text-gray-400 truncate">{v.emailID}</p>
												</button>
											))}
											{filteredVolunteers.length === 0 && (
												<p className="p-3 text-xs text-gray-400 text-center">No matching volunteers</p>
											)}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Action Button */}
						<div className="flex justify-end pt-2">
							<button
								onClick={handleSend}
								disabled={sending}
								className="bg-[#C1622A] hover:bg-[#a8521f] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition disabled:opacity-60 shadow-sm flex items-center gap-2"
							>
								{sending ? (
									<>
										<FaSpinner className="animate-spin" size={14} />
										Sending...
									</>
								) : (
									<>
										<FaPaperPlane size={12} />
										Send Notification
									</>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* ─── Sent History Card ─────────────────────────── */}
				<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
					<div className="flex justify-between items-center mb-4">
						<h2 className="font-semibold text-gray-700 flex items-center gap-2">
							<FaBell className="text-[#C1622A] text-sm" />
							Sent History
						</h2>
						{!historyLoading && (
							<span className="bg-[#EFE7DD] text-[#6B4B2A] text-xs font-bold px-2 py-0.5 rounded-full">
								{sentNotifications.length} Total
							</span>
						)}
					</div>

					{historyLoading ? (
						<div className="space-y-3">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
							))}
						</div>
					) : sentNotifications.length === 0 ? (
						<div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
							<FaBell className="text-gray-300 text-3xl mx-auto mb-2" />
							<p className="text-gray-500 text-sm">No notifications sent yet</p>
						</div>
					) : (
						<div className="bg-white rounded-xl overflow-hidden border border-gray-100">
							{/* Table Header */}
							<div className="hidden lg:grid grid-cols-[1fr_130px_100px_180px_140px_60px] bg-[#EFE7DD] text-[#6B4B2A] text-sm font-semibold p-4">
								<p>Notification</p>
								<p>Type</p>
								<p>Priority</p>
								<p>Sent To</p>
								<p>Sent At</p>
								<p className="text-center">Action</p>
							</div>

							{/* Table Body */}
							<div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
								{sentNotifications.map((noti) => {
									const typeCfg = getTypeConfig(noti.type);
									const priCfg = getPriorityConfig(noti.priority);
									const TypeIcon = typeCfg.icon;

									return (
										<div
											key={noti.id}
											className="flex flex-col lg:grid lg:grid-cols-[1fr_130px_100px_180px_140px_60px] p-4 items-start lg:items-center gap-3 lg:gap-4 hover:bg-gray-50 transition text-sm text-gray-700"
										>
											{/* Content info */}
											<div className="min-w-0 flex-1 w-full">
												<p className="font-semibold text-gray-800 truncate">{noti.title}</p>
												<p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{noti.body}</p>
											</div>

											{/* Type Badge */}
											<div className="flex items-center">
												<span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${typeCfg.color}`}>
													<TypeIcon className="text-[10px]" />
													{typeCfg.label}
												</span>
											</div>

											{/* Priority Badge */}
											<div>
												<span className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${priCfg.color}`}>
													{noti.priority}
												</span>
											</div>

											{/* Sent To */}
											<div className="truncate w-full max-w-[170px]" title={noti.target}>
												{noti.target === "all" ? (
													<span className="text-gray-600 font-medium">All Volunteers</span>
												) : (
													<span className="text-gray-500 font-mono text-xs">{noti.target}</span>
												)}
											</div>

											{/* Sent At */}
											<div className="text-gray-500 text-xs">
												{new Date(noti.created_at).toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric"
												})} @ {new Date(noti.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</div>

											{/* Action */}
											<div className="w-full lg:w-auto flex justify-end lg:justify-center">
												<button
													onClick={() => setDeleteConfirmId(noti.id)}
													className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
													title="Delete Notification"
												>
													<FaTrash size={12} />
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={!!deleteConfirmId}
				title="Delete Notification"
				message="Are you sure you want to delete this notification history item? It will be removed from sent records."
				onConfirm={handleDelete}
				onCancel={() => setDeleteConfirmId(null)}
			/>
		</div>
	);
};

export default AdminNotifications;
