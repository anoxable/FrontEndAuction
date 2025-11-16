import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types/User';


interface ChangeProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({ isOpen, onClose, user }) => {
  const [image, setImage] = useState<File | null>(null);
  console.log(user)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      console.log('Image selected:', file);
    } else {
      console.log('No file selected');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id.toString());
    formData.append('image', image);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating profile picture:', errorData);
        throw new Error('Failed to update profile picture');
      }

      onClose();
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-lg p-4 w-80">
        <h2 className="text-2xl font-bold text-black mb-4">Change Profile Picture</h2>
        <div className="mb-6 relative">
          <div className="w-full flex items-center justify-center rounded-xl flex-col">
            <Image
              src={image ? URL.createObjectURL(image) : user?.profilePictureUrl || ""}
              alt="Profile Picture"
              width={56}
              height={56}
              className="object-contain rounded-full mb-4"
            />
            <button onClick={() => document.getElementById('imageInput')?.click()} className="border border-black text-black rounded-2xl font-medium px-4 py-2">
              Upload new picture
            </button>
          </div>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-row justify-end text-black">
          <button onClick={onClose} className="rounded-full mr-4 font-medium bg-[#F6F6F4] py-2 px-4">Cancel</button>
          <button onClick={handleSubmit} className="rounded-full font-medium bg-primary py-2 px-4">Save changes</button>
        </div>
      </div>
    </div>
  );
};


export default ChangeProfilePictureModal;
