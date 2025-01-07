//Set grid width
var rowLength = 10;
var rows = 1;
//char list

let directions = [0,0,0,0];            //up, down, left, right
let wordList = [];
let badWordList = [];

const grid = [
    ['A', 'P', 'P', 'L', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['D', 'I', 'S', 'N', 'N', 'A', 'Q', 'R', 'S', 'T'],
    ['U', 'V', 'C', 'A', 'Y', 'E', 'N', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'R', 'I', 'J', 'I', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'D', 'I', 'T', 'X', 'V', 'W', 'X'],
    ['Y', 'Z', 'A', 'G', 'N', 'D', 'E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'],
    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']
];

const greekToLatinMap = {
    0x0391: 'A', // 'Α' - Greek Alpha
    0x0392: 'B', // 'Β' - Greek Beta
    0x0395: 'E', // 'Ε' - Greek Epsilon
    0x0396: 'Z', // 'Ζ' - Greek Zeta
    0x0397: 'H', // 'Η' - Greek Eta
    0x0399: 'I', // 'Ι' - Greek Iota
    0x039A: 'K', // 'Κ' - Greek Kappa
    0x039C: 'M', // 'Μ' - Greek Mu
    0x039D: 'N', // 'Ν' - Greek Nu
    0x039F: 'O', // 'Ο' - Greek Omicron
    0x03A1: 'P', // 'Ρ' - Greek Rho
    0x03A4: 'T', // 'Τ' - Greek Tau
    0x03A5: 'Y', // 'Υ' - Greek Upsilon
    0x03A7: 'X'  // 'Χ' - Greek Chi
};

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

const dictionaryTrie = new Trie();
const badTrie = new Trie();

function loadTrie(){
    // Insert words from the dictionary into the dictionaryTrie
    let badCount = 0;
    for (const word of library) {
        dictionaryTrie.insert(word);
    }
    for (const badWord of library2){
        badTrie.insert(badWord.toUpperCase());
        badCount++;
    }
    console.log(badCount + " bad words in Trie");
}

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
    addRow();
    populate();
    loadTrie();

    wordList.length = 0;
    wordList = generateCombinations(grid, dictionaryTrie);

    badWordList.length = 0;
    badWordList = generateCombinations(grid, badTrie);

    spitOutTheWords();

    const elapsed = (performance.now() - start);
    document.getElementById("performance").innerHTML = `Time taken: ${elapsed/1000} seconds`;
}

function updateGridSize(){
    let firstRow = false;
    resetRows();
    const defaultSize = document.getElementById("grid-size");
    let rowCount = parseInt(defaultSize.value, 10);
    for(let i = 0; i<rowCount; i++){
        if(i == 0){
            firstRow = true;
        }
        else{
            firstRow = false;
        }
        addRow(firstRow);
    }
    rows = rowCount;
}

function resetRows(){
    let g = document.getElementById("puzzle-create");
    // Clear all children explicitly
    while (g.firstChild) {
        g.removeChild(g.firstChild);
    }
    rows = 0;
}

function addRow(fr){
    rows++;
    let label = document.createElement("LABEL");
    label.innerHTML = `Row ${rows}: `;
    let k = document.createElement("input");
    let br = document.createElement("br");
    let g = document.getElementById("puzzle-create");
    if(!fr){g.appendChild(br);}
    g.appendChild(label);
    g.appendChild(k);
}

