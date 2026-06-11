import { supabase } from "./supabase-client";

/**
 * Fetch all notifications relevant to a specific user.
 * Returns notifications targeted to 'all' OR to this specific user's email.
 * Includes a computed `is_read` field based on the notification_reads table.
 */
export const fetchNotifications = async (userEmail) => {
	// 1. Get all notifications targeted to this user or 'all'
	const { data: notifications, error: nError } = await supabase
		.schema("me_dataspace")
		.from("notifications")
		.select("*")
		.or(`target.eq.all,target.eq.${userEmail}`)
		.order("created_at", { ascending: false });

	if (nError) {
		console.error("Error fetching notifications:", nError.message);
		return [];
	}

	// 2. Get all read notification IDs for this user
	const { data: reads, error: rError } = await supabase
		.schema("me_dataspace")
		.from("notification_reads")
		.select("notification_id")
		.eq("user_email", userEmail);

	if (rError) {
		console.error("Error fetching reads:", rError.message);
	}

	const readIds = new Set((reads || []).map((r) => r.notification_id));

	// 3. Merge: attach is_read to each notification
	return (notifications || []).map((n) => ({
		...n,
		is_read: readIds.has(n.id),
	}));
};

/**
 * Fetch the count of unread notifications for a user.
 */
export const fetchUnreadCount = async (userEmail) => {
	// Get all notification IDs targeted to this user
	const { data: notifications, error: nError } = await supabase
		.schema("me_dataspace")
		.from("notifications")
		.select("id")
		.or(`target.eq.all,target.eq.${userEmail}`);

	if (nError || !notifications) return 0;

	// Get read notification IDs
	const { data: reads, error: rError } = await supabase
		.schema("me_dataspace")
		.from("notification_reads")
		.select("notification_id")
		.eq("user_email", userEmail);

	if (rError) return notifications.length;

	const readIds = new Set((reads || []).map((r) => r.notification_id));
	return notifications.filter((n) => !readIds.has(n.id)).length;
};

/**
 * Mark a single notification as read for a user.
 */
export const markAsRead = async (notificationId, userEmail) => {
	const { error } = await supabase
		.schema("me_dataspace")
		.from("notification_reads")
		.upsert(
			{ notification_id: notificationId, user_email: userEmail },
			{ onConflict: "notification_id,user_email" }
		);

	if (error) {
		console.error("Error marking as read:", error.message);
		return false;
	}
	return true;
};

/**
 * Mark ALL unread notifications as read for a user.
 */
export const markAllAsRead = async (userEmail) => {
	// Get all notification IDs for this user
	const { data: notifications, error: nError } = await supabase
		.schema("me_dataspace")
		.from("notifications")
		.select("id")
		.or(`target.eq.all,target.eq.${userEmail}`);

	if (nError || !notifications?.length) return false;

	// Get already-read IDs
	const { data: reads } = await supabase
		.schema("me_dataspace")
		.from("notification_reads")
		.select("notification_id")
		.eq("user_email", userEmail);

	const readIds = new Set((reads || []).map((r) => r.notification_id));
	const unreadIds = notifications.filter((n) => !readIds.has(n.id));

	if (unreadIds.length === 0) return true;

	// Bulk insert reads
	const inserts = unreadIds.map((n) => ({
		notification_id: n.id,
		user_email: userEmail,
	}));

	const { error } = await supabase
		.schema("me_dataspace")
		.from("notification_reads")
		.insert(inserts);

	if (error) {
		console.error("Error marking all as read:", error.message);
		return false;
	}
	return true;
};

/**
 * Send a new notification (admin only).
 */
export const sendNotification = async ({
	title,
	body,
	type = "broadcast",
	priority = "normal",
	target = "all",
	metadata = {},
	createdBy,
}) => {
	const { data, error } = await supabase
		.schema("me_dataspace")
		.from("notifications")
		.insert({
			title,
			body,
			type,
			priority,
			target,
			metadata,
			created_by: createdBy,
		})
		.select()
		.single();

	if (error) {
		console.error("Error sending notification:", error.message);
		return { data: null, error };
	}
	return { data, error: null };
};

/**
 * Fetch all sent notifications (admin view — no user filtering).
 */
export const fetchAllNotifications = async () => {
	const { data, error } = await supabase
		.schema("me_dataspace")
		.from("notifications")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching all notifications:", error.message);
		return [];
	}
	return data || [];
};

/**
 * Delete a notification (admin only).
 */
export const deleteNotification = async (notificationId) => {
	const { error } = await supabase
		.schema("me_dataspace")
		.from("notifications")
		.delete()
		.eq("id", notificationId);

	if (error) {
		console.error("Error deleting notification:", error.message);
		return false;
	}
	return true;
};

/**
 * Subscribe to real-time notification inserts via Supabase Realtime.
 * Returns the channel so caller can unsubscribe.
 */
export const subscribeToNotifications = (callback) => {
	const channel = supabase
		.channel("notifications-realtime")
		.on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "me_dataspace",
				table: "notifications",
			},
			(payload) => {
				callback(payload.new);
			}
		)
		.subscribe();

	return channel;
};

/**
 * Unsubscribe from a realtime channel.
 */
export const unsubscribeFromNotifications = (channel) => {
	if (channel) {
		supabase.removeChannel(channel);
	}
};
