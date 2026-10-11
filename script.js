// ==========================================
// MASTER API LINK (Updated to your newest script)
// ==========================================
const BASE_API_URL = 'https://script.google.com/macros/s/AKfycbya6F7ujX8Xy2yJvdOOO4lk_hZ7g2I-Wh9tTi4eJydY_Imb9TXmSVLeErmvurs0jgI/exec';

// Grab the header element from the DOM (Document Object Model)
const header = document.querySelector('header');

// Listen for the user scrolling
window.addEventListener('scroll', () => {
    // If the user scrolls down more than 50 pixels
    if (window.scrollY > 50) {
        header.style.padding = '10px 10%'; // Shrink the padding
        header.style.transition = 'padding 0.3s ease';
    } else {
        header.style.padding = '20px 10%'; // Revert to original padding
    }
});

// ==========================================
// MAIN GALLERY FETCH CODE
// ==========================================
const galleryContainer = document.getElementById('dynamic-gallery');

async function loadGallery() {
    try {
        const response = await fetch(BASE_API_URL);
        const photos = await response.json();

        photos.forEach(photo => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'photo-item';

            const imgEl = document.createElement('img');
            imgEl.src = photo.url;
            imgEl.alt = photo.name;
            imgEl.loading = 'lazy'; 

            itemDiv.appendChild(imgEl);
            galleryContainer.appendChild(itemDiv);
        });
    } catch (error) {
        console.error("Error loading the gallery:", error);
        galleryContainer.innerHTML = "<p>Sorry, the gallery is currently unavailable.</p>";
    }
}

if (galleryContainer && !document.getElementById('dynamic-youth-grid')) { 
    // Prevents running on the youth page which uses a different fetch
    loadGallery(); 
}

// ==========================================
// MOBILE NAVIGATION LOGIC
// ==========================================
const burger = document.getElementById('burger-menu');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' || event.target.closest('a')) {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
});

// ==========================================
// DYNAMIC UPCOMING EVENTS (Google Calendar)
// ==========================================
const eventContainer = document.getElementById('calendar-widget');

if (eventContainer) {
    async function loadUpcomingEvents() {
        try {
            const response = await fetch(`${BASE_API_URL}?type=events`);
            const events = await response.json();

            eventContainer.innerHTML = '';

            events.forEach(event => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = `
                    <div class="event-date">${event.day}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <p>${event.time}</p>
                    </div>
                `;
                eventContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Calendar fetch error:", error);
        }
    }
    loadUpcomingEvents();
}

// ==========================================
// DYNAMIC MISSION STATEMENT FETCH
// ==========================================
const missionContainer = document.getElementById('dynamic-mission');

if (missionContainer) {
    async function loadMission() {
        try {
            const response = await fetch(`${BASE_API_URL}?type=mission`);
            const data = await response.json();

            if (data.text) {
                missionContainer.innerText = `"${data.text.trim()}"`;
            } else {
                console.error("Mission Doc Error:", data.error);
                missionContainer.innerText = "Mission statement currently unavailable.";
            }
        } catch (error) {
            console.error("Failed to fetch mission statement:", error);
            missionContainer.innerText = "Mission statement currently unavailable.";
        }
    }
    loadMission();
}

// ==========================================
// DYNAMIC SINGLE IMAGES (HERO & PASTOR)
// ==========================================
const heroBgContainer = document.getElementById('hero-bg-container');

if (heroBgContainer) {
    async function loadHeroSlideshow() {
        try {
            const response = await fetch(`${BASE_API_URL}?type=hero`);
            const data = await response.json();
            
            if (data.urls && data.urls.length > 0) {
                let currentIndex = 0;

                const changeBackground = () => {
                    const newSlide = document.createElement('div');
                    newSlide.className = 'hero-slide';
                    newSlide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${data.urls[currentIndex]}')`;
                    
                    heroBgContainer.appendChild(newSlide);

                    setTimeout(() => {
                        newSlide.style.opacity = '1';
                    }, 50);

                    const existingSlides = heroBgContainer.getElementsByClassName('hero-slide');
                    if (existingSlides.length > 1) {
                        setTimeout(() => {
                            existingSlides[0].remove();
                        }, 1500); 
                    }

                    currentIndex = (currentIndex + 1) % data.urls.length;
                };

                changeBackground(); 

                if (data.urls.length > 1) {
                    setInterval(changeBackground, 5000);
                }
            }
        } catch (error) {
            console.error("Hero slideshow fetch error:", error);
        }
    }
    loadHeroSlideshow();
}

const pastorImg = document.getElementById('dynamic-pastor-img');
if (pastorImg) {
    async function loadPastorImage() {
        try {
            const response = await fetch(`${BASE_API_URL}?type=pastor`);
            const data = await response.json();
            
            if (data.url) {
                pastorImg.src = data.url;
            }
        } catch (error) {
            console.error("Pastor image fetch error:", error);
        }
    }
    loadPastorImage();
}

// ==========================================
// NEW: YOUTH PAGE (CAROUSEL & GRID)
// ==========================================
const youthCarousel = document.getElementById('dynamic-carousel');
const youthGrid = document.getElementById('dynamic-youth-grid');

if (youthCarousel && youthGrid) {
    async function loadYouthPhotos() {
        try {
            const response = await fetch(`${BASE_API_URL}?type=youth`);
            const photos = await response.json();

            if (photos.error) {
                console.error("Youth Gallery Error:", photos.error);
                return;
            }

            // Clear the placeholder HTML
            youthCarousel.innerHTML = '';
            youthGrid.innerHTML = '';

            // Cap the total number of photos fetched at 22
            const displayPhotos = photos.slice(0, 22);

            displayPhotos.forEach((photo, index) => {
                if (index < 10) {
                    // Inject the first 10 photos into the Top Carousel
                    const slide = document.createElement('div');
                    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
                    slide.innerHTML = `
                        <img src="${photo.url}" alt="${photo.title}">
                        <div class="carousel-caption">${photo.title}</div>
                    `;
                    youthCarousel.appendChild(slide);
                } else {
                    // Inject the next 12 photos into the Grid Below
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'photo-item';
                    itemDiv.innerHTML = `<img src="${photo.url}" alt="${photo.title}" loading="lazy">`;
                    youthGrid.appendChild(itemDiv);
                }
            });

            // Hide placeholders and show the live images
            const placeholderCarousel = document.getElementById('placeholder-carousel');
            const placeholderGrid = document.getElementById('placeholder-youth-grid');
            
            if (placeholderCarousel) placeholderCarousel.style.display = 'none';
            youthCarousel.style.display = 'block'; // Reveal live carousel
            
            if (placeholderGrid) placeholderGrid.style.display = 'none';
            youthGrid.style.display = 'grid'; // Reveal live grid

        } catch (error) {
            console.error("Failed to load youth photos:", error);
        }
    }
    loadYouthPhotos();
}

// ==========================================
// NEW: TABLE OF CONTENTS LOGIC (HISTORY PAGE)
// ==========================================
const tocToggleBtn = document.getElementById('toc-toggle');
const tocMenu = document.getElementById('toc-menu');
const closeTocBtn = document.getElementById('close-toc');

if (tocToggleBtn && tocMenu && closeTocBtn) {
    // 1. Open the menu when the floating button is clicked
    tocToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops the click from immediately triggering the "close" logic below
        tocMenu.classList.add('open');
    });

    // 2. Close the menu when the "X" is clicked
    closeTocBtn.addEventListener('click', () => {
        tocMenu.classList.remove('open');
    });

    // 3. Close the menu if the user clicks anywhere outside of the menu panel
    document.addEventListener('click', (event) => {
        if (tocMenu.classList.contains('open') && !tocMenu.contains(event.target)) {
            tocMenu.classList.remove('open');
        }
    });

    // 4. Automatically close the menu after a user clicks one of the navigation links
    const tocLinks = tocMenu.querySelectorAll('a');
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            tocMenu.classList.remove('open');
        });
    });
}

