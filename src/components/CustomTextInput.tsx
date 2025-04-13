import React, { useState } from 'react';
import '../styles/CustomTextInput.css';

interface CustomTextInputProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ onSubmit, onCancel }) => {
  const [customText, setCustomText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      onSubmit(customText.trim());
    }
  };

  return (
    <div className="custom-text-modal">
      <div className="custom-text-content">
        <h2>输入自定义文本</h2>
        <p>请输入或粘贴您想要练习的文本：</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="在此输入您的文本..."
            rows={8}
            className="custom-text-area"
          />
          
          <div className="custom-text-buttons">
            <button type="button" onClick={onCancel} className="cancel-button">
              取消
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!customText.trim()}
            >
              开始练习
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomTextInput;
