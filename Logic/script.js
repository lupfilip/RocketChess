var pieceImage = "./Media/Images/Pieces/";
var piece = [
    "SideWallWhite.png", "SupporterWhite.png", "SideWallWhite.png", "GoalPostWhite.png", "CaptainWhite.png", "ball.png", 
    "SideWallBlack.png", "SupporterBlack.png", "SideWallBlack.png", "GoalPostBlack.png", "CaptainBlack.png", "ball.png"
];

var square = document.getElementsByClassName("square");
var transfer;
var placer;
var turn = false;
var goalCount = [0, 0];
var turnCount = 1;

function createBoard() {
    var board = document.getElementById("board");
    board.innerHTML = "";

    for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
            var square;
            if((i + j) % 2 == 0)
                square = "<div class='square dark' id='"+(j+i*8)+"'></div>";
            else 
                square = "<div class='square light' id='"+(j+i*8)+"'></div>";

            board.innerHTML += square;
        }
    }
}

function setBorders() {
    var board = document.getElementById("board");

    for(var i = 0; i <= 7; i++) {
        var pieceIMG = "";
        if(i < 4)
            pieceIMG = "<img class='contain100 static pawnWhite' src='"+pieceImage + piece[6 * (i >= 4)]+"' alt='piece'>";
        else 
            pieceIMG = "<img class='contain100 static pawnBlack' src='"+pieceImage + piece[6 * (i >= 4)]+"' alt='piece'>";
        board.children[i * 8].innerHTML = pieceIMG;
        board.children[i * 8 + 7].innerHTML = pieceIMG;
    }

    for(var i = 0; i <= 1; i++) {
        var pieceIMG = "<img class='contain100 static rook' src='"+pieceImage + piece[3 + 6 * i]+"' alt='piece'>";
        board.children[2 + 56 * i].innerHTML = pieceIMG;
        board.children[5 + 56 * i].innerHTML = pieceIMG;
        var pieceIMG = "<img class='contain100 static bishop' src='"+pieceImage + piece[2 + 6 * i]+"' alt='piece'>";
        board.children[1 + 56 * i].innerHTML = pieceIMG;
        board.children[6 + 56 * i].innerHTML = pieceIMG;
        var pieceIMG = "<img class='contain100 static goal' src='"+pieceImage+"goal.png' alt='piece'>";
        board.children[3+i].innerHTML = pieceIMG;
        board.children[i + 59].innerHTML = pieceIMG;
    }
}

function startPos(onTurn) {
    turn = onTurn;
    var board = document.getElementById("board");

    board.children[18].innerHTML = "<img class='white contain90 piece knight' src='"+pieceImage + piece[1]+"' alt='piece'>";
    board.children[21].innerHTML = "<img class='white contain90 piece knight' src='"+pieceImage + piece[1]+"' alt='piece'>";
    board.children[45].innerHTML = "<img class='black contain90 piece knight' src='"+pieceImage + piece[7]+"' alt='piece'>";
    board.children[42].innerHTML = "<img class='black contain90 piece knight' src='"+pieceImage + piece[7]+"' alt='piece'>";
    board.children[12].innerHTML = "<img class='white contain90 piece queen' src='"+pieceImage + piece[4]+"' alt='piece'>";
    board.children[51].innerHTML = "<img class='black contain90 piece queen' src='"+pieceImage + piece[10]+"' alt='piece'>";
    
    if(onTurn)
        board.children[36].innerHTML = "<img class='contain80 ball' src='"+pieceImage+"ball.png' alt='piece'>";
    else 
        board.children[27].innerHTML = "<img class='contain80 ball' src='"+pieceImage+"ball.png' alt='piece'>";
}

function knightMovement(index) {
    var moves = [];
    for(var i = -2; i <= 2; i+=2) {
        if(i == 0) continue;
        moves.push(index + 8 * i + 1);
        moves.push(index + 8 * i - 1);
        moves.push(index + i + 8);
        moves.push(index + i - 8);
    }

    return moves;
}

