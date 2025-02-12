import React from "react";

function SettingsPanel({ isOpen, onClose, settings, updateSettings, rampSize, setRampSize, maxRampSize }) {
  return isOpen ? (
    <div className="settings-modal">
      <h2>Settings</h2>

      {/* Even/Odd Distribution Slider */}
      <label>Even/Odd Distribution</label>
      <div className="slider-container">
        <input
          className="slider-object"
          type="range"
          min="0"
          max="100"
          value={settings.evenOddSlider}
          onChange={(e) => updateSettings("evenOddSlider", parseInt(e.target.value))}
        />
        <span className="slider-text">
          {settings.evenOddSlider === 50
            ? "50/50 Split"
            : `${100 - settings.evenOddSlider}% Even / ${settings.evenOddSlider}% Odd`}
        </span>
      </div>

      {/* Ramp Size Slider */}
      <label>Ramp Size: {rampSize}</label>
      <div className="slider-container">
        <input
          className="slider-object"
          type="range"
          min="1"
          max={maxRampSize}
          value={rampSize}
          onChange={(e) => setRampSize(parseInt(e.target.value))}
        />
      </div>

      <div className="toggle-settings">
        {/* Rover Request Toggle */}
        <div className="rover-toggle">
          <label>Rover Requests</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.roverRequests}
              onChange={() => updateSettings("roverRequests", !settings.roverRequests)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        {/* Row Request Toggle */}
        <div className="row-toggle">
          <label>Row Requests</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.rowRequests}
              onChange={() => updateSettings("rowRequests", !settings.rowRequests)}
            />
            <span className="slider round"></span>
          </label>
        </div>  
      </div>

      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}

export default SettingsPanel;
