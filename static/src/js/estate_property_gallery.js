odoo.define("hexclad_estate.estate_property_gallery", function (require) {
    "use strict";

    const domReady = require("web.dom_ready");

    domReady(function () {
        const galleries = document.querySelectorAll(".estate-gallery");
        if (!galleries.length) {
            return;
        }

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

        const openLightbox = (index) => {
            if (!lightbox || !lightboxImage || !state.images.length) {
                return;
            }
            state.index = index;
            lightboxImage.src = state.images[state.index];
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
            if (!state.images.length) {
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

            state.images = thumbs.map((thumb) => thumb.dataset.full).filter(Boolean);
            if (!state.images.length && hero && hero.src) {
                state.images = [hero.src];
            }

            thumbs.forEach((thumb, index) => {
                thumb.addEventListener("click", () => {
                    const src = thumb.dataset.full;
                    setHeroImage(hero, src, index);
                    syncThumbs(thumbs, index);
                });
            });

            if (hero && heroAction) {
                heroAction.addEventListener("click", () => openLightbox(Number(hero.dataset.index || 0)));
                hero.addEventListener("click", () => openLightbox(Number(hero.dataset.index || 0)));
                hero.setAttribute("role", "button");
                hero.setAttribute("tabindex", "0");
                hero.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openLightbox(Number(hero.dataset.index || 0));
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
    });
});
