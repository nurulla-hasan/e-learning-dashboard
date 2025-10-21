import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MenuItem from './MenuItem';
import { menuItems } from '@/data/sidebar.data';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {

  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-shrink-0 lg:inset-y-0"
      )}>
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-semibold text-gray-900">
                    Dashboard
                  </span>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="mt-6 flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                {menuItems?.map((item, index) => (
                  <MenuItem
                    key={index}
                    item={item}
                    setSidebarOpen={setSidebarOpen}
                  />
                ))}              
              </nav>
            </div>
            
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">
                Dashboard
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
            {menuItems?.map((item) => (
              <MenuItem
                key={item.name}
                item={item}
                setSidebarOpen={setSidebarOpen}
              />
            ))}          
          </nav>   
        </div>
      </div>
    </>
  );
};

export default Sidebar;