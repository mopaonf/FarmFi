import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';

function UpdatesList({ updates }) {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 6; // Adjusted for two-column layout

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

   const paginatedUpdates = updates.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const totalPages = Math.ceil(updates.length / itemsPerPage);

   return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
         <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
               Recent Updates
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
               Latest activities and milestones from ongoing projects
            </p>
         </div>

         {updates.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
               No updates available at the moment.
            </div>
         ) : (
            <motion.div
               className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
            >
               {paginatedUpdates.map((update) => (
                  <motion.div
                     key={update._id}
                     className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                     <div className="relative h-48 overflow-hidden rounded-t-lg">
                        {update.media && update.media.length > 0 ? (
                           <img
                              src={update.media[0]}
                              alt={`Media for ${update.project.title}`}
                              className="w-full h-full object-cover"
                           />
                        ) : (
                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                           </div>
                        )}
                        <div className="absolute top-3 right-3">
                           <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getMilestoneBadgeColor(
                                 update.milestone_type
                              )}`}
                           >
                              {update.milestone_type
                                 .split('_')
                                 .map(
                                    (word) =>
                                       word.charAt(0).toUpperCase() +
                                       word.slice(1)
                                 )
                                 .join(' ')}
                           </span>
                        </div>
                     </div>

                     <div className="p-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-medium text-green-600 truncate">
                              {update.project.title}
                           </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 flex items-center">
                           <FaCalendarAlt className="mr-1.5 h-3 w-3 text-gray-400" />
                           {formatDate(update.createdAt)}
                        </p>
                        <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                           {update.text_content}
                        </p>

                        <div className="mt-4">
                           <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150">
                              View Details
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </motion.div>
         )}

         {/* Pagination */}
         {updates.length > itemsPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                     <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                           {(currentPage - 1) * itemsPerPage + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                           {Math.min(
                              currentPage * itemsPerPage,
                              updates.length
                           )}
                        </span>{' '}
                        of <span className="font-medium">{updates.length}</span>{' '}
                        results
                     </p>
                  </div>
                  <div>
                     <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                     >
                        <button
                           onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                           }
                           disabled={currentPage === 1}
                           className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Previous
                        </button>

                        {Array.from(
                           { length: totalPages },
                           (_, i) => i + 1
                        ).map((pageNum) => (
                           <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                 pageNum === currentPage
                                    ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                           >
                              {pageNum}
                           </button>
                        ))}

                        <button
                           onClick={() =>
                              setCurrentPage((prev) =>
                                 Math.min(prev + 1, totalPages)
                              )
                           }
                           disabled={currentPage === totalPages}
                           className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Next
                        </button>
                     </nav>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default UpdatesList;
