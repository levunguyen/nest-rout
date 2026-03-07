"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/components/lib/utils";

type LinkTarget = LinkProps["href"];

interface NavLinkCompatProps
  extends Omit<ComponentPropsWithoutRef<"a">, "href" | "className"> {
  to: LinkTarget;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const normalizePath = (target: LinkTarget) => {
  if (typeof target === "string") return target;
  return target.pathname ?? "";
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName: _pendingClassName, to, ...props }, ref) => {
    const pathname = usePathname();
    const href = normalizePath(to);
    const isActive = href === pathname || (href !== "/" && pathname.startsWith(`/`));
    void _pendingClassName;

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
