import React from 'react';
import { FaChartLine, FaCalendarCheck, FaTrophy } from 'react-icons/fa';

function UpdateStats({ stats }) {
   return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
               Update Statistics
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
               Performance metrics for project updates
            </p>
         </div>
         
         <div className="p-6">
            <dl>
               <div className="flex items-center py-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-100 text-green-600">
                     <FaCalendarCheck className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                     <dt className="text-sm font-medium text-gray-500">
                        Updates This Month
                     </dt>
                     <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {stats.updatesThisMonth}
                     </dd>
                  </div>
               </div>
               
               <div className="flex items-center py-3 border-t border-gray-200">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-600">
                     <FaChartLine className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                     <dt className="text-sm font-medium text-gray-500">
                        Total Updates
                     </dt>
                     <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {stats.totalUpdates}
                     </dd>
                  </div>
               </div>
               
               <div className="flex items-center py-3 border-t border-gray-200">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-yellow-100 text-yellow-600">
                     <FaTrophy className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                     <dt className="text-sm font-medium text-gray-500">
                        Most Active Project
                     </dt>
                     <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {stats.mostActiveProject || 'N/A'}
                     </dd>
                  </div>
               </div>
            </dl>
         </div>
      </div>
   );
}

export default UpdateStats;