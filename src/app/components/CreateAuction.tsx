import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaDollarSign, FaEuroSign, FaTrash, FaSpinner } from 'react-icons/fa';
import { User } from '@/types/User';
import { refreshAccessToken } from '../lib/refresh';

interface CreateAuctionProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

const CreateAuction: React.FC<CreateAuctionProps> = ({ isOpen, onClose, user }) => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startingPrice, setStartingPrice] = useState<number>();
  const [currency, setCurrency] = useState<string>('USD');
  const [endDate, setEndDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setStartingPrice(undefined);
      setEndDate("");
      setImage(null);
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      console.log('Image selected:', file);
    } else {
      console.log('No file selected');
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    console.log('Image deleted');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !startingPrice || startingPrice <= 0 || !currency || !endDate || !image || !user) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startingPrice', startingPrice.toString());
    formData.append('currency', currency);
    formData.append('endDate', endDate);
    formData.append('userId', user.id.toString());
    formData.append('image', image);

    try {
      await refreshAccessToken(); 
      const response = await fetch('http://localhost:3001/auctions', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating auction:', errorData);
        throw new Error('Failed to create auction');
      }

      onClose();
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl text-black font-bold mb-6">Add auction</h2>
        
        <div className="mb-6 relative">
          {image ? (
            <>
              <Image src={URL.createObjectURL(image)} alt="Preview" width={300} height={200} className="w-full h-48 object-cover rounded" />
              <button 
                onClick={handleDeleteImage} 
                className="absolute top-2 right-2 rounded-md p-1 shadow-md bg-black p-2"
                disabled={isSubmitting}
              >
                <FaTrash className="text-white-500" />
              </button>
            </>
          ) : (
            <div className="w-full h-48 bg-[#F6F6F4] flex items-center justify-center rounded-xl">
              <button 
                onClick={() => document.getElementById('imageInput')?.click()} 
                className="border border-black text-black rounded-xl font-medium px-4 py-2"
                disabled={isSubmitting}
              >
                Add image
              </button>
            </div>
          )}
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=" Write item name here"
            className="pl-2 mt-1 p-2 text-s text-black border block w-full rounded-full border-gray-200"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder=" Write description here"
            className="mt-1 pl-2 pt-2 text-black block w-full rounded-xl border border-gray-300"
            rows={3}
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 pb-2">Starting price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                onClick={() => !isSubmitting && setCurrency(currency === 'USD' ? 'EUR' : 'USD')}
              >
                {currency === 'USD' ? <FaDollarSign className="text-gray-400" /> : <FaEuroSign className="text-gray-400" />}
              </div>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                placeholder='Price'
                className="block w-full pl-4 p-2 rounded-2xl border border-gray-300 text-black"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 pb-2">End date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-4 block w-full p-2 rounded-xl border border-gray-300"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-black bg-primary flex items-center justify-center min-w-24"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Start auction'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;