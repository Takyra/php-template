"use strict";

document.addEventListener('DOMContentLoaded', function() {
    $('.slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class="slider-arrow slider-arrow--prev"><span></span></button>',
        nextArrow: '<button type="button" class="slider-arrow slider-arrow--next"><span></span></button>',
        draggable: false,
        infinite: false,
        responsive: [{
            breakpoint: 1025,
            settings: {slidesToShow: 1}
        }]
    });

    previousPage('.return');
});

//=include _find-target.js
//=include _previous-page.js