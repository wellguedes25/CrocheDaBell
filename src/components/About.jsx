import React, { useEffect, useState } from 'react';
import { Scissors, Gift, Coffee } from 'lucide-react';
import { supabase } from '../lib/supabase';

const About = () => {
    const [settings, setSettings] = useState({
        about_title: 'Uma história tecida com carinho',
        about_text: 'No Ateliê Crochê da Bell, cada ponto conta uma história. Transformamos fios em memórias, criando peças únicas e cheias de personalidade.'
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
        <div id="about" className="py-16 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center mb-12">
                    <h2 className="text-base text-brand-purple font-semibold tracking-wide uppercase font-sans">Sobre o Ateliê</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-brown sm:text-4xl font-serif">
                        {settings.about_title}
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto font-sans">
                        {settings.about_text}
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        <div className="flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-cream text-brand-purple mb-4">
                                <Scissors className="h-8 w-8" />
                            </div>
                            <dt className="text-lg leading-6 font-medium text-brand-brown font-serif">Feito à Mão</dt>
                            <dd className="mt-2 text-base text-gray-500 font-sans">
                                Cada peça é produzida manualmente, garantindo qualidade e exclusividade em cada detalhe.
                            </dd>
                        </div>

                        <div className="flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-cream text-brand-purple mb-4">
                                <Gift className="h-8 w-8" />
                            </div>
                            <dt className="text-lg leading-6 font-medium text-brand-brown font-serif">Presentes Únicos</dt>
                            <dd className="mt-2 text-base text-gray-500 font-sans">
                                O presente perfeito para quem você ama, feito sob medida e com muito carinho.
                            </dd>
                        </div>

                        <div className="flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-cream text-brand-purple mb-4">
                                <Coffee className="h-8 w-8" />
                            </div>
                            <dt className="text-lg leading-6 font-medium text-brand-brown font-serif">Conforto & Estilo</dt>
                            <dd className="mt-2 text-base text-gray-500 font-sans">
                                Peças que trazem aconchego para o lar e beleza para o dia a dia.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default About;
