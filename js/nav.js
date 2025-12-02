// Merged navigation script (minimal + full behaviors)
document.addEventListener('DOMContentLoaded', function() {
  // If the navbar markup isn't already on the page, load it from components/navbar.html
  if (!document.getElementById('mobile-menu-button')) {
    fetch('./components/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
        initializeNavbar();
        initializeMobileMenu();
        initializeSearchModal();
        addDynamicStyles();
      })
      .catch(error => console.error('Error loading navbar:', error));
  } else {
    // Navbar already present in the page (no need to fetch). Initialize behaviors.
    initializeNavbar();
    initializeMobileMenu();
    initializeSearchModal();
    addDynamicStyles();
  }

  // Simple mobile menu toggle for this product page (safeguard: will not duplicate listeners)
  const btn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (btn && mobileMenu && !btn.dataset._navInit) {
    btn.addEventListener('click', function(){
      mobileMenu.classList.toggle('hidden');
      const i = btn.querySelector('i');
      if(i) i.classList.toggle('fa-bars'), i.classList.toggle('fa-times');
    });
    btn.dataset._navInit = '1';
  }
});

function initializeProductGallery(){
  document.querySelectorAll('.thumb-img, [onclick="changeImage(this)"]').forEach(function(el){
    // Support both data-src/thumb-img approach and inline onclick thumbnails
    if (el.dataset && el.dataset.src) {
      el.addEventListener('click', function(){
        const main = document.getElementById('img_main');
        if(main) main.src = this.dataset.src;
      });
    }
  });
}

window.addEventListener('load', initializeProductGallery);

/* --- Below: functions imported from nav-full.js (navbar behaviors) --- */
function initializeNavbar() {
    // Menú hamburguesa: ensure not to duplicate handlers
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton && !mobileMenuButton.dataset._initNavbar) {
        const icon = mobileMenuButton.querySelector('i');
        mobileMenuButton.addEventListener('click', function() {
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        mobileMenuButton.dataset._initNavbar = '1';
    }
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!mobileMenuButton || !mobileMenu) return;

    if (!mobileMenuButton.dataset._initMobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
          mobileMenu.classList.remove('-translate-x-full');
          mobileMenu.classList.remove('hidden');
          if (menuOverlay) menuOverlay.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
          const icon = mobileMenuButton.querySelector('i');
          if (icon) {
              icon.classList.remove('fa-bars');
              icon.classList.add('fa-times');
          }
      });

      if (closeMenuButton) {
          closeMenuButton.addEventListener('click', closeMobileMenu);
      }

      if (menuOverlay) {
          menuOverlay.addEventListener('click', closeMobileMenu);
      }

      function closeMobileMenu() {
          mobileMenu.classList.add('-translate-x-full');
          if (menuOverlay) menuOverlay.classList.add('hidden');
          document.body.style.overflow = '';
          const icon = mobileMenuButton.querySelector('i');
          if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
          }
      }

      mobileMenuButton.dataset._initMobileMenu = '1';
    }
}

function initializeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    const searchButton = document.getElementById('search-button');
    const mobileSearchButton = document.getElementById('mobile-search-button');
    const closeSearch = document.getElementById('close-search');

    function openSearchModal() {
        if (searchModal) {
            searchModal.classList.remove('none');
            searchModal.classList.add('anim');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSearchModal() {
        if (searchModal) {
            searchModal.classList.add('none');
            document.body.style.overflow = '';
        }
    }

    if (searchButton && !searchButton.dataset._initSearch) { searchButton.addEventListener('click', openSearchModal); searchButton.dataset._initSearch = '1'; }
    if (mobileSearchButton && !mobileSearchButton.dataset._initSearch) { mobileSearchButton.addEventListener('click', openSearchModal); mobileSearchButton.dataset._initSearch = '1'; }
    if (closeSearch && !closeSearch.dataset._initSearch) { closeSearch.addEventListener('click', closeSearchModal); closeSearch.dataset._initSearch = '1'; }

    if (searchModal && !searchModal.dataset._searchInit) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal && !searchModal.classList.contains('none')) {
                closeSearchModal();
            }
        });
        searchModal.dataset._searchInit = '1';
    }
}

function addDynamicStyles() {
    if (document.getElementById('_nav_dynamic_styles')) return;
    const style = document.createElement('style');
    style.id = '_nav_dynamic_styles';
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        
        .anim { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .none { display: none; }
        .-translate-x-full { transform: translateX(-100%); }
        #mobile-menu { transition: transform 0.3s ease-in-out; }
        #menu-overlay { background-color: rgba(0, 0, 0, 0.5); }
    `;
    document.head.appendChild(style);
}
