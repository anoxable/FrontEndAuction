import { User } from './User';
import { Bid } from './Bid';


export interface Auction {
  json(): Auction[] | PromiseLike<Auction[]>;
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  currency: string;
  endDate: string;
  image: string;
  userId: number;
  user: User;
  bids: Bid[];
  createdAt: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isUserHighestBidder?: boolean;
  status:string;
}
