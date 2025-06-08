import React from 'react';

function Header() {
    // Nama user bisa didapatkan dari context nantinya
    const username = "Pengguna";

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center">
                {/* Tombol menu untuk mobile bisa ditambahkan di sini */}
                <h1 className="text-lg font-semibold">Selamat Datang, {username}!</h1>
            </div>
            <div className="flex items-center">
                <img 
                    className="w-10 h-10 rounded-full" 
                    src="https://placehold.co/100x100/E2E8F0/4A5568?text=U" 
                    alt="User Avatar"
                />
            </div>
        </header>
    );
}

export default Header;
