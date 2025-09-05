import React from 'react';
import { CheckCircle, X, Calendar, Video, Mail, RefreshCw } from 'lucide-react';

const GoogleSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: 'Create Real Google Calendar Events',
      description: 'Schedule webinars that automatically appear in your Google Calendar'
    },
    {
      icon: <Video className="h-6 w-6 text-green-600" />,
      title: 'Generate Functional Google Meet Links',
      description: 'Get working video meeting links for your webinars'
    },
    {
      icon: <Mail className="h-6 w-6 text-purple-600" />,
      title: 'Send Calendar Invitations',
      description: 'Automatically invite participants to your webinars'
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-orange-600" />,
      title: 'Sync Webinar Schedules',
      description: 'Keep your webinar calendar in sync across platforms'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Congratulations! 🎉
          </h2>
          <p className="text-lg text-gray-600">
            Your Google account has been successfully connected!
          </p>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            You now have access to:
          </h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSuccessModal;
