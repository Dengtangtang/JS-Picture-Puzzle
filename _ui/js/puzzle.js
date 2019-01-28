app.Puzzle = (function(window, undefined) {
    var hasTouch = 'ontouchstart' in window,
        endEvent = hasTouch ? 'touchend' : 'mouseup';
      
    var Puzzle = function(options) {
        this.board = new app.Board({
            cssClass: "board",
            id: "board",
            image: options.image
        });
        this.wall = new app.Wall({
            cssClass: "wall",
            id: "wall",
        });
        this.isWin = false;
        var wrapper = document.querySelector(options.wrapper);
        wrapper.style.position = 'relative';
        wrapper.appendChild(this.wall.element);
        wrapper.appendChild(this.board.element);
        app.utils.event.fire('board:appended');
        this.initEvents();
        // app.utils.addClass(this.board.element, showClass);
    };
    
    Puzzle.prototype.initEvents = function() {
        var that = this;
        document.getElementById('shuffle').addEventListener(endEvent, function() {
            that.board.shuffle();
        }, false);
    };

    return Puzzle;
})(window);