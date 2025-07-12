import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const SuperBuildupAreaSection = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
  // Configuration
  const MIN_RANGE = 0;
  const MAX_RANGE = 1000000;
  const STEP = 1000;
  const MIN_DISTANCE = 10000; // Minimum distance between min and max values

  const [value, setValue] = useState([MIN_RANGE, MAX_RANGE]);

  // Initialize values from filters
  useEffect(() => {
    if (filters.super_builtup_area && typeof filters.super_builtup_area === 'string' && filters.super_builtup_area.includes('-')) {
      const [min, max] = filters.super_builtup_area.split('-').map(val => parseInt(val.trim()) || 0);
      setValue([
        Math.max(min, MIN_RANGE),
        Math.min(max, MAX_RANGE)
      ]);
    }
  }, [filters.super_builtup_area]);

  // Format number for display (e.g., 1000 -> 1K, 1000000 -> 1M)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    }
    return num.toString();
  };

  // Value text formatter for slider
  const valuetext = (value) => {
    return `${formatNumber(value)} sq ft`;
  };

  // Handle slider change with minimum distance enforcement
  const handleSliderChange = (event, newValue, activeThumb) => {
    if (newValue[1] - newValue[0] < MIN_DISTANCE) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], MAX_RANGE - MIN_DISTANCE);
        setValue([clamped, clamped + MIN_DISTANCE]);
        updateFilter([clamped, clamped + MIN_DISTANCE]);
      } else {
        const clamped = Math.max(newValue[1], MIN_DISTANCE);
        setValue([clamped - MIN_DISTANCE, clamped]);
        updateFilter([clamped - MIN_DISTANCE, clamped]);
      }
    } else {
      setValue(newValue);
      updateFilter(newValue);
    }
  };

  // Update filters with the range in "min-max" format
  const updateFilter = (newValue) => {
    const filterValue = `${newValue[0]}-${newValue[1]}`;
    setFilters(prev => ({
      ...prev,
      super_builtup_area: filterValue
    }));
  };

  // Handle input changes
  const handleInputChange = (type, inputValue) => {
    const numValue = Math.max(0, parseInt(inputValue) || 0);
    
    if (type === 'min') {
      const newMin = Math.min(numValue, value[1] - MIN_DISTANCE);
      const newValue = [newMin, value[1]];
      setValue(newValue);
      updateFilter(newValue);
    } else {
      const newMax = Math.max(numValue, value[0] + MIN_DISTANCE);
      const newValue = [value[0], newMax];
      setValue(newValue);
      updateFilter(newValue);
    }
  };

  // Clear filter
  const clearFilter = () => {
    setValue([MIN_RANGE, MAX_RANGE]);
    setFilters(prev => ({
      ...prev,
      super_builtup_area: ""
    }));
  };

  // Handle quick select options
  const handleQuickSelect = (min, max) => {
    const newValue = [min, max];
    setValue(newValue);
    updateFilter(newValue);
  };

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection("superBuildupArea")}
      >
        <h2 className="font-medium text-gray-800">Super Buildup Area</h2>
        <div className="flex items-center gap-2">
          {/* Clear button */}
          {filters.super_builtup_area && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilter();
              }}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 border border-red-300 rounded"
            >
              Clear
            </button>
          )}
          {/* Expand/collapse icon */}
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections.superBuildupArea ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Section Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expandedSections.superBuildupArea ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        {/* Range Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Min</span>
            <input
              type="number"
              value={value[0]}
              onChange={(e) => handleInputChange('min', e.target.value)}
              onBlur={(e) => {
                // Ensure valid range on blur
                const val = parseInt(e.target.value) || 0;
                if (val >= value[1]) {
                  handleInputChange('min', value[1] - MIN_DISTANCE);
                }
              }}
              className="text-sm font-medium text-gray-800 w-16 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent transition-colors"
              min={MIN_RANGE}
              max={value[1] - MIN_DISTANCE}
              step={STEP}
            />
          </div>
          <div className="text-gray-400 mx-2">-</div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Max</span>
            <input
              type="number"
              value={value[1]}
              onChange={(e) => handleInputChange('max', e.target.value)}
              onBlur={(e) => {
                // Ensure valid range on blur
                const val = parseInt(e.target.value) || MAX_RANGE;
                if (val <= value[0]) {
                  handleInputChange('max', value[0] + MIN_DISTANCE);
                }
              }}
              className="text-sm font-medium text-gray-800 w-20 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent text-right transition-colors"
              min={value[0] + MIN_DISTANCE}
              max={MAX_RANGE}
              step={STEP}
            />
          </div>
        </div>

        {/* Material-UI Range Slider */}
        <Box sx={{ px: 1, mb: 3 }}>
          <Slider
            getAriaLabel={() => 'Super Buildup Area range'}
            value={value}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            valueLabelFormat={valuetext}
            disableSwap
            min={MIN_RANGE}
            max={MAX_RANGE}
            step={STEP}
            sx={{
              color: '#0a4fbeff', // Blue color
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                backgroundColor: '#fff',
                border: '2px solid #043a90ff',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(104, 155, 237, 0.16)',
                },
                '&.Mui-active': {
                  boxShadow: '0px 0px 0px 14px rgba(59, 130, 246, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                height: 4,
                borderRadius: 2,
              },
              '& .MuiSlider-rail': {
                height: 4,
                borderRadius: 2,
                backgroundColor: '#e5e7eb',
              },
              '& .MuiSlider-valueLabel': {
                backgroundColor: '#374151',
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.75rem',
                '&:before': {
                  color: '#374151',
                },
              },
            }}
          />
        </Box>

        {/* Range Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>{formatNumber(MIN_RANGE)}</span>
          <span>{formatNumber(MAX_RANGE)}+</span>
        </div>

        {/* Selected Range Display */}
        <div className="text-center text-sm text-gray-700 mb-4">
          <span className="font-medium">
            {formatNumber(value[0])} - {formatNumber(value[1])} sq ft
          </span>
        </div>

        {/* Quick Select Options */}
        <div className="space-y-2">
          <div className="text-xs text-gray-600 mb-2">Quick Select:</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '0-500K', min: 0, max: 500000 },
              { label: '500K-1M', min: 500000, max: 1000000 },
              { label: '1M+', min: 1000000, max: MAX_RANGE },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => handleQuickSelect(option.min, option.max)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  value[0] === option.min && value[1] === option.max
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default SuperBuildupAreaSection;