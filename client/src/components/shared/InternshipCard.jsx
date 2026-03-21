import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const InternshipCard = ({ internship, isWishlisted, onWishlistToggle, showApply = true }) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const navigate = useNavigate();

  const daysLeft = Math.ceil(
    (new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (wishlisted) {
        await API.delete(`/wishlist/${internship._id}`);
        toast.success('Removed from wishlist');
      } else {
        await API.post(`/wishlist/${internship._id}`);
        toast.success('Added to wishlist');
      }
      setWishlisted(!wishlisted);
      if (onWishlistToggle) onWishlistToggle(internship._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div
      onClick={() => navigate(`/student/internship/${internship._id}`)}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{internship.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {internship.professorId?.name} · {internship.iitName}
          </p>
        </div>
        <button
          onClick={handleWishlist}
          className={`ml-2 text-lg transition ${wishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
        >
          ♥
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
          {internship.domain}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          internship.mode === 'Online'
            ? 'bg-green-50 text-green-700'
            : 'bg-orange-50 text-orange-700'
        }`}>
          {internship.mode}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {internship.duration}
        </span>
      </div>

      {/* Skills */}
      {internship.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {internship.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {internship.skills.length > 3 && (
            <span className="text-xs text-gray-400">+{internship.skills.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div>
          {internship.stipend > 0 ? (
            <span className="text-sm font-semibold text-gray-900">
              ₹{internship.stipend.toLocaleString()}/month
            </span>
          ) : (
            <span className="text-sm text-gray-400">Unpaid</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-orange-500' : 'text-gray-400'}`}>
            {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;