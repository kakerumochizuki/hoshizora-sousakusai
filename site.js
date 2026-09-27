'use strict';

document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobileViewport = window.matchMedia('(max-width: 720px)');

if (menuToggle && navigation) {
  function setMenuOpen(open, returnFocus = false) {
    menuToggle.setAttribute('aria-expanded', String(open));
    const label = open ? 'メニューを閉じる' : 'メニューを開く';
    menuToggle.setAttribute('aria-label', label);
    menuToggle.title = label;
    navigation.classList.toggle('is-open', open);
    if (returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    setMenuOpen(false);
    // Keep keyboard focus on the destination after collapsing mobile navigation.
    if (mobileViewport.matches && link.hash) {
      const destination = document.querySelector(link.hash);
      if (destination) {
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
        destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
      }
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenuOpen(false);
  });

  navigation.addEventListener('focusout', event => {
    if (event.relatedTarget && !event.relatedTarget.closest('.site-header')) setMenuOpen(false);
  });

  mobileViewport.addEventListener('change', () => setMenuOpen(false));

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigation.querySelectorAll('a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main .section').forEach(section => sectionObserver.observe(section));
  }
}
