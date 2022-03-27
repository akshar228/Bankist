'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const initialCode = section1.getBoundingClientRect();
const header = document.querySelector('.header');
const navHight = nav.getBoundingClientRect().height;

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation
//event delegation
//1.add event listener to common parent element
//2. Detemine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    id !== '#' &&
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  //guard clause
  if (!clicked) return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  //active tab
  clicked.classList.add('operations__tab--active');

  //active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
// window.addEventListener('scroll', () => {
//   if (window.scrollY > initialCode.y) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
const stickyNav = function (ent) {
  const [entry] = ent;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHight}px`,
});
headerObs.observe(header);

//reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (ent, obs) {
  const [entry] = ent;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  obs.unobserve(entry.target);
};

const sectionObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(function (section) {
  sectionObs.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (ent, obs) {
  const [entry] = ent;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  obs.unobserve(entry.target);
};

const imageobs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.5,
  rootMargin: '200px',
});
imgTarget.forEach(img => imageobs.observe(img));

//slider section
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curslide = 0;
  const maxSlide = slides.length - 1;
  const dotContainer = document.querySelector('.dots');

  //functions
  //create dots
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = "dots__dot" data-slide = "${i}"></button>`
      );
    });
  };

  //active dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //to go to given slides
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //next slide
  const nextSlide = function () {
    if (curslide === maxSlide) {
      curslide = 0;
    } else {
      curslide++;
    }
    goToSlide(curslide);
    activateDot(curslide);
  };

  //previous slide
  const prevSlide = function () {
    if (curslide === 0) {
      curslide = maxSlide;
    } else {
      curslide--;
    }
    goToSlide(curslide);
    activateDot(curslide);
  };

  //init function
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  //left and right button eventhandlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //arrow eventhandler
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //dot eventhandler
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
