app.Board = (function(window) {
    const gridNumEachSide = NUM_OF_GRID_EACH_SIDE;
    const hasTouch = 'ontouchstart' in window;
    let resizeEvent;
    const // Defined later because android doesn't always work with orientation change, so I need to know the platform.
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup';


    // Board dimensions declared in the Board constructor
    let widthOfBoard,
        heightOfBoard,
        tileWidth,
        tileHeight;

    let boardOffset;

    const ANIMATE_CSS_CLASS = 'animate',
        ACTIVE_PIECE_CSS_CLASS = 'active',
        SHOW_CLASS = 'showing';

    const convert = {
        arrayIndexToTransform: function (i) {
            const currentPosition = this.arrayIndexToBoardCoords(i);

            return {
                x: tileWidth * currentPosition.x,
                y: tileHeight * currentPosition.y
            };
        },

        clientCoordsToBoardCoords: function (x, y) {
            x -= boardOffset.x;
            y -= boardOffset.y;

            return {
                x: Math.floor(x / tileWidth),
                y: Math.floor(y / tileHeight)
            };
        },

        arrayIndexToBoardCoords: function (index) {
            return {
                x: index % gridNumEachSide,
                y: Math.floor(index / gridNumEachSide)
            };
        },

        boardCoordsToArrayIndex: function (point) {
            return (point.y * gridNumEachSide) + point.x;
        }
    };

    const setup = {
        pieces: function (board) {
            const pieces = [],
                gridSize = gridNumEachSide * gridNumEachSide,
                emptyPiece = Math.floor(Math.random() * gridSize);

            for (let i = 0; i < gridSize; i++) {
                let transformCoords;
                let piece;

                if (i === emptyPiece) {
                    // Remove one piece.
                    piece = null;
                } else {
                    transformCoords = convert.arrayIndexToTransform(i);

                    piece = new app.Piece({
                        width: tileWidth,
                        height: tileHeight,
                        backgroundSize: widthOfBoard,
                        id: i,
                        backgroundPosition: (-transformCoords.x) + 'px ' + (-transformCoords.y) + 'px',
                    });

                    translateByPosition(piece, transformCoords);
                    board.appendChild(piece.element);
                }
                pieces.push(piece);
            }

            return {pieces: pieces, emptyPiece: emptyPiece};
        },

        board: function (options) {
            const element = document.createElement('div');
            element.id = options.id;
            app.utils.addClass(element, options.cssClass);
            app.utils.addClass(element, ANIMATE_CSS_CLASS);
            app.utils.addClass(element, SHOW_CLASS);
            element.style.width = widthOfBoard + 'px';
            element.style.height = heightOfBoard + 'px';

            return element;
        },

        imageMask: function(parent, image) {
            // Add image at outset of game.
            const img = document.createElement('img');
            img.src = image;
            img.width = widthOfBoard;
            img.height = heightOfBoard;
            img.style.display = 'block';
            img.style.position = 'absolute';
            img.style.zIndex = "100";
            parent.appendChild(img);
        },
    };

    const translateByPosition = function(piece, position) {
        app.utils.translate(position.x, position.y, piece.element);
    };

    const translateByIndex = function (piece, arrayIndex) {
        const transformCoords = convert.arrayIndexToTransform(arrayIndex);
        translateByPosition(piece, transformCoords);
    };

    const setPiecesTransform = function (pieces) {
        pieces.forEach(function (piece, i) {
            if (piece) {
                translateByIndex(piece, i);
            }
        });
    };

    const addActiveClass = function (pieces) {
        pieces.forEach(function (piece) {
            if (piece) {
                app.utils.addClass(piece.element, ACTIVE_PIECE_CSS_CLASS);
            }
        });
    };

    const removeActiveClass = function (pieces) {
        pieces.forEach(function (piece) {
            if (piece) {
                app.utils.removeClass(piece.element, ACTIVE_PIECE_CSS_CLASS);
            }
        });
    };

    const setBoardOffset = function (element) {
        // To wait for Mobile to finish orientation
        setTimeout(function () {
            boardOffset = {
                x: element.offsetLeft,
                y: element.offsetTop
            };
        }, 100);
    };

    const getBoardInfoByEvent = function (e, pieces, getEmptyTileArrayIndex) {
        let isSameRow,
            isSameColumn,
            triggeredBoardCoords,
            emptyTileBoardCoords,
            arrayIndex;
        const emptyTileArrayIndex = getEmptyTileArrayIndex,
            point = hasTouch ? e.changedTouches[0] : e;

        triggeredBoardCoords = convert.clientCoordsToBoardCoords(point.pageX, point.pageY);
        emptyTileBoardCoords = convert.arrayIndexToBoardCoords(emptyTileArrayIndex);

        arrayIndex = convert.boardCoordsToArrayIndex(triggeredBoardCoords);

        isSameRow = triggeredBoardCoords.y === emptyTileBoardCoords.y;
        isSameColumn = triggeredBoardCoords.x === emptyTileBoardCoords.x;

        return {
            directionTriggeredRelativeToEmptyTile: {
                left: isSameRow && (triggeredBoardCoords.x - emptyTileBoardCoords.x) < 0,
                right: isSameRow && (triggeredBoardCoords.x - emptyTileBoardCoords.x) > 0,

                up: isSameColumn && (arrayIndex - emptyTileArrayIndex) < 0,
                down: isSameColumn && (arrayIndex - emptyTileArrayIndex) > 0,

                row: isSameRow,
                column: isSameColumn
            },

            rowDistance: triggeredBoardCoords.x - emptyTileBoardCoords.x,

            triggeredArrayIndex: arrayIndex
        };
    };


    /*
    Constructor
    */

    const Board = function (options) {
        const clientDimensions = app.utils.getClientDimensions();

        widthOfBoard = options.width || ((clientDimensions.x > 500) ? 500 : clientDimensions.x);
        heightOfBoard = options.height || widthOfBoard;  // because it is a square
        tileWidth = (widthOfBoard / gridNumEachSide);
        tileHeight = (heightOfBoard / gridNumEachSide);

        resizeEvent = (('onorientationchange' in window) && app.isAndroid) ? 'orientationchange' : 'resize';

        this.element = setup.board(options);
        setup.imageMask(this.element, options.image);
        const piecesSetup = setup.pieces(this.element);
        this.pieces = piecesSetup.pieces;
        this.answer = this.pieces.slice();
        this.emptyPiece = piecesSetup.emptyPiece;

        this.initEvents();
    };

    Board.prototype.getEmptyTileArrayIndex = function() {
        const pieces = this.pieces;
        for (let i = 0; i < pieces.length; i++) {
            if (!pieces[i]) {
                return i;
            }
        }
    };

    // This function returns true if puzzle is solvable
    Board.prototype.isSolvable = function() {
        // Count inversions in given puzzle
        const invCount = app.utils.getInvCount(this.pieces, gridNumEachSide);

        // If grid is odd, return true if inversion
        // count is even.
        if (gridNumEachSide  % 2 === 1)
            return (invCount % 2) === 0;
        else     // grid is even
        {
            const posEmptyTile = this.getEmptyTileArrayIndex();
            const rowEmptyTile = Math.floor(posEmptyTile / gridNumEachSide);

            const posEmptyPiece = this.emptyPiece;
            const rowEmptyPiece = Math.floor(posEmptyPiece / gridNumEachSide);

            const rowDifference = rowEmptyPiece - rowEmptyTile;

            if (rowDifference % 2 === 0)
                return (invCount % 2) === 0;	// the blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.) and number of inversions is even (if true).
            else
                return (invCount % 2) === 1;	// the blank is on an even row counting from the bottom (second-last, fourth-last, etc.) and number of inversions is odd (if true).
        }
    };

    Board.prototype.shuffle = function() {
        let pieces;
        do {
            pieces = this.pieces = app.utils.shuffleArray(this.pieces);
        } while(!this.isSolvable());

        pieces.forEach(function(piece, i) {
            if (piece) {
                translateByIndex(piece, i);
            }
        });
    };

    Board.prototype.initEvents = function() {
        const that = this;

        this.element.addEventListener(startEvent, this, false);
        window.addEventListener(resizeEvent, this, false);
        
        app.utils.event.subscribe('board:appended', function() {
            setBoardOffset(that.element);
        });
    };
        
    Board.prototype.handleEvent = function(e) {
        switch (e.type) {
            case startEvent:
                this.startEvent(e);
                break;
            case moveEvent:
                this.moveEvent(e);
                break;
            case endEvent:
                this.endEvent(e);
                break;
            case resizeEvent:
                this.resizeBoard();
                break;
        }
    };

    Board.prototype.getPiecesToMove = function() {
        const direction = this.boardInfo.directionTriggeredRelativeToEmptyTile,
            rowDistance = this.boardInfo.rowDistance,
            arrayIndex = this.boardInfo.triggeredArrayIndex,
            emptyPieceIndex = this.getEmptyTileArrayIndex(),
            piecesToMoveArray = [],
            column = emptyPieceIndex % gridNumEachSide;

        if (direction.left) {
            for (let leftIndex = rowDistance + 1; 0 >= leftIndex; leftIndex++) {
                piecesToMoveArray.unshift(this.pieces[arrayIndex - leftIndex]);
            }
        } else if (direction.right) {
            for (let rightIndex = rowDistance - 1; 0 <= rightIndex; rightIndex--) {
                piecesToMoveArray.unshift(this.pieces[arrayIndex-rightIndex]);
            }
        } else if (direction.up) {
            for (let aboveIndex = emptyPieceIndex - 1; arrayIndex <= aboveIndex; aboveIndex--) {
                if (aboveIndex % gridNumEachSide === column) {
                    piecesToMoveArray.unshift(this.pieces[aboveIndex]);
                }                        
            }
        } else if (direction.down) {
            for (let belowIndex = emptyPieceIndex+1; arrayIndex >= belowIndex; belowIndex++) {
                if (belowIndex % gridNumEachSide === column) {
                    piecesToMoveArray.unshift(this.pieces[belowIndex]);
                }
            }             
        }
        
        return piecesToMoveArray;
    };

    Board.prototype.startEvent = function(e) {
        let isSameRow, isSameColumn;

        const point = hasTouch ? e.changedTouches[0] : e;

        this.startingPoint = {
            pageX: point.pageX,
            pageY: point.pageY
        };
        
        this.boardInfo = getBoardInfoByEvent(e, this.pieces, this.getEmptyTileArrayIndex());
        
        // Due to piece confusion when finger/mouse leaves the board while touching/dragging.
        setPiecesTransform(this.pieces);
        
        isSameRow = this.boardInfo.directionTriggeredRelativeToEmptyTile.row;
        isSameColumn = this.boardInfo.directionTriggeredRelativeToEmptyTile.column;
        if (isSameRow || isSameColumn) {
            this.element.addEventListener(moveEvent, this, false);
            this.element.addEventListener(endEvent, this, false);
        }
        
        this.curTransform = convert.arrayIndexToTransform(this.boardInfo.triggeredArrayIndex);
        
        this.piecesToMove = this.getPiecesToMove();
        
        addActiveClass(this.piecesToMove);
    }; 

    Board.prototype.moveEvent = function(e) {
        const that = this,
            point = hasTouch ? e.changedTouches[0] : e,
            direction = this.boardInfo.directionTriggeredRelativeToEmptyTile,
            piecesToMove = this.piecesToMove,
            shouldMove = true,
            currentTile = this.pieces[this.boardInfo.triggeredArrayIndex];

        app.utils.removeClass(this.element, ANIMATE_CSS_CLASS);
        e.preventDefault();
        
        if (piecesToMove.length) {
            piecesToMove.forEach(function(piece, i) {
                let modifier, deltaX = 0, deltaY = 0;
                if (direction.row){
                    modifier = direction.left ? (tileWidth*i) : -(tileWidth*i);
                    deltaX = (point.pageX - that.startingPoint.pageX) + modifier;
                } else {
                    modifier = direction.up ? (tileHeight*i) : -(tileHeight*i);
                    deltaY = (point.pageY - that.startingPoint.pageY) + modifier;
                }
                app.utils.translate(deltaX, deltaY, piece.element, that.curTransform);                
 
             });
        }
        
        this.lastPoint = point;
    };

    Board.prototype.endEvent = function() {
        let movedMostOfTheWay,
            didntMoveAtAll;
        const point = this.lastPoint || this.startingPoint,
            direction = this.boardInfo.directionTriggeredRelativeToEmptyTile;

        removeActiveClass(this.piecesToMove);
        
        app.utils.removeClass(this.element, ANIMATE_CSS_CLASS);
                
        if (direction.left || direction.up) {
            movedMostOfTheWay = point.pageX - this.startingPoint.pageX > (tileWidth/2) || 
                point.pageY - this.startingPoint.pageY > (tileWidth/2);
        } else {
            movedMostOfTheWay = this.startingPoint.pageX - point.pageX > (tileWidth/2) || 
                this.startingPoint.pageY - point.pageY > (tileWidth/2);
        }

        didntMoveAtAll = (this.boardInfo.directionTriggeredRelativeToEmptyTile.row) ? 
            (point.pageX - this.startingPoint.pageX) === 0 : 
            (point.pageY - this.startingPoint.pageY) === 0;
        
        if (movedMostOfTheWay || didntMoveAtAll) {
            this.movePieces();
        } else {
            setPiecesTransform(this.pieces);
            
        }

        this.element.removeEventListener(moveEvent, this, false);
        this.element.removeEventListener(endEvent, this, false);
                        
        this.lastPoint = null;
        
        app.utils.addClass(this.element, ANIMATE_CSS_CLASS);

        const isWin = this.checkGame();
        if (isWin) {
            app.utils.removeClass(this.element, SHOW_CLASS);
            // Add wall
            const wall = new app.Wall({
                cssClass: 'wall',
                id: 'wall',
            });
            app.utils.addClass(wall.element, SHOW_CLASS);
            this.element.parentElement.appendChild(wall.element);
        }
    };
    
    Board.prototype.resizeBoard = function() {
        const that = this;
        setBoardOffset(this.element);
        app.utils.removeClass(this.element, ANIMATE_CSS_CLASS);
        
        // xxx don't repeat this getclient code from up above - DRY
        const clientWidth = (app.utils.getClientDimensions().x > 500) ? 500 : app.utils.getClientDimensions().x;
        tileWidth = clientWidth / gridNumEachSide;
        tileHeight = clientWidth / gridNumEachSide;
        
        this.element.style.width = clientWidth + 'px';
        this.element.style.height = clientWidth + 'px';
        
        this.pieces.forEach(function(piece, i) {
            let transformCoords;
            let styles = {};

            if (piece) {
                transformCoords = convert.arrayIndexToTransform(piece.id);
                
                styles = {
                    height: tileHeight,
                    width: tileWidth,
                    backgroundSize: clientWidth,
                    backgroundPosition: (-transformCoords.x) + 'px ' + (-transformCoords.y) + 'px'
                };
                that.pieces[i].ui(styles);
                
               translateByIndex(piece, i);
            }
        });
        
        // To wait for the resize to finish
        setTimeout(function() {
            app.utils.addClass(that.element, ANIMATE_CSS_CLASS);
        }, 100);
        
    };
    
    Board.prototype.movePieces = function() {
        const direction = this.boardInfo.directionTriggeredRelativeToEmptyTile,
            arrayIndex = this.boardInfo.triggeredArrayIndex,
            piecesToMove = this.piecesToMove,
            that = this;

        piecesToMove.forEach(function(piece, i) {
            if (direction.left) {
                that.pieces[arrayIndex + 1 + i] = piece;
            }
            else if (direction.right) {
                that.pieces[arrayIndex - 1 - i] = piece;
            }        
            else if (direction.up) {
                that.pieces[arrayIndex + gridNumEachSide + (i * gridNumEachSide)] = piece;
            }        
            else if (direction.down) {
                that.pieces[arrayIndex - gridNumEachSide - (i * gridNumEachSide)] = piece;
            }
        });
        
        if (direction.row || direction.column) {
            this.pieces[arrayIndex] = null;
        }
        
        setPiecesTransform(this.pieces);
    };

    Board.prototype.checkGame = function() {
        // console.log(this.answer);
        // console.log(this.pieces);
        for (let i = 0; i < this.answer.length; i++) {
            const currAnswerPiece = this.answer[i];
            const currPiece = this.pieces[i];
            if (currAnswerPiece === null) {
                if (currPiece !== null) {
                    return false;
                }
            } else {
                if (currPiece === null || currAnswerPiece.element.id !== currPiece.element.id) {
                    return false;
                }
            }
        }
        return true;
    };

    return Board;
})(window);