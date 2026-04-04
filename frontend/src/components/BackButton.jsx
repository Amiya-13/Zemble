import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

/**
 * Reusable back button using browser history.
 * Shows icon+label on desktop, icon-only on mobile.
 */
const BackButton = ({ fallback = '/', label = 'Back', className = '' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className={`back-btn ${className}`}
            aria-label="Go back"
        >
            <ArrowLeftOutlined />
            <span className="back-btn-label">{label}</span>
        </button>
    );
};

export default BackButton;
