'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Logo } from './ui/logo';
import { X, Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#213635] ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center space-x-8">
            <Logo />
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/about">About</NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white text-lg font-medium transition-colors hover:text-purple-300"
                  >
                    Projects <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/community-projects" className="w-full">
                      Community Projects
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/mentor-projects" className="w-full">
                      Mentor-Based Projects
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NavLink href="/discover-projects">Discover Ideas</NavLink>
              <NavLink href="/mentors">Mentors</NavLink>
              <NavLink href="/forum">Chat Forum</NavLink>
              <NavLink href="/tasks">Tasks</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <div className="bg-[#2e4747] rounded-full flex items-center">
                <Input
                  placeholder="Search..."
                  className="bg-transparent border-none focus:ring-0 focus:border-transparent pl-10 pr-4 py-2 text-white h-9 rounded-full w-32 md:w-44 lg:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Button asChild variant="ghost" className="text-white hover:text-purple-300">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              className="sm:hidden rounded-full h-9 w-9 bg-[#2e4747] hover:bg-[#374f4f] p-0 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="text-gray-400 h-4 w-4" />
            </Button>

            {/* Menu Button */}
            <Button
              variant="ghost"
              className={`md:hidden h-16 px-6 text-white rounded-none ${isMenuOpen ? 'bg-[#6b3e7c]' : 'bg-[#6b3e7c] hover:bg-[#5a2e6b]'}`}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <span className="text-lg">Menu</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#213635] border-t border-[#2e4747]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              <NavLink href="/about" onClick={toggleMenu}>
                About
              </NavLink>
              <NavLink href="/community-projects" onClick={toggleMenu}>
                Community Projects
              </NavLink>
              <NavLink href="/mentor-projects" onClick={toggleMenu}>
                Mentor Projects
              </NavLink>
              <NavLink href="/discover-projects" onClick={toggleMenu}>
                Discover Ideas
              </NavLink>
              <NavLink href="/mentors" onClick={toggleMenu}>
                Mentors
              </NavLink>
              <NavLink href="/forum" onClick={toggleMenu}>
                Chat Forum
              </NavLink>
              <NavLink href="/tasks" onClick={toggleMenu}>
                Tasks
              </NavLink>
              <NavLink href="/contact" onClick={toggleMenu}>
                Contact
              </NavLink>

              {/* Auth Links - Mobile */}
              <div className="pt-4 border-t border-[#2e4747]">
                <NavLink href="/login" onClick={toggleMenu}>
                  Login
                </NavLink>
                <NavLink href="/signup" onClick={toggleMenu}>
                  Sign Up
                </NavLink>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="mt-6">
              <div className="relative">
                <Input
                  placeholder="Search..."
                  className="bg-[#2e4747] border-none focus:ring-0 pl-10 text-white rounded-md w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-white text-lg font-medium transition-colors hover:text-gray-200"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
