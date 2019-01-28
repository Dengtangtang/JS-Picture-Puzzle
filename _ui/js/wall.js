app.Wall = (function(window) {
    var numOfRows = 6;
    var numOfColumns = 7;

    var widthOfBoard,
        heightOfBoard,
        tileWidth,
        tileHeight;

    var images = [
        ['transparent', 'dog', 'dog', 'transparent', 'dog', 'dog', 'transparent'],
        ['dog', 'dog', 'dog', 'dog', 'dog', 'dog', 'dog'],
        ['dog', 'dog', 'dog', 'dog', 'dog', 'dog', 'dog'],
        ['transparent', 'dog', 'dog', 'dog', 'dog', 'dog', 'transparent'],
        ['transparent', 'transparent', 'dog', 'dog', 'dog', 'transparent', 'transparent'],
        ['transparent', 'transparent', 'transparent', 'dog', 'transparent', 'transparent', 'transparent'],
    ];

    var setup = {
        createWall: function(options) {
            var wallDiv,
                wallTable,
                wallTr,
                wallTd,
                imgTag,
                imgName,
                img;

            wallDiv = document.createElement('div');
            wallTable = document.createElement('table');
            for (var i = 0; i < numOfRows; i++) {
                wallTr = document.createElement('tr');
                for (var j = 0; j < numOfColumns; j++) {
                    wallTd = document.createElement('td');

                    imgName = images[i][j];
                    img = '_ui/img/' + imgName + '.jpg';
                    imgTag = document.createElement('img');
                    imgTag.width = options.imgWidth;
                    imgTag.height = options.imgHeight;
                    imgTag.src = img;
                    if (imgName === 'transparent') {
                        imgTag.style.opacity = 0;
                    } else {
                        imgTag.style.opacity = 1;
                    }

                    wallTd.appendChild(imgTag);
                    wallTr.appendChild(wallTd);
                }
                wallTable.appendChild(wallTr);
            }
            wallDiv.appendChild(wallTable);

            return wallDiv;
        }
    }

    var Wall = function(options) {
        var clientDimensions = app.utils.getClientDimensions();
        
        widthOfWall = options.width || ((clientDimensions.x > 700) ? 700 : clientDimensions.x);
        heightOfWall = options.height || widthOfWall / 1.5;  // because it is a square
        imgWidth = (widthOfWall / numOfColumns);
        imgHeight = (heightOfWall / numOfRows);

        styles = {
            imgWidth: imgWidth,
            imgHeight: imgHeight,
        }
        
        // resizeEvent = (('onorientationchange' in window) && app.isAndroid) ? 'orientationchange' : 'resize';

        this.element = setup.createWall(styles);
        this.element.id = options.id;
        app.utils.addClass(this.element, options.cssClass);
    };

    return Wall;
})(window);