import React from 'react';

interface ClockProps {
  time: string;
  date: string;
}

export const Clock: React.FC<ClockProps> = ({ time, date }) => {
  return (
    <div className="mb-12 text-center select-none">
      <div className="text-gray-100 text-8xl font-extralight tracking-widest mb-4">
        {time}
      </div>
      <div className="text-gray-400 text-[18px] font-light tracking-widest uppercase opacity-80">
        {date}
      </div>
    </div>
  );
};