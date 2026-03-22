import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  Applied: 'bg-blue-50 text-blue-700',
  'In Review': 'bg-yellow-50 text-yellow-700',
  Accepted: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
};

const ProfessorDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [intRes, appRes] = await Promise.all([
        API.get('/internships/professor/my'),
        API.get('/applications/professor/all'),
      ]);
      setInternships(intRes.data);
      setApplications(appRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await API.delete('/internships/' + id);
      setInternships(internships.filter((i) => i._id !== id));
      toast.success('Internship deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await API.put('/applications/' + appId + '/status', { status });
      setApplications(
        applications.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      toast.success('Marked as ' + status);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const stats = {
    total: applications.length,
    active: internships.filter((i) => i.isActive).length,
    accepted: applications.filter((a) => a.status === 'Accepted').length,
  };

  const urgentInternships = internships.filter((i) => {
    const days = Math.ceil(
      (new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days <= 7 && days > 0;
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Manage Your Research Internships
            </h1>
            <p className="text-indigo-200">
              Review applications and find the best students
            </p>
          </div>
          <button
            onClick={() => navigate('/professor/post')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >
            + Post Internship
          </button>
        </div>

        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Applications', value: stats.total },
            { label: 'Active Internships', value: stats.active },
            { label: 'Students Selected', value: stats.accepted },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-indigo-500 bg-opacity-50 rounded-xl p-4"
            >
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-indigo-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {urgentInternships.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h2 className="text-orange-700 font-semibold mb-3">
              Upcoming Deadlines
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {urgentInternships.map((i) => {
                const days = Math.ceil(
                  (new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={i._id}
                    className="bg-white border border-orange-200 rounded-lg p-3 min-w-48 flex-shrink-0"
                  >
                    <p className="font-medium text-gray-900 text-sm">
                      {i.title}
                    </p>
                    <p className="text-xs text-orange-500 font-medium mt-1">
                      {days} days left
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            My Internships
          </h2>
          {internships.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500">No internships posted yet</p>
              <button
                onClick={() => navigate('/professor/post')}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Post your first internship
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internships.map((i) => {
                const daysLeft = Math.ceil(
                  (new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={i._id}
                    className="bg-white border border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{i.title}</h3>
                      <span
                        className={
                          daysLeft <= 0
                            ? 'text-xs px-2 py-1 rounded-full bg-red-50 text-red-600'
                            : 'text-xs px-2 py-1 rounded-full bg-green-50 text-green-600'
                        }
                      >
                        {daysLeft <= 0 ? 'Expired' : 'Active'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {i.domain} · {i.mode}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {i.applicantCount || 0} applicants · Deadline:{' '}
                      {new Date(i.deadline).toLocaleDateString('en-IN')}
                    </p>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() =>
                          navigate('/professor/applicants/' + i._id)
                        }
                        className="flex-1 text-xs bg-indigo-50 text-indigo-700 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition"
                      >
                        View Applicants
                      </button>
                      <button
                        onClick={() => navigate('/professor/edit/' + i._id)}
                        className="flex-1 text-xs bg-gray-50 text-gray-700 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(i._id)}
                        className="flex-1 text-xs bg-red-50 text-red-600 py-1.5 rounded-lg font-medium hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Applications
          </h2>
          {applications.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-500">No applications received yet</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Student', 'Internship', 'Resume', 'Status', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.slice(0, 10).map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">
                          {app.studentId?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {app.studentId?.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {app.internshipId?.title}
                      </td>
<td className="px-4 py-3">
  <a href={"http://localhost:5000" + app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs hover:underline">View PDF</a>
</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            'text-xs px-2 py-1 rounded-full font-medium ' +
                            (statusColors[app.status] || '')
                          }
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {['Accepted', 'In Review', 'Rejected'].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusUpdate(app._id, s)}
                              disabled={app.status === s}
                              className={
                                app.status === s
                                  ? 'text-xs px-2 py-1 rounded font-medium bg-gray-100 text-gray-400 cursor-default'
                                  : s === 'Accepted'
                                  ? 'text-xs px-2 py-1 rounded font-medium bg-green-50 text-green-700 hover:bg-green-100'
                                  : s === 'Rejected'
                                  ? 'text-xs px-2 py-1 rounded font-medium bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'text-xs px-2 py-1 rounded font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                              }
                            >
                              {s === 'Accepted' ? 'Accept' : s === 'In Review' ? 'Mark for Review' : 'Reject'}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;