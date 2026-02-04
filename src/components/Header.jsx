import React, { useState } from 'react';
import { Menu, X, Instagram } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Início', href: '#home' },
        { name: 'Sobre', href: '#about' },
        { name: 'Galeria', href: '#gallery' },
        { name: 'Depoimentos', href: '#reviews' },
        { name: 'Contato', href: '#contact' },
    ];

    return (
        <nav className="fixed w-full bg-brand-cream/90 backdrop-blur-sm z-50 shadow-sm border-b border-brand-brown/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <img className="h-12 w-12 rounded-full border-2 border-brand-purple" src={logo} alt="Crochê da Bell" />
                        <span className="font-serif text-2xl text-brand-brown font-semibold">Crochê da Bell</span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-brand-brown hover:text-brand-purple transition-colors px-3 py-2 rounded-md text-lg font-medium font-sans"
                                >
                                    {item.name}
                                </a>
                            ))}
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-brand-brown hover:text-brand-purple">
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-brand-brown hover:text-brand-purple focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-brand-cream border-b border-brand-brown/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-brand-brown hover:text-brand-purple block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
