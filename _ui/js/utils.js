app.Utils = (function(window) {
    const Utils = function () {};

    let transformProperty;

    if (document.body.style.webkitTransform !== undefined) {
      transformProperty = 'webkitTransform';
    } else if (document.body.style.mozTransform !== undefined){
      transformProperty = 'mozTransform';
    } else {
      transformProperty = 'transform';
    }
    
    Utils.prototype.event = {
        eventMap: {},
        fire: function(eventName, data) {
            if (typeof this.eventMap[eventName] === 'function') {
                this.eventMap[eventName](data);
            }
        },
        subscribe: function(eventName, fn, replace) {
            if (typeof this.eventMap[eventName] === 'undefined' || replace) {
                this.eventMap[eventName] = fn;
            } else {
                const oldFunction = this.eventMap[eventName];
                this.eventMap[eventName] = function(data) {
                    if(typeof data !== 'undefined') {
                        oldFunction(data);
                        fn(data);
                    } else {
                        oldFunction();
                        fn();
                    }
                };
            }
        }
    };

    Utils.prototype.getClientDimensions = function() {
        return {
            x: window.innerWidth, 
            y: window.innerHeight
        };
    };
    
    Utils.prototype.addClass = function(el, classname) {
        const existingClasses = el.className;

        if (existingClasses.indexOf(classname) === -1 ) {
            el.className = (existingClasses + ' ' + classname).trim();
        }
        
        return el;
    };
    
    Utils.prototype.removeClass = function(el, classname) {
        const existingClasses = el.className;

        el.className = existingClasses.replace(classname, '').trim();
        
        return el;
    };
    
    Utils.prototype.translate = function(toX, toY, el, currentTransform) {
        currentTransform = currentTransform || {};
        const currentX = currentTransform.x || 0;
        const currentY = currentTransform.y || 0;
        el.style[transformProperty] = 'translate(' + Math.ceil(currentX + toX)+ 'px, ' + Math.ceil(currentY + toY) + 'px)';
    };
    
    //  from Underscore.js
    // http://documentcloud.github.com/underscore/underscore.js
    Utils.prototype.shuffleArray = function(obj) {
        const shuffled = [];
        let rand;
        obj.forEach(function(value, index) {
          if (index === 0) {
            shuffled[0] = value;
          } else {
            rand = Math.floor(Math.random() * (index + 1));
            shuffled[index] = shuffled[rand];
            shuffled[rand] = value;
          }
        });
        return shuffled;
    };
    
    Utils.prototype.isAndroid = function() {
      return navigator.userAgent.indexOf('Android') > -1;
    };

    // A utility function to count inversions in given
    // array 'arr[]'. Note that this function can be
    // optimized to work in O(n Log n) time. The idea
    // here is to keep code small and simple.
    Utils.prototype.getInvCount = function(pieces, gridNumEachSide) {
        let inv_count = 0;
        for (let i = 0; i < gridNumEachSide * gridNumEachSide - 1; i++)
        {
            if(!pieces[i])
                continue;

            for (let j = i + 1; j < gridNumEachSide * gridNumEachSide; j++)
            {
                if(!pieces[j])
                    continue;
                // count pairs(i, j) such that i appears
                // before j, but i > j.
                if (pieces[i].id > pieces[j].id)
                    inv_count++;
            }
        }
        return inv_count;
    };

    return Utils;
    
})(window, undefined);