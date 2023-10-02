//Set grid width
var x = 10;
var rows = 1;
//char list

let string = "petescriptpetescriptpetescriptpetescript";  //qrstuvwxyz012345
let puzzle = [];
let directions = [0,0,0,0];            //up, down, left, right
let wordList = [];

const grid = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    ['U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'],
    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']
];

function populate(){
    let place = document.getElementById("puzzle");
    place.innerHTML = "";
    let lines = string.length/x;
    let stopPoint = string.length % x;
    if(stopPoint > 0){lines+=1;}
    let line = 0;
    let spot = 0;
    while(line<lines){
        for(i=0; i<x;i++){
            place.innerHTML += string.charAt(spot);
            puzzle[spot]=string.charAt(spot);
            spot++;
        }
        place.innerHTML += "<br />";
        line+=1;
    }
    puzzle.length = string.length;
}

function init(){
    wordList.length = 0;
    populate();
    generateAllPossibleWords();
}

function isValidMove(x, y, prevX, prevY) {
    // Parameters:
    // x, y: Current coordinates of the cell we want to move to.
    // prevX, prevY: Coordinates of the previous cell we moved from.

    // Check if the new coordinates (x, y) are within the grid boundaries (0 to 9).
    // Also, check if the move is within a distance of 1 cell in both horizontal and vertical directions.
    // Disallow diagonal moves by ensuring that either x or y must be the same as prevX or prevY, respectively.
    return x >= 0 && x < 10 && y >= 0 && y < 10 && ((x === prevX && Math.abs(y - prevY) === 1) || (y === prevY && Math.abs(x - prevX) === 1));
}


function dfs(grid, visited, x, y, path, result) {
    visited[x][y] = true;
    path.push(grid[x][y]);

    if (path.length >= 2 && path.length <= length) {
        result.add(path.join(''));
    }


    const directions = [-1, 0, 1];
    for (const dx of directions) {
        for (const dy of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (isValidMove(newX, newY, x, y) && !visited[newX][newY]) {
                dfs(grid, visited, newX, newY, path, result);
            }
        }
    }

    if (path.length <= length) {
        const directions = [-1, 0, 1];
        for (const dx of directions) {
            for (const dy of directions) {
                const newX = x + dx;
                const newY = y + dy;
                if (isValidMove(newX, newY, x, y) && !visited[newX][newY]) {
                    dfs(grid, visited, newX, newY, path, result, length);
                }
            }
        }
    }

    visited[x][y] = false;
    path.pop();
}

function generateCombinations(grid) {
    const result = new Set();

    for (let length = 5; length <= 100; length++) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const visited = Array.from(Array(10), () => Array(10).fill(false));
                dfs(grid, visited, i, j, [], result, length);
            }
        }
    }

    return Array.from(result);
}

// Example usage:


const combinations = generateCombinations(grid);
console.log(combinations);


function checkLibrary(){
    const start = performance.now();
    let normal = document.getElementById("normal-check").checked;
    let out = document.getElementById("output");
    out.innerHTML = "";
    let trouble = document.getElementById("bad-output");
    trouble.innerHTML = "";
    let bad = 0;
    let total = 0;
    if(normal){
        wordList.forEach(element => {
            for(var i = 0; i<library.length;i++){
                if(element == library[i]){
                    //console.log(`YES! The found word is: ${element}`);
                    out.innerHTML += `Found: ${element} <br>`;
                    total++;
                }
            }
        });
    }
    else{
        out.innerHTML = "Normal not checked";
    }
    wordList.forEach(element => {
        for(var i = 0; i<library2.length;i++){
            if(library2[i].length<6){
                if(element.toUpperCase() == library2[i].toUpperCase()){
                    //console.log(`YES! The found word is: ${element}`);
                    trouble.innerHTML += `Found: ${element} <br>`;
                    bad++;
                }
            }
        }
    });
    trouble.innerHTML += `${bad} bad words found.`;
    out.innerHTML += `${total} words found.`;
    const elapsed = (performance.now() - start);
    document.getElementById("performance").innerHTML = `Time taken: ${elapsed/1000} seconds`;
}
//  length = 3 
//  Node1 = 0       generate directions [-8, 8, -1, 2]      Possible Directions [8, 2]       Secondary Nodes    [8, 2]      generate directions for 8  [0, 16, 7, 9]    Possible [16, 9]
//                                                                                                                          generate directions for 2  [-6, 10, 1, 3]   Possible [10, 1, 3]

function addRow(){
    rows++;
    let label = document.createElement("LABEL");
    label.innerHTML = `Row ${rows}: `;
    let k = document.createElement("input");
    let br = document.createElement("br");
    let g = document.getElementById("puzzle-create");
    g.appendChild(br);
    g.appendChild(label);
    g.appendChild(k);
}

function update(){
    let container = document.getElementById("puzzle-create");
    let all = container.getElementsByTagName("input");
    string = "";
    for(let i=0; i<all.length; i++){
        string += all[i].value;
    }
    if(all.length>1){
        [...all].forEach(setRowLength);
    }
    init();
    document.getElementById("output").innerHTML = "Updated";
    document.getElementById("bad-output").innerHTML = "Clear";
}

function setRowLength(item, index){
    if(index==0){
        x=item.value.length;
    }
    else if(index>0){
        if(item.value.length!=x){alert("Rows must be same length");}
    }
}