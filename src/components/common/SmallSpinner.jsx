import React from 'react';

const SmallSpinner = ({ size = 'md', color = 'blue-500' }) => {
    const sizeClasses = {
        xs: 'w-4 h-4 border-2',
        sm: 'w-6 h-6 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
        xxl: 'w-20 h-20 border-4'
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClass} border-t-transparent border-${color} rounded-full animate-spin`}></div>
        </div>
    );
};

export default SmallSpinner;
