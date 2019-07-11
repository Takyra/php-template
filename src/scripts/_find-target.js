function findTarget(userOptions, options) {
    if (!document.querySelectorAll(userOptions.target).length) return false;

    mergeOptions(userOptions);

    const TARGETS = document.querySelectorAll(options.target);

    init();

    function init() {
        getResizeValue();
        getScrollValue();
        window.addEventListener('resize', getResizeValue);
        window.addEventListener('scroll', getScrollValue);
    }

    function eventHandler(target) {
        console.log('find');
    }

    function getScrollValue() {
        let windowPosition = {
            top: window.pageYOffset,
            right: window.pageXOffset + document.documentElement.clientWidth,
            bottom: window.pageYOffset + document.documentElement.clientHeight,
            left: window.pageXOffset
        };

        for (let i = 0; i < TARGETS.length; i++) {
            let indentY = options.indentY,
                target = TARGETS[i],
                targetSize = {
                    width: target.clientWidth,
                    height: target.clientHeight
                };

            if (options.procentIndentY) indentY = targetSize.height * options.indentY / 100;

            let targetPosition = {
                    top: window.pageYOffset + target.getBoundingClientRect().top + indentY,
                    right: window.pageXOffset + target.getBoundingClientRect().right,
                    bottom: window.pageYOffset + target.getBoundingClientRect().bottom - indentY,
                    left: window.pageXOffset + target.getBoundingClientRect().left
                };

            if (targetPosition.bottom > windowPosition.top &&
                targetPosition.top < windowPosition.bottom &&
                targetPosition.right > windowPosition.left &&
                targetPosition.left < windowPosition.right &&
                !target.classList.contains(options.addClass)) {
                    target.classList.add(options.addClass);
                    options.findEvent(target);
                }
        }
    }

    function getResizeValue() {
        if (options.header) {
            let header = document.querySelector(options.header),
                headerHeight = header.clientHeight;

            options.indentY = options.indentY + headerHeight;
        }
    }

    function mergeOptions(userOptions) {
        let defaultOptions = {
            target: '.target-animation',
            addClass: 'tagret-find',
            findEvent: function() {},
            header: false,
            indentY: 0
        };

        for (let key in userOptions) defaultOptions[key] = userOptions[key];

        options = defaultOptions;
        checkIndent(options.indentY);

        function checkIndent(indentY) {
            indentY = String(indentY).split('');

            if (indentY[indentY.length - 1] == '%') {
                options.procentIndentY = true;
                indentY.pop();
                options.indentY = Number(indentY.join(''));
            }
        }
    }
}