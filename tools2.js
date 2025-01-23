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

function populate() {
    const place = document.getElementById("puzzle");
    place.innerHTML = ""; // Clear existing content

    grid.forEach((row, rowIndex) => {
        const rowDiv = document.createElement("div"); // Create a div for each row
        row.forEach((letter, colIndex) => {
            const cell = document.createElement("span");
            cell.textContent = letter; // Set the letter as the cell content
            cell.id = `cell-${rowIndex}-${colIndex}`; // Assign a unique ID using row and col
            cell.className = "puzzle-cell"; // Optional: Add a class for styling
            rowDiv.appendChild(cell); // Append the cell to the row div
        });
        place.appendChild(rowDiv); // Append the row div to the puzzle container
    });

    console.log("Puzzle grid populated with cells.");
}

function init(){
    const start = performance.now();
    updateGridSize();
    populate();
    loadTrie();

    wordList.length = 0;
    wordList = generateCombinations(grid, dictionaryTrie);

    badWordList.length = 0;
    badWordList = generateCombinations(grid, badTrie);

    spitOutTheWords();

    const elapsed = (performance.now() - start);
    document.getElementById("performance").innerHTML = `Time taken: ${(elapsed/1000).toFixed(4)} seconds`;
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
            //console.log(`Processing character: ${char} (Unicode: ${charCode})`);

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

    function dfs(row, col, path, positions, length, visited) {
        visited[row][col] = true;

        const currentCombination = path.join('');
        const currentPositions = [...positions, [row, col]];

        // If the current combination is a word, store it in the result
        if (dictTrie.isWord(currentCombination)) {
            result.add({ word: currentCombination, positions: [...currentPositions] });
        }

        // Continue exploring neighbors if the current path is shorter than the maximum length
        if (path.length < length) {
            const directions = [-1, 0, 1];
            for (const dx of directions) {
                for (const dy of directions) {
                    const newX = row + dx;
                    const newY = col + dy;

                    if (isValidMove(newX, newY, row, col) && !visited[newX][newY]) {
                        const tempTest = currentCombination + grid[newX][newY];
                        if (dictTrie.isAnyWordStartingWith(tempTest)) {
                            dfs(newX, newY, path.concat(grid[newX][newY]), currentPositions, length, visited);
                        }
                    }
                }
            }
        }

        visited[row][col] = false;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Maximum possible path length is the total number of cells in the grid
    const maxLength = rows * cols;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dfs(i, j, [grid[i][j]], [], maxLength, visited);
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

function spitOutTheWords() {
    let out = document.getElementById("output");
    let badOut = document.getElementById("bad-output");
    out.innerHTML = "";
    const titleWords = document.createElement("span");
    titleWords.id = 'good-total';
    badOut.innerHTML = "";
    const titleBad = document.createElement("span");
    titleBad.id = 'bad-total';
    let total = 0;
    let badTotal = 0;

    const bigOnly = document.getElementById("normal-check").checked;
    const excludePlurals = document.getElementById("plural-exclusion").checked; // New checkbox for excluding plurals

    wordList.forEach((entry, index) => {
        // Entry is already an object; no need to parse
        const { word, positions } = entry; 

        const isPlural = word.endsWith("S");

        if (!(excludePlurals && isPlural)) {
            //console.log(isPlural + " word is " + word);
            if (!bigOnly || word.length >= 5) {
                const wordItem = document.createElement("div");
                wordItem.textContent = `${word}`;
                wordItem.classList.add("good-hoverable-word");
                wordItem.dataset.index = index; // Store index to track hover
                out.appendChild(wordItem);
                total++;
            } 
        }
    });
    badWordList.forEach((entry, index) => {
        // Entry is already an object; no need to parse
        const { word, positions } = entry; 
            const wordItem = document.createElement("div");
            wordItem.textContent = `${word}`;
            wordItem.classList.add("bad-hoverable-word");
            wordItem.dataset.index = index; // Store index to track hover
            badOut.appendChild(wordItem);
            badTotal++;
    });
    titleWords.textContent = `${total} words found`;
    out.insertBefore(titleWords, out.firstChild);
    titleBad.textContent = `${badTotal} bad words found`;
    badOut.insertBefore(titleBad, badOut.firstChild)

    // Attach hover event listeners to handle word highlighting
    attachHoverListeners();
    attachClickListeners();
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
        showResults();
    });
    document.getElementById("plural-exclusion").addEventListener("click", function() {
        console.log("changed butts");
        showResults();
    });
});

