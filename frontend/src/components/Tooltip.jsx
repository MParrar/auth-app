import React from 'react';

export const Tooltip = ({ title, message }) => {
  return (
    <div className='relative group inline-block'>
      <button className='text-white rounded'>{title}</button>

      <div className='absolute hidden group-hover:block z-10 w-max bottom-full -translate-x-1/3 mb-2 ml-32'>
        <div className='bg-gray-800 text-white text-xs rounded-md inline-block'>
          {message}
        </div>
      </div>
    </div>
  );
};
