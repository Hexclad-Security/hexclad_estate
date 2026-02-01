/** @odoo-module **/

const initGallery = () => {
    const galleries = document.querySelectorAll(".estate-gallery");
    if (!galleries.length) {
        return;
    }

    console.log("estate gallery loaded");

    const lightbox = document.querySelector(".estate-lightbox");
    const lightboxImage = lightbox ? lightbox.querySelector(".estate-lightbox__image") : null;
    const lightboxClose = lightbox ? lightbox.querySelector(".estate-lightbox__close") : null;
    const lightboxPrev = lightbox ? lightbox.querySelector(".estate-lightbox__prev") : null;
    const lightboxNext = lightbox ? lightbox.querySelector(".estate-lightbox__next") : null;

    const state = {
        images: [],
        index: 0,
    };

    const setHeroImage = (hero, src, index) => {
        if (!hero || !src) {
            return;
        }
        hero.src = src;
        hero.dataset.index = String(index);
    };

    const syncThumbs = (thumbs, activeIndex) => {
        thumbs.forEach((thumb, index) => {
            thumb.setAttribute("aria-current", index === activeIndex ? "true" : "false");
        });
    };

    const toggleNav = () => {
        const isSingle = state.images.length <= 1;
        if (lightboxPrev) {
            lightboxPrev.classList.toggle("is-hidden", isSingle);
        }
        if (lightboxNext) {
            lightboxNext.classList.toggle("is-hidden", isSingle);
        }
    };

    const openLightbox = (index, images) => {
        if (!lightbox || !lightboxImage || !images.length) {
            return;
        }
        state.images = images;
        state.index = index;
        lightboxImage.src = state.images[state.index];
        toggleNav();
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("estate-lightbox-open");
        lightboxClose && lightboxClose.focus();
    };

    const closeLightbox = () => {
        if (!lightbox) {
            return;
        }
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("estate-lightbox-open");
    };

    const showImage = (direction) => {
        if (!state.images.length || !lightboxImage) {
            return;
        }
        const length = state.images.length;
        state.index = (state.index + direction + length) % length;
        lightboxImage.src = state.images[state.index];
    };

    galleries.forEach((gallery) => {
        const hero = gallery.querySelector(".estate-gallery__hero-image");
        const heroAction = gallery.querySelector(".estate-gallery__hero-action");
        const thumbs = Array.from(gallery.querySelectorAll(".estate-gallery__thumb"));

        const images = thumbs
            .map((thumb) => thumb.dataset.fullSrc || thumb.dataset.full)
            .filter(Boolean);

        if (!images.length && hero && hero.src) {
            images.push(hero.src);
        }

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
                const src = thumb.dataset.fullSrc || thumb.dataset.full;
                setHeroImage(hero, src, index);
                syncThumbs(thumbs, index);
            });
        });

        if (hero && heroAction && images.length) {
            const openHeroLightbox = () =>
                openLightbox(Number(hero.dataset.index || 0), images);

            heroAction.addEventListener("click", openHeroLightbox);
            hero.addEventListener("click", openHeroLightbox);
            hero.setAttribute("role", "button");
            hero.setAttribute("tabindex", "0");
            hero.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openHeroLightbox();
                }
            });
        }
    });

    if (lightbox) {
        lightbox.addEventListener("click", (event) => {
            if (event.target && event.target.dataset.lightboxClose) {
                closeLightbox();
            }
        });

        lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
        lightboxPrev && lightboxPrev.addEventListener("click", () => showImage(-1));
        lightboxNext && lightboxNext.addEventListener("click", () => showImage(1));

        document.addEventListener("keydown", (event) => {
            if (!lightbox.classList.contains("is-open")) {
                return;
            }
            if (event.key === "Escape") {
                closeLightbox();
            } else if (event.key === "ArrowLeft") {
                showImage(-1);
            } else if (event.key === "ArrowRight") {
                showImage(1);
            }
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGallery);
} else {
    initGallery();
}
