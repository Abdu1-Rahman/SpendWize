"use client";

import { LuShieldCheck } from "react-icons/lu";
import { useEffect, useState } from "react";
import Link from "next/link";

const Hero = () => {

  return (
    <div className="space-y-6 flex flex-col text-center justify-center items-center h-[calc(100%-72px)]">
      <div className="border border-white/80 bg-white/5 rounded-2xl w-fit px-3 py-1 mx-auto backdrop-blur-sm">
        <p className="flex gap-1">
          <LuShieldCheck className="mt-1 text-lg" />
          PERSONAL FINANCE, DONE RIGHT
        </p>
      </div>
      <div>
        <h2 className="font-bold text-6xl">
          Track smarter.{" "}
          <span
            className="text-5xl font-extrabold text-transparent bg-clip-text
               bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-500"
          >
            Spend wiser
          </span>
        </h2>
      </div>
      <p className="text-gray-400 opacity-80 max-w-xl">
        SpendWize helps you understand where your money goes and keep budgets tight.
      </p>

        <Link href={'/login'}
          className="mt-3 px-6 py-3 rounded-xl border border-white/20 bg-white/10"
        >
          Get started — it’s free
        </Link>
    </div>
  );
};

export default Hero;
