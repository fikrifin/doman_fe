import React from 'react';
import { useAuth } from '../../../auth/AuthContext'; // Sesuaikan path ini

function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b flex items-center justify-end px-6">
            <div className="flex items-center space-x-4">
                 <span className="text-right hidden sm:block">
                    <div className="font-semibold">{user ? user.username : '...'}</div>
                    <div className="text-xs text-gray-500">{user ? user.email : '...'}</div>
                </span>
            </div>
        </header>
    );
}

export default Header;
