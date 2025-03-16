'use client'

import { useState, useEffect, useCallback } from 'react';


import AuctionCard from '@/app/components/AuctionCard';
import { User } from '@/types/User';
import { Auction } from '@/types/Auction';  // Adjust the import path as needed
import EditAuction from '../../components/EditAuction';
import {refreshAccessToken} from '../../lib/refresh';


export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState('My auctions');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditAuctionOpen,setIsEditAuctionOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction>();
 


  const fetchAuctions = useCallback(async (userData?: User) => {
    try {
      let url = '';
      if (selectedTab === 'Bidding') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions/user/bids`;
      } else if (selectedTab === 'My auctions') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions/user/${userData?.id || user?.id}`;
      } else if (selectedTab === 'Won') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions/user/bids/won`;
      }

      if (!url) return;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const auctionsData: {auction:Auction; status:string}[] = await response.json();
          const auctionsWithBids = auctionsData.map(auction => ({
        ...auction.auction,
        status:auction.status, // Ensure bids exist to avoid undefined errors
      }));
      console.log(auctionsWithBids)
      setAuctions(auctionsWithBids);
      } else  {
        throw new Error('Failed to fetch auctions');
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setError('Failed to fetch auctions');
    }
  }, [selectedTab, user?.id]);

  
  useEffect(() => {
    async function fetchUser() {
      try {
        await refreshAccessToken(); // Uncomment if needed
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
          method: 'GET', // Use GET if fetching data
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
  
        const data = await response.json();
        console.log(data);
        
        setUser(data.user);
        fetchAuctions(data.user); // Ensure fetchAuctions is memoized
      } catch (error) {
        console.error("Error fetching user:", error);
      
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
  
    fetchUser();
  }, [fetchAuctions]); // Avoid including `router` unless necessary
  


  const handleDeleteAuction =async (id:number) => {
    // Implement delete logic here
    try {
      const response = await fetch (`${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error editing auction:', errorData);
        throw new Error('Failed to edit auction');
      } else {
        fetchAuctions(); // Re-render auctions after successful deletion
      }
    }
    catch (error) {
      console.error('Error editing auction:', error);
    console.log(`Deleting auction with id: ${id}`);
  };
}

  const handleEditAuction = (id: number) => {
    // Implement edit logic here
    console.log(`Editing auction with id: ${id}`);
    const auctionToEdit = auctions.find(auction => auction.id === id);
    console.log(auctionToEdit )
    if (auctionToEdit) {
      setSelectedAuction(auctionToEdit);
      setIsEditAuctionOpen(true);
    }
  };


  const handleCloseEditAuction = () => {
    setIsEditAuctionOpen(false);
  };

  if (error) return <div>Error: {error}</div>;
  ;

  return (
    <div className="min-h-screen bg-gray-50">
    


      {/* Main content */}
      <main className=" mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold text-black mb-8 flex items-center">
      Hello,{" "}
      {user?.name ? (
        <span className="ml-2">{user.name.charAt(0).toUpperCase()+ user.name.slice(1)}!</span>
      ) : (
        <span className=" flex ml-2 bg-gray-100 rounded-md w-20 inline-block animate-pulse">...</span>
      )}
    </h1>

        {/* Sub-navbar */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 rounded-full inline-flex">
            {['My auctions', 'Bidding', 'Won'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full ${ 
                  selectedTab === tab ? 'bg-selectedButton text-white' : 'text-gray-700 hover:bg-gray-300  hover:text-white transition duration-300 '
                }`}
                onClick={() => {
                  setSelectedTab(tab);
                  fetchAuctions(); // Will use current user state
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Auctions grid */}
        {auctions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {auctions.map((auction) => (
              <div key={auction.id} className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <AuctionCard 
                  auction={auction}
                  user={user || undefined}
                  onDelete={() => handleDeleteAuction(auction.id)}
                  onEdit={() => handleEditAuction(auction.id)}
                  status={auction.status}
                  
                />
              </div>
            ))}
          </div>
        )}
        {auctions.length === 0 && (
          <div className="flex flex-col justify-center items-center text-center h-[70vh]">
           <p className="text-2xl font-bold text-black mb-4">Oh no, no auctions added!</p>
           <p className="text-sm text-gray-500">To add new auctions click &apos;+&apos; button <br/>in navigation bar and new auctions will be <br/>added here!</p>
         </div>
        )}
      </main>

      {/* CreateAuction Modal */}
      {isEditAuctionOpen && selectedAuction && (
  <EditAuction
    isOpen={isEditAuctionOpen}
    onClose={handleCloseEditAuction}
    auction={selectedAuction}
  />
)}
        </div>
  );
}
