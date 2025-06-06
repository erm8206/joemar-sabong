document.addEventListener('DOMContentLoaded', function() {
    initGameCardEffects();

    animateCounterValues();

    const lottoModal = document.getElementById('lottoGames');
    if (lottoModal) {
        lottoModal.addEventListener('show.bs.modal', initLottoModalEffects);

        lottoModal.addEventListener('hidden.bs.modal', function() {
            resetLottoModalAnimations();
        });
    }
});

function initGameCardEffects() {
    const gameCards = document.querySelectorAll('.game-category-card');

    gameCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth < 992) return;

            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            const rotateY = mouseX * 0.03;
            const rotateX = -mouseY * 0.03;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            const contentElement = card.querySelector('.game-category-content');
            if (contentElement) {
                contentElement.style.transform = `translateZ(20px) translateX(${mouseX * 0.02}px) translateY(${mouseY * 0.02}px)`;
            }

            const iconElement = card.querySelector('.game-category-icon');
            if (iconElement) {
                iconElement.style.transform = `translateZ(30px) translateX(${mouseX * 0.03}px) translateY(${mouseY * 0.03}px) scale(1.1)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';

            const contentElement = card.querySelector('.game-category-content');
            if (contentElement) {
                contentElement.style.transform = '';
            }

            const iconElement = card.querySelector('.game-category-icon');
            if (iconElement) {
                iconElement.style.transform = '';
            }
        });

        if (card.classList.contains('casino-card')) {
            addCasinoCardEffects(card);
        } else if (card.classList.contains('lotto-card')) {
            addLottoCardEffects(card);
        } else if (card.classList.contains('sabong-card')) {
            addSabongCardEffects(card);
        }
    });

    window.addEventListener('resize', makeCardsEqualHeight);
    makeCardsEqualHeight();
}

function makeCardsEqualHeight() {
    const topRowCards = document.querySelectorAll('.row:not(:last-child) .game-category-card');
    const bottomRowCards = document.querySelectorAll('.row:last-child .game-category-card');

    topRowCards.forEach(card => card.style.height = '');
    bottomRowCards.forEach(card => card.style.height = '');

    if (window.innerWidth < 768) {
        let maxTopHeight = 0;
        topRowCards.forEach(card => {
            maxTopHeight = Math.max(maxTopHeight, card.offsetHeight);
        });

        topRowCards.forEach(card => {
            card.style.height = `${maxTopHeight}px`;
        });

        let maxBottomHeight = 0;
        bottomRowCards.forEach(card => {
            maxBottomHeight = Math.max(maxBottomHeight, card.offsetHeight);
        });

        bottomRowCards.forEach(card => {
            card.style.height = `${maxBottomHeight}px`;
        });
    }
}

function addCasinoCardEffects(card) {
    const overlay = card.querySelector('.game-category-overlay');

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'casino-particle';

        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;

        particle.style.animationDelay = `${Math.random() * 5}s`;

        overlay.appendChild(particle);
    }
}

function addLottoCardEffects(card) {
    const overlay = card.querySelector('.game-category-overlay');

    const ballColors = ['#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'];

    for (let i = 0; i < 8; i++) {
        const ball = document.createElement('div');
        ball.className = 'lotto-ball';

        const size = Math.random() * 12 + 8;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.top = `${Math.random() * 100}%`;
        ball.style.left = `${Math.random() * 100}%`;

        const colorIndex = Math.floor(Math.random() * ballColors.length);
        ball.style.backgroundColor = ballColors[colorIndex];

        ball.style.animationDelay = `${Math.random() * 4}s`;
        ball.style.animationDuration = `${Math.random() * 6 + 8}s`;

        overlay.appendChild(ball);
    }
}

function addSabongCardEffects(card) {
    const overlay = card.querySelector('.game-category-overlay');

    for (let i = 0; i < 6; i++) {
        const feather = document.createElement('div');
        feather.className = 'sabong-feather';

        feather.style.top = `${Math.random() * 100}%`;
        feather.style.left = `${Math.random() * 100}%`;

        const rotation = Math.random() * 360;
        const scale = Math.random() * 0.6 + 0.4;
        feather.style.transform = `rotate(${rotation}deg) scale(${scale})`;

        feather.style.animationDelay = `${Math.random() * 5}s`;
        feather.style.animationDuration = `${Math.random() * 8 + 10}s`;

        overlay.appendChild(feather);
    }
}

function animateCounterValues() {
    const counterElements = document.querySelectorAll('.dashboard-card-value');

    counterElements.forEach(counter => {
        const targetValue = counter.getAttribute('data-target');
        if (!targetValue) return;

        const targetNumber = parseInt(targetValue.replace(/,/g, ''), 10);
        const duration = 2000;
        const startTime = performance.now();
        let currentValue = 0;

        function updateCounter(timestamp) {
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            currentValue = Math.floor(easeOutProgress * targetNumber);
            counter.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetNumber.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

function initLottoModalEffects() {
    const lottoGameCards = document.querySelectorAll('.lotto-game-card');

    lottoGameCards.forEach(card => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, Array.from(lottoGameCards).indexOf(card) * 150);

        addLottoCardParticles(card);

        if (window.innerWidth >= 992) {
            addTiltEffect(card);
        }
    });

    addLottoModalBackgroundEffects();
    animateLottoNumbers();
    addDrawInfoEffects();
}
function addLottoCardParticles(card) {
    const overlay = card.querySelector('.lotto-game-card-overlay');
    if (!overlay) return;

    const particleCount = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'lotto-particle';

        const size = Math.random() * 3 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.top = `${Math.random() * 80 + 10}%`;
        particle.style.left = `${Math.random() * 80 + 10}%`;

        particle.style.opacity = `${Math.random() * 0.5 + 0.3}`;

        particle.style.animationDelay = `${Math.random() * 5}s`;

        overlay.appendChild(particle);
    }
}

function addTiltEffect(card) {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / centerX * 5;
        const moveY = (y - centerY) / centerY * 5;

        card.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) translateZ(10px)`;

        const image = card.querySelector('.lotto-game-card-image img');
        if (image) {
            image.style.transform = `translateX(${moveX * 2}px) translateY(${moveY * 2}px) scale(1.1)`;
        }
    });

    card.addEventListener('mouseleave', function() {
        card.style.transform = '';
        const image = card.querySelector('.lotto-game-card-image img');
        if (image) {
            image.style.transform = '';
        }
    });
}

