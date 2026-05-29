import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase-client';
import { FaHistory, FaSync, FaTrash, FaEdit, FaUserPlus, FaCalendarPlus, FaImage, FaEnvelope, FaFileAlt, FaUser } from 'react-icons/fa';
import { AdminListSkeleton } from '../../components/adminDashboard/AdminSkeletons';

const ACTION_ICONS = {
  DELETE_VOLUNTEER: FaTrash,
  EDIT_VOLUNTEER: FaEdit,
  DELETE_EVENT: FaTrash,
  EDIT_EVENT: FaEdit,
  CREATE_EVENT: FaCalendarPlus,
  MARK_ATTENDANCE: FaUser,
  ADD_WALKIN: FaUserPlus,
  DELETE_NEWSLETTER: FaTrash,
  UPLOAD_NEWSLETTER: FaEnvelope,
  DELETE_CALENDAR: FaTrash,
  UPLOAD_CALENDAR: FaFileAlt,
  UPLOAD_PHOTO: FaImage,
};

const ACTION_COLORS = {
  DELETE_VOLUNTEER: 'bg-red-100 text-red-600',
  EDIT_VOLUNTEER: 'bg-blue-100 text-blue-600',
  DELETE_EVENT: 'bg-red-100 text-red-600',
  EDIT_EVENT: 'bg-blue-100 text-blue-600',
  CREATE_EVENT: 'bg-green-100 text-green-700',
  MARK_ATTENDANCE: 'bg-orange-100 text-orange-600',
  ADD_WALKIN: 'bg-purple-100 text-purple-700',
  DELETE_NEWSLETTER: 'bg-red-100 text-red-600',
  UPLOAD_NEWSLETTER: 'bg-green-100 text-green-700',
  DELETE_CALENDAR: 'bg-red-100 text-red-600',
  UPLOAD_CALENDAR: 'bg-green-100 text-green-700',
  UPLOAD_PHOTO: 'bg-indigo-100 text-indigo-600',
};

const PAGE_SIZE = 20;

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .schema('me_dataspace')
        .from('activity_log')
        .select('*', { count: 'exact' })
        .order('performed_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (actionFilter) query = query.eq('action', actionFilter);

      const { data, count, error } = await query;
      if (error) throw error;
      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page, actionFilter]);

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const allActions = Object.keys(ACTION_ICONS);

  return (
    <div className="p-4 sm:p-6 bg-[#F7F2EC] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <FaHistory className="text-[#C1622A] text-xl" />
          <h1 className="text-xl font-bold text-[#461711]">Activity Log</h1>
          <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{totalCount} entries</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(0); }}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40"
          >
            <option value="">All Actions</option>
            {allActions.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
          </select>
          <button
            onClick={() => fetchLogs()}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#C1622A] hover:text-[#C1622A] transition"
          >
            <FaSync size={12} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <AdminListSkeleton rows={8} /> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <FaHistory className="mx-auto text-5xl text-gray-200 mb-4" />
              <p className="text-gray-500">No activity recorded yet.</p>
              <p className="text-gray-400 text-sm mt-1">Actions taken in the admin panel will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map(log => {
                const Icon = ACTION_ICONS[log.action] || FaHistory;
                const colorClass = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3 w-full sm:w-auto">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{log.description}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className="text-xs text-gray-400">{log.performed_by}</span>
                          <span className="text-gray-200 hidden sm:inline">·</span>
                          <span className="text-xs text-gray-400">{formatTime(log.performed_at)}</span>
                          {log.entity_type && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{log.entity_type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded sm:ml-auto shrink-0 mt-2 sm:mt-0">{log.action}</span>
                  </div>
                );
              })}
            </div>
          )}

          {totalCount > PAGE_SIZE && (
            <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(totalCount / PAGE_SIZE)}</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition">Previous</button>
                <button disabled={(page + 1) * PAGE_SIZE >= totalCount} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
