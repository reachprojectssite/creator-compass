import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Video, FileText, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebinarHostingService } from '@/lib/webinar-hosting-service';

export function WebinarCreationForm({ currentUser, onClose, onWebinarCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration_minutes: 60,
    max_participants: 100,
    category: '',
    location: 'Online',
    is_public: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await WebinarHostingService.createWebinarWithMeeting(
        formData, 
        currentUser.id
      );

      if (result.success) {
        setSuccess('Webinar created successfully! Google Meet link generated.');
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          duration_minutes: 60,
          max_participants: 100,
          category: '',
          location: 'Online',
          is_public: true
        });
        
        // Notify parent component
        onWebinarCreated?.(result.data);
        
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to create webinar');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Create webinar error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Technology',
    'Education',
    'Entertainment',
    'Lifestyle',
    'Business',
    'Gaming',
    'Fitness',
    'Food',
    'Travel',
    'Other'
  ];

  const durations = [30, 45, 60, 90, 120, 180];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Create New Webinar</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-slate-100"
            >
              <X size={20} />
            </Button>
          </div>
          <p className="text-slate-600 mt-2">
            Schedule a new webinar and automatically generate a Google Meet link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <FileText size={20} />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Webinar Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                placeholder="Enter webinar title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 resize-none"
                placeholder="Describe what participants will learn..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <Calendar size={20} />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration
                </label>
                <select
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 bg-white"
                >
                  {durations.map(duration => (
                    <option key={duration} value={duration}>
                      {duration} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <Tag size={20} />
              Settings
            </h3>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">Make this webinar public</span>
              </label>
            </div>
          </div>

          {/* Google Meet Integration Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Video size={20} className="text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Google Meet Integration</h4>
                <p className="text-sm text-blue-700 mt-1">
                  A Google Meet link will be automatically generated when you create this webinar. 
                  Participants can join directly from the meeting link.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Webinar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

