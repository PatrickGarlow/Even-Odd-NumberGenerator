import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import NumberComponent from "./components/NumberComponent";
import SettingsPanel from "./components/SettingsPanel";
import "./styles.css"; // Import CSS for animations

const weightedNumbers = [
  { number: 1, weight: 5 },
  { number: 2, weight: 10 },
  { number: 3, weight: 10 },
  { number: 4, weight: 8 },
  { number: 5, weight: 2 },
  { number: 6, weight: 6 },
  { number: 7, weight: 4 },
  { number: 8, weight: 9 },
  { number: 9, weight: 1 },
  { number: 10, weight: 7 },
  { number: 11, weight: 3 },
  { number: 12, weight: 5 },
  { number: 13, weight: 2 },
  { number: 14, weight: 6 },
];

function getRandomNumber(sliderValue, settings, evenWeights = {}, oddWeights = {}) {
  // Ensure evenWeights and oddWeights are always valid objects
  evenWeights = evenWeights || {};
  oddWeights = oddWeights || {};

  const evenNumbers = Object.keys(evenWeights).map(num => ({
    number: parseInt(num),
    weight: evenWeights[num] || 0
  }));

  const oddNumbers = Object.keys(oddWeights).map(num => ({
    number: parseInt(num),
    weight: oddWeights[num] || 0
  }));

  const evenProbability = (100 - sliderValue) / 100;
  const isEven = Math.random() < evenProbability;
  const sourceArray = isEven ? evenNumbers : oddNumbers;

  // Ensure there is at least one valid number
  let weightedPool = sourceArray.flatMap(({ number, weight }) => Array(weight).fill(number));
  if (weightedPool.length === 0) {
    return { id: uuidv4(), number: isEven ? 2 : 1, note: "", isRover: false, noteTag: "note-null" };
  }

  // Select a random number
  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  const selectedNumber = weightedPool[randomIndex];

  let isRover = settings.roverRequests && Math.random() < 0.2;
  let note = "";
  if (!isRover && settings.rowRequests && Math.random() < 0.3) { 
    const rowRequestChance = Math.random();
    if (rowRequestChance < 0.6) {
      note = "Row 1"; 
    } else {
      const rowOptions = ["Not front", "Back bikes", "Middle"];
      note = rowOptions[Math.floor(Math.random() * rowOptions.length)];
    }
  }

  let noteTag = note ? "note-true" : "note-null";

  return { id: uuidv4(), number: selectedNumber, note, isRover, noteTag };
}





function App() {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [selectedNumberId, setSelectedNumberId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    evenOddSlider: 50,
    displayMode: "single",
    rowRequests: false,
    roverRequests: false,
  });
  const totalEvenWeight = 100; // Total weight for even numbers
  const totalOddWeight = 100;  // Total weight for odd numbers

  const [evenWeights, setEvenWeights] = useState({
    2: 30, 4: 30, 6: 20, 8: 10, 10: 5, 12: 4, 14: 1
  });
  const [oddWeights, setOddWeights] = useState({
    1: 30, 3: 30, 5: 20, 7: 10, 9: 10, 11: 4, 13: 1
  });


const updateWeights = (number, newWeight, isEven) => {
  let weights = isEven ? { ...evenWeights } : { ...oddWeights };
  let totalWeight = isEven ? totalEvenWeight : totalOddWeight;
  let remainingTotal = totalWeight - newWeight;
  let otherNumbers = Object.keys(weights).filter(num => parseInt(num) !== number);
  
  // Prevent NaN issue if remaining total is 0
  if (remainingTotal <= 0) {
    otherNumbers.forEach(num => (weights[num] = 0)); // Set all others to 0
  } else {
    let totalCurrentOther = otherNumbers.reduce((sum, num) => sum + weights[num], 0) || 1; // Avoid division by 0
    otherNumbers.forEach(num => {
      weights[num] = Math.max(0, Math.round((weights[num] / totalCurrentOther) * remainingTotal));
    });
  }

  weights[number] = newWeight;

  if (isEven) {
    setEvenWeights(weights);
  } else {
    setOddWeights(weights);
  }
};
  
  const [rampSize, setRampSize] = useState(7);
  const maxRampSize = 15;

  useEffect(() => {
    let initialNumbers = [];
    for (let i = 0; i < rampSize; i++) {
      initialNumbers.push(getRandomNumber(settings.evenOddSlider, settings));
    }
    setNumbers(initialNumbers);
  }, [rampSize]);

  const generateNewNumber = () => {
    const newNumber = getRandomNumber(settings.evenOddSlider, settings, evenWeights, oddWeights);
    setNumbers((prev) => {
      if (prev.length > 0) {
        setCurrentNumber(prev[0]);
        return [...prev.slice(1), newNumber];
      } else {
        setCurrentNumber(newNumber);
        return [newNumber];
      }
    });
    setSelectedNumberId(null); 
  };
  
  

  const removeNumber = (id) => {
    setNumbers((prev) => {
      const updatedNumbers = prev.filter((num) => num.id !== id);
      if (updatedNumbers.length < rampSize) {
        const newNumber = getRandomNumber(settings.evenOddSlider, settings, evenWeights, oddWeights);
        updatedNumbers.push(newNumber);
      }
      return updatedNumbers;
    });
  
    if (id === selectedNumberId) {
      setSelectedNumberId(null);
    }
  };
  
  

  return (
    <div className="grouper-container">
      <div className="nav-bar">
        <h1 className="page-title">Number Generator</h1>
        <button className="settings-button" onClick={() => setSettingsOpen(!settingsOpen)}>
          <img className="button-image" src="/images/svg/gear.svg" alt="⚙️"/>
        </button>
      </div>
      
      <SettingsPanel
  isOpen={settingsOpen}
  onClose={() => setSettingsOpen(false)}
  settings={settings}
  updateSettings={(key, value) => setSettings((prev) => ({ ...prev, [key]: value }))}
  rampSize={rampSize}
  maxRampSize= {20}
  setRampSize={setRampSize}
  evenWeights={evenWeights}
  oddWeights={oddWeights}
  updateWeights={updateWeights}
/>


      {/* Current Number */}
      <div className="display-section">
  <div className={` ${currentNumber ? "current-num-class" : "nullNum"} ${currentNumber?.isRover ? "rover" : ""} number${currentNumber ? currentNumber.number : ""} ${currentNumber?.noteTag}`}>
    {currentNumber ? currentNumber.number : "Press Generate to Start..."}
    {currentNumber?.noteTag === "note-true" && <div className="number-note">Request: {currentNumber.note}</div>}
  </div>
</div>

      {/* Ramp */}
      <div className="ramp-section">
  <h2>Up Next</h2>
  <div className="ramp">
    {numbers.map((num) => (
      <NumberComponent
        key={num.id}
        {...num}
        isSelected={num.id === selectedNumberId}
        onDelete={removeNumber}
        onSelect={() => setSelectedNumberId(num.id)}
        showNote={false} // Ensure ramp numbers do not display notes
      />
    ))}
  </div>
</div>
      <div className="button-section">
      <button className="gen-button" onClick={generateNewNumber}>{currentNumber ? "Next Number" : "Generate Number"} </button>

      </div>
    </div>
  );
}

export default App;
