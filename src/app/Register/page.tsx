'use client'
import Image from 'next/image';
import Logo from '../assets/Logo.svg';
import RegisterImage from '../assets/LoginImage.png'; // Using the same image as Login for now
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoClick = () => {
    router.push('/');
  };  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (password !== repeatPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // Set loading state to true when starting registration
    setIsLoading(true);
    
    try {
      const response = await fetch('https://auctionbaybackend.onrender.com/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        router.push('/Login');
      } else {
        console.error('Registration failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with image - hidden on mobile, visible on md screens and up */}
      <div className="hidden md:block md:w-[70%]  bg-gray-100 flex items-center justify-center">
      <div className="flex items-center justify-center h-full w-full">
        <Image
          src={RegisterImage}
          alt="Register illustration"
          width={600}
          height={400}
          className="object-contain"
          priority
        />
        </div>
      </div>

      {/* Right side with registration form - full width on mobile, 30% on md screens */}
      <div className="w-full  md:w-[30%] bg-white flex flex-col items-center p-8 justify-between">
        <div 
          className="mb-12 bg-primary rounded-full p-4 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image src={Logo} alt="Logo" width={32} height={32}/>
        </div>
        <div className='text-center'>
        <h1 className="text-3xl font-bold mb-2 text-black">Hello!</h1>
        <p className="text-sm text-gray-600 mb-8">Please enter your details</p>
        </div>

        <form className="w-full max-w-sm text-black" onSubmit={handleRegister} >
          <div className="flex mb-4 gap-4">
            <div className="w-1/2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="placeholder"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-black"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="placeholder"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-black"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="placeholder"
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="placeholder"
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-black"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Repeat Password
            </label>
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="placeholder"
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black font-semibold py-2 px-4 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <a href='http://localhost:3000/Login' className='text-black'>Already have an account? <strong>Log in</strong></a>
      </div>
    </div>
  );
}
