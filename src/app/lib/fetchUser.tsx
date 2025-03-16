// utils/fetchUser.ts
import { cookies } from 'next/headers';
import { Auction } from "@/types/Auction";
import { Bid } from "@/types/Bid";

interface User {
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

export const fetchUser = async (): Promise<User | null> => {
  try {
    // Get the cookie store from Next.js
    const cookieStore = cookies();
    const token = cookieStore.get('jwt')?.value; // Changed from 'token' to 'jwt'

    // If no token is found, return null
    if (!token) {
      return null;
    }

    // Fetch with the token in the headers
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token}`, // Use 'jwt' instead of 'token'
      },
    });

    if (!response.ok) {
      // Log the error response for debugging
      const errorText = await response.text();
      console.error('Failed to fetch user:', errorText);
      return null;
    }

    const { user } = await response.json(); // Destructure user from the response
    return user;
  } catch (error) {
    console.error('Error in fetchUser:', error);
    return null;
  }
};