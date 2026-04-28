/* ============================================================
   FITHUB — SKILLS MARKETPLACE  |  app.js
   GSAP animations + marketplace interaction logic
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create('snap', 'M0,0 C0.25,0.1 0.25,1 1,1');
CustomEase.create('bounce-out', 'M0,0 C0,0 0.1,1.4 0.4,1.1 0.7,0.8 1,1 1,1');

/* ============================================================
   NAV — scroll-aware glass effect
   ============================================================ */
const nav = document.getElementById('nav');

ScrollTrigger.create({
  start: 80,
  onEnter:  () => nav.classList.add('nav--scrolled'),
  onLeaveBack: () => nav.classList.remove('nav--scrolled'),
});

/* ============================================================
   HERO ENTRANCE
   ============================================================ */
function initHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* Nav */
  tl.from(nav, { y: -60, opacity: 0, duration: .8 });

  /* Badge */
  tl.from('#heroBadge', { y: 20, opacity: 0, duration: .6 }, '-=.4');

  /* Title lines stagger */
  tl.from('.hero__title-line', {
    y: 60,
    opacity: 0,
    duration: .8,
    stagger: .15,
    ease: 'power4.out',
  }, '-=.3');

  /* Sub-text */
  tl.from('#heroSub', { y: 24, opacity: 0, duration: .6 }, '-=.4');

  /* CTA buttons */
  tl.from('#heroCta .btn', {
    y: 20,
    opacity: 0,
    duration: .5,
    stagger: .1,
  }, '-=.3');

  /* Stats */
  tl.from('#heroStats > *', {
    y: 16,
    opacity: 0,
    duration: .45,
    stagger: .07,
  }, '-=.2');

  /* Phone */
  tl.from('#heroVisual .hero__phone', {
    y: 60,
    opacity: 0,
    scale: .9,
    duration: 1,
    ease: 'bounce-out',
  }, '-=.7');

  /* Floating cards */
  tl.from('.hero__card-float', {
    y: 30,
    opacity: 0,
    duration: .6,
    stagger: .12,
    ease: 'back.out(1.4)',
  }, '-=.6');

  /* Orbs subtle entrance */
  tl.from('.hero__orb', {
    scale: 0,
    opacity: 0,
    duration: 1.5,
    stagger: .2,
    ease: 'power2.out',
  }, 0);

  /* Continuous floating animation for the phone */
  gsap.to('#heroVisual .hero__phone', {
    y: -14,
    duration: 3.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  /* Floating cards bob */
  gsap.to('.hero__card-float--a', { y: -10, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero__card-float--b', { y: 10,  duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: .5 });
  gsap.to('.hero__card-float--c', { y: -8,  duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });

  /* Phone progress fill shimmer */
  gsap.fromTo('.hero__phone-progress-fill',
    { scaleX: 0, transformOrigin: 'left' },
    { scaleX: 1, duration: 1.8, ease: 'power2.inOut', delay: 1.5 }
  );
}

/* ============================================================
   FILTER SECTION ENTRANCE
   ============================================================ */
function initFiltersAnimation() {
  gsap.from('#filterTitle', {
    scrollTrigger: { trigger: '#filtersSection', start: 'top 85%' },
    y: 30, opacity: 0, duration: .7, ease: 'power3.out',
  });

  gsap.from('.filter-tab', {
    scrollTrigger: { trigger: '#filtersSection', start: 'top 80%' },
    y: 16, opacity: 0, duration: .5, stagger: .06, ease: 'power2.out',
    delay: .2,
  });
}

/* ============================================================
   SKILLS CARDS — scroll entrance
   ============================================================ */
function initCardsAnimation() {
  const cards = gsap.utils.toArray('.skill-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      y: 50,
      opacity: 0,
      duration: .65,
      delay: (i % 3) * 0.08,
      ease: 'power3.out',
    });

    /* Card hover — lift + glow */
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, duration: .3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: .4, ease: 'power2.inOut' });
    });
  });
}

/* ============================================================
   TRAINERS SECTION
   ============================================================ */
function initTrainersAnimation() {
  gsap.from('#trainersHeader > *', {
    scrollTrigger: { trigger: '#trainersSection', start: 'top 85%' },
    y: 30, opacity: 0, duration: .6, stagger: .12, ease: 'power3.out',
  });

  gsap.from('.trainer-pill', {
    scrollTrigger: { trigger: '#trainersRow', start: 'top 90%' },
    x: -30, opacity: 0, duration: .5, stagger: .09, ease: 'back.out(1.4)',
  });
}

