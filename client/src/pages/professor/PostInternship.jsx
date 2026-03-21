import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const PostInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', skills: [], domain: '',
    duration: '', stipend: '', positions: 1,
    iitName: '', mode: 'Online', deadline: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/internships', { ...form, stipend: Number(form.stipend) || 0 });
      toast.success('Internship posted successfully!');
      navigate('/professor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-indigo-600 text-sm font-medium mb-6 hover:underline">
          Back to Dashboard
        </button>
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Internship</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g. ML Research Intern"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                placeholder="Describe the internship..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input type="text" name="domain" value={form.domain} onChange={handleChange} required
                  placeholder="e.g. Machine Learning"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input type="text" name="duration" value={form.duration} onChange={handleChange} required
                  placeholder="e.g. 2 months"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (per month)</label>
                <input type="number" name="stipend" value={form.stipend} onChange={handleChange}
                  placeholder="0 for unpaid"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Positions</label>
                <input type="number" name="positions" value={form.positions} onChange={handleChange} min={1} required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IIT Name</label>
                <input type="text" name="iitName" value={form.iitName} onChange={handleChange} required
                  placeholder="e.g. IIT Bombay"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <select name="mode" value={form.mode} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={addSkill}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-100"
                >
                  Add
                </button>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map(skill => (
                    <span key={skill} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-indigo-600 ml-1">x</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Posting...' : 'Post Internship'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostInternship;
