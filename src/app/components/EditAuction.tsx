import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import DatePicker from '../assets/datePicker.png';
import { Auction } from '../../types/Auction';

interface EditAuctionProps {
  isOpen: boolean;
  onClose: () => void;
  auction: Auction // Assuming you have an Auction type defined
}

const EditAuction: React.FC<EditAuctionProps> = ({ isOpen, onClose, auction }) => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  // Populate fields when auction prop changes
  useEffect(() => {
    if (auction) {
      setTitle(auction.title);
      setDescription(auction.description);
      setEndDate(auction.endDate);
    }
  }, [auction]);

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
  
  const handleDateIconClick = () => {
    // This will open the native date picker when the custom icon is clicked
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !endDate) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('endDate', endDate);
    if (image) {
      formData.append('image', image);
    }

    try {
      console.log(auction);
      const response = await fetch(`http://localhost:3001/auctions/${auction.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error editing auction:', errorData);
        throw new Error('Failed to edit auction');
      }

      onClose();
    } catch (error) {
      console.error('Error editing auction:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-2xl text-black font-bold mb-6 ">Edit auction</h2>

        {/* Form fields populated with auction data */}
        <div className="mb-6 relative">
          {image ? (
            <>
              <Image src={URL.createObjectURL(image)} alt="Preview" width={300} height={200} className="w-full h-48 object-cover rounded" />
              <button 
                onClick={handleDeleteImage} 
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <FaTrash className="text-red-500" />
              </button>
            </>
          ) : (
            <div className="w-full h-48 bg-[#F6F6F4] flex items-center justify-center rounded-xl">
              <button onClick={() => document.getElementById('imageInput')?.click()} className="border border-black text-black rounded-xl font-medium px-4 py-2 rounded">
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
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write item name here"
            className="pl-4 mt-1 p-1 text-s text-black border block w-full rounded-full border-gray-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write description here"
            className="overflow-hidden overflow-ellipsis mt-1 pl-4 p-1 text-black block w-full rounded-xl border "
            rows={3}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black">End date</label>
          <div className="mt-1 relative">
            <input
              ref={dateInputRef}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-4 p-1 block w-full pr-10 rounded-xl border color"
              style={{ 
                colorScheme: 'light',
                color:'black',
                // This is the key CSS to hide the default calendar icon
                '&::-webkit-calendar-picker-indicator': {
                  opacity: 0,
                  
                  right: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }
              } as React.CSSProperties}
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={handleDateIconClick}
            >
              <Image 
                src={DatePicker} 
                alt="Date picker" 
                width={13} 
                height={13} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6 ">
          <button onClick={onClose} className="px-4 py-2 bg-color-red bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">
            Discard changes
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-black bg-gray-800 text-white">
            Edit auction
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAuction;
