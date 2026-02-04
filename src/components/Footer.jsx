import React, { useEffect, useState } from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Footer = () => {
    const [settings, setSettings] = useState({
        whatsapp_number: "5581998910873",
        contact_email: "izabelmorais_@hotmail.com",
        location_city: "Jaboatão dos Guararapes, PE",
        working_hours: "Segunda à Sexta, 9h às 18h",
        instagram_url: "https://instagram.com"
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

    const whatsappLink = `https://wa.me/${settings.whatsapp_number}?text=Olá! Gostaria de fazer um orçamento.`;

    return (
        <footer id="contact" className="bg-brand-brown text-brand-cream">
            {/* Wave separator */}
            <div className="w-full leading-none rotate-180">
                <svg className="relative block w-full h-[30px] md:h-[50px] rotate-180" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-brand-cream"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4 text-brand-purple">Crochê da Bell</h3>
                        <p className="font-sans text-brand-cream/80 max-w-xs mx-auto md:mx-0">
                            Transformando fios em amor, ponto a ponto. Peças exclusivas e personalizadas para você.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-serif font-bold mb-4">Contato</h3>
                        <ul className="space-y-2 font-sans text-brand-cream/80">
                            <li>{settings.working_hours}</li>
                            <li>{settings.location_city}</li>
                            <li>
                                <a href={`mailto:${settings.contact_email}`} className="hover:text-brand-purple transition-colors">{settings.contact_email}</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-serif font-bold mb-4">Redes Sociais</h3>
                        <div className="flex justify-center md:justify-start space-x-6">
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-brand-cream hover:text-brand-purple transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-8 w-8" />
                            </a>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-brand-cream hover:text-green-400 transition-colors">
                                <span className="sr-only">WhatsApp</span>
                                <MessageCircle className="h-8 w-8" />
                            </a>
                        </div>
                        <div className="mt-6">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-purple hover:bg-brand-sage text-white font-bold py-2 px-6 rounded-full transition-colors font-sans">
                                Fale no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-brand-cream/20 pt-8 md:flex md:items-center md:justify-between">
                    <p className="mt-8 text-base text-brand-cream/60 md:mt-0 font-sans text-center w-full">
                        &copy; {new Date().getFullYear()} Crochê da Bell. Todos os direitos reservados.
                        <br />
                        <a href="/admin" className="text-[10px] opacity-20 hover:opacity-100 transition-opacity mt-2 inline-block">Acesso Admin</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
