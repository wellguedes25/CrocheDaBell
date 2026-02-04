import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Hero = () => {
    const [settings, setSettings] = useState({
        hero_title: 'Arte e amor em cada ponto',
        hero_subtitle: 'Peças exclusivas feitas à mão para trazer aconchego e beleza para você e sua casa. Amigurumis, roupas e decoração com alma.'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase.from('site_settings').select('id, value');
            if (data && !error) {
                const mapped = data.reduce((acc, curr) => {
                    acc[curr.id] = curr.value;
                    return acc;
                }, {});
                setSettings(prev => ({ ...prev, ...mapped }));
            }
        };
        fetchSettings();
    }, []);

    return (
        <div id="home" className="relative bg-brand-cream pt-20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-brand-cream sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-brand-brown sm:text-5xl md:text-6xl font-serif">
                                <span className="block">{settings.hero_title}</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-sans">
                                {settings.hero_subtitle}
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a
                                        href="#contact"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-brand-brown transition-colors md:py-4 md:text-lg md:px-10"
                                    >
                                        Fazer Encomenda
                                    </a>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <a
                                        href="#gallery"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 transition-colors md:py-4 md:text-lg md:px-10"
                                    >
                                        Ver Galeria
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="h-56 w-full bg-brand-sage/20 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
                    <Heart className="h-32 w-32 text-brand-sage opacity-50 animate-pulse" />
                </div>
            </div>

            {/* Decorative wave at bottom */}
            <div className="absolute bottom-0 w-full leading-none rotate-180 text-white">
                <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-brand-cream"></path>
                </svg>
            </div>
        </div>
    );
};

export default Hero;
