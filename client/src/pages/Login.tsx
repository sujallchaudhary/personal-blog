import React from 'react';
import LoginForm from '../components/loginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Login</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;