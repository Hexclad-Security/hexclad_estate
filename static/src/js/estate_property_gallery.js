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

    _onGalleryClick(event) {
        event.preventDefault();
        const index = Number(event.currentTarget.dataset.index || 0);
        if (!this.$carousel.length || Number.isNaN(index) || !window.bootstrap) {
            return;
        }

        const modalElement = this.$modal.get(0);
        const carouselElement = this.$carousel.get(0);
        if (!carouselElement || !modalElement) {
            return;
        }

        const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        const carousel = window.bootstrap.Carousel.getOrCreateInstance(carouselElement, {
            interval: false,
            ride: false,
            wrap: true,
        });
        carousel.to(index);
        modal.show();
    },
});
