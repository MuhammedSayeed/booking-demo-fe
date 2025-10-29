// contexts/PreviousRouteContext.tsx
"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const PreviousRouteContext = createContext<string | null>(null);

export const PreviousRouteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [previous, setPrevious] = useState<string | null>(null);
  const currentPath = useRef<string | null>(null);

  useEffect(() => {
    if (currentPath.current && currentPath.current !== pathname) {
      setPrevious(currentPath.current);
    }
    currentPath.current = pathname;
  }, [pathname]);

  return (
    <PreviousRouteContext.Provider value={previous}>
      {children}
    </PreviousRouteContext.Provider>
  );
};

export const usePreviousRoute = () => useContext(PreviousRouteContext);