function attachHoverListeners() {
    const goodWordElements = document.querySelectorAll(".good-hoverable-word");
    const badWordElements = document.querySelectorAll(".bad-hoverable-word");
    goodWordElements.forEach((element) => {
        const index = element.dataset.index;
        const { positions } = wordList[index];

        element.addEventListener("mouseover", () => {
            // Only apply hover highlight if the word is not clicked
            if (!element.classList.contains("clicked")) {
                highlightWord(positions, wordList[index].word, false); // Temporary highlight
                //console.log("ENTERED");
            }
        });

        element.addEventListener("mouseout", () => {
            // Clear only temporary highlights (hover effects)
            clearTemporaryHighlights();
            //console.log("LEFT");
        });
    });
    badWordElements.forEach((element) => {
        const index = element.dataset.index;
        const { positions } = badWordList[index];

        element.addEventListener("mouseover", () => {
            // Only apply hover highlight if the word is not clicked
            if (!element.classList.contains("clicked")) {
                highlightWord(positions, badWordList[index].word, false); // Temporary highlight
                //console.log("ENTERED");
            }
        });

        element.addEventListener("mouseout", () => {
            // Clear only temporary highlights (hover effects)
            clearTemporaryHighlights();
            //console.log("LEFT");
        });
    });
}

let wordClasses = {};

function highlightWord(positions, word, isPersistent) {

    let colorClass = wordClasses[word];
    if(isPersistent){
        bumpClass(colorClass);
    }
    //console.log(word);
    // If this word has no class yet, create a random class for it
    if (!colorClass) {
        colorClass = getRandomColorClass(word);
        wordClasses[word] = colorClass; // Store the class name for this word
        createRandomColorClass(colorClass); // Add the class dynamically to the CSS
    }

    positions.forEach(([row, col]) => {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
            // Mark cell as persistent if applicable
            if (isPersistent) {
                cell.classList.add(colorClass);
            }
            else if(!isPersistent){
                cell.classList.add("temp-highlight");    
            }
        }
    });
}

// function addClassToFront(element, newClass) {
//     // Check if the class already exists
//     if (element.classList.contains(newClass)) {
//         // Remove the class to re-add it at the front
//         element.classList.remove(newClass);
//     }

//     // Add the class to the front of the list
//     element.className = `${newClass} ${element.className}`.trim();
// }

function clearHighlights(positions, word) {
    positions.forEach(([row, col]) => {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
            cell.style.backgroundColor = ""; // Reset background color
            cell.classList.forEach(function(className) {
                if (className.startsWith(`${word}`)) {
                  cell.classList.remove(className);
                  console.log(className + " removed");
                }
            });
        }  
    });
}

function clearTemporaryHighlights() {
    const cells = document.querySelectorAll(".puzzle-cell");
    cells.forEach((cell) => {
        cell.classList.remove("temp-highlight"); // Reset background color
    });
    
}

function attachClickListeners() {
    const wordElements = document.querySelectorAll('[class*="hoverable-word"]');
    wordElements.forEach((element) => {
        const index = element.dataset.index;
        const { positions } = wordList[index];
        let isHighlighted = false;
        //let highlightColor = "";

        element.addEventListener("click", () => {
            console.log("CLICKED");
            if (isHighlighted) {
                // Remove persistent highlight
                console.log(wordList[index].word + " clicked");
                clearHighlights(positions, wordList[index].word); // Clear specific positions
                isHighlighted = false;
                element.style.backgroundColor = ""; // Reset word background
                element.classList.remove("clicked");
                element.classList.remove("persist-highlight");
            } else {
                // Apply persistent highlight with random color
                //highlightColor = getRandomColorClass(wordList[index].word);
                highlightWord(positions, wordList[index].word, true); // Persistent highlight
                element.classList.add("persist-highlight");
                isHighlighted = true;
            }
            var styleElement = document.getElementById("dynamic-styles");
            const sheet = styleElement.sheet;
            // console.log("Current order of dynamic stylesheet:");
            // for (let i = 0; i < sheet.cssRules.length; i++) {
            //     console.log(sheet.cssRules[i].cssText); // Output the rule's text (e.g., .colorClass { background-color: #ff0000; })
            // }
        });
    });
}

function getRandomColorClass(word) {
    const letters = 'ABCDEF0123456789'; // Ensures that values will start from 'A'
    let colorClass = `${word}-`;
    for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
            // Force the first character of each color component to be at least 'A'
            colorClass += letters[Math.floor(Math.random() * 6)]; // Only 'A' to 'F'
        } else {
            // Second character of each color component can be any valid hexadecimal digit
            colorClass += letters[Math.floor(Math.random() * 10)];
        }
    }
    return colorClass;
}

