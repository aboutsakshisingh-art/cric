import React, { useEffect } from 'react';

const EventAnimation = ({ event }) => {
  const { type } = event || {};

  // Determine the text and style based on event type
  const getEventConfig = () => {
    switch (type) {
      case 'HIT_SIX':
        return {
          text: 'SIX!',
          gradient: 'from-pink-500 via-purple-500 to-indigo-500',
          textColor: 'text-white',
          shadowColor: 'shadow-pink-500/50',
          scaleClass: 'scale-150',
        };
      case 'HIT_FOUR':
        return {
          text: 'FOUR!',
          gradient: 'from-blue-400 via-cyan-500 to-teal-500',
          textColor: 'text-white',
          shadowColor: 'shadow-blue-500/50',
          scaleClass: 'scale-125',
        };
      case 'FALL_OF_WICKET':
        return {
          text: 'WICKET!',
          gradient: 'from-red-600 via-orange-500 to-yellow-500',
          textColor: 'text-white',
          shadowColor: 'shadow-red-500/50',
          scaleClass: 'scale-125',
        };
      default:
        return {
          text: '',
          gradient: 'from-gray-500 to-gray-700',
          textColor: 'text-white',
          shadowColor: 'shadow-gray-500/50',
          scaleClass: 'scale-100',
        };
    }
  };

  const config = getEventConfig();

  if (!type) return null;

  return (
    <div className="event-animation-overlay">
      <div
        className={`
          event-animation-content
          bg-gradient-to-r ${config.gradient}
          ${config.textColor}
          ${config.scaleClass}
          shadow-2xl ${config.shadowColor}
        `}
      >
        <span className="event-text">{config.text}</span>
      </div>
    </div>
  );
};

export default EventAnimation;
