import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';

function UpdateModal({ update, onClose, isVisible }) {
  if (!update) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getMilestoneBadgeColor = (type) => {
    switch (type) {
      case 'planting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'harvesting':
      case 'harvest':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growth_monitoring':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'construction':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'installation':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'stocking':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'health_check':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {update.project.title}
                </h3>
                <div className="mt-2">
                  {update.media && update.media.length > 0 && (
                    <img
                      src={update.media[0]}
                      alt={`Media for ${update.project.title}`}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getMilestoneBadgeColor(update.milestone_type)}`}>
                      {update.milestone_type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1.5 h-3 w-3 text-gray-400" />
                      {formatDate(update.createdAt)}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {update.text_content}
                  </p>
                  
                  {/* Additional details section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Project Details</h4>
                    <dl className="mt-2 space-y-1">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Project ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{update.project._id}</dd>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Update ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{update._id}</dd>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Milestone Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {update.milestone_type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            {/* Can add more action buttons here if needed */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UpdateModal;