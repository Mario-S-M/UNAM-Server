'use client';

import Image from 'next/image';
import UnamEscudo from '@/assets/Escudo UNAM azul.jpg';
import EnesMediateca from '@/assets/logo enes morelia mediateca.png';
import FESLogo from '@/assets/logo_FES.png';

export function WelcomeDashboard() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-foreground opacity-100">
            Bienvenido a
          </h2>
          <h1 
          className="text-5xl font-bold text-center opacity-100" 
          style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            lineHeight: '1.2',
            minHeight: '2rem'
          }}
        >
          Éskani
        </h1>
        </div>

        {/* Logos elegantes */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
            <div className="p-3 rounded-xl bg-white shadow-sm ring-1 ring-border/50">
              <Image
                src={UnamEscudo}
                alt="Escudo UNAM"
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-out hover:scale-105"
                priority
              />
            </div>
            <div className="p-3 rounded-xl bg-white shadow-sm ring-1 ring-border/50">
              < Image
                src={FESLogo} 
                alt="Escudo FES Aragon"
                priority
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-out hover:scale-105"
                />
            </div>
            <div className="p-3 rounded-xl bg-white shadow-sm ring-1 ring-border/50">
              <Image
                src={EnesMediateca}
                alt="ENES Morelia Mediateca"
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}