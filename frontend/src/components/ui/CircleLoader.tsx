import React from "react";

interface CircleLoaderProps {
    className?: string;
    size?: number;
    color?: string;
}

const CircleLoader: React.FC<CircleLoaderProps> = ({
    className = "",
    size = 24,
    color = "currentColor"
}) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="31.4 31.4"
                    className="opacity-25"
                />
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="31.4 31.4"
                    strokeDashoffset="0"
                />
            </svg>
        </div>
    );
};

export default CircleLoader;
