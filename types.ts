
export enum GameState {
  LOADING = 'LOADING',
  TERMS = 'TERMS',
  HUB = 'HUB',
  MEMORY_GAME = 'MEMORY_GAME',
  MEMORY_PREPARE = 'MEMORY_PREPARE',
  WORD_PUZZLE = 'WORD_PUZZLE',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  LEVEL_FAIL = 'LEVEL_FAIL'
}

export enum HubSubView {
  MAIN = 'MAIN',
  PLANETS = 'PLANETS',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
  LEAGUE = 'LEAGUE',
  COLLECTION = 'COLLECTION',
  SHOP = 'SHOP',
  MISSIONS = 'MISSIONS'
}

export interface UserStats {
  coins: number;
  hearts: number;
  stars: number;
  level: number;
  lastLifeRefillTime: number;
  // İpuçları
  hintsFreeze: number;
  hintsReveal: number;
  // Görevler
  claimedMissions: number[]; // Alınan ödüllerin ID'leri
  lastMissionsRefresh: number; // Görevlerin en son ne zaman sıfırlandığı (timestamp)
  // Dinamik Zorluk Parametreleri (Yerel)
  difficultyFactor: number; // 0.5 (Kolay) - 2.0 (Zor) arası
  performanceHistory: boolean[]; // Son geçit başarı geçmişi
  streak: number; // Mevcut doğru cevap serisi
  maxStreak: number; // Rekor doğru cevap serisi
}
