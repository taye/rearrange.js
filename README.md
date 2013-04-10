rearrange.js
============

Use it to rearrange things on websites.

----------------

Use a bookmark url
```javascript
javascript:(function(){s=document.createElement('script');s.src='https://raw.github.com/taye/rearrange.js/master/rearrange.min.js';document.body.appendChild(s);}())
```

or run in the console
```javascript
var r = document.createElement('script');
r.src = 'https://raw.github.com/taye/rearrange.js/master/rearrange.min.js'
document.body.appendChild(r);
```

When you hover over an element with the mouse, it's focused and it gets a yellow border. Hold Alt and roll your mousewheel down to focus on the current element's parent. Click and drag to move stuff around.
