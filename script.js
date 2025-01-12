let board = [0,0,0,0,0,0,0,0,0];
let count = 0;
let winPatterns = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];

// DOM manipulators
let main = document.querySelector(".main");
let page = document.querySelectorAll(".page");
let play_area = document.querySelector(".play_area");
let decision = document.querySelector(".decision");
let box = document.querySelectorAll(".box");
let p2 = document.querySelector(".p2");
let p3 = document.querySelector(".p3");
let dec_p = document.querySelector(".dec_p");
let dec_img = document.querySelector(".dec_img");
let line = document.querySelector(".line");
let clickSound = document.getElementById("clickSound");
let winSound = document.getElementById("winSound");

// Flags
let flag1 = true;   // true : X || false : O
let flag2 = true;   // toggle b/w main and container screen 
let flag3 = false;  // friend mode
let flag4 = false;  // computer mode

// image : zero
let zero = document.createElement("img");
zero.src = "assets\\zero.png";
zero.alt = "zero";

// image : cross
let cross = document.createElement("img");
cross.src = "assets\\cross.png";
cross.alt = "cross";

// image : design
let design = document.createElement("img");
design.src = "assets\\design.png";
design.alt = "cross";
design.height = 350;
design.width = 350;

// event listners for "main" screen
for(let i=0;i<page.length;i++){
    page[i].addEventListener("click",function(event){
        console.log("main page button clicked");
        clickSound.play();
        if(event.target.id=='frnd'){
            console.log("friend option clicked");
            flag3=true;
        }
        else if(event.target.id=='comp'){
            console.log("computer option clicked");
            flag4=true;
        }
        toggle();
    });
}

//event listners for "board" screen
for(let i=0;i<box.length;i++){
    box[i].addEventListener("click",function(event){
        let id = event.target.id;
        clickSound.play();
        if(!id){
            console.log("Error : wrong button clicked");
        }
        else{
            console.log(`btn ${id} was clicked`);
            if(flag3){
                playVSfrnd(id);
            }
            else if(flag4){
                playVScomp(id);
            }
        }
    });
}

// default settings
main.style.opacity = "1";
main.style.visibility = "visible"
main.style.pointerEvents = "auto";
dec_img.appendChild(design.cloneNode(true));
play_area.style.opacity = "0";
play_area.style.visibility = "hidden";
play_area.style.pointerEvents = "none";

function toggle(){
    if(flag2){
        main.style.opacity = "0";
        main.style.visibility = "hidden"
        main.style.pointerEvents = "none";
        play_area.style.opacity = "1";
        play_area.style.visibility = "visible";
        play_area.style.pointerEvents = "auto";
    }
    else{
        main.style.opacity = "1";
        main.style.visibility = "visible"
        main.style.pointerEvents = "auto";
        play_area.style.opacity = "0";
        play_area.style.visibility = "hidden";
        play_area.style.pointerEvents = "none";
    }
    flag2 = !flag2;
}

function reset_board(){
    console.log("reset board");
    flag1 = true;
    board = [0,0,0,0,0,0,0,0,0];
    count=0;
    for(let i=0;i<box.length;i++){
        if(box[i].classList.contains("img1")){
            box[i].classList.remove("img1");
        }
        if(box[i].classList.contains("img2")){
            box[i].classList.remove("img2");
        }
        while(box[i].firstChild){
            box[i].removeChild(box[i].firstChild);
        }
    }
    line.style.visibility = "hidden";
    line.style.opacity = "0";
    line.style.width = "0";
    line.style.transform = `translate(${0}px, ${0}px) rotate(${0}deg)`;
    p2.innerText = "X";
    p3.innerText = "Turn";
}

function reset_decision(){
    console.log("reset decision");
    flag3=false;
    flag4=false;
    while(dec_img.firstChild){
        dec_img.removeChild(dec_img.firstChild);
    }
    if(dec_img.classList.contains("high")){
        dec_img.classList.remove("high");
    }
}

// GAME AGAINST FRIEND
function playVSfrnd(id) {
    console.log(id);
    let temp = document.getElementById(`${id}`);
    if (!temp.hasChildNodes() && flag1) {
        temp.appendChild(cross.cloneNode(true));
        temp.classList.add("img1");
        p2.innerText = "O";
        add(id, 1);
        flag1 = false;
        count++;
        console.log(`player1 clicked : ${id} ||${board}|| count : ${count}`);
    } 
    else if (!temp.hasChildNodes() && !flag1) {
        temp.appendChild(zero.cloneNode(true));
        temp.classList.add("img2");
        p2.innerText = "X";
        add(id, -1);
        flag1 = true;
        count++;
        console.log(`player2 clicked : ${id} ||${board}|| count : ${count}`);
    }

    check(); // check if (somebody won) or (match draw) or (continue)
}

