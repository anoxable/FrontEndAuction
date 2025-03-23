'use client'
import Image from 'next/image';
import Logo from '../assets/Logo.svg';
import ForgotPasswordImage from '../assets/LoginImage.png'; // Using the same image as Login for now
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Password reset instructions sent:', data);
        router.push('/Login');
        // Redirect to a success page or show a success message
      } else {
        console.error('Failed to send password reset instructions');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with image */}
      <div className="hidden md:block w-[70%] bg-gray-100 flex items-center justify-center ">
        <div className="flex items-center justify-center h-full w-full">
          <Image
            src={ForgotPasswordImage}
            alt="Forgot Password illustration"
            width={600}
            height={400}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right side with forgot password form */}
      <div className="w-full md:w-[30%] bg-white flex flex-col items-center p-8">
        <div 
          className="mb-12 bg-primary rounded-full p-4 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image src={Logo} alt="Logo" width={32} height={32}/>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-black">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-8">No worries, we will send you reset instructions.</p>

        <form className="w-full max-w-sm" onSubmit={handleForgotPassword}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
        <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/Login`} className='mt-8 text-gray-600'>{'< '} Back to Login</a>
      </div>
    </div>
  );
}