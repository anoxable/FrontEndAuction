'use client'
import Image from 'next/image';
import Logo from '../assets/Logo.svg';
import LoginImage from '../assets/LoginImage.png';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://auctionbaybackend-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response === null) {
        console.error('Failed to Login');
        setIsLoading(false);
        return;
      }
      
      if (response) {
        router.push('/dashboard/Profile');
      } else {
        console.error('Failed to login');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to login:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with image */}
      <div className="hidden md:block md:w-[70%] bg-gray-100 flex items-center justify-center">
        <div className="flex items-center justify-center h-full w-full">
          <Image
            src={LoginImage}
            alt="Login illustration"
            width={600}
            height={400}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-[30%] bg-white flex flex-col items-center p-8 justify-between ">
        <div 
          className="mb-12 bg-primary rounded-full p-4 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image src={Logo} alt="Logo" width={32} height={32}/>
        </div>
        <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-8">Please enter your details</p>
        </div>

        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder='Placeholder'
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl border focus:outline-black text-black"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className='relative'>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              placeholder='Placeholder'
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-black text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 m-4"
            >
              <FaEye className="text-gray-600" />
            </button>
          </div>
          </div>
          <a href='http://localhost:3000/ForgotPassword' className='float-right mb-8 text-gray-600'>Forgot password?</a>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </button>
        </form>
        <a href='http://localhost:3000/Register' className='text-black'>Don&apos;t have account? <strong>Sign up</strong></a>
      </div>
    </div>
  );
}
