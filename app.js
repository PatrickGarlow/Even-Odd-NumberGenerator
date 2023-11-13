const checkboxSingle = document.getElementById('generate-single');
const checkboxList = document.getElementById('generate-list');
const checkboxRamp = document.getElementById('generate-ramp');

const displaySection = document.getElementsByClassName('display-section')[0];
const displaySingleDiv = document.getElementById('display-single');
const displayListDiv = document.getElementById('display-list');

const displayListSub1 = document.getElementById('display-list-1');
const displayListSub2 = document.getElementById('display-list-2');

const evenOddSlider = document.getElementById('even-odd-range');




let oddVsEvenPercent = 50; //0 is odd, 10 is even
let numOfGroups = 10;

let useOneRamp = true;

// [2,4,6,8,10,12,14,16,18,20]
let evenPercentList = [20,30,20,10,10,6,1,1,1,1];

// [1,3,5,7,9,11,13,15,17,19,21]
let oddPercentList = [20,30,20,10,10,6,1,1,1,1];


function getNumType() {
    //returns true for even and false for odd
    let temp = (Math.floor(Math.random() * 100));
    if(!checkboxRamp.checked) {
        oddVsEvenPercent = evenOddSlider.value;
    }
    
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
    oddVsEvenPercent = 0;
    console.log("ODD")
    displayListSub1.children[0].innerHTML = listToString(generateList())
    console.log("---------------------------------")
    oddVsEvenPercent = 100;
    console.log("EVEN")
    displayListSub2.children[0].innerHTML = listToString(generateList())
}

function listToString(inputList) {
    outString = "";
    for(let x = 0; x < inputList.length; x++) {
        outString += inputList[x];
        outString += ", ";
    }
    outString = outString.slice(0, -2);
    return outString;
}
function generate() {
    if (checkboxSingle.checked) {
        displaySingleDiv.children[0].innerHTML = generateNumber();
    }
    else if(checkboxList.checked) {
        displayListSub1.children[0].innerHTML = listToString(generateList())
    }
    else if(checkboxRamp.checked) {
        generateRamp();
    }
    else {
        console.log("ERROR: How did you get here, there's only 3 options")
    }
}

checkboxSingle.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        
        displaySingleDiv.style.display = "flex";
        displaySection.style.flexDirection = "row";
        displaySingleDiv.children[0].innerHTML = "";
        displayListDiv.style.display = "none";
        displayListSub1.style.display = "none";
        displayListSub2.style.display = "none";
        useOneRamp = true;
        checkboxList.checked = false;
        checkboxRamp.checked = false;
    } 
  })
checkboxList.addEventListener('change', (event) => {
if (event.currentTarget.checked) {
    displayListSub1.children[0].innerHTML = "";
    displaySection.style.flexDirection = "column";
    displaySingleDiv.style.display = "none";
    displayListDiv.style.display = "flex";
    displayListSub1.style.display = "flex";
    displayListSub2.style.display = "none";
    useOneRamp = true;
    checkboxSingle.checked = false;
    checkboxRamp.checked = false;
} 
})
checkboxRamp.addEventListener('change', (event) => {
if (event.currentTarget.checked) {
    displayListSub1.children[0].innerHTML = "";
    displayListSub2.children[0].innerHTML = "";
    displaySingleDiv.style.display = "none";
    displayListDiv.style.display = "flex";
    displayListSub1.style.display = "flex";
    displayListSub2.style.display = "flex";
    displaySection.style.flexDirection = "column";
    useOneRamp = false;
    checkboxList.checked = false;
    checkboxSingle.checked = false;
} 
})







