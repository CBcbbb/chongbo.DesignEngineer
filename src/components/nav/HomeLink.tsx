"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore, type ComponentProps } from "react";
import { applicationHome, currentApplicationHome, rememberApplicationHome, subscribeApplicationHome } from "@/lib/application-home";

/** The name and Back Home controls return an application visitor to their printer, including after reading work. */
export function HomeLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  const href = useSyncExternalStore(subscribeApplicationHome, currentApplicationHome, () => applicationHome(pathname, "") ?? "/");
  useEffect(() => {
    rememberApplicationHome(pathname, window.location.search);
  }, [pathname]);
  return <Link {...props} href={href} />;
}
