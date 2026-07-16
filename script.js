const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const revealItems = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

menuToggle.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("open");
  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

document.getElementById("year").textContent = new Date().getFullYear();


// Modal – tréninkový plán již brzy v prodeji
const comingSoonButton = document.querySelector(".plan-coming-soon");
const comingSoonModal = document.querySelector(".coming-soon-modal");
const comingSoonClose = document.querySelector(".coming-soon-close");

function openComingSoonModal() {
  comingSoonModal?.classList.add("open");
  comingSoonModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeComingSoonModal() {
  comingSoonModal?.classList.remove("open");
  comingSoonModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

comingSoonButton?.addEventListener("click", openComingSoonModal);
comingSoonClose?.addEventListener("click", closeComingSoonModal);

comingSoonModal?.addEventListener("click", (event) => {
  if (event.target === comingSoonModal) closeComingSoonModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeComingSoonModal();
});


// Celý ceník ve fullscreen náhledu
const priceImageButton = document.querySelector(".price-image-button");
const priceLightbox = document.querySelector(".price-lightbox");
const priceLightboxClose = document.querySelector(".price-lightbox-close");

function openPriceLightbox() {
  priceLightbox?.classList.add("open");
  priceLightbox?.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closePriceLightbox() {
  priceLightbox?.classList.remove("open");
  priceLightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

priceImageButton?.addEventListener("click", openPriceLightbox);
priceLightboxClose?.addEventListener("click", closePriceLightbox);

priceLightbox?.addEventListener("click", (event) => {
  if (event.target === priceLightbox) closePriceLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePriceLightbox();
});


// V4 – fullscreen fotogalerie se šipkami a swipe
const galleryItems = [...document.querySelectorAll(".training-photo")];
const galleryLightbox = document.querySelector(".gallery-lightbox");
const galleryImage = document.querySelector(".gallery-stage img");
const galleryCounter = document.querySelector(".gallery-counter");
const galleryClose = document.querySelector(".gallery-close");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");

const galleryData = galleryItems.map(item => {
  const image = item.querySelector("img");
  return {
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt")
  };
});

let currentGalleryIndex = 0;
let galleryTouchStartX = 0;

function renderGalleryImage() {
  const photo = galleryData[currentGalleryIndex];
  if (!photo || !galleryImage) return;

  galleryImage.src = photo.src;
  galleryImage.alt = photo.alt;
  galleryCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
}

function openGallery(index) {
  currentGalleryIndex = index;
  renderGalleryImage();
  galleryLightbox?.classList.add("open");
  galleryLightbox?.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeGallery() {
  galleryLightbox?.classList.remove("open");
  galleryLightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

function showPreviousGalleryImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
  renderGalleryImage();
}

function showNextGalleryImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
  renderGalleryImage();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openGallery(index));
});

galleryClose?.addEventListener("click", closeGallery);
galleryPrev?.addEventListener("click", showPreviousGalleryImage);
galleryNext?.addEventListener("click", showNextGalleryImage);

galleryLightbox?.addEventListener("click", event => {
  if (event.target === galleryLightbox) closeGallery();
});

galleryLightbox?.addEventListener("touchstart", event => {
  galleryTouchStartX = event.changedTouches[0].clientX;
}, { passive: true });

galleryLightbox?.addEventListener("touchend", event => {
  const difference = event.changedTouches[0].clientX - galleryTouchStartX;
  if (Math.abs(difference) < 45) return;
  difference > 0 ? showPreviousGalleryImage() : showNextGalleryImage();
}, { passive: true });

// V4 – slider referencí
const referenceSlider = document.querySelector(".reference-slider");
const referenceTrack = document.querySelector(".reference-track");
const referenceCards = [...document.querySelectorAll(".reference-card")];
const referencePrev = document.querySelector(".reference-prev");
const referenceNext = document.querySelector(".reference-next");
const referenceDots = document.querySelector(".reference-dots");

let referenceIndex = 0;
let referenceTouchStartX = 0;

function referencesPerView() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function maxReferenceIndex() {
  return Math.max(0, referenceCards.length - referencesPerView());
}

function renderReferenceDots() {
  if (!referenceDots) return;
  referenceDots.innerHTML = "";

  const count = maxReferenceIndex() + 1;
  for (let index = 0; index < count; index++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === referenceIndex ? "active" : "";
    dot.setAttribute("aria-label", `Zobrazit reference od pozice ${index + 1}`);
    dot.addEventListener("click", () => {
      referenceIndex = index;
      updateReferenceSlider();
    });
    referenceDots.appendChild(dot);
  }
}

function updateReferenceSlider() {
  if (!referenceTrack || !referenceSlider) return;

  referenceIndex = Math.min(referenceIndex, maxReferenceIndex());

  const firstCard = referenceCards[0];
  if (!firstCard) return;

  const cardWidth = firstCard.getBoundingClientRect().width;
  const gap = 16;
  referenceTrack.style.transform = `translateX(-${referenceIndex * (cardWidth + gap)}px)`;

  [...referenceDots.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === referenceIndex);
  });
}

function previousReference() {
  referenceIndex = referenceIndex <= 0 ? maxReferenceIndex() : referenceIndex - 1;
  updateReferenceSlider();
}

function nextReference() {
  referenceIndex = referenceIndex >= maxReferenceIndex() ? 0 : referenceIndex + 1;
  updateReferenceSlider();
}

referencePrev?.addEventListener("click", previousReference);
referenceNext?.addEventListener("click", nextReference);

referenceSlider?.addEventListener("touchstart", event => {
  referenceTouchStartX = event.changedTouches[0].clientX;
}, { passive: true });

referenceSlider?.addEventListener("touchend", event => {
  const difference = event.changedTouches[0].clientX - referenceTouchStartX;
  if (Math.abs(difference) < 40) return;
  difference > 0 ? previousReference() : nextReference();
}, { passive: true });

window.addEventListener("resize", () => {
  renderReferenceDots();
  updateReferenceSlider();
});

renderReferenceDots();
updateReferenceSlider();

// Rozšíření ovládání klávesnice
document.addEventListener("keydown", event => {
  if (galleryLightbox?.classList.contains("open")) {
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") showPreviousGalleryImage();
    if (event.key === "ArrowRight") showNextGalleryImage();
  }
});


// V5 – podpisové logo vždy vrátí stránku úplně nahoru
document.querySelectorAll('a.brand[href="#top"]').forEach((logo) => {
  logo.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    menuToggle?.classList.remove("open");
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
