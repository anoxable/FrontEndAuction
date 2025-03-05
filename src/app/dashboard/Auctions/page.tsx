'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuctionCard from '@/app/components/AuctionCard';
import CreateAuction from '@/app/components/CreateAuction';
import { User } from '@/types/User';
import { Auction } from '@/types/Auction';
import { refreshAccessToken } from '@/app/lib/refresh';
import { DynamicCardsSkeleton } from '@/app/components/skeletons';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false);
  const [filter,] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
        } else {
          if (response.status === 401) {
            router.push('/Login');
          } else {
            throw new Error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchAuctions = async (filterType: string) => {
      try {
        await refreshAccessToken();
        let url = 'http://localhost:3001/auctions/active';
        
        if (filterType === 'bidding' && user?.id) {
          url = `http://localhost:3001/auctions/user/bids`;
        }

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const auctionsData:  { auction: Auction; status: string }[] = await response.json();
          setAuctions(auctionsData.map((item) => ({ ...item.auction, status: item.status }))) 
          console.log(auctionsData.map((auction) =>  auction.status ))
        
        } else {
          throw new Error('Failed to fetch auctions');
        }
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setError('Failed to fetch auctions');
      }
    };

    fetchUserData();
    fetchAuctions(filter);
  }, [filter, router]);


  const handleCloseCreateAuction = () => {
    setIsCreateAuctionOpen(false);
  };

  if (loading) return <div className='h-screen'><DynamicCardsSkeleton count={auctions.length} /></div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    
    <div className="min-h-screen bg-gray-50">
    
      {/* Main content */}
      <main className=" mx-auto px-8 py-8 w=full">
        <h1 className="text-3xl font-bold text-black mb-8">
          Active Auctions
        </h1>

        {/* Auctions grid */}
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {auctions.map((auction,index) => (
              <div key={index} className='hover:scale-105 transition-transform duration-300 cursor-pointer'>
              <AuctionCard 
                key={auction.id} 
                auction={auction}
                user={user}
                isUserHighestBidder={auction.isUserHighestBidder}
                status={auction.status}
              />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[70vh]">
            <div>
              <p className="text-2xl font-bold text-black mb-4">Oh no, no auctions yet!</p>
              <p className="text-sm text-gray-500 text-center">To add new auction click &apos;+&apos; button in <br/>navigation bar or wait for other users <br/>to add new auctions.</p>
            </div>
          </div>
        )}
      </main>

      {/* CreateAuction Modal */}
      <CreateAuction 
        isOpen={isCreateAuctionOpen} 
        onClose={handleCloseCreateAuction} 
      />
    </div>
  );
}
