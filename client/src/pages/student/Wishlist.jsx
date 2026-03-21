import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/wishlist');
        setWishlist(data);
      } catch (err) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const removeFromWishlist = async (internshipId) => {
    try {
      await API.delete(`/wishlist/${internshipId}`);
      setWishlist(wishlist.filter(w => w.internshipId?._id !== internshipId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">♥</div>
            <p className="text-lg font-medium text-gray-700">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mt-1">Click the heart on any internship to save it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map(item => {
              const i = item.internshipId;
              if (!i) return null;
              const daysLeft = Math.ceil((new Date(i.deadline) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/student/internship/${i._id}`)}
                    >
                      <h3 className="font-semibold text-gray-900">{i.title}</h3>
                      <p className="text-sm text-gray-500">{i.professorId?.name} · {i.iitName}</p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(i._id)}
                      className="text-red-400 hover:text-red-600 text-lg ml-2"
                    >
                      ♥
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{i.domain}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${i.mode === 'Online' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>{i.mode}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">
                      {i.stipend > 0 ? `₹${i.stipend.toLocaleString()}/mo` : 'Unpaid'}
                    </span>
                    <span className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
                    </span>
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

export default Wishlist;