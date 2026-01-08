'use client';
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();
  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push('/auth/login');
    return;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <a href="users" className="p-20 m-10 rounded content-center bg-green-400">Users</a>
      <a href="stocks" className="p-20 m-10 rounded content-center bg-green-400">Stock Report</a>
    </div>
  );

}
