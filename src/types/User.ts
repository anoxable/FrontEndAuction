import { Auction } from './Auction';
import { Bid } from './Bid'

type User = {
  id: number;
  email: string;
  name?: string;
  surname?: string;
  passwordHash: string;
  createdAt: Date;
  auctions: Auction[];
  bids: Bid[];
  profilePictureUrl: string;
}

export type { User };
