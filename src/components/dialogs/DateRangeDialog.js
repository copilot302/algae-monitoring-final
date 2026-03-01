import React, { useState } from 'react';
import '../../styles/Modal.css';

const DateRangeDialog = ({ isOpen, onClose, onExport }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    if (startDate && endDate) {
      onExport(startDate, endDate);
      onClose();
    } else {
      alert('Please select both start and end dates');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export Data by Date Range</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="date-input-group">
            <label htmlFor="start-date">Start Date:</label>
            <input
              id="start-date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          
          <div className="date-input-group">
            <label htmlFor="end-date">End Date:</label>
            <input
              id="end-date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleExport}>Export</button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeDialog;