function createRandomColorClass(colorClass) {
    // Find or create a dedicated <style> block
    let styleElement = document.querySelector('#dynamic-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-styles';
        document.head.appendChild(styleElement);
    }

    // Access the stylesheet object
    const sheet = styleElement.sheet;

    // Generate a random color
    const randomColor = getRandomColor();

    // Calculate the brightness of the color
    function calculateBrightness(hexColor) {
        // Remove the '#' if it exists
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16); // Red component
        const g = parseInt(hex.slice(2, 4), 16); // Green component
        const b = parseInt(hex.slice(4, 6), 16); // Blue component

        // Use the luminance formula
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Determine font color (black or white)
    const brightness = calculateBrightness(randomColor);
    const fontColor = brightness > 128 ? 'black' : 'white';

    // Safely add or replace the rule
    try {
        // Check for and remove an existing rule for the class
        for (let i = 0; i < sheet.cssRules.length; i++) {
            if (sheet.cssRules[i].selectorText === `.${colorClass}`) {
                sheet.deleteRule(i);
                break;
            }
        }

        // Add the new rule with the determined font color
        sheet.insertRule(
            `.${colorClass} { background-color: ${randomColor}; color: ${fontColor}; }`,
            sheet.cssRules.length
        );
    } catch (e) {
        console.error('Failed to modify the stylesheet:', e);
    }

    // Optional: Log for debugging
    //console.log(`Assigned background-color: ${randomColor}, font color: ${fontColor}`);
}

function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0')}`;
}

//Last class clicked needs to be at the END of the dynamic stylesheet.
//it will be implemented ABOVE all others.

function bumpClass(prioritizedClass) {
    //prioritized means LAST on the sheet.  That's all we're doing here.
    //manifest the real rules list first
    const styleList = document.getElementById("dynamic-styles");
    const sheetOfRules = styleList.sheet;
    if(!styleList){console.log("Nothing to use!");}
    
    //create the new list from which we will make the new list.
    let stylesPresent = [];

    for(let i = 0; i< sheetOfRules.cssRules.length; i++){
        stylesPresent.push(sheetOfRules.cssRules[i].cssText);
    }

    //grabbed all present styles on the dynamic list
    //now remove them all.

    while( sheetOfRules.cssRules.length > 0 ){
        sheetOfRules.deleteRule(0);
    }
    //console.log("Deleted rules");
    //console.log(sheetOfRules);

    //things are saved, now we will reinsert them.

    //console.log("My saved contents:");
    //console.log(stylesPresent);
    //console.log("LOOKING for " + prioritizedClass);
    //console.log("are it? " + classExists(prioritizedClass, stylesPresent));
    //console.log("I got this: " + getEntireLine(prioritizedClass, stylesPresent));
    
    //the one that needs to be LAST is grabbed.
    
    const styleToAddLast = getEntireLine(prioritizedClass, stylesPresent);

    //iterate through the stylesPresent and add them to the
    //real rules list.

    stylesPresent.forEach(rule => {
        if(rule != styleToAddLast){
            sheetOfRules.insertRule(rule);
            //console.log("rule added: " + rule);
        }
    });

    //insert the important one last
    sheetOfRules.insertRule(styleToAddLast, sheetOfRules.cssRules.length);
    //console.log("rule added " + styleToAddLast);
    //console.log("success?");
    //console.log(sheetOfRules.cssRules);
}

function fetchStyleTextBySelector(selector, sheetTest) {
    // Get all stylesheets in the document
    const targetSheet = sheetTest;
    const contents = targetSheet.sheet;
    //console.log(contents.cssRules.length + " css length");
    for (let i = 0; i < contents.cssRules.length; i++) {
        const rule = contents.cssRules[i];
        //console.log("Looking for selector in fetch");
        //console.log(rule.selectorText);
        // Check if the rule matches the desired selector
        if (rule.selectorText === `.${selector}`) {
            return rule.cssText; // Return the full CSS rule text
        }
    }
    // If no match is found
    return `No style found for selector: ${selector}`;
}

function classExists(selector, styles) {
    // Loop through the array to find a match
    return styles.some(style => style.includes(selector));
}

function getEntireLine(selector, styles) {
    // Find the line that includes the given selector
    return styles.find(style => style.includes(selector)) || null;
}