"use client"

import { User } from "@/types/User";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'  
import { FaHome, FaUser, FaPlus } from "react-icons/fa";
import logo from '../assets/Logo.svg'
import { GoGear } from "react-icons/go";
import { useEffect, useState } from "react";
import ProfileSettingsModal from "./modals/ProfileSettingsModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import ChangeProfilePictureModal from "./modals/ChangeProfilePictureModal";
import CreateAuction from "./CreateAuction";
import { fetchWithAuth } from "../lib/auth";



const Navbar = () => {
 
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeProfilePictureOpen, setIsChangeProfilePictureOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetchWithAuth<{ user: User }>({ url: "http://localhost:3001/auth/me" });
        if (response.user) {
          setUser(response.user);
          console.log(response.user)
        }
      } catch (error) {
        console.error("User fetch failed:", error);
        router.push("/Login"); // Redirect to login on failure
      }
    }
    fetchUserData();
  }, [router]);
  const pathname = usePathname()
  

  const handleOpenAuctions = () => {
    router.push('/dashboard/Auctions')
  };
  const handleOpenCreateAuction = () => {
    setIsCreateAuctionOpen(true);
  };


  const handleCloseCreateAuction = () => {
    setIsCreateAuctionOpen(false);
  };


  const handleOpenProfile = () => {
    router.push("/dashboard/Profile")
  };

  const handleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleProfileSettings = () => {
    setIsProfileMenuOpen(false);
    setIsProfileSettingsOpen(true);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/Login');
  };

  // Consolidated single method for changing profile picture
  const handleChangeProfilePicture = () => {
    setIsProfileSettingsOpen(false);
    setIsChangeProfilePictureOpen(true);
  };

  const handleCloseProfileSettings = () => {
    setIsProfileSettingsOpen(false);
  };

  const handleChangePassword = () => {
    setIsProfileSettingsOpen(false);
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  // Added method to close profile picture modal
  const handleCloseProfilePicture = () => {
    setIsChangeProfilePictureOpen(false);
  };
  
  const isAuctionsRoute = pathname.startsWith('/dashboard/Auctions') && pathname.split('/').length === 3;
  const isAuctionDetailsRoute = pathname.startsWith('/dashboard/Auctions/') && pathname.split('/').length > 3;
  const isProfileRoute = pathname.startsWith('/dashboard/Profile');
  
  return (
    <nav className="flex justify-between items-center p-8 bg-gray-50 ">
      <div className="flex items-center space-x-4">
        <div className="bg-primary rounded-full p-2">
          <Image src={logo} alt="Logo" width={32} height={32} />
        </div>
        <div className="flex items-center space-x-2 bg-white rounded-full">
          <button 
            onClick={handleOpenAuctions} 
            className={`flex items-center space-x-2 rounded-full px-4 py-4 transition duration-300 ${
              isAuctionsRoute ? 'bg-black text-white' : isAuctionDetailsRoute ? 'bg-white text-black' : 'text-black hover:bg-gray-300'
            }`}
          >
            <FaHome />
            <span className="hidden md:block">Auctions</span>
          </button>
          <button 
            onClick={handleOpenProfile} 
            className={`flex items-center space-x-2 rounded-full px-4 py-4 transition duration-300 ${
              isProfileRoute ? 'bg-black text-white' : isAuctionDetailsRoute ? 'bg-white text-black' : 'text-black hover:bg-gray-300'
            }`}
          >
            <FaUser />
            <span className="hidden md:block">Profile</span>
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-white rounded-full p-1">
        <button onClick={handleOpenCreateAuction} className="bg-primary rounded-full p-4 hover:scale-105 transition-transform duration-300">
          <FaPlus className="text-black" />
        </button>
        <button onClick={handleProfileMenu}>
          {user && user.profilePictureUrl ? (
            <Image
              src={user.profilePictureUrl}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FaUser className='text-black' />
          )}
        </button>
        {isProfileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsProfileMenuOpen(false)}
            />
            <div className="fixed flex flex-col text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl p-6 z-50 min-w-[200px]">
              <button 
                onClick={handleProfileSettings} 
                className="w-full text-left text-black mb-4 py-2 px-4 hover:bg-gray-100 rounded-md transition-colors flex items-center"
              >
                <GoGear className='mr-2' />
                Profile Settings
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full text-left text-black py-2 px-4 hover:bg-gray-100 rounded-md transition-colors flex justify-center border border-black rounded-2xl"
              >
                Log Out
              </button>
            </div>
          </>
        )}
      <CreateAuction 
        isOpen={isCreateAuctionOpen} 
        onClose={handleCloseCreateAuction}
        user={user}
      />
   
        {user && <ProfileSettingsModal 
          isOpen={isProfileSettingsOpen} 
          onClose={handleCloseProfileSettings} 
          onChangePassword={handleChangePassword}
          changeProfilePicture={handleChangeProfilePicture}
          user={user}
        />}

        {/* Change Password Modal */}
        <ChangePasswordModal 
          isOpen={isChangePasswordOpen} 
          onClose={handleCloseChangePassword} 
        />
        {user &&<ChangeProfilePictureModal
          isOpen={isChangeProfilePictureOpen}
          onClose={handleCloseProfilePicture}
          user={user}
        />}
      </div>
    </nav>
  );
};

export default Navbar;