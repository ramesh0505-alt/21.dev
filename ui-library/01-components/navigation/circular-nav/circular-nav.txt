You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
cicular-navigation-bar.tsx
"use client";
 
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
 
interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}
 
interface CircularNavigationProps {
  navItems: NavItem[];
  isOpen: boolean;
  toggleMenu: () => void;
}
 
export default function CircularNavigation({
  navItems,
  isOpen,
  toggleMenu,
}: CircularNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
 
  return (
    <>
      {isOpen && (
        <div className=" fixed h-screen w-full flex items-center justify-center bg-background z-[9000]">
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative aspect-square w-[420px] max-w-screen rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow:
                  "inset 2px 2px 2px rgba(255,255,255,0.5), inset -1px -1px 1px rgba(255,255,255,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleMenu}
                className="absolute aspect-square flex items-center justify-center w-12 h-12 rounded-full bg-white text-black z-10"
              >
                <X className="w-6 h-6" />
              </button>
 
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const angle = (360 / navItems.length) * index;
 
                return (
                  <div
                    key={item.name}
                    className="absolute"
                    style={{
                      transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center justify-center w-20 h-20 aspect-square rounded-full transition-colors duration-200 no-decoration ${
                        hoveredItem === item.name
                          ? "bg-white text-black"
                          : "text-white"
                      }`}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={toggleMenu}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span
                        className="text-xs font-medium"
                        style={{ textDecoration: "none" }}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}

demo.tsx
"use client";
 
import { useState } from "react";
import CircularNavigation from "@/components/ui/cicular-navigation-bar";
import {
  Home,
  Film,
  Music,
  Trophy,
  FileText,
  Settings,
  Search,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
 
const navItems = [
{ name: "Home", icon: Home, href: "/" },
{ name: "Movies", icon: Film, href: "/movies" },
{ name: "Music", icon: Music, href: "/music" },
{ name: "Sports", icon: Trophy, href: "/sports" },
{ name: "News", icon: FileText, href: "/news" },
{ name: "Settings", icon: Settings, href: "/settings" },
{ name: "Search", icon: Search, href: "/search" },
];
 
export default function CircularNav() {
  const [isOpen, setIsOpen] = useState(false);
 
const toggleMenu = () => setIsOpen(!isOpen);
 
return (
 
<>
  <div className="h-screen w-full flex items-center justify-center">
    <Button onClick={toggleMenu}>Open Navigation</Button>
  </div>
  <CircularNavigation
    navItems={navItems}
    isOpen={isOpen}
    toggleMenu={toggleMenu}
  />
</>
); }
```

Copy-paste these files for dependencies:
```tsx
shadcn/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

Install NPM dependencies:
```bash
next, lucide-react, framer-motion, @radix-ui/react-slot, class-variance-authority
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