function queenMovement(index) {
    var moves = [];
    for(var i = 1; i <= 7; i++) {
        moves.push(index + 8 * i + i);
        moves.push(index + 8 * i - i);
        moves.push(index + i);
        moves.push(index + 8 * i);
        moves.push(index - 8 * i + i);
        moves.push(index - 8 * i - i);
        moves.push(index - i);
        moves.push(index - 8 * i);
    }

    return moves;
}

function ballMove(index, depthStart, depth, dir, dirStart) {
    var moves = [];
    var bonus = [-9, -8, -7, -1, 1, 7, 8, 9, 0];

    switch (dir) {
        case 0:
            if(depth > 0) {
                if(square[index - 9].hasChildNodes()) {
                    if(square[index - 9].children[0].classList.contains("knight") || 
                    square[index - 9].children[0].classList.contains("rook") ||
                    square[index - 9].children[0].classList.contains("pawnBlack"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index - 9].children[0].classList.contains("queen") || 
                    square[index - 9].children[0].classList.contains("bishop") ||
                    square[index - 9].children[0].classList.contains("pawnWhite")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 7, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 7, dirStart);
                    }
                    else if(square[index - 9].children[0].classList.contains("goal"))
                        moves.push(index - 9);
                }
                else 
                    moves = ballMove(index - 9, depthStart, depth - 1, 0, dirStart);
            }
            else moves.push(index);
            break;
        case 1:
            if(depth > 0) {
                if(square[index - 8].hasChildNodes()) {
                    if(square[index - 8].children[0].classList.contains("knight") || 
                    square[index - 8].children[0].classList.contains("bishop"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index - 8].children[0].classList.contains("queen") || 
                    square[index - 8].children[0].classList.contains("rook")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 6, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 6, dirStart);
                    }
                    else if(square[index - 8].children[0].classList.contains("goal"))
                        moves.push(index - 8);
                }
                else 
                    moves = ballMove(index - 8, depthStart, depth - 1, 1, dirStart);
            }
            else moves.push(index);
            break;
        case 2:
            if(depth > 0) {
                if(square[index - 7].hasChildNodes()) {
                    if(square[index - 7].children[0].classList.contains("knight") || 
                    square[index - 7].children[0].classList.contains("rook") ||
                    square[index - 7].children[0].classList.contains("pawnBlack"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index - 7].children[0].classList.contains("queen") || 
                    square[index - 7].children[0].classList.contains("bishop") ||
                    square[index - 7].children[0].classList.contains("pawnWhite")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 5, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 5, dirStart);
                    }
                    else if(square[index - 7].children[0].classList.contains("goal"))
                        moves.push(index - 7);
                }
                else 
                    moves = ballMove(index - 7, depthStart, depth - 1, 2, dirStart);
            }
            else moves.push(index);
            break;
        case 3:
            if(depth > 0) {
                if(square[index - 1].hasChildNodes()) {
                    if(square[index - 1].children[0].classList.contains("knight") ||
                    square[index - 1].children[0].classList.contains("pawnWhite") ||
                    square[index - 1].children[0].classList.contains("pawnBlack"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index - 1].children[0].classList.contains("queen")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 4, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 4, dirStart);
                    }
                    else if(square[index - 1].children[0].classList.contains("goal"))
                        moves.push(index - 1);
                }
                else 
                    moves = ballMove(index - 1, depthStart, depth - 1, 3, dirStart);
            }
            else moves.push(index);
            break;
        case 4:
            if(depth > 0) {
                if(square[index + 1].hasChildNodes()) {
                    if(square[index + 1].children[0].classList.contains("knight") ||
                    square[index + 1].children[0].classList.contains("pawnWhite") ||
                    square[index + 1].children[0].classList.contains("pawnBlack"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index + 1].children[0].classList.contains("queen")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 3, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 3, dirStart);
                    }
                    else if(square[index + 1].children[0].classList.contains("goal"))
                        moves.push(index + 1);
                }
                else 
                    moves = ballMove(index + 1, depthStart, depth - 1, 4, dirStart);
            }
            else moves.push(index);
            break;
        case 5:
            if(depth > 0) {
                if(square[index + 7].hasChildNodes()) {
                    if(square[index + 7].children[0].classList.contains("knight") || 
                    square[index + 7].children[0].classList.contains("rook") ||
                    square[index + 7].children[0].classList.contains("pawnWhite"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index + 7].children[0].classList.contains("queen") || 
                    square[index + 7].children[0].classList.contains("bishop") ||
                    square[index + 7].children[0].classList.contains("pawnBlack")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 2, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 2, dirStart);
                    }
                    else if(square[index + 7].children[0].classList.contains("goal"))
                        moves.push(index + 7);
                }
                else 
                    moves = ballMove(index + 7, depthStart, depth - 1, 5, dirStart);
            }
            else moves.push(index);
            break;
        case 6:
            if(depth > 0) {
                if(square[index + 8].hasChildNodes()) {
                    if(square[index + 8].children[0].classList.contains("knight") || 
                    square[index + 8].children[0].classList.contains("bishop"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index + 8].children[0].classList.contains("queen") || 
                    square[index + 8].children[0].classList.contains("rook")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 1, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 1, dirStart);
                    }
                    else if(square[index + 8].children[0].classList.contains("goal"))
                        moves.push(index + 8);
                }
                else 
                    moves = ballMove(index + 8, depthStart, depth - 1, 6, dirStart);
            }
            else moves.push(index);
            break;
        case 7:
            if(depth > 0) {
                if(square[index + 9].hasChildNodes()) {
                    if(square[index + 9].children[0].classList.contains("knight") || 
                    square[index + 9].children[0].classList.contains("rook") ||
                    square[index + 9].children[0].classList.contains("pawnWhite"))
                        moves = ballMove(index, depthStart, depth, 8, dirStart);
                    else if(square[index + 9].children[0].classList.contains("queen") || 
                    square[index + 9].children[0].classList.contains("bishop") ||
                    square[index + 9].children[0].classList.contains("pawnBlack")) {
                        if(depthStart === depth)
                            moves = ballMove(index, depthStart, depth, 8, dirStart);
                        else if(dir !== dirStart)
                            moves = ballMove(index, depthStart, depth - 1, 0, dirStart);
                        else
                            moves = ballMove(index, depthStart, depth, 0, dirStart);
                    }
                    else if(square[index + 9].children[0].classList.contains("goal"))
                        moves.push(index + 9);
                }
                else 
                    moves = ballMove(index + 9, depthStart, depth - 1, 7, dirStart);
            }
            else moves.push(index);
            break;
        case 8:
            let found = false;
            if(depth > 0) {
                for(let i = 0; i < 8; i++) {
                    if(!square[index + bonus[i]].hasChildNodes()) {
                        found = true;
                        let result = ballMove(index, depthStart, depth, i, i);
                        for(let j = 0; j < result.length; j++) {
                            if(moves.includes(result[j])) continue;
                            else moves.push(result[j]);

                        }
                    }
                    else if(square[index + bonus[i]].children[0].classList.contains("goal")) {
                        moves.push(index + bonus[i]);
                    }
                }

                if(!found) {
                    if(square[index].hasChildNodes()) {
                        for(let i = 0; i < 8; i++) {
                            if(index + bonus[i] * 2 < 0 || index + bonus[i] * 2 >= 64) continue;
                            if(!square[index + bonus[i] * 2].hasChildNodes()) {
                                let result = ballMove(index + bonus[i] * 2, depthStart, depth - 1, i, i);
                                for(let j = 0; j < result.length; j++) {
                                    if(moves.includes(result[j])) continue;
                                    else moves.push(result[j]);
        
                                }
                            }
                        }
                    }
                    else
                        moves.push(index);
                }
            }
            else moves.push(index);
            break;
        default:
            break;
    }

    return moves;
}