// GAME AGAINST COMPUTER
function playVScomp(id){

    if(flag1){  //user's turn
        let temp = document.getElementById(`${id}`);
        if (!temp.hasChildNodes()) {
            temp.appendChild(cross.cloneNode(true));
            temp.classList.add("img1");
            p2.innerText = "O";
            add(id, 1);
            flag1 = false;
            count++;
        }
    }

    console.log(`you clicked : ${id} ||${board}|| count : ${count}`);

    check();   // check if (somebody won) or (match draw) or (continue)
}

function computerTurn(){
    
    let bestMove = findBestMove(board);
    let comp_move = get_id(bestMove);
    let temp = document.getElementById(`${comp_move}`);
    temp.appendChild(zero.cloneNode(true));
    temp.classList.add("img2");
    p2.innerText = "X";
    add(comp_move, -1);
    flag1 = true;
    count++;
    clickSound.play();
    console.log(`Computer clicked : ${comp_move} ||${board}|| count : ${count}`);

    check(); // check if (somebody won) or (match draw) or (continue)
}

function get_id(bestMove){
    switch (bestMove){
        case 0:
            return "one";
        case 1:
            return "two";
        case 2:
            return "three";
        case 3:
            return "four";
        case 4:
            return "five";
        case 5:
            return "six";
        case 6:
            return "seven";
        case 7:
            return "eight";
        case 8:
            return "nine";
    }
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    // Priority order: Center > Corners > Edges
    const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

    for (let i=0;i<9;i++) {
        if (board[i] === 0) {
            board[i] = -1;
            let moveVal = minimax(board, 0, false);
            board[i] = 0;
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    let score = evaluate(board);
    
    // If AI wins, subtract depth for faster win
    if (score === 10) return score - depth;
    // If player wins, add depth to delay loss
    if (score === -10) return score + depth;
    
    // If the board is full, it's a draw
    if (isBoardFull(board)) return 0;
    
    // Maximizer's move (AI)
    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          board[i] = -1;
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = 0;
        }
      }
      return best;
    }
    
    // Minimizer's move (Player)
    else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          board[i] = 1;
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = 0;
        }
      }
      return best;
    }
}

function evaluate(board){
    for(let i=0;i<8;i++){
        let [a,b,c] = winPatterns[i];
        if(board[a]===board[b] && board[b]===board[c]){
            if(board[a]===-1){  //computer
                return 10;
            }
            if(board[a]===1){   //user
                return -10;
            }
        }
    }
    return countThreats(board, -1) - countThreats(board, 1);
}

function countThreats(board, player) {
    let threats = 0;
    for(let i=0;i<8;i++){
        let [a,b,c] = winPatterns[i];
        if ((board[a] === player && board[b] === player && board[c] === 0) ||
            (board[a] === player && board[c] === player && board[b] === 0) ||
            (board[b] === player && board[c] === player && board[a] === 0)){
            threats++;
        }
    }

    return threats;
}

function isBoardFull(board){
    for(let i=0;i<9;i++){
        if(board[i]===0){
            return false;
        }
    }
    return true;
}

function add(id,x){
    switch (id){
        case "one":
            board[0]=x;
            break;
        case "two":
            board[1]=x;
            break;
        case "three":
            board[2]=x;
            break;
        case "four":
            board[3]=x;
            break;
        case "five":
            board[4]=x;
            break;
        case "six":
            board[5]=x;
            break;
        case "seven":
            board[6]=x;
            break;
        case "eight":
            board[7]=x;
            break;
        case "nine":
            board[8]=x;
            break;
    }
}

