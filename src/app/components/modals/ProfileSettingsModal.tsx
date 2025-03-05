import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeProfilePictureModal from './ChangeProfilePictureModal';
import { User } from '@/types/User';



interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: () => void;
  changeProfilePicture: () => void;
  user : User
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ user,isOpen, onClose, onChangePassword, changeProfilePicture }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangePictureOpen, setIsChangePictureOpen] = useState(false);
  console.log(user)
  const handleSaveChanges = () => {
    // Handle save logic here
    console.log('Saved changes:', { name, surname, email });
    onClose(); // Close the modal after saving
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false)
  }
  const handleClosePicture = () => {
    setIsChangePictureOpen(false)
  }

  if (!isOpen) return null; // Don't render anything if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-black mb-4">Profile Settings</h2>
        <div className='flex '>
        <div className="mb-4 text-textPrimary">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-2xl w-full p-2"
          />
        </div>
        <div className="mb-4 ml-4">
          <label className="block mb-1 text-textPrimary">Surname</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="border rounded-2xl w-full p-2 text-black"
          />
        </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-textPrimary">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-2xl w-full p-2 text-black"
          />
        </div>
        
        <div className='flex flex-col items-start'>
        <button className="text-gray-800 font-medium mb-4" onClick={onChangePassword}>
          Change Password
        </button>
        <button className="text-gray-800 mb-4 " onClick={changeProfilePicture}>
          Change Profile Picture
        </button>
        </div>
        <div className="flex justify-end">
          <button className="mr-2 bg-gray-300 text-textPrimary rounded-2xl p-2 px-4" onClick={onClose}>Cancel</button>
          <button className="bg-primary text-textPrimary rounded-md px-4 py-2 " onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={handleCloseChangePassword} 
      />
      <ChangeProfilePictureModal
      isOpen={isChangePictureOpen}
      user={user}
      onClose={handleClosePicture} 
      
      />
    </div>
  );
};

export default ProfileSettingsModal; 