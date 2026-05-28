import { supabase } from './supabase-client';

/**
 * Logs an admin action to the activity_log table.
 * @param {Object} params
 * @param {string} params.action - Short action label, e.g. 'DELETE_VOLUNTEER'
 * @param {string} params.description - Human-readable description
 * @param {string} [params.entity_type] - e.g. 'volunteer', 'event', 'newsletter'
 * @param {string} [params.entity_id] - ID of the affected record
 */
export const logActivity = async ({ action, description, entity_type = null, entity_id = null }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .schema('me_dataspace')
      .from('activity_log')
      .insert({
        action,
        description,
        entity_type,
        entity_id: entity_id ? String(entity_id) : null,
        performed_by: user?.email || 'admin',
        performed_at: new Date().toISOString(),
      });
  } catch (err) {
    // Never block the main action if logging fails
    console.warn('Activity log failed:', err.message);
  }
};