function check(){  

    if(is_win(1)){
        console.log("X won");
        p2.innerText = "X";
        p3.innerText = "Won";
        reset_decision();
        dec_img.appendChild(cross.cloneNode(true));
        if (!dec_img.classList.contains("high")) {
            dec_img.classList.add("high");
        }
        dec_p.innerText = "WINNER!";
        console.log("GAME ENDED");
        play_area.style.pointerEvents = "none";
        winSound.play();
        setTimeout(toggle, 5000);
        setTimeout(reset_board, 5000);
    }

    else if(is_win(-1)){
        console.log("O won");
        p2.innerText = "O";
        p3.innerText = "Won";
        reset_decision();
        dec_img.appendChild(zero.cloneNode(true));
        if (!dec_img.classList.contains("high")) {
            dec_img.classList.add("high");
        }
        dec_p.innerText = "WINNER!";
        console.log("GAME ENDED");
        play_area.style.pointerEvents = "none";
        winSound.play();
        setTimeout(toggle, 5000);
        setTimeout(reset_board, 5000);
    }

    else if(count==9){
        console.log("Draw");
        p2.innerText = "Game";
        p3.innerText = "Over";
        reset_decision();
        dec_img.appendChild(cross.cloneNode(true));
        dec_img.appendChild(zero.cloneNode(true));
        if (!dec_img.classList.contains("high")) {
            dec_img.classList.add("high");
        }
        dec_p.innerText = "DRAW!";
        console.log("GAME ENDED");
        play_area.style.pointerEvents = "none";
        winSound.play();
        setTimeout(toggle, 5000);
        setTimeout(reset_board, 5000);
    }

    else{
        console.log("CONTINUE THE GAME");
        if(!flag1&&flag4){
            play_area.style.pointerEvents = "none";
            setTimeout(computerTurn,1000);
        } else if(flag1){
            play_area.style.pointerEvents = "auto";
        }
    }
}

function is_win(x){  

    if(x==1){
        line.style.background = "black";
    }
    else{
        line.style.background = "white";
    }

    let resp = (window.innerWidth<551)?true:false;  //responsiveness     1: resp || 0 : !resp

    // 8 possible patterns to win (3 horz, 3 vert, 2 dig)

    if(resp){   
        // HORIZONTAL WIN
        if(board[0]==x&&board[1]==x&&board[2]==x){
            set_line(0,60,0,1);
            return true;
        }
        else if(board[3]==x&&board[4]==x&&board[5]==x){
            set_line(0,180,0,1);
            return true;
        }
        else if(board[6]==x&&board[7]==x&&board[8]==x){
            set_line(0,300,0,1);
            return true;
        }
        // VERTICAL WIN
        else if(board[0]==x&&board[3]==x&&board[6]==x){
            set_line(-120,180,90,1);
            return true;
        }
        else if(board[1]==x&&board[4]==x&&board[7]==x){
            set_line(0,180,90,1);
            return true;
        }
        else if(board[2]==x&&board[5]==x&&board[8]==x){
            set_line(120,180,90,1);
            return true;
        }
        // DIAGONAL WIN
        else if(board[0]==x&&board[4]==x&&board[8]==x){
            set_line(0,180,45,1);
            return true;
        }
        else if(board[2]==x&&board[4]==x&&board[6]==x){
            set_line(0,180,135,1);
            return true;
        }
    }

    if(!resp){
        // HORIZONTAL WIN
        if(board[0]==x&&board[1]==x&&board[2]==x){
            set_line(0,80,0,0);
            return true;
        }
        else if(board[3]==x&&board[4]==x&&board[5]==x){
            set_line(0,240,0,0);
            return true;
        }
        else if(board[6]==x&&board[7]==x&&board[8]==x){
            set_line(0,400,0,0);
            return true;
        }
        // VERTICAL WIN
        else if(board[0]==x&&board[3]==x&&board[6]==x){
            set_line(-160,240,90,0);
            return true;
        }
        else if(board[1]==x&&board[4]==x&&board[7]==x){
            set_line(0,240,90,0);
            return true;
        }
        else if(board[2]==x&&board[5]==x&&board[8]==x){
            set_line(160,240,90,0);
            return true;
        }
        // DIAGONAL WIN
        else if(board[0]==x&&board[4]==x&&board[8]==x){
            set_line(0,241,45,0);
            return true;
        }
        else if(board[2]==x&&board[4]==x&&board[6]==x){
            set_line(0,241,135,0);
            return true;
        }
    }

    return false;
}

function set_line(a,b,angle,resp){

    line.style.visibility = "visible";
    line.style.opacity = "1";

    if(resp){
        line.style.height = "0.7rem";
        line.style.width = "22rem";
    }
    else{
        line.style.height = "0.8rem";
        line.style.width = "30rem";
    }
    
    line.style.transform = `translate(${a}px, ${b}px) rotate(${angle}deg)`;
}








