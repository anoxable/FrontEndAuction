'use client'
import Image from 'next/image';
import Home from './assets/Home.png';
import Logo from './assets/Logo.svg';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/Login');
  };

  const handleSignUp = () => {
    router.push('/Register');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Transparent Navbar */}
      <nav className="flex justify-between items-center p-4 bg-transparent">
        <div className="logo">
          {/* Logo with yellow round background */}
          <div className="bg-primary rounded-full p-2">
            <Image className="m-2" src={Logo} alt="Logo" width={32} height={32} />
          </div>
        </div>
        <div className="flex items-center gap-4 text-yellow-500">
          <button 
            className="px-2 py-2 text-black font-bold transition-colors"
            onClick={handleLogin}
          >
            Log in
          </button>
          <p className='text-black font-thin p-0'>or</p>
          <button 
            className="px-4 py-2 bg-gray-800 text-white rounded-3xl hover:bg-gray-800 transition-colors border-1 border-black"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl text-black font-bold mb-4">E-auctions made easy!</h1>
        <p className="text-base mb-8 text-black font-light">
          Simple way for selling your unused products, or <br /> getting a deal on product you want!
        </p>
        <a href='http://localhost:3000/Login' className='bg-primary text-black py-2 px-4 rounded-full font-medium'>Start bidding</a>
        {/* Replace with your actual image */}
      </main>
      <div className="w-full max-w-4xl flex m-auto ">
          <Image
            src={Home}
            alt="E-auction illustration"
            width={1200}
            height={800}
            layout="responsive"
            objectFit="cover"
          />
        </div>
    </div>
  );
}
