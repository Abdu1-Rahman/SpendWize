"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeButton from "./theme/ThemeButton";
import Image from "next/image";
import AddTransaction from "./dashboard/AddTransaction";
import { createClient } from "@/utils/supabase/client";
import Logout from "./auth/Logout";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh(); // ✅ force re-render of server + client components
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const getFirstLetter = () => {
    if (!user) return "";
    const username = user.user_metadata?.username || user.email || "";
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed z-1 backdrop-blur-sm bg-white/5 flex justify-between items-center w-full px-3 py-2 border border-border">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          width={80}
          height={80}
          alt="logo"
          className="w-14 h-14"
        />
        <h1 className="text-2xl font-bold">SpendWize</h1>
      </div>

      <div className="flex items-center gap-20">
        <ThemeButton />

        {!user ? (
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl border border-white/20"
          >
            Login
          </Link>
        ) : (
          <div className="flex gap-2 items-center">
            <AddTransaction />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold focus:outline-none">
                  {getFirstLetter()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-5">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
