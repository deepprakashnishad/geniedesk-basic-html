// Animate mission points on scroll
const missionPoints = document.querySelectorAll('.fade-up');
function animateMissionPoints() {
    missionPoints.forEach(point => {
        const pointPosition = point.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (pointPosition < screenPosition) {
            point.classList.add('visible');
        }
    });
}

// Initialize animations
window.addEventListener('scroll', function() {
    animateMissionPoints();
});

// Trigger animations on page load if elements are already in view
animateMissionPoints();