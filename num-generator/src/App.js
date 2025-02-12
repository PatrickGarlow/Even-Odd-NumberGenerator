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

function getRandomNumber(sliderValue, settings) {
  const evenNumbers = weightedNumbers.filter(({ number }) => number % 2 === 0);
  const oddNumbers = weightedNumbers.filter(({ number }) => number % 2 !== 0);

  const expandedEvens = evenNumbers.flatMap(({ number, weight }) => Array(weight).fill(number));
  const expandedOdds = oddNumbers.flatMap(({ number, weight }) => Array(weight).fill(number));

  const evenProbability = (100 - sliderValue) / 100;
  const isEven = Math.random() < evenProbability;
  const sourceArray = isEven ? expandedEvens : expandedOdds;

  const randomIndex = Math.floor(Math.random() * sourceArray.length);
  const selectedNumber = sourceArray[randomIndex];

  let isRover = settings.roverRequests && Math.random() < 0.2;

  let note = "";
  if (!isRover && settings.rowRequests && Math.random() < 0.3) { // Only assign a row request if it's NOT a rover
    const rowRequestChance = Math.random();
    if (rowRequestChance < 0.6) {
      note = "Row 1"; // 60% chance
    } else {
      const rowOptions = ["Not front", "Back bikes", "Middle"];
      note = rowOptions[Math.floor(Math.random() * rowOptions.length)]; // 40% split among other options
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
    const newNumber = getRandomNumber(settings.evenOddSlider, settings);
    setNumbers((prev) => {
      if (prev.length > 0) {
        setCurrentNumber(prev[0]);
        return [...prev.slice(1), newNumber];
      } else {
        setCurrentNumber(newNumber);
        return [newNumber];
      }
    });
    setSelectedNumberId(null); // Reset selection
  };

  const removeNumber = (id) => {
    setNumbers((prev) => {
      // Filter out the deleted number
      const updatedNumbers = prev.filter((num) => num.id !== id);
  
      // Generate a new number to replace the removed one
      const newNumber = getRandomNumber(settings.evenOddSlider, settings);
  
      // Ensure ramp stays the same size by adding a new number at the end
      return [...updatedNumbers, newNumber];
    });
  
    // If the deleted number was selected, reset selection
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
  setRampSize={setRampSize}
  maxRampSize={maxRampSize}
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
