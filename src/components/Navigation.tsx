import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Search, Home, FileText, PlusCircle, User, Info } from 'lucide-react';
import { User as UserType } from '../App';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: UserType | null;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, user, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search Items', icon: Search },
    { id: 'report-lost', label: 'Report Lost', icon: FileText },
    { id: 'report-found', label: 'Report Found', icon: PlusCircle },
    ...(user ? [{ id: 'dashboard', label: 'Dashboard', icon: User }] : []),
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (pageId: string) => {
    if ((pageId === 'report-lost' || pageId === 'report-found' || pageId === 'dashboard') && !user) {
      onNavigate('auth');
    } else {
      onNavigate(pageId);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Lost & Found Portal</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => handleNavClick('auth')}
                className="ml-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? "default" : "ghost"}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center space-x-2 justify-start"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
                
                {user ? (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Logged in as: {user.name}</p>
                    <Button variant="outline" onClick={onLogout} className="w-full">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleNavClick('auth')}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    Login / Register
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}