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
    cat: 'Strength', level: 'Beginner', levelClass: 'skill-card__level--beginner',
    title: 'Powerlifting Foundations',
    desc: 'Master the squat, bench press, and deadlift with perfect form and progressive overload principles. Includes weekly programming, video breakdowns, and 1-on-1 form checks.',
    trainer: { name: 'Marcus Reid', cred: 'NSCA-CPT · 8 yrs', avatarClass: 'skill-card__avatar--1' },
    includes: [
      '3× weekly progressive programs',
      'Video library with 80+ tutorials',
      'Monthly live Q&A sessions',
      'Form check submissions',
      'Private community access',
    ],
    price: '$49<span>/mo</span>',
  },
  '2': {
    thumbClass: 'skill-card__thumb--cardio',
    cat: 'Cardio', level: 'Intermediate', levelClass: 'skill-card__level--intermediate',
    title: 'HIIT Accelerator Program',
    desc: 'High-intensity interval training designed to torch calories and boost VO₂ max in 30-minute sessions. Structured 8-week plan with heart rate zones and recovery guidance.',
    trainer: { name: 'Priya Sharma', cred: 'ACE-CPT · 6 yrs', avatarClass: 'skill-card__avatar--2' },
    includes: [
      '30-min daily HIIT sessions',
      'Heart rate zone tracking guide',
      '8-week structured plan',
      'Cool-down & mobility routines',
      'Nutrition sync recommendations',
    ],
    price: '$39<span>/mo</span>',
  },
  '3': {
    thumbClass: 'skill-card__thumb--yoga',
    cat: 'Yoga', level: 'Beginner', levelClass: 'skill-card__level--beginner',
    title: 'Morning Flow & Mobility',
    desc: 'Start each day with guided vinyasa flows that improve flexibility, posture, and mental clarity. Daily 20-30 minute sessions designed for all body types.',
    trainer: { name: 'Elena Voss', cred: 'RYT-500 · 11 yrs', avatarClass: 'skill-card__avatar--3' },
    includes: [
      'Daily 20-30 min flow sessions',
      'Beginner-friendly modifications',
      'Posture & alignment guides',
      'Breathing technique library',
      'Weekend restorative sessions',
    ],
    price: '$29<span>/mo</span>',
  },
  '4': {
    thumbClass: 'skill-card__thumb--nutrition',
    cat: 'Nutrition', level: 'All Levels', levelClass: 'skill-card__level--all',
    title: 'Performance Nutrition Blueprint',
    desc: 'Evidence-based meal planning, macro tracking, and fuelling strategies for athletes and weekend warriors. Personalised plans and supplement guidance included.',
    trainer: { name: 'James Okafor', cred: 'RD, CSSD · 9 yrs', avatarClass: 'skill-card__avatar--4' },
    includes: [
      'Personalised macro targets',
      '100+ performance recipes',
      'Pre & post-workout nutrition',
      'Supplement guidance',
      'Weekly check-in calls',
    ],
    price: '$59<span>/mo</span>',
  },
  '5': {
    thumbClass: 'skill-card__thumb--recovery',
    cat: 'Recovery', level: 'All Levels', levelClass: 'skill-card__level--all',
    title: 'Deep Recovery & Sleep',
    desc: 'Foam rolling protocols, breathwork, and sleep optimisation to maximise your body\'s repair cycle. Science-backed methods used by professional athletes.',
    trainer: { name: 'Sofia Mendes', cred: 'CSCS · 7 yrs', avatarClass: 'skill-card__avatar--5' },
    includes: [
      'Daily foam rolling routines',
      'Breathwork for parasympathetic activation',
      'Sleep hygiene protocol',
      'HRV monitoring guide',
      'Ice bath & contrast therapy intro',
    ],
    price: '$35<span>/mo</span>',
  },
  '6': {
    thumbClass: 'skill-card__thumb--sport',
    cat: 'Sport', level: 'Advanced', levelClass: 'skill-card__level--advanced',
    title: 'Explosive Athleticism',
    desc: 'Plyometrics, agility ladder work, and sport-specific conditioning drills for competitive athletes. Periodised 12-week blocks designed to peak for competition.',
    trainer: { name: 'Dani Brooks', cred: 'USAW · 12 yrs', avatarClass: 'skill-card__avatar--6' },
    includes: [
      '12-week periodised blocks',
      'Olympic lifting primer',
      'Plyometric progression system',
      'Sport-specific drills library',
      '1-on-1 performance review',
    ],
    price: '$69<span>/mo</span>',
  },
  '7': {
    thumbClass: 'skill-card__thumb--calisthenics',
    cat: 'Strength', level: 'Intermediate', levelClass: 'skill-card__level--intermediate',
    title: 'Calisthenics Mastery',
    desc: 'Bodyweight progressions from pull-ups to handstands — build elite relative strength anywhere, with zero equipment required.',
    trainer: { name: 'Kai Nakamura', cred: 'NASM-CPT · 5 yrs', avatarClass: 'skill-card__avatar--7' },
    includes: [
      'Progressions from zero to advanced',
      'Handstand coaching track',
      'Mobility & flexibility circuits',
      'No-equipment travel plan',
      'Community skill challenges',
    ],
    price: '$44<span>/mo</span>',
  },
  '8': {
    thumbClass: 'skill-card__thumb--meditation',
    cat: 'Mindfulness', level: 'Beginner', levelClass: 'skill-card__level--beginner',
    title: 'Meditation for Athletes',
    desc: 'Build mental resilience, focus under pressure, and accelerate recovery through mindfulness practice. Short daily sessions designed to fit around training.',
    trainer: { name: 'Aisha Brennan', cred: 'MBSR · 10 yrs', avatarClass: 'skill-card__avatar--8' },
    includes: [
      'Daily 10-min guided meditations',
      'Visualisation & focus techniques',
      'Pre-competition mindset protocols',
      'Stress & anxiety management',
      'Sleep & recovery meditations',
    ],
    price: '$25<span>/mo</span>',
  },
  '9': {
    thumbClass: 'skill-card__thumb--running',
    cat: 'Cardio', level: 'Intermediate', levelClass: 'skill-card__level--intermediate',
    title: 'Marathon Training Plan',
    desc: '16-week structured plan covering base building, threshold runs, and race-day strategy for 26.2 miles. GPS data analysis and heart rate zone coaching included.',
    trainer: { name: 'Tom Vickers', cred: 'USATF-L2 · 14 yrs', avatarClass: 'skill-card__avatar--9' },
    includes: [
      '16-week progressive schedule',
      'Heart rate zone training',
      'Long run & tempo guidance',
      'Taper & race-day strategy',
      'GPS data review sessions',
    ],
    price: '$55<span>/mo</span>',
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