window.onload = function() {
    function clearHighlight() {
        for(var i = 0; i < 64; i++) {
            if(square[i].hasChildNodes()) {
                if(square[i].children[0].classList.contains("piece")) {
                    square[i].addEventListener("click", selectSquare);
                }

                if(square[i].children[0].classList.contains("move")) {
                    square[i].innerHTML = "";
                }
                else if(square[i].classList.contains("selected")) {
                    square[i].classList.remove("selected");
                }
            }
            else {
                if(square[i].classList.contains("selected")) {
                    square[i].classList.remove("selected");
                    square[i].removeEventListener("click", selectSquare);
                }
                square[i].addEventListener("click", clearHighlight);
            }

            square[i].removeEventListener("click", selectMove);
        }
    }

    function place(index) {
        return function() {
            if(!square[index].hasChildNodes() && square[index].classList.contains("selected")) {
                square[index].innerHTML = placer[0];
                placer = undefined;
    
                // Remove the "selected" class and event listener after placing
    
                if (turn === true) {
                    for (let i = 0; i < 2; i++) {
                        if (!square[9 + i].hasChildNodes()) {
                            square[9 + i].classList.remove("selected");
                            square[9 + i].removeEventListener("click", place(9 + i));
                        }
                        if (!square[14 - i].hasChildNodes()) {
                            square[14 - i].classList.remove("selected");
                            square[14 - i].removeEventListener("click", place(14 - i));
                        }
                    }
                } else {
                    for (let i = 0; i < 2; i++) {
                        if (!square[49 + i].hasChildNodes()) {
                            square[49 + i].classList.remove("selected");
                            square[49 + i].removeEventListener("click", place(49 + i));
                        }
                        if (!square[54 - i].hasChildNodes()) {
                            square[54 - i].classList.remove("selected");
                            square[54 - i].removeEventListener("click", place(54 - i));
                        }
                    }
                }
                for(var i = 0; i < 64; i++) {
                    if(square[i].hasChildNodes()) {
                        if(square[i].children[0].classList.contains("piece"))
                            square[i].addEventListener("click", selectSquare);
                    }
                }
                clearHighlight();
            }
        };
    }
    
    function placePiece(piece) {
        placer = piece;
        
        if (turn === false) {
            for (let i = 0; i < 2; i++) {
                if (!square[9 + i].hasChildNodes()) {
                    square[9 + i].classList.add("selected");
                    square[9 + i].addEventListener("click", place(9 + i));
                }
                if (!square[14 - i].hasChildNodes()) {
                    square[14 - i].classList.add("selected");
                    square[14 - i].addEventListener("click", place(14 - i));
                }
            }
        } else {
            for (let i = 0; i < 2; i++) {
                if (!square[49 + i].hasChildNodes()) {
                    square[49 + i].classList.add("selected");
                    square[49 + i].addEventListener("click", place(49 + i));
                }
                if (!square[54 - i].hasChildNodes()) {
                    square[54 - i].classList.add("selected");
                    square[54 - i].addEventListener("click", place(54 - i));
                }
            }
        }
        for(let i = 0; i < 64; i++) {
            square[i].removeEventListener("click", selectSquare);
            square[i].removeEventListener("click", clearHighlight);
        }
    }

    function selectMove() {
        var copy = [this.innerHTML, this.id, this.children[0]];
        var dir = 8;

        var demo = document.createElement("div");
        demo.innerHTML = transfer[0];
        if(demo.children[0].classList.contains("ball")) {
            if(this.hasChildNodes()) {
                if(this.children[0].classList.contains("piece")) {
                    return;
                }
            }

            this.innerHTML = transfer[0];
            transfer[0] = square[parseInt(transfer[1])].innerHTML;
        }
        else {
            this.innerHTML = transfer[0];
            transfer[0] = "";
            if(turn) {
                turnCount++;
                document.getElementById("turn").innerHTML = "Turns: " + turnCount;
            }
            turn = !turn;
        }

        square[parseInt(transfer[1])].innerHTML = "";
        square[parseInt(transfer[1])].innerHTML = transfer[0];

        clearHighlight();

        if(copy[2].classList.contains("ball")) {
            for(let i = 1; i < 6; i++) {
                if(i * (-9) + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 0;
                else if(i * (-8) + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 1;
                else if(i * (-7) + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 2;
                else if(i * (-1) + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 3;
                else if(i * 1 + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 4;
                else if(i * 7 + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 5;
                else if(i * 8 + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 6;
                else if(i * 9 + parseInt(transfer[1]) === parseInt(copy[1]))
                    dir = 7;
            }

            selectBall(copy, dir);
        }
        else if(copy[2].classList.contains("piece")) {
            placePiece(copy);
        }

        if((Math.floor(parseInt(copy[1]) / 8)) % 7 == 0) {
            if(Math.floor(parseInt(copy[1]) / 8) == 7) goalCount[0]++;
            else goalCount[1]++;
            let goal = document.getElementById("goal");
            goal.innerHTML = goalCount[0] + " : " + goalCount[1];
            createBoard();
            setBorders();
            startPos(turn);

            for(var i = 0; i < 64; i++) {
                if(square[i].hasChildNodes()) {
                    if(square[i].children[0].classList.contains("piece"))
                        square[i].addEventListener("click", selectSquare);
                }
            }
        }
    }

    function selectBall(ball, dir) {
        clearHighlight();
        for(var i = 0; i < 64; i++) {
            square[i].removeEventListener("click", selectSquare);
            square[i].removeEventListener("click", selectMove);
            square[i].removeEventListener("click", clearHighlight);
        }
        transfer = [ball[0], ball[1]];
        square[parseInt(ball[1])].classList.add("selected");

        var move = [];
        
        if(square[parseInt(ball[1])].children[0].classList.contains("knight"))
            move = ballMove(parseInt(ball[1]), 3, 3, 8);
        else if(square[parseInt(ball[1])].children[0].classList.contains("queen")) {
            move = ballMove(parseInt(ball[1]), 3, 3, dir);
        }

        for(var j = 0; j < move.length; j++) {
            if(move[j] % 8 > 0 && move[j] % 8 < 7 &&
                Math.floor(move[j] / 8) >= 0 && Math.floor(move[j] / 8) <= 7) {
                    if(!square[move[j]].hasChildNodes()) {
                        square[move[j]].innerHTML += "<div class='move'></div>";
                        square[move[j]].removeEventListener("click", clearHighlight);
                    }
                    else {
                        if(square[parseInt(ball[1])].children[0].classList[0] != square[move[j]].children[0].classList[0]) {
                            square[move[j]].classList.add("selected");
                            square[move[j]].removeEventListener("click", selectSquare);
                        }
                    }
                    square[move[j]].addEventListener("click", selectMove);
                }
        }
    }
    
    function selectSquare() {
        clearHighlight();
        transfer = [this.innerHTML, this.id];
        this.classList.add("selected");

        var b = false;

        if(this.children[0].classList.contains("knight") && ((turn === false && 
        this.children[0].classList.contains("white")) || (turn === true && 
        this.children[0].classList.contains("black")
        )))
            var move = knightMovement(parseInt(this.id));
        else if(this.children[0].classList.contains("queen") && ((turn === false && 
        this.children[0].classList.contains("white")) || (turn === true && 
        this.children[0].classList.contains("black")
        ))) {
            move = queenMovement(parseInt(this.id));
            b = true;
        }

        var block = [0, 0, 0, 0, 0, 0, 0, 0];
        for(var j = 0; j < move.length; j++) {
            if(block[j % 8] != 0 && b) continue;

            if(move[j] % 8 > 0 && move[j] % 8 < 7 &&
                Math.floor(move[j] / 8) > 0 && Math.floor(move[j] / 8) < 7) {
                    if(!square[move[j]].hasChildNodes()) {
                        square[move[j]].innerHTML += "<div class='move'></div>";
                        square[move[j]].removeEventListener("click", clearHighlight);
                    }
                    else {
                        if(this.children[0].classList[0] != square[move[j]].children[0].classList[0]) {
                            square[move[j]].classList.add("selected");
                            square[move[j]].removeEventListener("click", selectSquare);
                        }
                        block[j % 8] = 1;
                    }
                    square[move[j]].addEventListener("click", selectMove);
                }
                else 
                    block[j % 8] = 1;
        }
    }


//------------


    createBoard();
    setBorders();
    startPos(false);

    for(var i = 0; i < 64; i++) {
        if(square[i].hasChildNodes()) {
            if(square[i].children[0].classList.contains("piece"))
                square[i].addEventListener("click", selectSquare);
        }
    }
}