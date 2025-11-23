import React, { useState, useRef, useEffect } from 'react';
import type { ChatPanelProps } from '../types';

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  currentUserId,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`mp-flex mp-flex-col mp-h-full mp-bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="mp-px-4 mp-py-3 mp-border-b mp-border-gray-800">
        <h3 className="mp-text-white mp-font-semibold mp-text-lg">Chat</h3>
      </div>

      {/* Messages */}
      <div className="mp-flex-1 mp-overflow-y-auto mp-px-4 mp-py-2 mp-space-y-3">
        {messages.length === 0 ? (
          <div className="mp-flex mp-items-center mp-justify-center mp-h-full mp-text-gray-500">
            No messages yet
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            const isSystem = message.type === 'system';

            if (isSystem) {
              return (
                <div key={message.id} className="mp-text-center mp-text-gray-500 mp-text-sm mp-py-1">
                  {message.content}
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`mp-flex mp-flex-col ${isOwnMessage ? 'mp-items-end' : 'mp-items-start'}`}
              >
                {!isOwnMessage && (
                  <span className="mp-text-xs mp-text-gray-400 mp-mb-1">
                    {message.senderName || 'Unknown'}
                  </span>
                )}

                <div
                  className={`mp-max-w-[80%] mp-px-3 mp-py-2 mp-rounded-lg ${
                    isOwnMessage
                      ? 'mp-bg-blue-600 mp-text-white'
                      : 'mp-bg-gray-700 mp-text-white'
                  }`}
                >
                  <p className="mp-text-sm mp-break-words">{message.content}</p>
                  <span className="mp-text-xs mp-opacity-70 mp-mt-1 mp-block">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mp-p-4 mp-border-t mp-border-gray-800">
        <div className="mp-flex mp-gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="mp-flex-1 mp-px-4 mp-py-2 mp-bg-gray-800 mp-text-white mp-rounded-lg mp-border mp-border-gray-700 focus:mp-border-blue-500 focus:mp-outline-none"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="mp-px-6 mp-py-2 mp-bg-blue-600 mp-text-white mp-rounded-lg hover:mp-bg-blue-700 disabled:mp-opacity-50 disabled:mp-cursor-not-allowed mp-transition-colors"
          >
            <svg className="mp-w-5 mp-h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
