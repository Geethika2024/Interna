import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship]           = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [applying, setApplying]               = useState(false);
  const [showApplyForm, setShowApplyForm]      = useState(false);
  const [alreadyApplied, setAlreadyApplied]   = useState(false);
  const [form, setForm] = useState({
    availabilityStatus: 'immediate',
    availabilityDetails: '',
    resume: null
  });

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const [internRes, appRes] = await Promise.all([
          API.get(`/internships/${id}`),
          API.get('/applications/my')
        ]);
        setInternship(internRes.data);
        const applied = appRes.data.some(a => a.internshipId?._id === id);
        setAlreadyApplied(applied);
      } catch (err) {
        toast.error('Failed to load internship');
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.resume) return toast.error('Please upload your resume');

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('internshipId', id);
      formData.append('availabilityStatus', form.availabilityStatus);
      formData.append('availabilityDetails', form.availabilityDetails);
      formData.append('resume', form.resume);

      await API.post('/applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Application submitted successfully!');
      setAlreadyApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!internship) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Internship not found</p>
    </div>
  );

  const daysLeft = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <button onClick={() => navigate(-1)} className="text-indigo-600 text-sm font-medium mb-6 flex items-center gap-1 hover:underline">
          ← Back
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{internship.title}</h1>
              <p className="text-gray-500 mt-1">
                {internship.professorId?.name} · {internship.professorId?.department}
              </p>
              <p className="text-indigo-600 font-medium">{internship.iitName}</p>
            </div>
            <div className="text-right">
              {internship.stipend > 0 ? (
                <div className="text-xl font-bold text-gray-900">₹{internship.stipend.toLocaleString()}/mo</div>
              ) : (
                <div className="text-gray-400">Unpaid</div>
              )}
              <div className={`text-sm font-medium mt-1 ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-orange-500' : 'text-gray-400'}`}>
                {daysLeft <= 0 ? 'Deadline passed' : `${daysLeft} days left`}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium">{internship.domain}</span>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${internship.mode === 'Online' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>{internship.mode}</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{internship.duration}</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{internship.positions} position{internship.positions !== 1 ? 's' : ''}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">About this internship</h2>
            <p className="text-gray-600 leading-relaxed">{internship.description}</p>
          </div>

          {/* Skills */}
          {internship.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, i) => (
                  <span key={i} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 rounded-xl p-4">
            {[
              { label: 'Deadline',  value: new Date(internship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Duration',  value: internship.duration },
              { label: 'Mode',      value: internship.mode },
              { label: 'Positions', value: internship.positions },
            ].map(d => (
              <div key={d.label}>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{d.label}</p>
                <p className="font-semibold text-gray-900 mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          {alreadyApplied ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium">✓ You have already applied to this internship</p>
            </div>
          ) : daysLeft <= 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 font-medium">Application deadline has passed</p>
            </div>
          ) : (
            <button
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              {showApplyForm ? 'Cancel' : 'Apply Now'}
            </button>
          )}
        </div>

        {/* Apply Form */}
        {showApplyForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Application</h2>

            <form onSubmit={handleApply} className="space-y-6">

              {/* Availability */}
              <div>
                <label className="block font-medium text-gray-900 mb-3">Are you available immediately?</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio" name="availability" value="immediate"
                      checked={form.availabilityStatus === 'immediate'}
                      onChange={() => setForm({ ...form, availabilityStatus: 'immediate' })}
                      className="text-indigo-600"
                    />
                    <span className="text-gray-700">Yes, I am available immediately</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio" name="availability" value="later"
                      checked={form.availabilityStatus === 'later'}
                      onChange={() => setForm({ ...form, availabilityStatus: 'later' })}
                      className="text-indigo-600"
                    />
                    <span className="text-gray-700">No, I have a specific timeline</span>
                  </label>
                </div>

                {form.availabilityStatus === 'later' && (
                  <textarea
                    value={form.availabilityDetails}
                    onChange={(e) => setForm({ ...form, availabilityDetails: e.target.value })}
                    placeholder="Please explain your availability timeline..."
                    rows={3}
                    className="mt-3 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block font-medium text-gray-900 mb-2">Upload Resume (PDF only)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition">
                  <input
                    type="file" accept=".pdf"
                    onChange={(e) => setForm({ ...form, resume: e.target.files[0] })}
                    className="hidden" id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {form.resume ? (
                      <div>
                        <p className="text-indigo-600 font-medium">✓ {form.resume.name}</p>
                        <p className="text-gray-400 text-sm mt-1">Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-4xl mb-2">📄</p>
                        <p className="text-gray-600 font-medium">Click to upload your resume</p>
                        <p className="text-gray-400 text-sm mt-1">PDF only, max 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit" disabled={applying}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;