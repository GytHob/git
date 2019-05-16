

var _stage;
var _canvas;

var _img;
var _mouse;

var _puzzleWidth;
var _puzzleHeight;

var _pieces;
var _currentPiece;

var _currentLevel;

// var click = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';

function init() {
    _img = new Image();
    _img.addEventListener('load', onImage, false);
    _currentLevel = 5;
    _img.src = _currentLevel + ".jpg";
}

function onImage() {
    _puzzleWidth = 900;
    _puzzleHeight = _puzzleWidth * _img.height / _img.width;
    setCanvas();
    initPuzzle();
}

function setCanvas() {
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "1px solid black";
}

function initPuzzle() {
    _pieces = [];
    _mouse = {x: 0, y: 0};
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleWidth * _img.height / _img.width);
    // createTitle("Click to Start Puzzle");
    buildPieces();
}

function createTitle(msg) {
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .4;
    _stage.fillRect(100, _puzzleHeight - 40, _puzzleWidth - 200, 40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg, _puzzleWidth / 2, _puzzleHeight - 20);
}

function buildPieces() {
    // 1 = "1000x1778"
    w = _puzzleWidth;
    var h = _puzzleWidth * 1.778;

    switch (_currentLevel) {
        case 1:
            h = _puzzleWidth * 1.778;
            _pieces = [{x:0.49*w, y:0.64*h, r:0.15*w}, {x:0.88*w, y:0.67*h, r:0.1*w}, {x:0.48*w, y:0.33*h, r:0.04*w}, {x:0.26*w, y:0.2*h, r:0.05*w}, {x:0.94*w, y:0.3*h, r:0.15*w}];
            break;
        case 2:
            h = _puzzleWidth * (3024/4032);
            _pieces = [{x:0.02*w, y:0.57*h, r:0.05*w}, {x:0.50*w, y:0.55*h, r:0.04*w}, {x:0.45*w, y:0.21*h, r:0.04*w}, {x:0.84*w, y:0.93*h, r:0.03*w}, {x:0.16*w, y:0.32*h, r:0.1*w}];
            break;
        case 3:
            h = _puzzleWidth * (4032/3024);
            _pieces = [{x:0.06*w, y:0.45*h, r:0.04*w}, {x:0.25*w, y:0.32*h, r:0.06*w}, {x:0.547*w, y:0.407*h, r:0.12*w}, {x:0.92*w, y:0.856*h, r:0.07*w}, {x:0.53*w, y:0.96*h, r:0.14*w}];
            break;
        case 4:
            h = _puzzleWidth * (495/880);
            _pieces = [{x:0.89*w, y:0.71*h, r:0.07*w}, {x:0.50*w, y:0.44*h, r:0.02*w}, {x:0.60*w, y:0.635*h, r:0.04*w}, {x:0.68*w, y:0.92*h, r:0.1*w}, {x:0.75*w, y:0.08*h, r:0.05*w}];
            break;
        case 5:
            h = _puzzleWidth * (1440/1080);
            _pieces = [{x:0.056*w, y:0.236*h, r:0.03*w}, {x:0.347*w, y:0.66*h, r:0.03*w}, {x:0.66*w, y:0.07*h, r:0.1*w}, {x:0.265*w, y:0.88*h, r:0.07*w}, {x:0.51*w, y:0.285*h, r:0.02*w}];
            break;
        default:
            _pieces = null;
    }

    for (var i = 0; i < _pieces.length; i++) {
        var piece = _pieces[i];
        piece.hit = false;
    }

    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
    document.onmousedown = onPuzzleClick;
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}


function onPuzzleClick(e) {
    if (e.layerX || e.layerX === 0) {
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    } else if (e.offsetX || e.offsetX === 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _currentPiece = checkPieceClicked();

    var hits = 0;
    for (var i = 0; i < _pieces.length; i++) {
        var piece = _pieces[i];
        if (piece.hit) {
            _stage.lineWidth = 2;
            _stage.strokeStyle = '#ccff00';
            _stage.beginPath();
            _stage.arc(piece.x, piece.y, piece.r, 0, 2 * Math.PI);
            _stage.stroke();
            hits++;
        }
    }

    if (hits === 5) {
        document.getElementById("test").innerHTML = "win!";
    }

    if (_currentPiece != null) {
        // _stage.clearRect(_currentPiece.x, _currentPiece.y, _pieceRadius, _pieceRadius);
        // _stage.save();
        // _stage.globalAlpha = .9;
        // _stage.drawImage(_img, _currentPiece.x, _currentPiece.y, _pieceRadius, _pieceRadius, _mouse.x - (_pieceRadius / 2), _mouse.y - (_pieceRadius / 2), _pieceRadius, _pieceRadius);
        // _stage.restore();
    }
}

function checkPieceClicked() {
    var i;
    var hits = 0;
    var piece;

    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        if (piece.hit) {
            hits++;
        }
    }

    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];

        var a = _mouse.x - piece.x;
        var b = _mouse.y - piece.y;
        var c = Math.sqrt( a*a + b*b );

        if (c > piece.r) {
            //PIECE NOT HIT
        } else {
            piece.hit = true;
            return piece;
        }
    }

    return null;
}
