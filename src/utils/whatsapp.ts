import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../context/AppContext';

export function generateWhatsAppLink(product: any, phoneNumber: string = '5562996842833') {
  const message = `Olá! Tenho interesse neste produto:

*${product.name}*
Preço: R$ ${product.price.toFixed(2).replace('.', ',')}

${product.description}

Pode me enviar mais informações?`;

  const encodedMessage = encodeURIComponent(message);
  
  // Registrar interação no banco
  trackWhatsAppInteraction(product);
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function createOrderFromCart(cartItems: any[], customerInfo: any): Order {
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const orderItems: OrderItem[] = cartItems.map((item, index) => ({
    id: `item_${index}_${Date.now()}`,
    product: item.product,
    quantity: item.quantity,
    unit_price: Number(item.product.price),
    total_price: Number(item.product.price) * item.quantity,
    size: item.size,
    color: item.color
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
  const deliveryFee = 0; // Frete grátis

  return {
    id: orderId,
    customer_name: customerInfo.name || 'Cliente WhatsApp',
    customer_phone: customerInfo.phone || '',
    customer_email: customerInfo.email || '',
    delivery_address: customerInfo.address || '',
    total_amount: subtotal + deliveryFee,
    delivery_fee: deliveryFee,
    status: 'pending',
    order_items: orderItems,
    created_at: new Date().toISOString()
  };
}

export function generateCartWhatsAppLink(cartItems: any[], phoneNumber: string = '5562996842833') {
  let message = 'Olá! Tenho interesse nos seguintes produtos:\n\n';
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   Preço: R$ ${item.product.price.toFixed(2).replace('.', ',')}\n`;
    if (item.size) message += `   Tamanho: ${item.size}\n`;
    if (item.color) message += `   Cor: ${item.color}\n`;
    message += `   Quantidade: ${item.quantity}\n\n`;
    
    // Registrar interação para cada produto
    trackWhatsAppInteraction(item.product);
  });

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  message += `*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
  message += 'Pode me enviar mais informações sobre a disponibilidade?';

  const encodedMessage = encodeURIComponent(message);
  
  // Simular criação de pedido para demonstração
  const simulatedOrder = createOrderFromCart(cartItems, {
    name: 'Cliente WhatsApp',
    phone: phoneNumber,
    email: '',
    address: ''
  });
  
  // Em uma implementação real, você salvaria o pedido no banco aqui
  console.log('Pedido simulado criado:', simulatedOrder);
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

async function trackWhatsAppInteraction(product: any) {
  try {
    await supabase
      .from('whatsapp_interactions')
      .insert({
        product_id: product.id,
        product_name: product.name,
        user_agent: navigator.userAgent,
        ip_address: null // IP seria obtido no backend
      });
  } catch (error) {
    console.error('Erro ao registrar interação WhatsApp:', error);
  }
}