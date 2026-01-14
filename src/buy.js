import './style.css';
import { mountNavbar } from './components/navbar.js';
import { CanvasRenderer } from './canvas.js';

mountNavbar();

// Reuse our canvas engine for a static preview? 
// Or just load one frame.
// Let's load the last frame (reassembled back view)
const previewCanvas = new CanvasRenderer('preview-canvas', 60, null);

// We want to show the LAST frame (reassembled phone)
previewCanvas.preloadImages().then(() => {
    previewCanvas.renderFrame(59); // Last frame
});


// Logic for color selection (fake tint)
window.selectColor = function (btn) {
    // Reset active
    document.querySelectorAll('.color-btn').forEach(b => {
        b.removeAttribute('data-active');
        b.classList.remove('ring-2', 'ring-blue-500');
    });

    // Set active
    btn.setAttribute('data-active', 'true');
    btn.classList.add('ring-2', 'ring-blue-500');

    // Apply Tint
    const color = btn.getAttribute('data-color');
    const overlay = document.getElementById('tint-overlay');

    // Simple way to simulate color: Mix blend mode
    // iPhone is mostly metallic. 
    overlay.style.backgroundColor = color;
    overlay.style.mixBlendMode = 'multiply'; // or overlay
    overlay.style.opacity = '0.4';
}
