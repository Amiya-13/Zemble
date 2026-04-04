import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

/**
 * A reusable back button that uses browser history.
 * Falls back to `fallback` route if history is empty.
 */
const BackButton = ({ fallback = '/', label = 'Back', className = '' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        // If there's history to go back to, use it; otherwise fallback
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(fallback);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`back-btn ${className}`}
            aria-label="Go back"
        >
            <ArrowLeftOutlined />
            <span>{label}</span>
        </button>
    );
};

export default BackButton;
