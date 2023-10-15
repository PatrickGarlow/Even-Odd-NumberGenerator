
let oddVsEvenPercent = 5; //0 is odd, 10 is even
let numOfGroups = 10;

let useOneRamp = true;

// [2,4,6,8,10,12,14,16,18,20]
let evenPercentList = [20,30,20,10,10,6,1,1,1,1];

// [1,3,5,7,9,11,13,15,17,19,21]
let oddPercentList = [20,30,20,10,10,6,1,1,1,1];


function getNumType() {
    //returns true for even and false for odd
    let temp = (Math.floor(Math.random() * 10));
    if(temp < oddVsEvenPercent){
        return true;
    }
    else {
        return false;
    }
}

function generateNumber() {
    let tempNum = (Math.floor(Math.random() * 100));
    let tempNumType = getNumType();
    let index = 0;

    while(tempNum > 0) {
        if(tempNumType) {
            tempNum -= evenPercentList[index];
        }
        else {
            tempNum -= oddPercentList[index];
        }
        
        index+=1;
    }

    if (tempNumType) {
        return (index*2);
    }
    else {
        return (2*index)+1;
    }
}


//takes in the list 
function generateList() {
    let tempList = [];
    for(let x = 0; x < numOfGroups; x++) {
        tempList.push(generateNumber());
    }
    return tempList;
}

function generateRamp() {
    if(useOneRamp) {
        console.log(generateList());
    }
    else {
        // use both ramps
        oddVsEvenPercent = 0;
        console.log("ODD")
        console.log(generateList());
        console.log("---------------------------------")
        oddVsEvenPercent = 10;
        console.log("EVEN")
        console.log(generateList());
    }
}


generateRamp();







