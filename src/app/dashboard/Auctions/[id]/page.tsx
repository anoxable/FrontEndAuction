'use client'

import { useEffect, useState } from 'react';
import { useParams} from 'next/navigation';

import ProfilePicEmpty from '../../../assets/ProfilePicEmpty.jpg'
import { User } from '../../../../types/User';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Auction } from '@/types/Auction';

import TimeIcon from '../../../assets/Time.svg'
import { fetchWithAuth } from '@/app/lib/auth';
import AuctionSkeleton from '@/app/components/skeletons';

export default function AuctionDetailPage() {
  const params = useParams();
  const [bid, setBid] = useState<number | undefined>(undefined);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userResponse = await fetchWithAuth<{ user: User }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, 
          method: 'GET', 
          headers: {
         
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.user) {
          console.log("Logged in user:", userResponse.user);
        } else {
          console.error('Failed to fetch user data or session expired');
          router.push('/Login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchAuctionDetails = async () => {
      setLoading(true);
       console.log('yo')
      try {
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions/${params.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch auction details: ${response.statusText}`);
        }
        const data: Auction = await response.json(); // ✅ Convert response to JSON
        console.log(data); // ✅ Log the actual auction data
        setAuction(data); // ✅ Store the auction data in state
      } catch (error) {
        console.error('Error fetching auction details:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchUserData();
      fetchAuctionDetails();
    }
  }, [params.id, router]);

  const handlePlaceBid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bid) {
      alert("Please place a bid");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions/${params.id}/bid`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: bid }),
      });

      if (!response) {
        throw new Error('Failed to place bid');   
      }

      alert("Bid placed successfully");
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };


  const formatEndDate = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end.getTime() - now.getTime();

    if (diffInMs < 0) {
      return "Ended"; // Auction has ended
    }

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInHours / 24);
    const hours = diffInHours % 24;

    let result = '';
    if (days > 0) {
      result += `${days}d `;
    }
    result += `${hours}h`;

    return result.trim(); // Remove any trailing spaces
  };

  if (loading) return <div><AuctionSkeleton/></div>;
  if (error) return <div>Error: {error}</div>;
  if (!auction) return <div><AuctionSkeleton/></div>;

  return (

    <div className="min-h-screen bg-gray-50 p-8 ">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
        <div className="bg-blue-500 rounded-xl relative h-52 overflow-hidden md:h-screen">
          <Image 
            src={auction.image} 
            alt={auction.title} 
            layout="fill"
            objectFit="cover"
          />
          Large Grid on the Left
        </div>
  
  
  <div className="flex flex-col gap-4  ">
    <div className="bg-white text-black flex-1 rounded-xl p-2 flex-grow flex-grow-0 ">
    <div className="flex justify-between  ">
      <span className='bg-red-300 rounded-full pl-2 pr-2'>Outbid</span>
      <span className='bg-red-300 rounded-full pl-2 pr-2 flex items-center justify-between'><span>{formatEndDate(auction.endDate)}</span><Image src={TimeIcon} alt="Time Icon" width={20} height={20} className='ml-1 mr-1' /></span>
    </div>
    <h1 className='font-bold text-[29px] md:text-[32px] pt-4'> {auction.title}</h1>
    <h2 className='pt-4'> {auction.description}</h2>
    <div className='float-right'>
      <form className='my-4' onSubmit={handlePlaceBid}>
        <label>Bid:</label>
        <input 
          type="number" 
          placeholder="" 
          className="border-2 rounded-full border-gray-300 bg-white h-10 ml-2 p-2 pl-4 w-[83px] h-[40px]  text-sm focus:outline-none"
          value={bid}
          onChange={(e) => setBid(Number(e.target.value))}
        />
        <button className='bg-primary rounded-full ml-2 p-2 px-4 py-2'>Place bid</button>
      </form>
    </div>
    </div>
  
    <div className="bg-white flex-1">
      
      <h1 className='text-black font-bold m-4 text-[20px] md:text-[23px]'>Bidding History ({auction.bids.length})</h1>
      {auction.bids.length > 0 ? (
        auction.bids.map((bid, index) => (
          <div key={index} className="flex justify-between items-center p-2 border-b border-gray-200 text-black">
            <div className="flex items-center space-x-2 ">
              <Image
                src={bid.user && bid.user.profilePictureUrl ? bid.user.profilePictureUrl : ProfilePicEmpty}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex flex-col md:flex-row ">
                <h2>{bid.user.name}</h2>
                <p className='text-base  md:hidden md:text-sm'>{new Date(bid.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
              </div>
            </div>
            <div className='flex'>
              <div className='hidden md:block'>
                <p className='text-base'>{new Date(bid.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
              </div>
              <p className=' px-4 ml-4  bg-primary rounded-full font-semi-bold'>{bid.amount} €</p>
            </div>
          </div>
        ))
      ) : (
        <>
        <div className="flex flex-col items-center justify-center md:h-full text-center pb-8">
          <p className='font-bold text-black text-[18px]'>No bids yet!</p>
          <p className='text-silver'>Place your bid to have a chance to get this item.</p>
        </div>
        </>
      )}
      
    </div>
  </div>
</div>

      
     
    </div>
  );
}