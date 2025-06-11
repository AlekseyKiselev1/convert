import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory, HistoryEntry } from '../utils/historyUtils';
import './HistoryViewer.css';

const HistoryViewer: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const allHistory = getHistory();
    setHistory(allHistory);
  }, []);

  useEffect(() => {
    const fortyEightHoursAgo = new Date().getTime() - 48 * 60 * 60 * 1000;
    const recentHistory = history.filter(
      (entry) => new Date(entry.date).getTime() > fortyEightHoursAgo
    );
    setFilteredHistory(recentHistory);
  }, [history]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]); 
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <h2 className="history-title">История за 48 часов</h2>
          <button onClick={handleClearHistory} className="clear-button" disabled={history.length === 0}>
            Очистить всё
          </button>
        </div>
        
        <div className="history-list">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="history-item-main">
                    <span className="history-amount">{entry.amount} {entry.fromCurrency}</span>
                    <span className="history-arrow">→</span>
                    <span className="history-result">{entry.result} {entry.toCurrency}</span>
                </div>
                <div className="history-item-details">
                    <span className="history-rate">Курс: {entry.rate.toFixed(4)}</span>
                    <span className="history-date">{formatDate(entry.date)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="placeholder-text">Ваша история конвертаций пуста.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryViewer;