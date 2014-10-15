var knnCanvas = document.getElementById("knn-canvas");
var knnCanvasContext = knnCanvas.getContext("2d");

var data = [
    { x: 320, y: 400, color: { r: 0, g: 255, b: 0 } }
];

function drawCanvas() {
    var canvasData = knnCanvasContext.getImageData(0, 0, knnCanvas.width, knnCanvas.height);

    for (var y = 0; y < knnCanvas.height; y++) {
        for (var x = 0; x < knnCanvas.width; x++) {
            var pixelIndex = (x + y * knnCanvas.width) * 4;

            var closestElement = data[findClosestNeighboor(x, y).index];
            canvasData.data[pixelIndex] = closestElement.color.r;
            canvasData.data[pixelIndex + 1] = closestElement.color.g;
            canvasData.data[pixelIndex + 2] = closestElement.color.b;
            canvasData.data[pixelIndex + 3] = 255;
        }
    }

    knnCanvasContext.putImageData(canvasData, 0, 0);

    for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
        var currentData = data[dataIndex];
        knnCanvasContext.rect(currentData.x - 3, currentData.y - 3, 6, 6);
        knnCanvasContext.fillStyle = "black";
        knnCanvasContext.fill();
    }
}

function placePoint(event) {
    data.push({
        x: event.clientX - knnCanvas.offsetTop,
        y: event.clientY - knnCanvas.offsetLeft,
        color: {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        }
    });

    var timeToExecute = performance.now();

    drawCanvas();

    timeToExecute = performance.now() - timeToExecute;

    console.log(data.length + " points in " + timeToExecute + "ms");
}

function findClosestNeighboor(x, y) {
    var closestElement = {
        index: 0,
        distance: Math.pow(x - data[0].x, 2) + Math.pow(y - data[0].y, 2)
    };

    for (var dataIndex = 1; dataIndex < data.length; dataIndex++) {
        var distance = Math.pow(x - data[dataIndex].x, 2) + Math.pow(y - data[dataIndex].y, 2);

        if (distance < closestElement.distance) {
            closestElement = {
                index: dataIndex,
                distance: distance
            }
        }
    }

    return closestElement;
}