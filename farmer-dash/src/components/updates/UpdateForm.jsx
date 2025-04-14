import React, { useState } from 'react';

function UpdateForm({ projects, onSubmit }) {
  const [formData, setFormData] = useState({
    project: '',
    milestone_type: 'planting',
    text_content: '',
    media: []
  });
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      media: files
    });

    // Generate previews
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setMediaPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        // Reset form
        setFormData({
          project: '',
          milestone_type: 'planting',
          text_content: '',
          media: []
        });
        setMediaPreview([]);
        alert('Update posted successfully!');
      }
    } catch (error) {
      alert('Failed to post update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Post New Update</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">Select Project</label>
          <select 
            id="project" 
            name="project" 
            value={formData.project}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select a project...</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.title}</option>
            ))}
          </select>
        </div>
        
        {/* Milestone Type */}
        <div>
          <label htmlFor="milestone_type" className="block text-sm font-medium text-gray-700">Update Type</label>
          <select 
            id="milestone_type" 
            name="milestone_type" 
            value={formData.milestone_type}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="planting">Planting</option>
            <option value="harvesting">Harvesting</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Update Content */}
        <div>
          <label htmlFor="text_content" className="block text-sm font-medium text-gray-700">Update Details</label>
          <textarea 
            id="text_content" 
            name="text_content" 
            value={formData.text_content}
            onChange={handleChange}
            rows="4" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" 
            placeholder="Share your progress with investors..."
            required
          ></textarea>
        </div>
        
        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Photos & Videos</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="media" className="cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>Upload files</span>
                  <input 
                    id="media" 
                    name="media" 
                    type="file" 
                    className="sr-only" 
                    multiple 
                    accept="image/*,video/*" 
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        {mediaPreview.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {mediaPreview.map((media, index) => (
              <div key={index}>
                {media.type.startsWith('image/') ? (
                  <img 
                    src={media.url} 
                    alt={`Preview ${index}`} 
                    className="h-24 w-full object-cover rounded-md"
                  />
                ) : (
                  <video 
                    src={media.url} 
                    className="h-24 w-full object-cover rounded-md" 
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
          >
            {isSubmitting ? (
              <>
                <span>Posting...</span>
                <svg className="ml-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : 'Post Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateForm;