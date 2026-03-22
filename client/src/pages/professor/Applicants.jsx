import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await API.get('/applications/professor/all');
        setApplications(data);
      } catch (err) {
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleStatus = async (appId, status) => {
    try {
      await API.put('/applications/' + appId + '/status', { status });
      setApplications(applications.map(a => a._id === appId ? { ...a, status } : a));
      toast.success('Marked as ' + status);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Applied') return 'bg-blue-50 text-blue-700';
    if (status === 'In Review') return 'bg-yellow-50 text-yellow-700';
    if (status === 'Accepted') return 'bg-green-50 text-green-700';
    if (status === 'Rejected') return 'bg-red-50 text-red-700';
    return '';
  };

  const getBtnClass = (s, current) => {
    if (current === s) return 'text-xs px-2 py-1 rounded font-medium bg-gray-100 text-gray-400 cursor-default';
    if (s === 'Accepted') return 'text-xs px-2 py-1 rounded font-medium bg-green-50 text-green-700 hover:bg-green-100';
    if (s === 'Rejected') return 'text-xs px-2 py-1 rounded font-medium bg-red-50 text-red-700 hover:bg-red-100';
    return 'text-xs px-2 py-1 rounded font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          All Applicants ({applications.length})
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-500">No applications received yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{app.studentId?.name}</h3>
                      <span className={'text-xs px-2 py-1 rounded-full font-medium ' + getStatusClass(app.status)}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{app.studentId?.email}</p>
                    <p className="text-sm text-gray-600">
                      Applied for: <span className="font-medium text-gray-900">{app.internshipId?.title}</span>
                      {' · '}{app.internshipId?.iitName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Availability: {app.availabilityStatus === 'immediate' ? 'Immediate' : 'Later — ' + app.availabilityDetails}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <a
                        href={"http://localhost:5000" + app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100"
                      >
                        View Resume
                      </a>
                      <span className="text-xs text-gray-400">
                        Applied {new Date(app.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {['Accepted', 'In Review', 'Rejected'].map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatus(app._id, s)}
                        disabled={app.status === s}
                        className={getBtnClass(s, app.status)}
                      >
                       {s === 'Accepted' ? 'Accept' : s === 'In Review' ? 'Mark for Review' : 'Reject'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;