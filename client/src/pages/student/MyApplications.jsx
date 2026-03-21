import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await API.get('/applications/my');
        setApplications(data);
      } catch (err) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const getStatusClass = (status) => {
    if (status === 'Applied') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (status === 'In Review') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (status === 'Accepted') return 'bg-green-50 text-green-700 border-green-200';
    if (status === 'Rejected') return 'bg-red-50 text-red-700 border-red-200';
    return '';
  };

  const getModeClass = (mode) => {
    if (mode === 'Online') return 'text-xs px-2 py-1 rounded-full bg-green-50 text-green-700';
    return 'text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

        {applications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg font-medium text-gray-700">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Browse internships and apply to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => {
              const internship = app.internshipId;
              return (
                <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{internship?.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {internship?.professorId?.name} · {internship?.iitName}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={getModeClass(internship?.mode)}>
                          {internship?.mode}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Deadline: {new Date(internship?.deadline).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Applied: {new Date(app.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {app.resumeUrl && (
                        <a
                          href={"http://localhost:5000" + app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 text-sm mt-3 hover:underline"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                    <div className="ml-4">
                      <span className={"text-sm font-medium px-3 py-1.5 rounded-full border " + getStatusClass(app.status)}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;