/**
 * Custom Libraries Loader
 * 
 * This file dynamically loads all scripts in the js/ directory to keep index.html clean.
 * Using document.write ensures synchronous loading and preserves the global scope
 * required by script.js.
 */

(function() {
    const libraries = [
        'js/utils.js',
        'js/clock.js',
        'js/menu.js',
        'js/test_ua.js'
    ];

    libraries.forEach(src => {
        document.write(`<script src="${src}"></script>`);
    });
})();
