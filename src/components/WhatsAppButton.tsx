import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = 'Olá! Gostaria de mais informações sobre os produtos.';
    const phoneNumber = '5562996842833';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}