function update(){
    let container = document.getElementById("puzzle-create");
    const all = container.getElementsByTagName("input");
    const rows = all.length;
    const cols = all[0].value.toString().length;
    console.log( rows + " update rows and " + cols + " cols" );

    let equal = true;

    var lengths = Array.from(all).map(function(input) {
        return input.value.length;
    });

    var areAllEqual = lengths.every(function(length) {
        return length === lengths[0];
    });

    equal = areAllEqual ? true : false;

    if(equal){
        
        grid.length = rows;

        for(let i=0; i<rows; i++){
            grid[i] = new Array(cols).fill('');
        }
        for(let i=0; i<grid.length; i++){
            for(let j=0;j<cols;j++){
                grid[i][j] = all[i].value.charAt(j);
            }
        }

        sanitizeGrid();

        populate();

        wordList.length = 0;
        wordList = generateCombinations(grid, dictionaryTrie);

        badWordList.length = 0;
        badWordList = generateCombinations(grid, badTrie);

        document.getElementById("output").innerHTML = "Updated";
        document.getElementById("bad-output").innerHTML = "Clear";

        //console.log(grid[0][5].charCodeAt(0) + " char");

        showResults();
    }
    else{

        alert("Rows must be the same length");

        document.getElementById("output").innerHTML = "Error";
        document.getElementById("bad-output").innerHTML = "Error";
    }
}

function sanitizeGrid() {
    const greekRegex = /[\u0391-\u03A9]/;

    // Check the grid for any Greek characters
    const hasGreekCharacter = grid.some(row =>
        row.some(char => greekRegex.test(char))
    );

    if (hasGreekCharacter) {
        console.log("Treasure found! There is a Greek character in the grid.");
        alert("Your puzzle contains Greek Character Look-Alikes.  They will be replaced with Latin Equivalents.")
    } else {
        console.log("No treasure here. No Greek characters in the grid.");
    }

    // Map the grid to sanitizedGrid, replacing Greek characters with their corresponding Latin characters
    const sanitizedGrid = grid.map(row =>
        row.map(char => {
            const charCode = char.codePointAt(0); // Get the Unicode code point of the character
            console.log(`Processing character: ${char} (Unicode: ${charCode})`);

            // Use the code point to lookup in the map
            if (greekToLatinMap[charCode]) {
                console.log(`Greek character detected: ${char} -> ${greekToLatinMap[charCode]}`);
            }
            return greekToLatinMap[charCode] || char; // Replace if there's a map, else keep the character
        })
    );

    // Replace each element in the grid with the corresponding element from sanitizedGrid
    grid.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            row[colIndex] = sanitizedGrid[rowIndex][colIndex];
        });
    });
}

function generateCombinations(grid, dictTrie) {
    const result = new Set();
    //depth-first-search function, recursive

    function dfs(row, col, path, length, visited) {
        visited[row][col] = true;

        const currentCombination = path.join('');
        
        if(dictTrie.isWord(currentCombination)){
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
                        if(dictTrie.isAnyWordStartingWith(tempTest)){
                            dfs(newX, newY, path.concat(grid[newX][newY]), length, visited, dictTrie);
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
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dfs(i, j, [grid[i][j]], rows*cols, visited, dictTrie);
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

function spitOutTheWords(){
    let out = document.getElementById("output");
    out.innerHTML = "";
    let total = 0;

    const bigOnly = document.getElementById("normal-check").checked;

    wordList.forEach(element => {
        if(bigOnly){
            if(element.length>=5){
                out.innerHTML += `${element} <br>`;
                total++;
            }
        }
        else{
            out.innerHTML += `${element} <br>`;
            total++;
        }
    });

    let trouble = document.getElementById("bad-output");
    trouble.innerHTML = "";
    let bad = 0;
    badWordList.forEach(element => {
        trouble.innerHTML += `${element} <br>`;
        bad++;
    });

    out.innerHTML += `${total} words found`;
    trouble.innerHTML += `${bad} bad words found`;
}

function showResults(){
    spitOutTheWords();
}
//  length = 3 
//  Node1 = 0       generate directions [-8, 8, -1, 2]      Possible Directions [8, 2]       Secondary Nodes    [8, 2]      generate directions for 8  [0, 16, 7, 9]    Possible [16, 9]
//                                                                                                                          generate directions for 2  [-6, 10, 1, 3]   Possible [10, 1, 3]


document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("normal-check").addEventListener("click", function() {
        console.log("changed");
        showResults()
    });
});

