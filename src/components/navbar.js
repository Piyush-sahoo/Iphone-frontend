
export function mountNavbar() {
    const navHTML = `
    <nav id="main-nav" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-4xl transition-all duration-500 ease-out">
        <div class="relative flex items-center justify-between px-6 py-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 hover:bg-black/50 hover:border-white/20 transition-colors">
            
            <!-- Logo -->
            <a href="/" class="flex items-center gap-2 group">
                <svg class="h-6 w-6 text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.54-.83.9-1.67.8-2.61-.79 0-1.81.44-2.39 1.07-.53.58-.94 1.54-.82 2.49.88.07 1.77-.32 2.41-.95z"/>
                </svg>
                <span class="font-medium tracking-tight text-white/90">iPhone 17</span>
            </a>

            <!-- Desktop Links -->
            <div class="hidden md:flex items-center gap-8">
                <a href="/" class="text-sm font-medium text-white/70 hover:text-white transition-colors">Overview</a>
                <a href="/specs.html" class="text-sm font-medium text-white/70 hover:text-white transition-colors">Specs</a>
                <a href="/buy.html" class="text-sm font-medium text-white/70 hover:text-white transition-colors">Buy</a>
            </div>

            <!-- CTA -->
            <div class="flex items-center gap-4">
                <a href="/buy.html" class="hidden md:block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-gray-200 transition-colors">
                    Pre-order
                </a>
                
                <!-- Mobile Menu Button -->
                <button class="md:hidden text-white/80 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
        </div>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Scroll Effect: Shrink slightly when scrolling down
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scale-95', 'opacity-90');
        } else {
            nav.classList.remove('scale-95', 'opacity-90');
        }
    });

    // Highlight active link simple logic
    const path = window.location.pathname;
    const links = document.querySelectorAll('#main-nav a');
    links.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('text-white');
            link.classList.remove('text-white/70');
        }
    });
}
