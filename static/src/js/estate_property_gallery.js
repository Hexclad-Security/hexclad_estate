/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.HexPropertyGallery = publicWidget.Widget.extend({
    selector: ".hex-estate-property-page",
    events: {
        "click .hex-property-thumb": "_onGalleryClick",
    },

    start() {
        this.$modal = this.$el.find("#hex_property_gallery_modal");
        this.$carousel = this.$modal.find("#hex_property_gallery_carousel");
        return this._super(...arguments);
    },

    _setActiveSlide(index) {
        const $items = this.$carousel.find(".carousel-item");
        if (!$items.length) {
            return null;
        }

        const safeIndex = index >= 0 && index < $items.length ? index : 0;
        $items.removeClass("active");
        $items.eq(safeIndex).addClass("active");

        const $indicators = this.$carousel.find(".carousel-indicators [data-bs-slide-to]");
        if ($indicators.length) {
            $indicators.removeClass("active").removeAttr("aria-current");
            $indicators.eq(safeIndex).addClass("active").attr("aria-current", "true");
        }

        return safeIndex;
    },

    _onGalleryClick(event) {
        event.preventDefault();
        const index = Number(event.currentTarget.dataset.index || 0);
        if (!this.$carousel.length || Number.isNaN(index)) {
            return;
        }

        const modalElement = this.$modal.get(0);
        const carouselElement = this.$carousel.get(0);
        const activeIndex = this._setActiveSlide(index);
        if (!carouselElement || !modalElement || activeIndex === null) {
            return;
        }

        const bootstrapModal = window.bootstrap?.Modal;
        const bootstrapCarousel = window.bootstrap?.Carousel;
        if (!bootstrapModal || !bootstrapCarousel) {
            if (this.$modal.modal) {
                this.$modal.modal("show");
            }
            return;
        }

        const modal = bootstrapModal.getOrCreateInstance(modalElement);
        const carousel = bootstrapCarousel.getOrCreateInstance(carouselElement, {
            interval: false,
            ride: false,
            wrap: true,
        });
        carousel.to(activeIndex);
        modal.show();
    },
});

export default publicWidget.registry.HexPropertyGallery;