function addLottoModalBackgroundEffects() {
    const modalBody = document.querySelector('.lotto-modal-body');
    if (!modalBody) return;

    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        circle.className = 'lotto-bg-circle';

        const size = Math.random() * 100 + 50;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;

        circle.style.top = `${Math.random() * 80 + 10}%`;
        circle.style.left = `${Math.random() * 80 + 10}%`;

        circle.style.opacity = `${Math.random() * 0.05 + 0.02}`;

        circle.style.animationDelay = `${Math.random() * 5}s`;
        circle.style.animationDuration = `${Math.random() * 10 + 15}s`;

        modalBody.appendChild(circle);
    }
}

function animateLottoNumbers() {
    const numberSpans = document.querySelectorAll('.lotto-numbers span');

    numberSpans.forEach((span, index) => {
        const finalNumber = parseInt(span.textContent);
        span.textContent = '0';

        setTimeout(() => {
            let currentNumber = 0;
            const interval = setInterval(() => {
                currentNumber = (currentNumber + 1) % 10;
                span.textContent = currentNumber;

                if (currentNumber === finalNumber) {
                    clearInterval(interval);
                    span.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
                    setTimeout(() => {
                        span.style.textShadow = '';
                    }, 500);
                }
            }, 80);
        }, 300 + (index * 150));
    });
}

function addDrawInfoEffects() {
    const drawInfoCards = document.querySelectorAll('.lotto-draw-info');

    drawInfoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const numberSpans = card.querySelectorAll('.lotto-numbers span');
            numberSpans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.transform = 'scale(1.15) translateY(-5px)';
                    span.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.2)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function() {
            const numberSpans = card.querySelectorAll('.lotto-numbers span');
            numberSpans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.transform = '';
                    span.style.boxShadow = '';
                }, index * 50);
            });
        });
    });
}

function resetLottoModalAnimations() {
    const bgCircles = document.querySelectorAll('.lotto-bg-circle');
    bgCircles.forEach(circle => circle.remove());

    const particles = document.querySelectorAll('.lotto-particle');
    particles.forEach(particle => particle.remove());

    const lottoGameCards = document.querySelectorAll('.lotto-game-card');
    lottoGameCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });
}
