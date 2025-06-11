export interface HistoryEntry {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: string;
  rate: number;
  date: string;
}

const HISTORY_KEY = 'currencyConversionHistory';

export const getHistory = (): HistoryEntry[] => {
  try {
      const historyJson = localStorage.getItem(HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      return [];
  }
};

export const saveConversionToHistory = (entryData: Omit<HistoryEntry, 'id' | 'date'>) => {
  const newEntry: HistoryEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
  };

  const history = getHistory();
  history.unshift(newEntry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};