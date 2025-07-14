import React from 'react';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.jpg" 
                alt="Aura beach & fit" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                Aura beach & fit
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Moda feminina com elegância e sofisticação. Peças únicas para mulheres que valorizam qualidade e estilo.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/aura.fiitness/?igsh=djd4eWI4amd6aWc1&utm_source=qr#" className="text-pink-500 hover:text-pink-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Início</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Produtos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Categorias</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li><a href="tel:+5562996842833" className="text-gray-600 hover:text-pink-600 transition-colors">(62) 99684-2833</a></li>
              <li><a href="https://wa.me/5562996842833" className="text-gray-600 hover:text-pink-600 transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Aura beach & fit. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-sm flex items-center mt-4 md:mt-0">
            Feito com <Heart className="w-4 h-4 text-pink-500 mx-1" /> para você
          </p>
          <p className="text-gray-600 text-sm">BY ALPHADEVSS</p>
        </div>
      </div>
    </footer>
  );
}