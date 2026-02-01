/** @odoo-module **/

const initGallery = () => {
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
        const triggers = Array.from(gallery.querySelectorAll("[data-gallery-index]"));
        if (!triggers.length) {
            return;
        }

        const imagesByIndex = [];
        triggers.forEach((trigger) => {
            const index = Number(trigger.dataset.galleryIndex);
            if (Number.isNaN(index)) {
                return;
            }
            const src =
                trigger.dataset.fullSrc ||
                trigger.dataset.full ||
                trigger.dataset.src ||
                trigger.querySelector("img")?.src;
            if (!src) {
                return;
            }
            if (!imagesByIndex[index]) {
                imagesByIndex[index] = src;
            }
        });

        const images = imagesByIndex.filter(Boolean);
        if (!images.length) {
            return;
        }

        triggers.forEach((trigger) => {
            const index = Number(trigger.dataset.galleryIndex || 0);
            trigger.addEventListener("click", () => openLightbox(index, images));
        });
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
