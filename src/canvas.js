
export class CanvasRenderer {
    constructor(canvasId, frameCount, onProgress) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.frameCount = frameCount;
        this.onProgress = onProgress;

        this.images = [];
        this.isLoaded = false;
        this.currentFrameIndex = -1;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Set internal resolution to match window size for sharpness
        // Or keep it fixed aspect if preferred, but filling screen is better for this effect
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);

        // Redraw current frame after resize
        if (this.currentFrameIndex >= 0) {
            this.renderFrame(this.currentFrameIndex);
        }
    }

    generateFramePaths() {
        const paths = [];
        for (let i = 1; i <= this.frameCount; i++) {
            // frame_0001.jpg format
            const num = i.toString().padStart(4, '0');
            paths.push(`/frames/frame_${num}.jpg`);
        }
        return paths;
    }

    async preloadImages() {
        const paths = this.generateFramePaths();
        let loadedCount = 0;

        const loadPromises = paths.map((path, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = path;
                img.onload = () => {
                    this.images[index] = img;
                    loadedCount++;
                    if (this.onProgress) {
                        this.onProgress(loadedCount / this.frameCount);
                    }
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${path}`);
                    // Resolve anyway to prevent blocking
                    resolve();
                };
            });
        });

        await Promise.all(loadPromises);
        this.isLoaded = true;

        // Initial draw
        this.renderFrame(0);
    }

    render(progress) {
        if (!this.isLoaded) return;

        // exact floating point index (e.g., 14.35)
        // We map 0..1 to 0..frameCount-1
        const rawIndex = progress * (this.frameCount - 1);

        const index1 = Math.floor(rawIndex);
        const index2 = Math.min(this.frameCount - 1, index1 + 1);
        const blend = rawIndex - index1;

        requestAnimationFrame(() => this.renderBlendedFrame(index1, index2, blend));
    }

    // Draw one frame (fallback) or helper
    renderFrame(index) {
        this.renderBlendedFrame(index, index, 0);
    }

    renderBlendedFrame(index1, index2, blend) {
        const img1 = this.images[index1];
        const img2 = this.images[index2];
        if (!img1 || !img2) return;

        const canvas = this.canvas;
        const ctx = this.ctx;

        // Logic to "contain" the image within the canvas bounds while centering it
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        // We assume all images have same dimensions, calculation based on img1
        const imgRatio = img1.width / img1.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image -> fit to height
            drawHeight = canvasHeight;
            drawWidth = img1.width * (canvasHeight / img1.height);
        } else {
            // Canvas is narrower than image -> fit to width
            drawWidth = canvasWidth;
            drawHeight = img1.height * (canvasWidth / img1.width);
        }

        const x = (canvasWidth - drawWidth) / 2;
        const y = (canvasHeight - drawHeight) / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Config
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw Frame 1 (Base)
        ctx.globalAlpha = 1;
        ctx.drawImage(img1, x, y, drawWidth, drawHeight);

        // Draw Frame 2 (Overlay) if blending necessary
        if (blend > 0 && index1 !== index2) {
            ctx.globalAlpha = blend;
            ctx.drawImage(img2, x, y, drawWidth, drawHeight);
        }

        // Reset
        ctx.globalAlpha = 1;
    }
}
