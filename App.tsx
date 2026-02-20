
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, UserStats, HubSubView } from './types';
import { LoadingScreen } from './screens/LoadingScreen';
import { HubScreen } from './screens/HubScreen';
import { MemoryGame } from './screens/MemoryGame';
import { WordPuzzle } from './screens/WordPuzzle';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelFailModal } from './components/LevelFailModal';
import { ChestModal } from './components/ChestModal';
import { MemoryTransitionModal } from './components/MemoryTransitionModal';
import { auth, fetchCloudStats, syncUserStats, reconcileStats } from './lib/firebase.ts';
import { onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { WordDatabase, GateQuestion } from './lib/wordDatabase';
import { SoundManager } from './managers/SoundManager';

export const GAME_ASSETS = {
  HUB_BG: './1769539203503.png'
};

const STORAGE_KEY = 'lumina_stats';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [hubSubView, setHubSubView] = useState<HubSubView>(HubSubView.MAIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      coins: 2063, hearts: 5, stars: 12, level: 1,
      lastLifeRefillTime: Date.now(),
      hintsFreeze: 3, hintsReveal: 3,
      claimedMissions: [],
      lastMissionsRefresh: Date.now(),
      difficultyFactor: 1.0, performanceHistory: [],
      streak: 0, maxStreak: 0
    };
  });

  // Global Zorluk Katsayısı Hesaplama
  const currentDDS = useMemo(() => {
    const baseDDS = WordDatabase.getDDSForGate(stats.level);
    // Seri (streak) her 1 birim için zorluğu %5 artırır (Global Momentum)
    const streakBonus = stats.streak * 0.05;
    return parseFloat((baseDDS + streakBonus).toFixed(2));
  }, [stats.level, stats.streak]);

  useEffect(() => {
    SoundManager.getInstance().setDifficulty(currentDDS);
    SoundManager.getInstance().setLevel(stats.level);
  }, [currentDDS, stats.level]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        const cloudData = await fetchCloudStats(user.uid);
        if (cloudData) {
          const merged = reconcileStats(stats, cloudData);
          setStats(merged);
        }
        setIsSyncing(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    if (currentUser) {
      const timeout = setTimeout(async () => {
        setIsSyncing(true);
        await syncUserStats(currentUser.uid, stats, currentUser.displayName || "", currentUser.photoURL || "");
        setIsSyncing(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [stats, currentUser]);

  const [currentGateQuestions, setCurrentGateQuestions] = useState<GateQuestion[]>([]);
  const [fullWordPool, setFullWordPool] = useState<string[]>([]);
  const [showChest, setShowChest] = useState(false);
  const [bonusEarned, setBonusEarned] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [starsEarnedInLevel, setStarsEarnedInLevel] = useState(0);

  const handleStartGame = (forcedLevel?: number) => {
    const targetLevel = forcedLevel ?? stats.level;
    if (stats.hearts > 0) {
      setSessionScore(0);
      const questions = WordDatabase.getQuestionsForGate(targetLevel);
      setCurrentGateQuestions(questions);
      setGameState(GameState.WORD_PUZZLE);
    } else {
      setHubSubView(HubSubView.SHOP);
    }
  };

  const handleQuitGame = () => {
    setStats(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
      streak: 0, // Çıkınca seri bozulur
      lastLifeRefillTime: prev.hearts === 5 ? Date.now() : prev.lastLifeRefillTime
    }));
    setGameState(GameState.HUB);
  };

  const handleLevelFail = () => {
    setStats(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
      streak: 0, // Kaybedince seri bozulur
      lastLifeRefillTime: prev.hearts === 5 ? Date.now() : prev.lastLifeRefillTime
    }));
    setGameState(GameState.LEVEL_FAIL);
  };

  const handlePuzzleComplete = (earned: number, allTargets: string[], allDistractors: string[]) => {
    setSessionScore(earned);
    const pooledWords = [...allTargets, ...allDistractors].sort(() => Math.random() - 0.5);
    setFullWordPool(pooledWords);
    setGameState(GameState.MEMORY_PREPARE);
  };

  const handleGameComplete = (correctCount: number) => {
    let stars = correctCount === 5 ? 3 : correctCount >= 4 ? 2 : 1;
    let bonus = correctCount * 50;
    setStarsEarnedInLevel(stars);
    setBonusEarned(bonus);
    setGameState(GameState.LEVEL_COMPLETE);
  };

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      if (updated.streak > prev.maxStreak) updated.maxStreak = updated.streak;
      return updated;
    });
  };

  const renderScreen = () => {
    // DDS'yi her aşamaya kümülatif olarak gönderiyoruz
    const ddsProps = { ...stats, difficultyFactor: currentDDS };

    switch (gameState) {
      case GameState.LOADING: return <LoadingScreen onFinished={() => setGameState(GameState.HUB)} />;
      case GameState.HUB: return <HubScreen stats={ddsProps} currentUser={currentUser} isSyncing={isSyncing} hubSubView={hubSubView} setHubSubView={setHubSubView} onStartGame={() => handleStartGame()} onAddCoins={(amt) => setStats(p=>({...p, coins: p.coins+amt}))} onBuyHearts={(c, a) => {}} onOpenChest={() => setShowChest(true)} onClaimMission={() => {}} />;
      case GameState.WORD_PUZZLE: return <WordPuzzle stats={ddsProps} questions={currentGateQuestions} onComplete={handlePuzzleComplete} onExit={handleQuitGame} onUpdateStats={updateStats} />;
      case GameState.MEMORY_PREPARE: return <MemoryTransitionModal onConfirm={() => setGameState(GameState.MEMORY_GAME)} />;
      case GameState.MEMORY_GAME: return <MemoryGame stats={ddsProps} backgroundUrl={GAME_ASSETS.HUB_BG} words={fullWordPool} targetWords={currentGateQuestions.map(q => q.target)} onNext={handleGameComplete} onFail={handleLevelFail} onExit={handleQuitGame} />;
      case GameState.LEVEL_COMPLETE: return <LevelCompleteModal level={stats.level} coinsEarned={sessionScore + bonusEarned} starsEarned={starsEarnedInLevel} onContinue={() => { const nextLevel = stats.level + 1; setStats(p => ({...p, level: nextLevel, coins: p.coins + sessionScore + bonusEarned, stars: p.stars + starsEarnedInLevel})); handleStartGame(nextLevel); }} onMenu={() => { setStats(p => ({...p, level: p.level + 1, coins: p.coins + sessionScore + bonusEarned, stars: p.stars + starsEarnedInLevel})); setGameState(GameState.HUB); }} />;
      case GameState.LEVEL_FAIL: return <LevelFailModal hearts={stats.hearts} lastLifeRefillTime={stats.lastLifeRefillTime} onRetry={() => handleStartGame()} onShop={() => setHubSubView(HubSubView.SHOP)} onExit={() => setGameState(GameState.HUB)} />;
      default: return <LoadingScreen />;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020617] overflow-hidden select-none">
      <div className="w-full h-full">
        {renderScreen()}
        {showChest && <ChestModal onClose={() => setShowChest(false)} onReward={(amt) => setStats(p=>({...p, coins: p.coins+amt}))} />}
      </div>
    </div>
  );
};

export default App;
