

import { createClient } from '@/utils/supabase/server';
import Hero from '../components/Hero'
import { redirect } from 'next/navigation';

export default async function Home() {

  const supabase = await createClient()

  const {data , error} =await supabase.auth.getUser()

  if(data?.user){
    redirect("/dashboard")
  }
  
  return (
    <div className="h-screen w-full bg-[url('/images/griddesign.jpg')] bg-cover">
      <div className="inset-0 bg-black/80 h-full">
        <Hero/>
      </div>
    </div>
  );
}