/* ============================================================
   CTA BANNER
   ============================================================ */
function initCTAAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#ctaBanner', start: 'top 75%' },
  });

  tl.from('.cta-banner__orb', {
    scale: 0,
    opacity: 0,
    duration: 1.2,
    stagger: .2,
    ease: 'power2.out',
  });

  tl.from('#ctaContent > *', {
    y: 30,
    opacity: 0,
    duration: .6,
    stagger: .12,
    ease: 'power3.out',
  }, '-=.8');
}

/* ============================================================
   FILTER TABS — interactive category switching
   ============================================================ */
function initFilters() {
  const tabs       = document.querySelectorAll('.filter-tab');
  const cards      = document.querySelectorAll('.skill-card');
  const noResults  = document.getElementById('noResults');
  const searchInput = document.getElementById('searchInput');
  let activeFilter = 'all';
  let searchQuery  = '';

  function applyFilters() {
    let visible = 0;

    cards.forEach(card => {
      const cat   = card.dataset.category;
      const title = card.querySelector('.skill-card__title').textContent.toLowerCase();
      const desc  = card.querySelector('.skill-card__desc').textContent.toLowerCase();
      const matchesCat  = activeFilter === 'all' || cat === activeFilter;
      const matchesSearch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        visible++;
        gsap.to(card, { opacity: 1, scale: 1, y: 0, duration: .4, ease: 'power2.out', display: 'flex' });
        card.style.display = '';
      } else {
        gsap.to(card, {
          opacity: 0, scale: .97, y: 10, duration: .25, ease: 'power2.in',
          onComplete: () => { card.style.display = 'none'; },
        });
      }
    });

    noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('filter-tab--active'));
      tab.classList.add('filter-tab--active');
      activeFilter = tab.dataset.filter;

      /* Underline indicator slide effect */
      gsap.from(tab, { scaleX: .8, duration: .3, ease: 'back.out(2)', transformOrigin: 'center' });

      applyFilters();
    });
  });

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.toLowerCase().trim();
      applyFilters();
    }, 200);
  });
}

/* ============================================================
   WISHLIST TOGGLE
   ============================================================ */
function initWishlist() {
  document.querySelectorAll('.skill-card__wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';

      gsap.timeline()
        .to(btn, { scale: 1.45, duration: .15, ease: 'power2.out' })
        .to(btn, { scale: 1, duration: .3, ease: 'bounce-out' });
    });
  });
}

/* ============================================================
   MODAL
   ============================================================ */
