import Navbar from "../components/Navbar"
import { Suspense } from "react";

const Loading = () => {
    return <div className="h-16 bg-gray-100 animate-pulse" />;
  };

export default async function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
        <Suspense fallback={<Loading />}>
          <Navbar/>
        </Suspense>
          <main>{children}</main>
        </body>
      </html>
    )
  }