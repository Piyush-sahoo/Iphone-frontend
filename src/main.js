import './style.css';
import { CanvasRenderer } from './canvas.js';
import { mountNavbar } from './components/navbar.js';

// Mount UI
mountNavbar();


// Configuration
const TOTAL_FRAMES = 60; // Upgraded to 60 frames
const SCROLL_HEIGHT = 250; // vh unit basically

const progressEl = document.getElementById('progress-bar');
const loaderEl = document.getElementById('loader');
const textElements = [
    document.getElementById('text-0'),
    document.getElementById('text-1'),
    document.getElementById('text-2'),
    document.getElementById('text-3'),
];

// Initialize Canvas
const renderer = new CanvasRenderer('hero-canvas', TOTAL_FRAMES, (progress) => {
    // Update loader
    progressEl.style.width = `${progress * 100}%`;
});

// Start loading
renderer.preloadImages().then(() => {
    // Fade out loader
    loaderEl.style.opacity = '0';
    setTimeout(() => {
        loaderEl.style.display = 'none';
        // Enable scrolling by removing any potential locks if we had them
        document.body.style.overflow = '';
    }, 500);
});


// Scroll Handling
const scrollContainer = document.getElementById('scroll-container');

function handleScroll() {
    const rect = scrollContainer.getBoundingClientRect();
    const start = rect.top;
    const height = rect.height - window.innerHeight;

    // Calculate progress 0 to 1 based on how far we've scrolled into the container
    // When top is 0, progress is 0. 
    // When bottom is at bottom of screen, progress is 1.
    // However, the container is sticky. 
    // Actually, usually for sticky scroll:
    // Progress = (WindowScrollY - ContainerOffset) / (ContainerHeight - WindowHeight)

    // Let's use simpler absolute math given the structure
    // The container is at the top of the page (or close to it).
    // The sticky element is inside it.

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight;
    const containerTop = scrollContainer.offsetTop;
    const containerHeight = scrollContainer.offsetHeight;

    // Effective scrollable distance for the animation
    const scrollDistance = containerHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    let progress = (scrollTop - containerTop) / scrollDistance;

    // Clamp
    progress = Math.max(0, Math.min(1, progress));

    // Update Canvas
    renderer.render(progress);

    // Update Text
    updateText(progress);
}

function updateText(progress) {
    // Reset all
    textElements.forEach(el => el.setAttribute('data-active', 'false'));

    if (progress < 0.2) {
        textElements[0].setAttribute('data-active', 'true');
    } else if (progress > 0.3 && progress < 0.55) {
        textElements[1].setAttribute('data-active', 'true');
    } else if (progress > 0.6 && progress < 0.85) {
        textElements[2].setAttribute('data-active', 'true');
    } else if (progress > 0.9) {
        textElements[3].setAttribute('data-active', 'true');
    }
}

// Bind scroll
window.addEventListener('scroll', handleScroll, { passive: true });
// Initial check
handleScroll();
