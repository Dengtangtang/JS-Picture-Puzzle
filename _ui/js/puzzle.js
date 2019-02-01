app.Puzzle = (function(window, undefined) {
    var hasTouch = 'ontouchstart' in window,
        endEvent = hasTouch ? 'touchend' : 'mouseup';

    // var SHOW_CLASS = 'showing';
      
    var Puzzle = function(options) {
        this.board = new app.Board({
            cssClass: 'board',
            id: 'board',
            image: options.image,
            timerWidth: 100,
            timerHeight: 100,
        });

        this.wall = new app.Wall({
            cssClass: 'wall',
            id: 'wall',
        });

        // Add wall, board and timer to wrapper
        var wrapper = document.querySelector(options.wrapper);
        wrapper.style.position = 'relative';
        wrapper.appendChild(this.wall.element);
        wrapper.appendChild(this.board.element);
        app.utils.event.fire('board:appended');
        this.initEvents();
    };
    
    Puzzle.prototype.initEvents = function() {
        var that = this;
        // document.getElementById('shuffle').addEventListener(endEvent, function() {
        //     that.board.shuffle();
        // }, false);

        that.board.shuffle();

        window.setTimeout(function() {
            document.querySelector('#timer-wrapper').remove();  // Remove timer.
            that.board.element.firstChild.remove();  // Remove image mask.
        }, 3000);        
    };

    return Puzzle;
})(window);