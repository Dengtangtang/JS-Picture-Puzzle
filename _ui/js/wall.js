app.Wall = (function(window) {
    const numOfRows = 6;
    const numOfColumns = 7;

    // Replace the image filenames.
    const images = [
        ['transparent', 'example', 'example', 'transparent', 'example', 'example', 'transparent'],
        ['example', 'example', 'example', 'example', 'example', 'example', 'example'],
        ['example', 'example', 'example', 'example', 'example', 'example', 'example'],
        ['transparent', 'example', 'example', 'example', 'example', 'example', 'transparent'],
        ['transparent', 'transparent', 'example', 'example', 'example', 'transparent', 'transparent'],
        ['transparent', 'transparent', 'transparent', 'example', 'transparent', 'transparent', 'transparent'],
    ];

    const IMAGE_HOVERABLE_CLASS = 'hoverable';

    const setup = {
        createWall: function (options) {
            let wallDiv,
                wallTable,
                wallTr,
                wallTd,
                imgTag,
                imgName,
                img;

            wallDiv = document.createElement('div');
            wallTable = document.createElement('table');
            for (let i = 0; i < numOfRows; i++) {
                wallTr = document.createElement('tr');
                for (let j = 0; j < numOfColumns; j++) {
                    wallTd = document.createElement('td');

                    imgName = images[i][j];
                    img = '_ui/img/wall_images/' + imgName + '.jpg';
                    imgTag = document.createElement('img');
                    imgTag.width = options.imgWidth;
                    imgTag.height = options.imgHeight;
                    imgTag.src = img;
                    if (imgName === 'transparent') {
                        imgTag.style.opacity = "0";
                    } else {
                        imgTag.style.opacity = "1";
                        app.utils.addClass(imgTag, IMAGE_HOVERABLE_CLASS);
                    }

                    wallTd.appendChild(imgTag);
                    wallTr.appendChild(wallTd);
                }
                wallTable.appendChild(wallTr);
            }
            wallDiv.appendChild(wallTable);

            return wallDiv;
        }
    };

    return function (options) {
        const clientDimensions = app.utils.getClientDimensions();

        const widthOfWall = options.width || ((clientDimensions.x > 700) ? 700 : clientDimensions.x);
        const heightOfWall = options.height || widthOfWall / 1.5;  // because it is a square
        const imgWidth = (widthOfWall / numOfColumns);
        const imgHeight = (heightOfWall / numOfRows);

        const styles = {
            imgWidth: imgWidth,
            imgHeight: imgHeight,
        };

        // resizeEvent = (('onorientationchange' in window) && app.isAndroid) ? 'orientationchange' : 'resize';

        this.element = setup.createWall(styles);
        this.element.id = options.id;
        app.utils.addClass(this.element, options.cssClass);
    };
})(window);