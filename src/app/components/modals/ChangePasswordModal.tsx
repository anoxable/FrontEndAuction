import React, { useEffect, useState } from 'react';
import { FaEye, FaSpinner } from "react-icons/fa";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsSubmitting(false);
  }, [isOpen]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    setError(null); // Clear error if passwords match
  
    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me/update-password', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassowrd: currentPassword, newPassword:newPassword }) // Ensure correct key name
      });
  
      if (!response.ok) {
        throw new Error('Failed to change password');
        setError("Passwords do not match");
        setIsSubmitting(false);
      }
  
      console.log('Password changed successfully');
      onClose();
    } catch (error) {
      console.error(error);
      setError("Failed to update password. Please try again.");
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-black mb-4">Change Password</h2>

        <div className="mb-4 relative">
          <label className="block mb-1 font-light text-textPrimary">Current Password</label>
          <div className='relative'>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded-2xl w-full p-2 pr-10 text-black"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-0 top-0 m-4"
            >
              <FaEye className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 font-light text-textPrimary">New Password</label>
          <div className='relative'>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-2xl w-full p-2 pr-10 text-black"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-0 top-0 m-4"
            >
              <FaEye className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 font-light text-textPrimary">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`border rounded-2xl w-full p-2 pr-10 text-black ${
                confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-0 m-4"
            >
              <FaEye className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end">
          <button 
            className=" font-medium mr-2 bg-gray-300 text-textPrimary rounded-2xl p-2 px-4" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`bg-primary font-medium text-textPrimary rounded-md px-4 py-2 ${
              newPassword !== confirmPassword ? 'opacity-50 cursor-not-allowed' : ''
            }`} 
            onClick={handleChangePassword}
            disabled={newPassword !== confirmPassword || isSubmitting}
          >
            {isSubmitting ? (
              <>  <div className='flex'>
                <FaSpinner className="animate-spin mr-2" />
                Submitting...
                </div>
              </>
              
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
