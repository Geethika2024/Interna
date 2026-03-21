import { useState, useEffect } from 'react';
import API from '../../api/axios';
import InternshipCard from '../../components/shared/InternshipCard';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [internships, setInternships]   = useState([]);
  const [wishlistIds, setWishlistIds]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [stats, setStats]               = useState({ applied: 0, inReview: 0, accepted: 0, wishlist: 0 });
  const [filters, setFilters]           = useState({
    search: '', iitName: '', domain: '', mode: '', minStipend: '', skills: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });

      const [internRes, wishRes, appRes] = await Promise.all([
        API.get('/internships', { params }),
        API.get('/wishlist'),
        API.get('/applications/my')
      ]);

      setInternships(internRes.data);
      setWishlistIds(wishRes.data.map(w => w.internshipId?._id));

      const apps = appRes.data;
      setStats({
        applied:  apps.length,
        inReview: apps.filter(a => a.status === 'In Review').length,
        accepted: apps.filter(a => a.status === 'Accepted').length,
        wishlist: wishRes.data.length
      });
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const urgentInternships = internships.filter(i => {
    const days = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days > 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-indigo-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Discover Research Internships Across IITs</h1>
          <p className="text-indigo-200 mb-6">Connect with top professors and kickstart your research journey</p>

          {/* Stats */}
          <div className="flex gap-6 mb-8">
            {[
              { label: 'Students', value: '2000+' },
              { label: 'Professors', value: '150+' },
              { label: 'Internships', value: '500+' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-indigo-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <input
              type="text" name="search" value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search internships, domains, skills..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Activity Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Applied',     value: stats.applied,  color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'In Review',   value: stats.inReview, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            { label: 'Accepted',    value: stats.accepted, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Wishlisted',  value: stats.wishlist, color: 'bg-pink-50 text-pink-700 border-pink-200' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-4 ${s.color}`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Urgent Deadlines */}
        {urgentInternships.length > 0 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <h2 className="text-red-700 font-semibold mb-3">⏰ Closing Soon</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {urgentInternships.map(i => {
                const days = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={i._id} className="bg-white border border-red-200 rounded-lg p-3 min-w-48 flex-shrink-0">
                    <p className="font-medium text-gray-900 text-sm">{i.title}</p>
                    <p className="text-xs text-gray-500">{i.iitName}</p>
                    <p className="text-xs text-red-500 font-medium mt-1">{days} day{days !== 1 ? 's' : ''} left</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-8">

          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">IIT</label>
                  <input
                    type="text" name="iitName" value={filters.iitName}
                    onChange={handleFilterChange}
                    placeholder="e.g. IIT Bombay"
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Domain</label>
                  <input
                    type="text" name="domain" value={filters.domain}
                    onChange={handleFilterChange}
                    placeholder="e.g. Machine Learning"
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mode</label>
                  <select
                    name="mode" value={filters.mode}
                    onChange={handleFilterChange}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min Stipend (₹)</label>
                  <input
                    type="number" name="minStipend" value={filters.minStipend}
                    onChange={handleFilterChange}
                    placeholder="e.g. 5000"
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</label>
                  <input
                    type="text" name="skills" value={filters.skills}
                    onChange={handleFilterChange}
                    placeholder="e.g. Python, ML"
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={fetchData}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Apply Filters
                </button>

                <button
                  onClick={() => {
                    setFilters({ search: '', iitName: '', domain: '', mode: '', minStipend: '', skills: '' });
                    setTimeout(fetchData, 100);
                  }}
                  className="w-full border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Internship Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">
                {loading ? 'Loading...' : `${internships.length} Internship${internships.length !== 1 ? 's' : ''} Found`}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-medium">No internships found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {internships.map(internship => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    isWishlisted={wishlistIds.includes(internship._id)}
                    onWishlistToggle={(id) => {
                      setWishlistIds(prev =>
                        prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;