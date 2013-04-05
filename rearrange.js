/*
 * Copyright (c) 2013 Taye Adeyemi
 * Open source under the MIT License.
 * https://raw.github.com/taye/rearrange.js/master/LICENSE
 */

(function () {
    'use strict';

    var document = window.document,
        target = null,
        targetPosition = null,
        scriptElement,
        styleElement,
        events = (function () {
            'use strict';

            var addEvent = ('addEventListener' in document)?
                    'addEventListener': 'attachEvent',
                removeEvent = ('removeEventListener' in document)?
                    'removeEventListener': 'detachEvent',
                
                elements = [],
                targets  = [];

            if (!('indexOf' in Array.prototype)) {
                Array.prototype.indexOf = function(elt /*, from*/)   {
                var len = this.length >>> 0;

                var from = Number(arguments[1]) || 0;
                from = (from < 0)?
                    Math.ceil(from):
                    Math.floor(from);

                if (from < 0) {
                    from += len;
                }

                for (; from < len; from++) {
                    if (from in this && this[from] === elt) {
                        return from;
                    }
                }

                return -1;
                };
            }

            function add (element, type, listener, useCapture) {
                if (!(element instanceof window.Element) && element !== window.document) {
                    return;
                }

                var target = targets[elements.indexOf(element)];

                if (!target) {
                    target = {
                        events: {},
                        typeCount: 0
                    };

                    elements.push(element);
                    targets.push(target);
                }
                if (!target.events[type]) {
                    target.events[type] = [];
                    target.typeCount++;
                }

                if (target.events[type].indexOf(listener) === -1) {
                    target.events[type].push(listener);

                    return element[addEvent](type, listener, useCapture || false);
                }
            }

            function remove (element, type, listener, useCapture) {
                var i,
                target = targets[elements.indexOf(element)];

                if (!target || !target.events) {
                    return;
                }

                if (type === 'all') {
                    for (type in target.events) {
                        if (target.events.hasOwnProperty(type)) {
                            remove(element, type, 'all');
                        }
                    }
                    return;
                }

                if (target.events[type]) {
                    var len = target.events[type].length;

                    if (listener === 'all') {
                        for (i = 0; i < len; i++) {
                            element[removeEvent](type, target.events[type][i], useCapture || false);
                        }
                        target.events[type] = null;
                        target.typeCount--;
                    } else {
                        for (i = 0; i < len; i++) {
                            if (target.events[type][i] === listener) {

                                element[removeEvent](type, target.events[type][i], useCapture || false);
                                target.events[type].splice(i, 1);

                                break;
                            }
                        }
                    }
                    if (target.events[type] && target.events[type].length === 0) {
                        target.events[type] = null;
                        target.typeCount--;
                    }
                }

                if (!target.typeCount) {
                    targets.splice(targets.indexOf(target), 1);
                    elements.splice(elements.indexOf(element), 1);
                }
            }

            return {
                add: add,
                remove: remove
            };
        }());

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
            target.rearranged = {
                x: 0,
                y: 0
            }
        }
    }

    function dragMove (event) {
        target.rearranged.x += event.dx;
        target.rearranged.y += event.dy;

        target.style.transform = [
            'translate(',
            target.rearranged.x,
            'px, ',
            target.rearranged.y,
            'px)'
        ].join('');
    }

    if (!window.interact) {
        var loadInteract = function () {
            scriptElement = document.createElement('script');
            scriptElement.src = 'https://raw.github.com/taye/interact.js/master/interact.js';
            document.body.appendChild(scriptElement);
        }

        if (document.readyState !== 'complete') {
            events.add(document, 'DOMContentLoaded', loadInteract);
        }
        else {
            loadInteract();
        }
    }

    function init () {
        if (document.readyState !== 'complete' || !window.interact) {
            setTimeout(init, 100);
            return;
        }

        interact(document.documentElement).draggable(true)
            .actionChecker(function (event) {
                if (event.target !== document.documentElement) {
                    return 'drag';
                }
            })
            .checkOnHover(false)
            .bind('mouseover', onMouseOver)
            .bind('wheel'    , onWheel)
            .bind('dragstart' , dragStart)
            .bind('dragmove' , dragMove);

        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML ='.rearrange-target{border:yellow solid 3px !important;} html .rearranging{border-style:dashed !important;}';
        document.body.appendChild(styleElement);
    };

    init();

}());
