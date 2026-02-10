const canvas = document.getElementById('sequence-canvas');
const context = canvas.getContext('2d');
const frameCount = 100;

// Helper to pad numbers with zeros (e.g., 5 -> "005")
const currentFrame = index => (
  `sequence 1/frame_${index.toString().padStart(3, '0')}_delay-0.1s.jpg`
);

const images = [];
const sequenceState = {
  frame: 0
};

// Preload images
const preloadImages = () => {
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                // Images loaded
                updateImage(0);
            }
        };
        images.push(img);
    }
};

const updateImage = index => {
    const img = images[index];
    if (!img) return;

    // Simulate object-fit: contain (Fix for "too zoomed in")
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    // Use 'contain' logic: maintain aspect ratio and ensure full image is visible
    if (imgRatio > canvasRatio) {
        // Image is wider than canvas (fit to width)
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        // Image is taller than canvas (fit to height)
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

// Handle window resizing
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateImage(sequenceState.frame); // Redraw current frame
};

window.addEventListener('resize', resizeCanvas);

// Initial size
resizeCanvas();

const storySections = document.querySelectorAll('.story-section');

// Scroll Interaction
window.addEventListener('scroll', () => {  
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    
    // Map scroll position to frame index
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    requestAnimationFrame(() => {
        updateImage(frameIndex);
        
        // Check visibility of story sections
        const triggerPoint = window.innerHeight * 0.8;
        storySections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            if (top < triggerPoint) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    });
});

// Start preloading
preloadImages();

// Interaction for the 'Laugh' button
const btn = document.getElementById('laugh-btn');
btn.addEventListener('click', () => {
    btn.textContent = "🤣 HAHA!";
    
    // Add temporary confetti or shake effect
    document.body.style.animation = "shake 0.5s";
    setTimeout(() => {
        document.body.style.animation = "none";
        btn.textContent = "😂 Laugh Again";
    }, 1000);
});

// A silly shake animation keyframe injected dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}`;
document.head.appendChild(styleSheet);