const SKILL_DATA = {
  '1': {
    thumbClass: 'skill-card__thumb--strength',
    cat: 'Force', level: 'Débutant', levelClass: 'skill-card__level--beginner',
    title: 'Bases du Powerlifting',
    desc: 'Maîtrisez le squat, le développé couché et le soulevé de terre avec une technique parfaite et les principes de surcharge progressive. Inclut une programmation hebdomadaire, des analyses vidéo et des corrections de technique en tête-à-tête.',
    trainer: { name: 'Marcus Reid', cred: 'NSCA-CPT · 8 ans', avatarClass: 'skill-card__avatar--1' },
    includes: [
      '3× programmes progressifs par semaine',
      'Vidéothèque avec 80+ tutoriels',
      'Sessions live Q&R mensuelles',
      'Soumissions de corrections techniques',
      'Accès à la communauté privée',
    ],
    price: '49 €<span>/mois</span>',
  },
  '2': {
    thumbClass: 'skill-card__thumb--cardio',
    cat: 'Cardio', level: 'Intermédiaire', levelClass: 'skill-card__level--intermediate',
    title: 'Programme HIIT Accélérateur',
    desc: 'Entraînement par intervalles à haute intensité conçu pour brûler les calories et booster le VO₂ max en séances de 30 minutes. Plan structuré de 8 semaines avec zones de fréquence cardiaque et conseils de récupération.',
    trainer: { name: 'Priya Sharma', cred: 'ACE-CPT · 6 ans', avatarClass: 'skill-card__avatar--2' },
    includes: [
      'Séances HIIT quotidiennes de 30 min',
      'Guide de suivi des zones cardiaques',
      'Plan structuré de 8 semaines',
      'Routines de récupération & mobilité',
      'Recommandations nutritionnelles synchronisées',
    ],
    price: '39 €<span>/mois</span>',
  },
  '3': {
    thumbClass: 'skill-card__thumb--yoga',
    cat: 'Yoga', level: 'Débutant', levelClass: 'skill-card__level--beginner',
    title: 'Flow Matinal & Mobilité',
    desc: 'Commencez chaque journée avec des flows vinyasa guidés qui améliorent la souplesse, la posture et la clarté mentale. Séances quotidiennes de 20 à 30 minutes adaptées à tous les morphotypes.',
    trainer: { name: 'Elena Voss', cred: 'RYT-500 · 11 ans', avatarClass: 'skill-card__avatar--3' },
    includes: [
      'Séances de flow de 20-30 min par jour',
      'Adaptations pour débutants',
      'Guides de posture et d\'alignement',
      'Bibliothèque de techniques respiratoires',
      'Séances restauratrices du week-end',
    ],
    price: '29 €<span>/mois</span>',
  },
  '4': {
    thumbClass: 'skill-card__thumb--nutrition',
    cat: 'Nutrition', level: 'Tous niveaux', levelClass: 'skill-card__level--all',
    title: 'Plan Nutrition Performance',
    desc: 'Planification nutritionnelle basée sur des preuves scientifiques, suivi des macros et stratégies d\'alimentation pour sportifs et amateurs. Plans personnalisés et conseils en supplémentation inclus.',
    trainer: { name: 'James Okafor', cred: 'RD, CSSD · 9 ans', avatarClass: 'skill-card__avatar--4' },
    includes: [
      'Objectifs de macros personnalisés',
      '100+ recettes de performance',
      'Nutrition pré & post-entraînement',
      'Conseils en supplémentation',
      'Appels de suivi hebdomadaires',
    ],
    price: '59 €<span>/mois</span>',
  },
  '5': {
    thumbClass: 'skill-card__thumb--recovery',
    cat: 'Récupération', level: 'Tous niveaux', levelClass: 'skill-card__level--all',
    title: 'Récupération Profonde & Sommeil',
    desc: 'Protocoles de foam rolling, travail respiratoire et optimisation du sommeil pour maximiser le cycle de réparation de votre corps. Méthodes validées scientifiquement utilisées par des athlètes professionnels.',
    trainer: { name: 'Sofia Mendes', cred: 'CSCS · 7 ans', avatarClass: 'skill-card__avatar--5' },
    includes: [
      'Routines quotidiennes de foam rolling',
      'Respiration pour l\'activation parasympathique',
      'Protocole d\'hygiène du sommeil',
      'Guide de suivi HRV',
      'Introduction aux bains froids & thérapie contrastée',
    ],
    price: '35 €<span>/mois</span>',
  },
  '6': {
    thumbClass: 'skill-card__thumb--sport',
    cat: 'Sport', level: 'Avancé', levelClass: 'skill-card__level--advanced',
    title: 'Athlétisme Explosif',
    desc: 'Pliométrie, travail d\'échelle d\'agilité et exercices de conditionnement spécifiques au sport pour les athlètes compétitifs. Blocs périodisés de 12 semaines conçus pour atteindre le pic de forme en compétition.',
    trainer: { name: 'Dani Brooks', cred: 'USAW · 12 ans', avatarClass: 'skill-card__avatar--6' },
    includes: [
      'Blocs périodisés de 12 semaines',
      'Introduction aux levées olympiques',
      'Système de progression pliométrique',
      'Bibliothèque d\'exercices spécifiques',
      'Bilan de performance individuel',
    ],
    price: '69 €<span>/mois</span>',
  },
  '7': {
    thumbClass: 'skill-card__thumb--calisthenics',
    cat: 'Force', level: 'Intermédiaire', levelClass: 'skill-card__level--intermediate',
    title: 'Maîtrise de la Callisthénie',
    desc: 'Progressions au poids du corps des tractions aux équilibres sur les mains — développez une force relative d\'élite partout, sans aucun équipement requis.',
    trainer: { name: 'Kai Nakamura', cred: 'NASM-CPT · 5 ans', avatarClass: 'skill-card__avatar--7' },
    includes: [
      'Progressions du niveau zéro à avancé',
      'Parcours de coaching handstand',
      'Circuits de mobilité & souplesse',
      'Plan voyage sans équipement',
      'Défis communautaires de compétences',
    ],
    price: '44 €<span>/mois</span>',
  },
  '8': {
    thumbClass: 'skill-card__thumb--meditation',
    cat: 'Pleine conscience', level: 'Débutant', levelClass: 'skill-card__level--beginner',
    title: 'Méditation pour Sportifs',
    desc: 'Développez la résilience mentale, la concentration sous pression et accélérez la récupération grâce à la pleine conscience. Courtes séances quotidiennes conçues pour s\'intégrer autour de l\'entraînement.',
    trainer: { name: 'Aisha Brennan', cred: 'MBSR · 10 ans', avatarClass: 'skill-card__avatar--8' },
    includes: [
      'Méditations guidées quotidiennes de 10 min',
      'Techniques de visualisation & concentration',
      'Protocoles mentaux pré-compétition',
      'Gestion du stress & de l\'anxiété',
      'Méditations de sommeil & récupération',
    ],
    price: '25 €<span>/mois</span>',
  },
  '9': {
    thumbClass: 'skill-card__thumb--running',
    cat: 'Cardio', level: 'Intermédiaire', levelClass: 'skill-card__level--intermediate',
    title: 'Plan d\'Entraînement Marathon',
    desc: 'Plan structuré de 16 semaines couvrant la construction de base, les sorties au seuil et la stratégie le jour de la course pour 42,195 km. Analyse GPS et coaching par zones cardiaques inclus.',
    trainer: { name: 'Tom Vickers', cred: 'USATF-L2 · 14 ans', avatarClass: 'skill-card__avatar--9' },
    includes: [
      'Programme progressif de 16 semaines',
      'Entraînement par zones cardiaques',
      'Conseils sorties longues & tempo',
      'Stratégie d\'affûtage & jour de course',
      'Sessions d\'analyse des données GPS',
    ],
    price: '55 €<span>/mois</span>',
  },
};

