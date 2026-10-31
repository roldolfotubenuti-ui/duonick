/**
 * CONFIGURAÇÃO CENTRAL DA PLATAFORMA DE AGENDAMENTO
 * ---------------------------------------------------------------------------
 * Edite este arquivo para configurar links de checkout, cadastro/login,
 * suporte, preços dos planos e canais sem precisar alterar o HTML/CSS.
 */

window.PLATFORM_CONFIG = {
  brand: {
    topLine: 'PLATAFORMA DE',
    mainName: 'AGENDAMENTO',
    logoUrl: 'assets/logo.png'
  },

  // Links externos de autenticação / suporte
  links: {
    ctaStart: '#planos',
    loginUrl: '',
    signupUrl: '',
    supportUrl: '',
    supportEmail: 'suporte@duonick.com.br',
    supportWhatsapp: ''
  },

  // Navegação principal (Seção 1)
  navigation: [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Planos', href: '#planos' },
    { label: 'Suporte', href: '#suporte' }
  ],

  // Faixa diagonal do Hero (Seção 2)
  ribbonItems: [
    'VÍDEOS',
    'FOTOS',
    'SHORTS',
    'REELS',
    'TIKTOK',
    'INSTAGRAM',
    'YOUTUBE',
    'AGENDAMENTO',
    'PUBLICAÇÃO AUTOMÁTICA',
    'CONTEÚDO EM MASSA'
  ],

  // Canais do Card 3 (Publique Automaticamente)
  channels: [
    { id: 'instagram', name: 'Instagram', active: true },
    { id: 'tiktok', name: 'TikTok', active: true },
    { id: 'youtube', name: 'YouTube', active: true },
    { id: 'shorts', name: 'Shorts', active: true },
    { id: 'reels', name: 'Reels', active: true }
  ],

  // Calendário interativo (Card 2)
  calendar: {
    defaultMonthIndex: 0,
    months: [
      {
        label: 'Maio 2024',
        prevDays: [29, 30],
        totalDays: 31,
        nextDays: [1, 2],
        scheduledDays: {
          2: { color: 'blue', count: 2, summary: 'Instagram Reels + TikTok (14:00)' },
          8: { color: 'blue', count: 3, summary: 'YouTube Shorts + Instagram (10:00)' },
          14: { color: 'blue', count: 2, summary: 'TikTok + Reels em massa (18:00)' },
          21: { color: 'blue', count: 4, summary: 'Lote semanal: 4 vídeos agendados' },
          24: { color: 'dark', count: 2, summary: 'YouTube + Shorts (18:00)' }
        }
      },
      {
        label: 'Junho 2024',
        prevDays: [27, 28, 29, 30, 31],
        totalDays: 30,
        nextDays: [1, 2, 3, 4, 5, 6, 7],
        scheduledDays: {
          4: { color: 'blue', count: 3, summary: 'Instagram + TikTok (12:00)' },
          11: { color: 'blue', count: 2, summary: 'YouTube Shorts (15:00)' },
          18: { color: 'blue', count: 5, summary: 'Agendamento em massa (19:00)' },
          25: { color: 'dark', count: 2, summary: 'Reels + TikTok (14:00)' }
        }
      }
    ]
  },

  // Planos de Assinatura (Seção 7)
  plans: [
    {
      id: 'basico',
      name: 'BÁSICO',
      accounts: 1,
      price: 'R$ 49,90',
      period: '/mês',
      featured: false,
      badge: '',
      checkoutUrl: '',
      features: [
        '1 conta conectada',
        'Até 100 publicações/mês',
        'Instagram, TikTok e YouTube',
        'Calendário de conteúdo',
        'Suporte por e-mail'
      ],
      ctaLabel: 'COMEÇAR AGORA →'
    },
    {
      id: 'pro',
      name: 'PRO',
      accounts: 2,
      price: 'R$ 67,90',
      period: '/mês',
      featured: true,
      badge: 'MAIS ESCOLHIDO',
      checkoutUrl: '',
      features: [
        '2 contas conectadas',
        'Publicações em massa',
        'Todas as redes suportadas',
        'Legendas e agendamento',
        'Relatórios de desempenho',
        'Suporte prioritário'
      ],
      ctaLabel: 'COMEÇAR AGORA →'
    },
    {
      id: 'personalizado',
      name: 'PERSONALIZADO',
      accounts: 3,
      price: 'R$ 99,90',
      period: '/mês',
      tierName: 'Starter',
      featured: false,
      badge: '',
      checkoutUrl: '',
      ctaLabel: 'COMEÇAR AGORA →'
    }
  ],

  // Tabela Oficial de Preços do Plano Personalizado
  // Valor unitário de referência individual: R$ 49,90 por conta/mês
  pricingTable: {
    singleAccountReference: 49.90,
    tiers: [
      { name: 'Starter', accounts: 3, price: 99.90 },
      { name: 'Pro', accounts: 5, price: 159.90 },
      { name: 'Business', accounts: 10, price: 279.90 }
    ]
  }
};
