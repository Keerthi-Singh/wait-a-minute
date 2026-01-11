import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, options, selectedOption, onSelect, questionNumber, totalQuestions }) => {
    return (
        <div className="question-card fade-in">
            <div className="question-header">
                <span className="question-counter">Question {questionNumber} of {totalQuestions}</span>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            <h2 className="question-text">{question}</h2>

            <div className="options-container">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                        onClick={() => onSelect(option)}
                    >
                        <span className="option-indicator"></span>
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
