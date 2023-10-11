//Set grid width
var rowLength = 10;
var rows = 1;
//char list

let directions = [0,0,0,0];            //up, down, left, right
let wordList = [];

const grid = [
    ['A', 'P', 'P', 'L', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['D', 'I', 'S', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    ['U', 'V', 'C', 'A', 'Y', 'E', 'N', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'R', 'I', 'J', 'I', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'D', 'I', 'T', 'S', 'V', 'W', 'X'],
    ['Y', 'Z', 'A', 'G', 'N', 'D', 'E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'],
    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']
];

function populate(){
    let place = document.getElementById("puzzle");
    place.innerHTML = "";
    let line = 0;
    while(line<grid.length){
        for(let i=0; i<grid[line].length;i++){
            place.innerHTML += grid[line][i];
        }
        place.innerHTML += "<br />";
        line+=1;
    }
}

function init(){
    const start = performance.now();
    wordList.length = 0;
    populate();
    wordList = generateCombinations(grid);
    spitOutTheWords(wordList);
    console.log(wordList.length + " number words");
    console.log(wordList);
    const elapsed = (performance.now() - start);
    document.getElementById("performance").innerHTML = `Time taken: ${elapsed/1000} seconds`;
}

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
    const rows = all.length;
    const cols = all[0].value.toString().length;

    for(let i=0; i<rows; i++){
        grid[i] = new Array(cols).fill('');
        for(let j=0;j<cols;j++){
            console.log(grid);
            grid[i][j] = all[i].value.charAt(j);
        }
        grid[i].length = cols;
    }

    if(all.length>1){
        [...all].forEach(setRowLength);
    }

    console.log(grid);
    init();
    document.getElementById("output").innerHTML = "Updated";
    document.getElementById("bad-output").innerHTML = "Clear";
    
}

function setRowLength(item, index){
    if(index==0){
        rowLength=item.value.length;
    }
    else if(index>0){
        if(item.value.length!=rowLength){alert("Rows must be same length");}
    }
}

function generateCombinations(grid) {
    //alert("entered");
    const result = new Set();
    const dictionaryTrie = new Trie();

    let count = 0;
    // Insert words from the dictionary into the dictionaryTrie
    for (const word of library) {
        dictionaryTrie.insert(word);
        count++;
    }

    console.log(count + " dictionary words");
    //depth-first-search function, recursive

    function dfs(row, col, path, length, visited) {
           visited[row][col] = true;

            const currentCombination = path.join('');

            if (path.length >= 5 && path.length <= length && dictionaryTrie.isWord(currentCombination)) {
                result.add(currentCombination);
            }

            if (path.length < length) {
                const directions = [-1, 0, 1];
                for (const dx of directions) {
                    for (const dy of directions) {
                        const newX = row + dx;
                        const newY = col + dy;
                        if (isValidMove(newX, newY, row, col) && !visited[newX][newY]) {
                            const tempTest = currentCombination + grid[newX][newY];
                            if(dictionaryTrie.isAnyWordStartingWith(tempTest)){
                                dfs(newX, newY, path.concat(grid[newX][newY]), length, visited, dictionaryTrie);
                            }
                        }
                    }
                }
            }

        visited[row][col] = false;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const visited = new Array(rows);
    for (let i = 0; i < rows; i++) {
        visited[i] = new Array(cols);
        for(let j = 0; j<cols; j++) {
            visited[i][j] = false;
            console.log(visited[i][j] + " i sub j");
        }
        console.log(visited[i]);
    }
    console.log(rows*cols + " rows and cols");
    console.log(visited);
    console.log(rows + " rows and " + cols + " cols");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dfs(i, j, [grid[i][j]], rows*cols, visited, dictionaryTrie);
        }
    }

    return Array.from(result);
}

function isValidMove(row, col, prevRow, prevCol) {
    // Parameters:
    // row, col: Current coordinates of the cell we want to move to.
    // prevRow, prevCol: Coordinates of the previous cell we moved from.

    // Check if the new coordinates (row, col) are within the grid boundaries (0 to 9).
    // Also, check if the move is within a distance of 1 cell in both horizontal and vertical directions.
    // Disallow diagonal moves by ensuring that either row or col must be the same as prevRow or prevCol, respectively.
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && ((row === prevRow && Math.abs(col - prevCol) === 1) || (col === prevCol && Math.abs(row - prevRow) === 1));
}

function spitOutTheWords(list){
    let out = document.getElementById("output");
    out.innerHTML = "";
    let total = 0;
    list.forEach(element => {
        out.innerHTML += `Found: ${element} <br>`;
        total++;
    });
    let trouble = document.getElementById("bad-output");
    trouble.innerHTML = "";
    let bad = 0;
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
}

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

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie{
    constructor(){
        this.root = new TrieNode();
    }

    insert(word){
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    isAnyWordStartingWith(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return true;
    }

    isWord(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

}