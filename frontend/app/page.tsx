'use client';
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const authService = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>
  }

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/auth/login');
  }

  return (
    <div className="text-center justify-center p-10">
      <h1 className="text-center">Menu</h1>

      <div className=" justify-center items-center h-screen">
        <a href="users" className="p-6 m-10 rounded content-center bg-green-300">Users</a>
        <a href="stocks" className="p-6 m-10 rounded content-center bg-green-300">Stock Report</a>
        <button onClick={handleLogout} className="p-6 m-10 rounded content-center bg-green-300">Logout</button>
      </div>
    </div>
  );

}