// ==========================================
// NEW: HOMEPAGE EVENT FLYERS (MANUAL SLIDESHOW)
// ==========================================
const flyerWrapper = document.getElementById('flyer-carousel-wrapper');
const dynamicFlyers = document.getElementById('dynamic-flyers');
const flyerSkeleton = document.getElementById('flyer-skeleton');

if (flyerWrapper && dynamicFlyers) {
    async function loadFlyers() {
        try {
            const response = await fetch(`${BASE_API_URL}?type=flyers`);
            const data = await response.json();
            
            if (data.urls && data.urls.length > 0) {
                dynamicFlyers.innerHTML = ''; // Clear out

                // Inject the flyers
                data.urls.forEach((url, index) => {
                    const slide = document.createElement('div');
                    slide.className = `flyer-slide ${index === 0 ? 'active' : ''}`;
                    slide.innerHTML = `<img src="${url}" alt="Upcoming Event Flyer">`;
                    dynamicFlyers.appendChild(slide);
                });

                // Reveal the carousel if there are flyers to show
                if (flyerSkeleton) flyerSkeleton.style.display = 'none'; 
                flyerWrapper.style.display = 'block';

                // Manual Controls Logic
                let currentFlyerIndex = 0;
                const flyerSlides = document.querySelectorAll('.flyer-slide');
                const prevBtn = document.querySelector('.prev-flyer');
                const nextBtn = document.querySelector('.next-flyer');

                function updateFlyerCarousel() {
                    flyerSlides.forEach(slide => slide.classList.remove('active'));
                    
                    if (currentFlyerIndex >= flyerSlides.length) currentFlyerIndex = 0;
                    if (currentFlyerIndex < 0) currentFlyerIndex = flyerSlides.length - 1;
                    
                    flyerSlides[currentFlyerIndex].classList.add('active');
                }

                prevBtn.addEventListener('click', () => {
                    currentFlyerIndex--;
                    updateFlyerCarousel();
                });

                nextBtn.addEventListener('click', () => {
                    currentFlyerIndex++;
                    updateFlyerCarousel();
                });
            }
        } catch (error) {
            console.error("Flyer slideshow fetch error:", error);
        }
    }
    loadFlyers();
}

// ==========================================
// GLOBAL IMAGE EXPANSION (MODAL POPUP)
// ==========================================
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');

if (modal && modalImg) {
    // Listen for clicks anywhere on the document
    document.addEventListener('click', function(event) {
        // If they click an image inside a flyer slide, a photo gallery, or a youth carousel
        if (event.target.tagName === 'IMG' && (event.target.closest('.flyer-slide') || event.target.closest('.photo-item') || event.target.closest('.carousel-slide'))) {
            modalImg.src = event.target.src; 
            modal.style.display = 'flex';    
        }
    });

    if (closeModal) {
        closeModal.addEventListener('click', function() { modal.style.display = 'none'; });
    }
    
    // Close modal if user clicks the dark background
    window.addEventListener('click', function(event) {
        if (event.target === modal) modal.style.display = 'none';
    });
}