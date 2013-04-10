/*
 * Copyright (c) 2013 Taye Adeyemi
 * Open source under the MIT License.
 * https://raw.github.com/taye/rearrange.js/master/LICENSE
 */

(function (interact) {
    'use strict';

    var document = window.document,
        target = null,
        targetPosition = null,
        styleElement,
        transformProp;

    function setTarget (element) {
        if (element !== target && element !== document && element !== document.documentElement) {
            clearTarget();

            target = element;
            element.classList.add('rearrange-target');
        }
    }

    function clearTarget () {
        if (target) {
            target.classList.remove('rearrange-target');
            target.classList.remove('rearranging');
        }
    }

    function onMouseOver (event) {
        if (!interact.currentAction()) {
            setTarget(event.target);
        }
    }

    function onWheel (event) {
        if (event.altKey) {
            var delta = event.detail || event.deltaY || event.wheelDeltaY;

            if (delta > 0) {
                setTarget(target.parentNode);
            }
            event.preventDefault();
        }
    }

    function dragStart (event) {
        if (!target.rearranged) {
            target.rearranged = { x: 0, y: 0 };
        }
        target.classList.add('rearranging');
    }

    function dragMove (event) {
        target.rearranged.x += event.dx;
        target.rearranged.y += event.dy;

        target.style[transformProp] =
            'translate(' + target.rearranged.x + 'px, ' + target.rearranged.y + 'px)';
    }

    function dragEnd (event) {
        target.classList.remove('rearranging');
    }

    function init () {
        transformProp = 'transform' in document.body.style?
            'transform': 'webkitTransform' in document.body.style?
                'webkitTransform': 'MozTransform' in document.body.style?
                    'MozTransform': 'oTransform' in document.body.style?
                        'oTransform': 'msTransform';

        interact(document.documentElement)
            .draggable(true)
            .actionChecker(function (event) {
                return target? 'drag': null;
            })
            .checkOnHover(false)
            .bind('mouseover', onMouseOver)
            .bind('wheel'    , onWheel)
            .bind('dragstart'  , dragStart)
            .bind('dragmove'   , dragMove)
            .bind('dragend'    , dragEnd);

        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = '.rearrange-target{border:yellow solid 3px !important;} .rearranging{border-style:dashed !important;}';
        document.body.appendChild(styleElement);
    };

    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', init);
    }
    else {
        init();
    }

}(window.interact));
