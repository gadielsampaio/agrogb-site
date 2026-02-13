document.addEventListener('DOMContentLoaded', () => {
  // INICIALIZADORES
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initMapSVGInteractions(); // Mapa do estado (hover)
});

// --- 1. NAVBAR GLASS EFFECT ---
function initNavbar() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('glass-header', 'py-2');
      header.classList.remove('py-6');
    } else {
      header.classList.remove('glass-header', 'py-2');
      header.classList.add('py-6');
    }
  });
}

// --- 2. MENU MOBILE ---
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const close = document.querySelector('#close-menu');
  const menu = document.querySelector('#side-menu');
  const backdrop = document.querySelector('#menu-backdrop');

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden', 'opacity-0');
  };

  const closeMenu = () => {
    menu.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  };

  toggle.addEventListener('click', (e) => { e.preventDefault(); openMenu(); });
  close.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// --- 3. ANIMAÇÕES DE SCROLL ---
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${index * 100}ms`;
    observer.observe(el);
  });
}

// --- 4. MAPA SVG (HOVER) ---
function initMapSVGInteractions() {
  // Lógica para o Mapa do Estado (Esquerda) iluminar a Lista (Direita)
  const triggers = document.querySelectorAll('#triggers circle');

  triggers.forEach(trigger => {
    const id = trigger.getAttribute('data-id');

    // Mouse Events
    trigger.addEventListener('mouseenter', () => window.highlightMap(id));
    trigger.addEventListener('mouseleave', () => window.resetMap(id));

    // Mobile Touch
    trigger.addEventListener('touchstart', (e) => {
      e.preventDefault();
      window.highlightMap(id);
      setTimeout(() => window.resetMap(id), 2000);
    });
  });
}

// --- FUNÇÕES GLOBAIS (window.) PARA ACESSO DIRETO NO HTML ---

// A. Mapa do Estado (Highlight)
window.highlightMap = function (id) {
  const pin = document.getElementById(`pin-visual-${id}`);
  const card = document.getElementById(`city-${id}`);

  if (pin) {
    pin.style.transform = "translateY(-15px) scale(1.3)";
    pin.style.filter = "drop-shadow(0 0 8px rgba(217, 249, 157, 0.8)) hue-rotate(90deg)";
    pin.style.zIndex = "50";
  }
  if (card) {
    card.classList.add('bg-white/10', 'border-brand-accent/50');
    card.querySelector('h3').classList.add('text-white');
  }
};

window.resetMap = function (id) {
  const pin = document.getElementById(`pin-visual-${id}`);
  const card = document.getElementById(`city-${id}`);

  if (pin) {
    pin.style.transform = "";
    pin.style.filter = "";
    pin.style.zIndex = "";
  }
  if (card) {
    card.classList.remove('bg-white/10', 'border-brand-accent/50');
    card.querySelector('h3').classList.remove('text-white');
  }
};

// B. Mapa de Sedes (Google Maps Switcher)
window.switchMap = function (location) {
  const iframe = document.getElementById('map-iframe');
  const label = document.getElementById('map-label');
  const address = document.getElementById('map-address');

  const tabAmambai = document.getElementById('tab-amambai');
  const tabBand = document.getElementById('tab-bandeirantes');

  // Classes Tailwind para estado Ativo/Inativo
  const activeClasses = ['bg-brand-accent', 'text-brand-dark', 'shadow-lg', 'border-transparent', 'active'];
  const inactiveClasses = ['text-white/50', 'hover:bg-white/5', 'hover:text-white', 'bg-transparent', 'border-transparent'];

  // Helper para trocar classes
  const setTabState = (activeTab, inactiveTab) => {
    activeTab.classList.add(...activeClasses);
    activeTab.classList.remove('text-white/50', 'hover:bg-white/5', 'hover:text-white', 'bg-transparent');

    inactiveTab.classList.remove(...activeClasses);
    inactiveTab.classList.add(...inactiveClasses);
  };

  if (location === 'amambai') {
    iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.476729606277!2d-55.23199992391036!3d-23.10900057911252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x948a601831885b73%3A0x7d06637373737373!2sR.%20Rio%20Branco%2C%20993%20-%20Centro%2C%20Amambai%20-%20MS%2C%2079990-000!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr";
    label.textContent = "Sede Administrativa";
    address.innerHTML = "Rua Rio Branco, 993<br>Amambai - MS";
    setTabState(tabAmambai, tabBand);

  } else if (location === 'bandeirantes') {
    // Coordenada genérica de Bandeirantes-MS (ajuste se tiver o link exato)
    iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3751.104188912709!2d-54.3702360240149!3d-19.920013837999164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94814941e8c94693%3A0x4dcd2be93e6b1485!2sR.%20Cel.%20Antonino%20Gon%C3%A7alves%2C%20189%20-%20Centro%2C%20Bandeirantes%20-%20MS%2C%2079430-000!5e0!3m2!1spt-BR!2sbr!4v1771012375315!5m2!1spt-BR!2sbr";
    label.textContent = "Filial Operacional";
    address.innerHTML = "Rodovia BR-060<br>Bandeirantes - MS";
    setTabState(tabBand, tabAmambai);
  }

};
