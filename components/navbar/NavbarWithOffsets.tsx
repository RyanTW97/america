"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

const NavbarWithOffset = ({ children }: { children: React.ReactNode }) => {
  const navbarRef = useRef<HTMLDivElement | null>(null); // ✅ tipo corregido
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />
      <main style={{ marginTop: `${navbarHeight}px` }}>{children}</main>
    </>
  );
};

export default NavbarWithOffset;
