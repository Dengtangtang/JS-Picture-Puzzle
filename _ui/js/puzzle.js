app.Puzzle = (function(window, undefined) {
    const hasTouch = 'ontouchstart' in window,
        endEvent = hasTouch ? 'touchend' : 'mouseup';

    const Puzzle = function (options) {
        this.board = new app.Board({
            cssClass: 'board',
            id: 'board',
            image: options.image
        });
        document.querySelector(options.wrapper).appendChild(this.board.element);
        app.utils.event.fire('board:appended');
        this.initEvents();
        app.utils.addClass(this.board.element, 'showing');
    };

    Puzzle.prototype.initEvents = function() {
        const that = this;
        document.getElementById('shuffle').addEventListener(endEvent, function() {
            that.board.shuffle();
        }, false);

        that.board.shuffle();
    };

    return Puzzle;
})(window);