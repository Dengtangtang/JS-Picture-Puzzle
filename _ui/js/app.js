window.app = {};

window.addEventListener('load', function() {
    app.utils = new app.Utils();
    
    app.isAndroid = app.utils.isAndroid();
    
    app.puzzle = new app.Puzzle({
        image: '_ui/img/nana.jpg',
        wrapper: '#board-wrapper',
    });

    // Add height to #board-wrapper.
    const boardDiv = app.puzzle.board.element;
    document.querySelector('#board-wrapper').style.height = boardDiv.offsetHeight + 20 * 2 + 'px';

    // Add timer inside #timer-wrapper.
    const timerWrapper = document.querySelector('#timer-wrapper');
    const spinDiv = document.createElement('div');
    const fillDiv = document.createElement('div');
    const maskDiv = document.createElement('div');
    app.utils.addClass(spinDiv, 'spinner');
    app.utils.addClass(spinDiv, 'pie');
    app.utils.addClass(fillDiv, 'filler');
    app.utils.addClass(fillDiv, 'pie');
    app.utils.addClass(maskDiv, 'mask');

    timerWrapper.appendChild(spinDiv);
    timerWrapper.appendChild(fillDiv);
    timerWrapper.appendChild(maskDiv);

});