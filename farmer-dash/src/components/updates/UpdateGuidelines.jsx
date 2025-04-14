import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

function UpdateGuidelines() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Update Guidelines</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Best practices for submitting quality project updates
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="ml-2 text-sm font-medium text-gray-700">What to Include</h3>
            </div>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-500 text-xs font-medium mr-2">✓</span>
                Regular progress reports (weekly or bi-weekly)
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-500 text-xs font-medium mr-2">✓</span>
                Clear, high-quality photos of your farm/project
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-500 text-xs font-medium mr-2">✓</span>
                Challenges you're facing and how you're addressing them
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-500 text-xs font-medium mr-2">✓</span>
                Important milestone achievements
              </li>
            </ul>
          </div>
          
          <div>
            <div className="flex items-center">
              <FaLightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="ml-2 text-sm font-medium text-gray-700">Best Practices</h3>
            </div>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-xs font-medium mr-2">!</span>
                Be honest about challenges - investors appreciate transparency
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-xs font-medium mr-2">!</span>
                Include photos with every update to showcase progress
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-xs font-medium mr-2">!</span>
                Keep updates concise but informative (250-500 words)
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-xs font-medium mr-2">!</span>
                Link updates to your project timeline and goals
              </li>
            </ul>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-blue-500" />
              <p className="ml-2 text-sm text-gray-700 font-medium">Did you know?</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Projects with regular updates (at least weekly) receive 60% more follow-on funding than those with infrequent updates.
            </p>
            <div className="mt-4">
              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                View the complete update guide →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateGuidelines;