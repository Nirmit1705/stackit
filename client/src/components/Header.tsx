import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  onLogin: (username: string, password: string) => void;
  onSignup: (username: string, email: string, password: string) => void;
  onLogout: () => void;
}

const DROPDOWN_OPTIONS = [
  'Newest Unanswered',
  'Most Voted',
  'Oldest',
  'My Questions',
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, user, onLogin, onSignup, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Newest Unanswered');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const widthMeasureRef = useRef<HTMLDivElement>(null);
  const [tabWidth, setTabWidth] = useState<number | undefined>(undefined);

  // Separate dropdown open state for mobile and desktop
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false);
      }
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    }
    if (mobileDropdownOpen || desktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileDropdownOpen, desktopDropdownOpen]);

  // Measure the widest label
  useEffect(() => {
    if (widthMeasureRef.current) {
      const children = Array.from(widthMeasureRef.current.children) as HTMLSpanElement[];
      let maxWidth = 0;
      children.forEach((child) => {
        const width = child.offsetWidth;
        if (width > maxWidth) maxWidth = width;
      });
      // Add padding for icon and button padding
      setTabWidth(maxWidth + 40); // 40px for icon and padding
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full">
      {/* Hidden width measure container */}
      <div ref={widthMeasureRef} className="absolute invisible h-0 overflow-hidden whitespace-nowrap">
        {DROPDOWN_OPTIONS.map(option => (
          <span key={option} className="px-6 py-2 text-base font-medium">
            {option}
          </span>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Logo and Login */}
        <div className="flex items-center justify-between h-14">
          <span className="text-3xl font-handwritten font-bold text-gray-800 dark:text-gray-100 select-none tracking-tight">
            StackIt
          </span>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="border-2 border-gray-700 rounded-full px-6 py-1 text-gray-800 dark:text-gray-100 font-medium bg-white hover:bg-gray-100 transition-colors text-base shadow-sm"
            style={{ fontFamily: 'inherit' }}
          >
            Login
          </button>
        </div>
        {/* Divider Line */}
        <div className="w-full border-t border-gray-300 dark:border-gray-700 mb-1" />
        {/* Second Row: Controls (responsive) */}
        {/* Mobile: Button row on top, search bar below */}
        <div className="flex flex-col gap-2 sm:hidden w-full h-auto min-h-[56px] pb-4 mb-4 mt-3">
          {/* Button row: Ask left, Tab right */}
          <div className="flex flex-row w-full justify-between items-center gap-2 px-1">
            <div className="flex justify-start w-1/2 pr-1">
              <button
                onClick={() => {
                  if (!user.isLoggedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    onNavigate('ask');
                  }
                }}
                className="border border-gray-400 rounded-lg px-2 py-1 text-blue-600 font-medium bg-white hover:bg-blue-50 transition-colors text-sm shadow-sm w-full max-w-[110px] min-w-[80px] min-h-[32px]"
              >
                Ask New
              </button>
            </div>
            <div className="flex justify-end w-1/2 pl-1 relative" ref={mobileDropdownRef}>
              <button
                className="flex items-center gap-1 border border-gray-400 rounded-lg px-3 py-1 bg-gray-100 text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm justify-center w-full whitespace-nowrap"
                style={tabWidth ? { width: tabWidth } : undefined}
                onClick={() => setMobileDropdownOpen((open) => !open)}
                aria-label="Show more options"
              >
                <span className="truncate max-w-full">{activeTab}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 ml-1" />
              </button>
              {/* Dropdown */}
              {mobileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-50">
                  {DROPDOWN_OPTIONS.filter(option => option !== activeTab).map((option) => (
                    <button
                      key={option}
                      className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                      onClick={() => {
                        if (option === 'My Questions' && !user.isLoggedIn) {
                          setIsAuthModalOpen(true);
                        } else {
                          setActiveTab(option);
                        }
                        setMobileDropdownOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Search bar below buttons */}
          <div className="flex items-center w-full justify-center mt-1">
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors text-base"
              />
            </div>
          </div>
        </div>
        {/* Desktop/Tablet: Current layout */}
        <div className="hidden sm:flex flex-row sm:items-center sm:justify-between w-full h-auto min-h-[56px] pb-4 sm:pb-0 mb-4 sm:mb-0">
          {/* Ask New Question */}
          <div className="flex items-center justify-start flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                if (!user.isLoggedIn) {
                  setIsAuthModalOpen(true);
                } else {
                  onNavigate('ask');
                }
              }}
              className="border border-gray-400 rounded-xl px-4 py-2 text-blue-600 font-medium bg-white hover:bg-blue-50 transition-colors text-base shadow-sm w-full sm:w-auto"
            >
              Ask New question
            </button>
          </div>
          {/* Combined Tab Centered */}
          <div className="flex-1 flex justify-center items-center relative w-full sm:w-auto" ref={desktopDropdownRef}>
            <button
              className="flex items-center gap-2 border border-gray-400 rounded-xl px-6 py-2 bg-gray-100 text-gray-700 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm justify-center"
              style={tabWidth ? { width: tabWidth } : undefined}
              onClick={() => setDesktopDropdownOpen((open) => !open)}
              aria-label="Show more options"
            >
              {activeTab}
              <ChevronDown className="w-5 h-5" />
            </button>
            {/* Dropdown */}
            {desktopDropdownOpen && (
              <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-50">
                {DROPDOWN_OPTIONS.filter(option => option !== activeTab).map((option) => (
                  <button
                    key={option}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-base"
                    onClick={() => {
                      if (option === 'My Questions' && !user.isLoggedIn) {
                        setIsAuthModalOpen(true);
                      } else {
                        setActiveTab(option);
                      }
                      setDesktopDropdownOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Search Bar */}
          <div className="flex items-center min-w-[180px] max-w-xs w-full sm:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors text-base"
              />
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={onLogin}
        onSignup={onSignup}
      />
    </header>
  );
};

export default Header;