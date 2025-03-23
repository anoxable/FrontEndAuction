import React from 'react';
import Image from 'next/image';

import TimeLeft from '../assets/TimeLeft.svg'
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User';
import { Auction } from '@/types/Auction';

interface AuctionCardProps {
  auction: Auction;
  user?: User;
  onDelete?: () => void;
  onEdit?: () => void;
  isUserHighestBidder?:boolean;
  status:string;
  
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, user, onDelete, onEdit, isUserHighestBidder,status }) => {
  const router = useRouter();
  console.log(isUserHighestBidder)
  console.log(auction)
  const {startingPrice, endDate } = auction;
  console.log(auction)

  const getTimeLeft = (endTimeStr?: string): string => {
    if (!endTimeStr) return 'N/A';
    
    const endTime = new Date(endTimeStr);
    if (isNaN(endTime.getTime())) return 'Invalid Date';

    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24 ) {
    return `${days}d`;
    } else {
      return `${hours}h ${minutes}m`
    }
  };

  const timeLeft = getTimeLeft(endDate);
  const isEnded = timeLeft === 'Ended';

  const handleAuctionClick = () => {
    router.push(`/dashboard/Auctions/${auction.id}`);
  };

  return (

  <div onClick={handleAuctionClick} className="rounded-xl max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
    <div className="px-4 py-4">
      <div className="flex  justify-between text-gray-700 text-base">
      <p
  className={`inline-block rounded-full px-2 py-1 text-xs md:text-sm text-gray-700 mr-2 mb-2
    ${
      status === 'Winning'
        ? 'bg-green-500'  // Winning -> Green
        : status === 'Outbid'
        ? 'bg-pink-500'   // Outbid -> Pink
        : status === 'Ended'
        ? 'bg-gray-500'   // Ended -> Gray
          : status === 'Done'
        ? 'bg-gray-500'
        : 'bg-primary'    // In Progress -> Blue
      
      
    }`}
>
  {status}
</p>
        <p className="inline-block  px-3 py-1 text-sm  text-gray-700 mb-2">{timeLeft}<Image className='float-right mt-1.5 ml-1' src={TimeLeft} alt="Logo" width={10} height={10} /></p>
      </div>
      <p className='text-black'>{auction.title}</p>
    </div>
    <p className="rounded-full px-4 text-sm font-medium leading-6 text-gray-700 mb-2">{startingPrice ? `$${startingPrice}` : 'N/A'}</p>
    <div className={`px-4 pt-4 ${isEnded ? 'pb-4' : 'pb-1'} flex items-center justify-between relative ${isEnded ? 'h-40' : 'h-40'}`}>
      <Image 
        src={auction.image}
        alt="Auction Image"
        fill={true}
        className='rounded-xl p-1'
        style={{objectFit: "cover"}}
      />
    </div>
    {!isEnded && user?.id === auction.userId ? (
      <div className="px-1 pb-1 pt-2 flex items-center justify-between">
        <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }}  className="inline-block bg-white border border-black rounded-full px-3 py-2 text-sm font-semibold text-black hover:scale-110 transition-transform leading-6"><FaTrash className="" /></button>
        <button onClick={(e) => { e.stopPropagation(); onEdit?.(); }}  className=" flex flex-row justify-center inline-block bg-gray-800 rounded-full px-3 py-2 text-sm font-semibold text-white flex-grow ml-2 leading-6 "><FaEdit className=" flex self-center mr-2 font-light " /><span className='font-medium'> Edit</span></button>
      </div>
    ) : null}
  </div>
  );
};

export default AuctionCard;
