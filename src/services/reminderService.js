import { supabase } from "./supabase-client";
import { sendNotification } from "./notificationService";

/**
 * Checks for any events or project occurrences scheduled for tomorrow,
 * and broadcasts a reminder notification to all users if one hasn't been sent already.
 */
export const checkAndSendReminders = async () => {
    try {
        // Throttling: run check at most once every 12 hours per browser session
        const lastCheck = localStorage.getItem("me_last_reminder_check");
        const nowTime = Date.now();
        if (lastCheck && nowTime - parseInt(lastCheck) < 12 * 60 * 60 * 1000) {
            console.log("Reminder check throttled (ran recently).");
            return;
        }

        console.log("Running automated reminder check...");

        const now = new Date();
        const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);

        // 1. Fetch occurrences/events happening tomorrow
        const { data: tomorrowEvents, error: eventsError } = await supabase
            .schema("me_dataspace")
            .from("events")
            .select("eventID, title, fromDateTime, venue, is_project, parent_project_id")
            .gte("fromDateTime", tomorrowStart.toISOString())
            .lte("fromDateTime", tomorrowEnd.toISOString());

        if (eventsError) {
            console.error("Error fetching tomorrow's events:", eventsError.message);
            return;
        }

        if (!tomorrowEvents || tomorrowEvents.length === 0) {
            console.log("No events or project occurrences tomorrow.");
            // Record check timestamp to avoid running repeatedly today
            localStorage.setItem("me_last_reminder_check", nowTime.toString());
            return;
        }

        // 2. Fetch existing event_reminder notifications
        const { data: existingNotifs, error: notifError } = await supabase
            .schema("me_dataspace")
            .from("notifications")
            .select("id, metadata")
            .eq("type", "event_reminder")
            .eq("target", "all");

        if (notifError) {
            console.error("Error fetching existing notifications:", notifError.message);
            return;
        }

        const sentEventIds = new Set();
        (existingNotifs || []).forEach((notif) => {
            if (notif.metadata && notif.metadata.event_id) {
                sentEventIds.add(notif.metadata.event_id);
            }
        });

        // 3. Send notification for each event/project day that hasn't been notified yet
        for (const event of tomorrowEvents) {
            if (sentEventIds.has(event.eventID)) {
                console.log(`Reminder already sent for event: ${event.title} (${event.eventID})`);
                continue;
            }

            const eventTime = new Date(event.fromDateTime);
            const formattedTime = eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const projectPrefix = event.is_project ? "Project: " : "";
            const malayalamPrefix = event.is_project ? "പ്രോജക്ട്: " : "";

            const title = `Reminder: ${projectPrefix}${event.title} is tomorrow! / ഓർമ്മപ്പെടുത്തൽ: ${malayalamPrefix}${event.title} നാളെയാണ്!`;
            const body = `Join us for ${event.title} starting tomorrow at ${formattedTime}. Venue: ${event.venue || 'TBD'}. / നാളെ ${formattedTime}-ന് ആരംഭിക്കുന്ന ${event.title}-ൽ പങ്കുചേരുക. സ്ഥലം: ${event.venue || 'തീരുമാനിച്ചിട്ടില്ല'}.`;

            console.log(`Sending reminder for tomorrow's event: ${event.title}`);
            await sendNotification({
                title,
                body,
                type: "event_reminder",
                priority: "normal",
                target: "all",
                metadata: {
                    event_id: event.eventID,
                    parent_project_id: event.parent_project_id || null,
                    type: event.is_project ? "project" : "event",
                    date: event.fromDateTime,
                },
                createdBy: "automated_reminder",
            });
        }

        // Mark check as done
        localStorage.setItem("me_last_reminder_check", nowTime.toString());
    } catch (err) {
        console.error("Exception in checkAndSendReminders:", err);
    }
};
