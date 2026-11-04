/**
 * PLATAFORMA DE AGENDAMENTO — INTERATIVIDADE E NAVEGAÇÃO
 */
(function () {
  'use strict';

  const config = window.PLATFORM_CONFIG || {};
  const modalBackdrop = document.getElementById('editorial-modal');
  const modalBody = document.getElementById('modal-body-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // 1. Aplicar configurações de marca caso personalizadas em config.js
  if (config.brand) {
    document.querySelectorAll('[data-config="brand-top"]').forEach((el) => {
      if (config.brand.topLine) el.textContent = config.brand.topLine;
    });
    document.querySelectorAll('[data-config="brand-main"]').forEach((el) => {
      if (config.brand.mainName) el.textContent = config.brand.mainName;
    });
  }

  // 2. Funções do Modal Editorial
  function openModal(htmlContent) {
    if (!modalBackdrop || !modalBody) return;
    modalBody.innerHTML = htmlContent;
    modalBackdrop.hidden = false;
    modalBackdrop.setAttribute('aria-hidden', 'false');

    const form = modalBody.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const planId = form.getAttribute('data-plan-form');
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : '';
        modalBody.innerHTML = `
          <span class="modal-badge">SOLICITAÇÃO REGISTRADA</span>
          <h3 id="modal-title" class="modal-heading">TUDO PRONTO!</h3>
          <p class="modal-text">
            Recebemos seu interesse${planId ? ` no plano <strong>${planId.toUpperCase()}</strong>` : ''}${email ? ` para <strong>${email}</strong>` : ''}.
            Configure a URL de checkout ou API de autenticação em <code>config.js</code> para redirecionamento automático ao gateway de pagamento.
          </p>
          <button type="button" class="modal-submit-btn" data-close-modal>ENTENDI</button>
        `;
        const closeBtn = modalBody.querySelector('[data-close-modal]');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
      });
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = true;
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  // 3. Card 1 — Visualização de Miniaturas e Botão '+'
  document.querySelectorAll('.media-thumb-tile').forEach((tile) => {
    tile.addEventListener('click', function () {
      const title = tile.getAttribute('data-preview-title') || 'Conteúdo da Biblioteca';
      const img = tile.getAttribute('data-preview-img') || 'assets/thumb-card-1.png';
      openModal(`
        <span class="modal-badge">BIBLIOTECA DE MÍDIA</span>
        <h3 id="modal-title" class="modal-heading">${title}</h3>
        <div style="margin: 12px 0; border-radius: 12px; overflow: hidden; border: 1.5px solid #080A0A; max-height: 210px;">
          <img src="${img}" alt="${title}" style="width: 100%; height: 210px; object-fit: cover; display: block;" />
        </div>
        <p class="modal-text">
          Pronto para agendamento em massa no Instagram, TikTok, YouTube, Shorts e Reels.
        </p>
        <a href="#planos" class="modal-submit-btn" style="display:inline-flex;justify-content:center;text-decoration:none;" data-close-and-scroll>
          COMEÇAR AGORA →
        </a>
      `);
      const btn = modalBody.querySelector('[data-close-and-scroll]');
      if (btn) btn.addEventListener('click', closeModal);
    });
  });

  document.querySelectorAll('[data-action="open-upload-demo"]').forEach((btn) => {
    btn.addEventListener('click', function () {
      openModal(`
        <span class="modal-badge">AGENDAMENTO EM MASSA</span>
        <h3 id="modal-title" class="modal-heading">ENVIE VÍDEOS, FOTOS E SHORTS</h3>
        <p class="modal-text">
          Organize seus arquivos em lote, defina legendas, datas e horários e distribua para Instagram, TikTok, YouTube, Shorts e Reels em um único fluxo.
        </p>
        <p class="modal-note" style="margin-bottom: 14px;">
          Nota técnica: A publicação direta nas redes requer conexão OAuth/API configurada no painel da conta.
        </p>
        <a href="#planos" class="modal-submit-btn" style="display:inline-flex;justify-content:center;text-decoration:none;" data-close-and-scroll>
          ESCOLHER UM PLANO →
        </a>
      `);
      const goBtn = modalBody.querySelector('[data-close-and-scroll]');
      if (goBtn) goBtn.addEventListener('click', closeModal);
    });
  });

  // 4. Card 2 — Calendário Interativo
  const calendarMonths = (config.calendar && config.calendar.months) || [];
  let currentMonthIdx = (config.calendar && config.calendar.defaultMonthIndex) || 0;
  const calMonthLabel = document.getElementById('cal-month-label');
  const calDaysGrid = document.getElementById('calendar-days-grid');
  const calFooterStatus = document.getElementById('cal-footer-status');
  const calPrevBtn = document.getElementById('cal-prev-btn');
  const calNextBtn = document.getElementById('cal-next-btn');

  function bindCalendarDayClicks(monthObj) {
    if (!calDaysGrid) return;
    calDaysGrid.querySelectorAll('[data-day]').forEach((dayBtn) => {
      dayBtn.addEventListener('click', function () {
        const d = dayBtn.getAttribute('data-day');
        const info = monthObj && monthObj.scheduledDays && monthObj.scheduledDays[d];
        if (calFooterStatus && info) {
          calFooterStatus.textContent = `DIA ${d}: ${info.summary.toUpperCase()}`;
        }
      });
    });
  }

  function renderCalendarMonth(idx) {
    const month = calendarMonths[idx];
    if (!month || !calDaysGrid || !calMonthLabel) return;
    calMonthLabel.textContent = month.label;

    let html = '';
    (month.prevDays || []).forEach((d) => {
      html += `<span class="cal-day cal-day-muted">${d}</span>`;
    });

    for (let d = 1; d <= month.totalDays; d++) {
      const sched = month.scheduledDays && month.scheduledDays[d];
      if (sched) {
        const colorClass = sched.color === 'dark' ? 'cal-day-dark' : 'cal-day-blue';
        const dots = sched.color === 'blue' ? '<i class="cal-mini-dots"></i>' : '';
        html += `
          <button type="button" class="cal-day cal-day-scheduled ${colorClass}" data-day="${d}" title="${sched.summary}">
            <span>${d}</span>
            ${dots}
          </button>
        `;
      } else if (d === 7 || d === 13) {
        html += `<span class="cal-day cal-day-has-dot">${d}</span>`;
      } else {
        html += `<span class="cal-day">${d}</span>`;
      }
    }

    (month.nextDays || []).forEach((d) => {
      html += `<span class="cal-day cal-day-muted">${d}</span>`;
    });

    calDaysGrid.innerHTML = html;
    if (calFooterStatus) calFooterStatus.textContent = 'PROGRAME AS DATAS';
    bindCalendarDayClicks(month);
  }

  if (calendarMonths.length > 0) {
    bindCalendarDayClicks(calendarMonths[currentMonthIdx]);
  }

  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', function () {
      if (!calendarMonths.length) return;
      currentMonthIdx = (currentMonthIdx - 1 + calendarMonths.length) % calendarMonths.length;
      renderCalendarMonth(currentMonthIdx);
    });
  }

  if (calNextBtn) {
    calNextBtn.addEventListener('click', function () {
      if (!calendarMonths.length) return;
      currentMonthIdx = (currentMonthIdx + 1) % calendarMonths.length;
      renderCalendarMonth(currentMonthIdx);
    });
  }

  // 5. Card 3 — Controles de Ativação de Canais
  const channelSwitches = document.querySelectorAll('.ui-switch');
  const channelsFooter = document.getElementById('channels-footer-status');

  function updateChannelsStatus() {
    if (!channelsFooter) return;
    const total = channelSwitches.length;
    let activeCount = 0;
    channelSwitches.forEach((sw) => {
      if (sw.classList.contains('is-on')) activeCount++;
    });
    if (activeCount === total) {
      channelsFooter.textContent = 'EM TODAS AS REDES';
    } else if (activeCount === 0) {
      channelsFooter.textContent = 'SELECIONE AS REDES';
    } else {
      channelsFooter.textContent = `${activeCount} DE ${total} REDES ATIVAS`;
    }
  }

  channelSwitches.forEach((sw) => {
    sw.addEventListener('click', function () {
      const isOn = sw.classList.toggle('is-on');
      sw.setAttribute('aria-checked', isOn ? 'true' : 'false');
      updateChannelsStatus();
    });
  });

  // 6. Lógica de Precificação e Seletor do Plano Personalizado
  // Tabela oficial de preços enviada:
  // Starter (3 contas) -> R$ 99,90 (https://pay.cakto.com.br/v2j3krs)
  // Pro (5 contas) -> R$ 159,90 (https://pay.cakto.com.br/dugzksx)
  // Business (10 contas) -> R$ 279,90 (https://pay.cakto.com.br/3aomaqr)
  const OFFICIAL_TIERS = (config.pricingTable && config.pricingTable.tiers) || [
    { name: 'Starter', accounts: 3, price: 99.90, checkoutUrl: 'https://pay.cakto.com.br/v2j3krs' },
    { name: 'Pro', accounts: 5, price: 159.90, checkoutUrl: 'https://pay.cakto.com.br/dugzksx' },
    { name: 'Business', accounts: 10, price: 279.90, checkoutUrl: 'https://pay.cakto.com.br/3aomaqr' }
  ];

  const SINGLE_ACCOUNT_REF_PRICE = (config.pricingTable && config.pricingTable.singleAccountReference) || 49.90; // R$ 49,90 por conta/mês

  let currentTierIndex = 0; // Começa em 3 contas (Starter)

  function formatBRL(val) {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateCustomCardUI() {
    const tier = OFFICIAL_TIERS[currentTierIndex];
    if (!tier) return;

    const accountsNumEl = document.getElementById('custom-accounts-num');
    const priceDisplayEl = document.getElementById('custom-price-display');
    const tierNameEl = document.getElementById('custom-tier-name');
    const savingsSimpleEl = document.getElementById('custom-savings-simple');
    const btnMinus = document.getElementById('custom-btn-minus');
    const btnPlus = document.getElementById('custom-btn-plus');
    const customCtaBtn = document.getElementById('custom-cta-btn');

    // Cálculo exato da economia:
    // VALOR INDIVIDUAL = quantidade de contas × R$ 49,90
    // ECONOMIA = valor individual - preço do plano selecionado
    const valorIndividual = Math.round(tier.accounts * SINGLE_ACCOUNT_REF_PRICE * 100) / 100;
    const economia = Math.round((valorIndividual - tier.price) * 100) / 100;

    // Atualiza número de contas
    if (accountsNumEl) {
      accountsNumEl.textContent = tier.accounts;
    }

    // Atualiza nome do plano
    if (tierNameEl) {
      tierNameEl.textContent = tier.name;
    }

    // Atualiza preço mensal
    if (priceDisplayEl) {
      priceDisplayEl.textContent = `R$ ${formatBRL(tier.price)}`;
    }

    // Atualiza economia: somente a frase "Economizou R$ XX,XX/mês"
    if (savingsSimpleEl) {
      if (economia > 0) {
        savingsSimpleEl.innerHTML = `Economizou <strong class="savings-highlight">R$ ${formatBRL(economia)}/mês</strong>`;
      } else {
        savingsSimpleEl.innerHTML = `Economizou <strong class="savings-highlight">R$ 0,00/mês</strong>`;
      }
    }

    // Atualiza o link de checkout do botão personalizado de acordo com o tier
    if (customCtaBtn && tier.checkoutUrl) {
      customCtaBtn.href = tier.checkoutUrl;
    }

    // Gerencia estado de ativação dos botões de - e +
    if (btnMinus) {
      btnMinus.disabled = currentTierIndex === 0;
    }
    if (btnPlus) {
      btnPlus.disabled = currentTierIndex === OFFICIAL_TIERS.length - 1;
    }

    // Atualiza o plano personalizado na configuração global
    const planPersonalizado = (config.plans || []).find((p) => p.id === 'personalizado');
    if (planPersonalizado) {
      planPersonalizado.price = `R$ ${formatBRL(tier.price)}`;
      planPersonalizado.accounts = tier.accounts;
      planPersonalizado.tierName = tier.name;
      planPersonalizado.savings = `R$ ${formatBRL(economia)}`;
      planPersonalizado.checkoutUrl = tier.checkoutUrl;
    }
  }

  const customBtnMinus = document.getElementById('custom-btn-minus');
  const customBtnPlus = document.getElementById('custom-btn-plus');

  if (customBtnMinus) {
    customBtnMinus.addEventListener('click', function () {
      if (currentTierIndex > 0) {
        currentTierIndex -= 1;
        updateCustomCardUI();
      }
    });
  }

  if (customBtnPlus) {
    customBtnPlus.addEventListener('click', function () {
      if (currentTierIndex < OFFICIAL_TIERS.length - 1) {
        currentTierIndex += 1;
        updateCustomCardUI();
      }
    });
  }

  // Inicializa o card personalizado imediatamente
  updateCustomCardUI();

  // 7. Ações de Planos (Redirecionamento direto ao checkout oficial da Cakto, sem modal)
  document.querySelectorAll('[data-action="select-plan"]').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const planId = btn.getAttribute('data-plan') || 'pro';
      let checkoutUrl = '';

      if (planId === 'personalizado') {
        const tier = OFFICIAL_TIERS[currentTierIndex];
        checkoutUrl = (tier && tier.checkoutUrl) || btn.getAttribute('href') || 'https://pay.cakto.com.br/v2j3krs';
      } else {
        const planObj = ((config.plans || []).find((p) => p.id === planId));
        checkoutUrl = (planObj && planObj.checkoutUrl) || btn.getAttribute('href');
      }

      if (checkoutUrl && checkoutUrl.startsWith('http')) {
        btn.href = checkoutUrl;
        // Navegação direta para a Cakto sem qualquer modal intermediário
      }
    });
  });

  document.querySelectorAll('[data-action="open-support"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const extUrl = config.links && (config.links.supportUrl || config.links.supportWhatsapp);
      if (extUrl && extUrl.trim() !== '') {
        window.open(extUrl, '_blank', 'noopener,noreferrer');
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const supportEmail = (config.links && config.links.supportEmail) || 'suporte@duonick.com.br';
      openModal(`
        <span class="modal-badge">CENTRAL DE ATENDIMENTO</span>
        <h3 id="modal-title" class="modal-heading">SUPORTE AO CLIENTE</h3>
        <p class="modal-text">
          Precisa de ajuda com agendamentos em massa, integração de contas ou dúvidas sobre os planos? Nossa equipe está pronta para atender você.
        </p>
        <p class="modal-text">
          <strong>E-mail de suporte:</strong> <a href="mailto:${supportEmail}" style="color:#1554FF;font-weight:700;">${supportEmail}</a>
        </p>
        <button type="button" class="modal-submit-btn" data-close-modal>FECHAR</button>
      `);
      const closeBtn = modalBody.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    });
  });

  document.querySelectorAll('[data-action="open-terms"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(`
        <span class="modal-badge">DOCUMENTO LEGAL</span>
        <h3 id="modal-title" class="modal-heading">TERMOS DE USO</h3>
        <p class="modal-text">
          A Plataforma de Agendamento permite organizar, programar e gerenciar conteúdos autorais para publicação nas redes sociais conectadas pelo usuário, respeitando os limites do plano contratado (Básico, Pro ou Premium) e as diretrizes oficiais do Instagram, TikTok e YouTube.
        </p>
        <button type="button" class="modal-submit-btn" data-close-modal>FECHAR</button>
      `);
      const closeBtn = modalBody.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    });
  });

  document.querySelectorAll('[data-action="open-privacy"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(`
        <span class="modal-badge">PRIVACIDADE & SEGURANÇA</span>
        <h3 id="modal-title" class="modal-heading">POLÍTICA DE PRIVACIDADE</h3>
        <p class="modal-text">
          Seus vídeos, fotos, legendas e credenciais de integração são protegidos e utilizados exclusivamente para a execução dos agendamentos programados por você na plataforma.
        </p>
        <button type="button" class="modal-submit-btn" data-close-modal>FECHAR</button>
      `);
      const closeBtn = modalBody.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    });
  });
})();

