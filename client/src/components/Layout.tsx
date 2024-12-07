import React from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black dark:text-white transition-colors">
      <nav className="border-b bg-gray-100 dark:bg-gray-950 border-gray-200 dark:border-gray-800 sticky top-0">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <PenLine className="h-8 w-8" />
              <span className="text-xl font-bold">Sujal Unfolded</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Home
              </Link>
              <div className='flex items-center space-x-2'>
                </div>   
              <Link to="/write" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Write
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-100 dark:border-gray-950 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Sujal Unfolded. All rights reserved. <br></br>Created By <a className='text-blue-500' href="https://sujal.info" target='_blank'>Sujal</a>
        </div>
      </footer>
    </div>
  );
}

export default Layout;