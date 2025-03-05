import { User } from './User';
import { Auction } from './Auction';

type Bid = {
  id: number;
  amount: number;
  userId: number;
  user: User;
  auctionId: number;
  auction: Auction;
  createdAt: Date;
}

export type { Bid };