// Updated Settings Section for Dashboard
// This replaces the existing settings section in the dashboard

import { useState, useEffect } from "react";
import { UserService } from "@/lib/user-service";
import { PaymentService } from "@/lib/payment-service";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/database";
import GoogleAccountVerification from "./google-account-verification";
import { 
  UserRound, 
  Bell, 
  CreditCard, 
  Lock, 
  Image, 
  Edit, 
  Plus, 
  Trash2,
  Check,
  X,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";

export function SettingsSection({ 
  currentUser, 
  activeSettingsTab, 
  setActiveSettingsTab,
  profileForm,
  setProfileForm,
  notificationPreferences,
  setNotificationPreferences,
  paymentMethods,
  setPaymentMethods,
  currentPlan,
  setCurrentPlan,
  showAddPaymentMethod,
  setShowAddPaymentMethod,
  isLoadingPayment,
  setIsLoadingPayment,
  isSavingProfile,
  setIsSavingProfile,
  isSavingNotifications,
  setIsSavingNotifications,
  profileSaveMessage,
  setProfileSaveMessage,
  notificationSaveMessage,
  setNotificationSaveMessage
}) {
  // Security state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [securityMessage, setSecurityMessage] = useState('');

  // Handle profile form input changes
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle notification preference changes
  const handleNotificationChange = (key, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      setIsSavingProfile(true);
      setProfileSaveMessage('');
      
      const result = await UserService.updateProfile(currentUser.id, profileForm);
      
      if (result.success) {
        setProfileSaveMessage('Profile updated successfully!');
        // Profile updated successfully
        // Clear message after 3 seconds
        setTimeout(() => setProfileSaveMessage(''), 3000);
      } else {
        setProfileSaveMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setProfileSaveMessage(`Error: ${error.message}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save notification preferences
  const handleSaveNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setIsSavingNotifications(true);
      setNotificationSaveMessage('');
      
      const result = await UserService.updateNotificationPreferences(currentUser.id, notificationPreferences);
      
      if (result.success) {
        setNotificationSaveMessage('Notification preferences updated successfully!');
        // Clear message after 3 seconds
        setTimeout(() => setNotificationSaveMessage(''), 3000);
      } else {
        setNotificationSaveMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setNotificationSaveMessage(`Error: ${error.message}`);
    } finally {
      setIsSavingNotifications(false);
    }
  };

  // Add payment method
  const handleAddPaymentMethod = async () => {
    alert('Payment functionality is coming soon! We\'re working on setting up secure payment processing.');
  };

  // Remove payment method
  const handleRemovePaymentMethod = async (paymentMethodId) => {
    alert('Payment functionality is coming soon! We\'re working on setting up secure payment processing.');
  };

  // Set default payment method
  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    alert('Payment functionality is coming soon! We\'re working on setting up secure payment processing.');
  };

  // Security handlers
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSecurityMessage('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setSecurityMessage('New password must be at least 6 characters');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      setSecurityMessage('');
      
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      setSecurityMessage('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setSecurityMessage(''), 3000);
    } catch (error) {
      setSecurityMessage(`Error: ${error.message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setSecurityMessage('');
      // For now, just toggle the state
      // In production, you'd integrate with a 2FA service
      setTwoFactorEnabled(!twoFactorEnabled);
      setSecurityMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
      setTimeout(() => setSecurityMessage(''), 3000);
    } catch (error) {
      setSecurityMessage(`Error: ${error.message}`);
    }
  };

  const handleViewSessions = async () => {
    try {
      setSecurityMessage('');
      // For now, just show a mock session
      // In production, you'd fetch actual sessions from your auth system
      setActiveSessions([
        {
          id: '1',
          device: 'Chrome on Windows',
          location: 'New York, US',
          lastActive: new Date().toLocaleString(),
          current: true
        }
      ]);
      setSecurityMessage('Sessions loaded');
      setTimeout(() => setSecurityMessage(''), 3000);
    } catch (error) {
      setSecurityMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      setSecurityMessage('');
      
      // For now, just show a message
      // In production, you'd implement actual account deletion
      setSecurityMessage('Account deletion is not yet implemented. Please contact support.');
      setShowDeleteModal(false);
      
      setTimeout(() => setSecurityMessage(''), 5000);
    } catch (error) {
      setSecurityMessage(`Error: ${error.message}`);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Settings</h1>
          <p className="text-slate-500">Manage your account preferences</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-md">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{currentUser?.full_name || 'User'}</h2>
              <p className="text-slate-500">Content Creator</p>
              <Button 
                variant="outline" 
                className="mt-4 w-full border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all"
              >
                <Image size={16} className="mr-2" />
                Change Photo
              </Button>
            </div>
            
            <div className="border-t border-slate-200">
              <nav className="p-2">
                <button 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    activeSettingsTab === "profile" 
                      ? "bg-amber-50 text-amber-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } font-medium text-sm`}
                  onClick={() => setActiveSettingsTab("profile")}
                >
                  <UserRound size={16} />
                  <span>Profile</span>
                </button>
                <button 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    activeSettingsTab === "notifications" 
                      ? "bg-amber-50 text-amber-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } font-medium text-sm mt-1`}
                  onClick={() => setActiveSettingsTab("notifications")}
                >
                  <Bell size={16} />
                  <span>Notifications</span>
                </button>
                <button 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    activeSettingsTab === "billing" 
                      ? "bg-amber-50 text-amber-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } font-medium text-sm mt-1`}
                  onClick={() => setActiveSettingsTab("billing")}
                >
                  <CreditCard size={16} />
                  <span>Billing</span>
                </button>
                <button 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    activeSettingsTab === "security" 
                      ? "bg-amber-50 text-amber-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } font-medium text-sm mt-1`}
                  onClick={() => setActiveSettingsTab("security")}
                >
                  <Lock size={16} />
                  <span>Security</span>
                </button>
                <button 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    activeSettingsTab === "google" 
                      ? "bg-amber-50 text-amber-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } font-medium text-sm mt-1`}
                  onClick={() => setActiveSettingsTab("google")}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google Integration</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {activeSettingsTab === "profile" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
              </div>
              
              <div className="p-6">
                {profileSaveMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    profileSaveMessage.includes('Error') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {profileSaveMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                      value={profileForm.full_name}
                      onChange={handleProfileInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                      value={profileForm.phone}
                      onChange={handleProfileInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea 
                      name="bio"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 resize-none"
                      rows={4}
                      value={profileForm.bio}
                      onChange={handleProfileInputChange}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-800">Creator Details</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Profile visibility:</span>
                      <button className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        Public
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Creator Name/Brand</label>
                      <input 
                        type="text" 
                        name="creator_name"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                        value={profileForm.creator_name}
                        onChange={handleProfileInputChange}
                        placeholder="Enter your creator name or brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select 
                        name="category"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 bg-white"
                        value={profileForm.category}
                        onChange={handleProfileInputChange}
                      >
                        <option value="">Select a category</option>
                        <option value="Technology">Technology</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Business">Business</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        name="location"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                        value={profileForm.location}
                        onChange={handleProfileInputChange}
                        placeholder="Enter your location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                      <input 
                        type="url" 
                        name="website"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                        value={profileForm.website}
                        onChange={handleProfileInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeSettingsTab === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-lg font-semibold text-slate-800">Notification Preferences</h2>
              </div>
              
              <div className="p-6">
                {notificationSaveMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    notificationSaveMessage.includes('Error') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {notificationSaveMessage}
                  </div>
                )}
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-medium">Webinar Reminders</h3>
                      <p className="text-sm text-slate-500">Get notified before your registered webinars</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.webinar_reminders}
                          onChange={(e) => handleNotificationChange('webinar_reminders', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-medium">Connection Requests</h3>
                      <p className="text-sm text-slate-500">Get notified when someone sends you a connection request</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.connection_requests}
                          onChange={(e) => handleNotificationChange('connection_requests', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-medium">Community Activity</h3>
                      <p className="text-sm text-slate-500">Get notified about new posts in your communities</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.community_activity}
                          onChange={(e) => handleNotificationChange('community_activity', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-medium">Email Notifications</h3>
                      <p className="text-sm text-slate-500">Receive email notifications for important updates</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.email_notifications}
                          onChange={(e) => handleNotificationChange('email_notifications', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-medium">Push Notifications</h3>
                      <p className="text-sm text-slate-500">Receive push notifications on your device</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.push_notifications}
                          onChange={(e) => handleNotificationChange('push_notifications', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-medium">Marketing Emails</h3>
                      <p className="text-sm text-slate-500">Receive promotional content and special offers</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.marketing_emails}
                          onChange={(e) => handleNotificationChange('marketing_emails', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSaveNotifications}
                    disabled={isSavingNotifications}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingNotifications ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Billing Tab */}
          {activeSettingsTab === "billing" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-lg font-semibold text-slate-800">Billing Information</h2>
              </div>
              
              <div className="p-6">
                {/* Current Plan */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-2 mr-3">
                      <Shield size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800">Current Plan: {currentPlan.plan_name}</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        {currentPlan.plan_type === 'free' 
                          ? 'Free plan - No charges during beta' 
                          : `Your subscription renews on ${currentPlan.current_period_end}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-medium text-slate-800">Payment Methods</h3>
                    <Button 
                      onClick={() => setShowAddPaymentMethod(true)}
                      disabled={isLoadingPayment}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-sm"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                  
                  {paymentMethods.length === 0 ? (
                    <div className="p-8 text-center">
                      <CreditCard size={48} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-2">No payment methods added</p>
                      <p className="text-sm text-slate-400">Add a payment method to enable future billing</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-16 bg-slate-100 rounded-md mr-4 flex items-center justify-center">
                              <CreditCard size={20} className="text-slate-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-800">
                                {method.card_brand} •••• {method.card_last4}
                              </h4>
                              <p className="text-xs text-slate-500">
                                Expires {method.card_exp_month}/{method.card_exp_year}
                                {method.is_default && (
                                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                                    Default
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!method.is_default && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-slate-200 text-slate-600"
                                onClick={() => handleSetDefaultPaymentMethod(method.stripe_payment_method_id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-slate-200 text-slate-600"
                              onClick={() => handleRemovePaymentMethod(method.stripe_payment_method_id)}
                            >
                              <Trash2 size={14} className="mr-1.5" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield size={18} className="text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Secure Payment Processing</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment information is processed securely through Stripe. We never store your full card details on our servers. 
                        All sensitive data is encrypted and handled by Stripe's secure infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Google Integration Tab */}
          {activeSettingsTab === "google" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-lg font-semibold text-slate-800">Google Integration</h2>
              </div>
              
              <div className="p-6">
                <GoogleAccountVerification 
                  currentUser={currentUser}
                  onVerificationChange={(verified) => {
                    // Handle verification status change
                    console.log('Google verification status changed:', verified);
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Security Tab */}
          {activeSettingsTab === "security" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-lg font-semibold text-slate-800">Security Settings</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Password Change */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-medium text-slate-800 mb-3">Change Password</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Update your password to keep your account secure
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-slate-200 text-slate-600"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password
                    </Button>
                  </div>
                  
                  {/* Two-Factor Authentication */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-medium text-slate-800 mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button 
                      variant={twoFactorEnabled ? "default" : "outline"}
                      className={twoFactorEnabled ? "bg-green-600 hover:bg-green-700" : "border-slate-200 text-slate-600"}
                      onClick={handleToggle2FA}
                    >
                      {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                  
                  {/* Login Sessions */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-medium text-slate-800 mb-3">Active Sessions</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Manage your active login sessions across devices
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-slate-200 text-slate-600"
                      onClick={handleViewSessions}
                    >
                      View Sessions
                    </Button>
                    
                    {/* Show active sessions if any */}
                    {activeSessions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {activeSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{session.device}</p>
                              <p className="text-xs text-slate-600">{session.location} • {session.lastActive}</p>
                            </div>
                            {session.current && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Account Deletion */}
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="font-medium text-red-800 mb-3">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Message Display */}
      {securityMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            securityMessage.includes('Error') 
              ? 'bg-red-100 border border-red-300 text-red-800' 
              : 'bg-green-100 border border-green-300 text-green-800'
          }`}>
            {securityMessage}
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="flex-1"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Delete Account</h3>
            <p className="text-slate-600 mb-6">
              This action cannot be undone. All your data, webinars, and account information will be permanently deleted.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex-1"
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
