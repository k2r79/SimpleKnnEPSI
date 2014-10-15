var pointRadius = 3;

var knnCanvas = document.getElementById("knn-canvas");
var knnCanvasContext = knnCanvas.getContext("2d");
var canvasData = knnCanvasContext.getImageData(0, 0, knnCanvas.width, knnCanvas.height);

var tree = new Node('V', new Point(320, 200, { r: 0, g: 255, b: 0 }), null, null);

function drawCanvas() {
    for (var y = 0; y < knnCanvas.height; y++) {
        for (var x = 0; x < knnCanvas.width; x++) {
            var pixelIndex = (x + y * knnCanvas.width) * 4;

            var closestNeighboor = findClosestNeighboor(x, y, tree, null, null).point;

            canvasData.data[pixelIndex] = closestNeighboor.color.r;
            canvasData.data[pixelIndex + 1] = closestNeighboor.color.g;
            canvasData.data[pixelIndex + 2] = closestNeighboor.color.b;
            canvasData.data[pixelIndex + 3] = 255;
        }
    }

    drawNodePointLocators(tree);

    knnCanvasContext.putImageData(canvasData, 0, 0);
}

function placePoint(event) {
    addPointToTree(new Point(event.clientX - knnCanvas.offsetTop, event.clientY - knnCanvas.offsetLeft, { r: Math.floor(Math.random() * 256), g: Math.floor(Math.random() * 256), b: Math.floor(Math.random() * 256) }));

    drawCanvas();
}

function addPointToTree(point) {
    var currentNode = tree;

    while (true) {
        if (currentNode.orientation == 'V') {
            if (point.x < currentNode.point.x) {
                if (!currentNode.leftNode) {
                    currentNode.leftNode = new Node('H', point, null, null);
                    break;
                }

                currentNode = currentNode.leftNode;
            } else {
                if (!currentNode.rightNode) {
                    currentNode.rightNode = new Node('H', point, null, null);
                    break;
                }

                currentNode = currentNode.rightNode;
            }
        } else {
            if (point.y > currentNode.point.y) {
                if (!currentNode.leftNode) {
                    currentNode.leftNode = new Node('V', point, null, null);
                    break;
                }

                currentNode = currentNode.leftNode;
            } else {
                if (!currentNode.rightNode) {
                    currentNode.rightNode = new Node('V', point, null, null);
                    break;
                }

                currentNode = currentNode.rightNode;
            }
        }
    }
}

function drawNodePointLocators(node) {
    for (var xOffset = -pointRadius; xOffset < pointRadius; xOffset++) {
        for (var yOffset = -pointRadius; yOffset < pointRadius; yOffset++) {
            var pixelIndex = ((node.point.x + xOffset) + (node.point.y + yOffset) * knnCanvas.width) * 4;

            canvasData.data[pixelIndex] = canvasData.data[pixelIndex + 1] = canvasData.data[pixelIndex + 2] = 0;
        }
    }

    if (node.leftNode) {
        drawNodePointLocators(node.leftNode);
    }

    if (node.rightNode) {
        drawNodePointLocators(node.rightNode);
    }
}

function findClosestNeighboor(x, y, node, closestNode, closestDistance) {
    var distance = Math.pow(x - node.point.x, 2) + Math.pow(y - node.point.y, 2);

    if (!closestNode || distance < closestDistance) {
        closestNode = node;
        closestDistance = distance;
    }

    if (node.orientation == 'V') {
        if (x < node.point.x) {
            return node.leftNode ? findClosestNeighboor(x, y, node.leftNode, closestNode, closestDistance) : closestNode;
        } else {
            return node.rightNode ? findClosestNeighboor(x, y, node.rightNode, closestNode, closestDistance) : closestNode;
        }
    } else {
        if (y > node.point.y) {
            return node.leftNode ? findClosestNeighboor(x, y, node.leftNode, closestNode, closestDistance) : closestNode;
        } else {
            return node.rightNode ? findClosestNeighboor(x, y, node.rightNode, closestNode, closestDistance) : closestNode;
        }
    }
}