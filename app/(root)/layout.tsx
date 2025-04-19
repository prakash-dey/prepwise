"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useRef, useState } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const tooltipRef = useRef<HTMLDivElement>(null);


  const handleLogout = async () => {
    // Optionally, clear cookies via an API route
    await axios.get("/api/users/logout");
    router.push("/signin");
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="root-layout">
      <nav className="flex justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>

        <div className="relative" ref={tooltipRef}>
          <button
            onClick={() => setShowTooltip((prev) => !prev)}
            className="flex items-center"
          >
            <Image
              src={"/user-avatar.png"}
              alt="profile"
              width={38}
              height={38}
              className="rounded-full"
            />
          </button>

          {showTooltip && (
            <div className="absolute -right-2 w-32 z-10">
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