function initModal() {
  const overlay   = document.getElementById('modalOverlay');
  const modal     = document.getElementById('modal');
  const closeBtn  = document.getElementById('modalClose');

  function openModal(id) {
    const data = SKILL_DATA[id];
    if (!data) return;

    /* Populate */
    document.getElementById('modalThumb').className   = 'modal__thumb ' + data.thumbClass;
    document.getElementById('modalMeta').innerHTML    =
      `<span class="skill-card__cat">${data.cat}</span>
       <span class="skill-card__level ${data.levelClass}">${data.level}</span>`;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent  = data.desc;
    document.getElementById('modalTrainer').innerHTML =
      `<div class="skill-card__avatar ${data.trainer.avatarClass}"></div>
       <div>
         <div class="skill-card__trainer-name">${data.trainer.name}</div>
         <div class="skill-card__trainer-cred">${data.trainer.cred}</div>
       </div>`;
    document.getElementById('modalList').innerHTML    =
      data.includes.map(item => `<li>${item}</li>`).join('');
    document.getElementById('modalPrice').innerHTML   = data.price;

    /* Animate in */
    overlay.classList.add('is-open');
    gsap.timeline()
      .to(overlay, { opacity: 1, duration: .3, ease: 'power2.out' })
      .from(modal, { y: 60, scale: .95, opacity: 0, duration: .45, ease: 'back.out(1.4)' }, '-=.15');

    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    gsap.timeline({ onComplete: () => {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }})
      .to(modal, { y: 30, opacity: 0, scale: .97, duration: .3, ease: 'power2.in' })
      .to(overlay, { opacity: 0, duration: .25 }, '-=.1');
  }

  /* Open on card click (not wishlist btn) */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.skill-card__wishlist')) return;
      openModal(card.dataset.id);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
}

/* ============================================================
   SMOOTH SCROLL for CTA buttons
   ============================================================ */
function initSmoothScroll() {
  document.querySelector('.hero__cta .btn--primary')?.addEventListener('click', () => {
    document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================================
   BUTTON MAGNETIC EFFECT
   ============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.btn--primary, .btn--white').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      gsap.to(btn, { x: dx * .18, y: dy * .18, duration: .3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .5)' });
    });
  });
}

/* ============================================================
   COUNTER ANIMATION for stats
   ============================================================ */
function animateCounters() {
  const counters = [
    { el: document.querySelector('.hero__stat:nth-child(1) strong'), end: 12000, suffix: 'k+', divisor: 1000 },
    { el: document.querySelector('.hero__stat:nth-child(3) strong'), end: 500,   suffix: '+' },
    { el: document.querySelector('.hero__stat:nth-child(5) strong'), end: 98,    suffix: '%' },
  ];

  counters.forEach(({ el, end, suffix, divisor }) => {
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: 2,
      delay: 1,
      ease: 'power2.out',
      onUpdate: () => {
        const v = Math.round(obj.val);
        el.textContent = divisor ? (v / divisor).toFixed(0) + suffix : v + suffix;
      },
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  initHero();
  animateCounters();
  initFiltersAnimation();
  initCardsAnimation();
  initTrainersAnimation();
  initCTAAnimation();
  initFilters();
  initWishlist();
  initModal();
  initSmoothScroll();
  initMagneticButtons();
});
