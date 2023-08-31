//Set grid width
var x = 8;
var rows = 1;
//char list

let string = "abtsefghiutlmnopqrstuvwxyznoedcf";  //qrstuvwxyz012345
let puzzle = [];
let directions = [0,0,0,0];            //up, down, left, right
let wordList = [];

//library exists in words.js

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

function generateAllPossibleWords(){

    // 0  1  2  3  4  5  6  7
    // 8  9  10 11 12 13 14 15
    // 16 17 18 19 20 21 22 23
    // 24 25 26 27 28 29 30 31
    // 32 33 34 35 36 37 38 39

    //if you are in the first column, i%x should be 0
    //if you are in the last column, i%x should be x-1

    //if you are in the top row, i<x
    //if you are in the bottom row, i>puzzle.length-x

    //available function - checks availability of the next location
    //
    // check function:
    //      if i-x < 0                  <-- checks "top"
    //      if i+x >= puzzle.length      <-- checks "bottom"
    //      if (i-1)%x == x-1;          <-- checks left
    //      if (i+1)%x == 0;            <-- checks right
    //
    //      each condition must be false in order to allow it
    //
    //requires list of all indexes and true/false for each.
    //if the index has been used then choose the next available index.
    //requires that the pattern have not been used before.  Incrementing
    //the index is only one way of doing it.  So, we should build a list
    //of index walks that can be checked each time and wipe it once the
    //total walks have been completed.

    //turns are either straight, left, or right.  All possible paths are
    //either +x, -x, +1 or -1
    //backwards is not permitted
    //example (word length 5):
    //Start at 5, x=8
    //      5, 6,   14, 15, 23
    //      i, +1,  +x, +1, +x
    //      5, 4,   12, 11, 10
    //      i, -1,  +x, -1, -1
    //example (word length 5):
    //start at 27, x=8
    //      27, 19, 11,  3,  2
    //      i,  -x, -x, -x, -1
    //      27, 19, 18, 17, 16
    //      i,  -x, -1, -1, -1

    //somehow the sequence needs to be saved.  How does the script know when all
    //possible sequences for a location have been exhausted?
    //When all unique sequences to the last possible sequence are created it can
    //be ended.
    //Sequences should be saved in an array and checked each time to see if the
    //next attempt is possible.
    //Store the current sequence so that you cannot repeat indexes.
    
    //1: Identify all possible base directions based on initial location.
    //2: Move to each possible directions and identify all possible next directions based on the new position
    //3: Move to the next position and so on.

    //Each position is a Node.  From the start Node, you must proceed word.length Nodes.  When each node is assessed, the directions of the next node are determined.
    //Sequences for each next-node possibility must be created.
    //Construct a primary array based on all possible node directions from the primary node.
    //Proceed to the first secondary node and build the first secondary array within the first index of the primary array based on all possible node directions from the secondary node.
    //Proceed to the tertiary node... etc.
    //When the final node is complete, back up with the full first tertiary array to the secondary node and create the second secondary array

    
    let word;
    let node1 = [];
    let node1Directions = [0,0,0,0];
    let node2 = [];
    let node2Directions = [0,0,0,0];
    let node3 = [];
    let node3Directions = [0,0,0,0];
    let node4 = [];
    let node4Directions = [0,0,0,0];
    let node5 = [];
    let note5Directions = [0,0,0,0];
    let node6 = [];
    let node7 = [];
    let node8 = [];
    let rawList = [];

    //node1 goes with i
    //node2 goes with j
    //node3 goes with k
    //node4 goes with m
    //node5 goes with n

    //i initialization for node 1

    //out of bounds is anything that goes beyond an edge.  You need to know where you are and where you will be due to left and right.
    //where you are is the previous node
    //where you will be is the current direction selection

    let l1,l2,l3,l4,l5;
    let n1,n2,n3,n4,n5;

    for(var i=0;i<puzzle.length;i++){           
        node1[i]=i;
        l1 = i;
        //j initialization for node 2
        for(var j = 0; j<4; j++){
            //if its the first instance, generate the directions
            if(j==0){
                generateDirections(l1,node1Directions);
            }
            //check the direction to see if its not out of bounds
            if(!outOfBounds(l1, node1Directions[j])){
                node2[j]=node1Directions[j];
                    //simplify the location of the current node
                l2 = node2[j];
                //k initialization for node 3
                for(var k = 0; k<4; k++){

                    if(k==0){
                        generateDirections(l2,node2Directions);
                    }
                    if(!outOfBounds(l2,node2Directions[k])&&l1!=node2Directions[k]){
                        node3[k]=node2Directions[k];
                        l3 = node3[k];
                        //m initialization for node 4
                        for(var m = 0; m<4; m++){
                            if(m==0){
                                generateDirections(l3,node3Directions);
                            }
                            if(!outOfBounds(l3,node3Directions[m])&&l2!=node3Directions[m]){
                                node4[m]=node3Directions[m];
                                l4 = node4[m];
                                //m initialization for node 5
                                for(var n = 0;n<4;n++){
                                    if(n==0){
                                        generateDirections(l4,node4Directions);
                                    }
                                    if(!outOfBounds(l4,node4Directions[n])&&l3!=node4Directions[n]&&l2!=node4Directions[n]&&l1!=node4Directions[n]){
                                        l5=node4Directions[n];
                                        word = puzzle[l1]+puzzle[l2]+puzzle[l3]+puzzle[l4]+puzzle[l5];
                                        rawList.push(word.toUpperCase());
                                    }
                                }
                                word = puzzle[l1]+puzzle[l2]+puzzle[l3]+puzzle[l4];
                                rawList.push(word.toUpperCase());
                            }
                            else node4[m]=false;
                        }
                        word = puzzle[node1[i]]+puzzle[node2[j]]+puzzle[node3[k]];
                        rawList.push(word.toUpperCase());   
                    }
                    else node3[k] = false;
                }
                word = puzzle[node1[i]]+puzzle[node2[j]];
                rawList.push(word.toUpperCase());
            }
            //if it is out of bounds, set that direction to false
            else node2[j] = false;
            //if the current direction isn't false, continue on to the next node.
        }
    }
    wordList = [...new Set(rawList)];
    console.log(wordList);

}

//      if i-x < 0                  <-- checks "top"
//      if i+x > puzzle.length      <-- checks "bottom"
//      if (i-1)%x == x-1;          <-- checks left
//      if (i+1)%x == 0;            <-- checks right

function outOfBounds(now, next){
    if(next<0){return true;}                            //check top
    else if(next>=puzzle.length){return true;}           //check bottom
    else if(now%x==0&&next%x==x-1){return true;}        //check left
    else if(now%x==x-1&&next%x==0){return true;}        //check right
    else return false;
}

function generateDirections(i, list){
    list[0] = i-x;        //up
    list[1] = i+x;        //down
    list[2] = i-1;        //left
    list[3] = i+1;        //right
}

function checkLibrary(){
    const start = performance.now();
    let normal = document.getElementById("normal-check").checked;
    let out = document.getElementById("output");
    out.innerHTML = "";
    let trouble = document.getElementById("bad-output");
    trouble.innerHTML = "";
    console.log(library.length);
    console.log(library2.length);
    if(normal){
        wordList.forEach(element => {
            for(var i = 0; i<library.length;i++){
                if(element == library[i]){
                    //console.log(`YES! The found word is: ${element}`);
                    out.innerHTML += `Found: ${element} <br>`;
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
                }
            }
        }
    });
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