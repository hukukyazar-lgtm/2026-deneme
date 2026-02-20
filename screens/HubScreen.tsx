
import React from 'react';
import { UserStats, HubSubView } from '../types';
import { Header } from '../components/Header';
import { ParticleBackground } from '../components/ParticleBackground';
import { PlanetMenuModal } from '../components/PlanetMenuModal';
import { SettingsModal } from '../components/SettingsModal';
import { ProfileModal } from '../components/ProfileModal';
import { RankingModal } from '../components/RankingModal';
import { ShopModal } from '../components/ShopModal';
import { MissionsModal } from '../components/MissionsModal';
import { Portal3D } from '../components/Portal3D';
import { Button } from '../components/Button';
import { User } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// @ts-ignore: HubScreenProps updated to fix App.tsx error
interface HubScreenProps {
  stats: UserStats;
  currentUser: User | null;
  isSyncing: boolean;
  hubSubView: HubSubView;
  setHubSubView: (view: HubSubView) => void;
  onStartGame: () => void;
  onAddCoins: (amount: number) => void;
  onBuyHearts: (cost: number, amount: number) => void;
  onOpenChest: () => void;
  onClaimMission: (id: number, reward: number) => void;
}

const NavIcon = ({ active, color, icon }: { active: boolean, color: string, icon?: string }) => (
  <div className={`transition-all duration-500 relative flex items-center justify-center ${active ? 'scale-125 -translate-y-1' : 'scale-100'}`}>
    <div 
      className={`absolute inset-[-15px] blur-3xl rounded-full transition-all duration-500 pointer-events-none ${active ? 'opacity-60 animate-pulse' : 'opacity-20'}`} 
      style={{ backgroundColor: color }} 
    />
    <div className={`relative z-10 text-4xl transition-all duration-500 ${active ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>
      {icon}
    </div>
  </div>
);

// @ts-ignore: Updated functional component to include new props
export const HubScreen: React.FC<HubScreenProps> = ({ 
  stats, 
  currentUser,
  isSyncing,
  hubSubView, 
  setHubSubView, 
  onStartGame, 
  onAddCoins, 
  onBuyHearts,
  onOpenChest,
  onClaimMission
}) => {
  const isMain = hubSubView === HubSubView.MAIN;
  
  const isLeftSideView = hubSubView === HubSubView.PLANETS || hubSubView === HubSubView.LEAGUE || hubSubView === HubSubView.SETTINGS;
  const isRightSideView = hubSubView === HubSubView.SHOP || hubSubView === HubSubView.MISSIONS || hubSubView === HubSubView.PROFILE;

  const stageTransform = isLeftSideView ? 'translateX(100%)' : isRightSideView ? 'translateX(-100%)' : 'translateX(0)';

  const navItems = [
    { view: HubSubView.PLANETS, color: '#22d3ee', icon: '📍' },
    { view: HubSubView.LEAGUE, color: '#818cf8', icon: '🥇' },
    { view: HubSubView.MAIN, isCustom: true, color: '#22d3ee', icon: '💠' },
    { view: HubSubView.MISSIONS, color: '#f472b6', icon: '📋' },
    { view: HubSubView.SHOP, color: '#fbbf24', icon: '🪙' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_60%)] opacity-40" />
      </div>

      <ParticleBackground />

      <div className={`transition-all duration-700 fixed top-0 left-0 right-0 z-[250] ${!isMain ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100 pointer-events-auto translate-y-0'}`}>
        <Header 
          stats={stats} 
          userPhoto={currentUser?.photoURL}
          isSyncing={isSyncing}
          onSettings={() => setHubSubView(HubSubView.SETTINGS)} 
          onProfile={() => setHubSubView(HubSubView.PROFILE)} 
          onShop={() => setHubSubView(HubSubView.SHOP)} 
        />
        
        <div className="absolute top-24 left-4 flex flex-col gap-4 z-[40] pointer-events-auto">
          <button 
            onClick={onOpenChest}
            className="w-16 h-16 bg-[#1e293b]/90 border-[4px] border-[#fbbf24]/50 border-b-[8px] border-b-[#d97706] backdrop-blur-3xl rounded-3xl flex items-center justify-center active:border-b-0 translate-y-0 active:translate-y-1 transition-all group relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-[#fbbf24]/20 to-transparent animate-pulse" />
             <span className="text-3xl relative z-10">🎁</span>
          </button>
          
          <button 
            onClick={() => onAddCoins(50)}
            className="w-16 h-16 bg-[#1e293b]/90 border-[4px] border-[#818cf8]/50 border-b-[8px] border-b-[#4f46e5] backdrop-blur-3xl rounded-3xl flex items-center justify-center active:border-b-0 translate-y-0 active:translate-y-1 transition-all group relative overflow-hidden"
          >
             <span className="text-3xl group-hover:scale-110 transition-transform relative z-10">📺</span>
             <div className="absolute -bottom-1 -right-1 bg-[#fbbf24] text-[#78350f] text-[9px] font-black px-2 py-0.5 rounded-lg border border-white shadow-lg">+50</div>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[150]" style={{ transform: stageTransform }}>
        
        <div className="absolute top-0 -left-full w-full h-full z-[160] overflow-hidden bg-[#020617]">
          {hubSubView === HubSubView.PLANETS && <PlanetMenuModal onClose={() => setHubSubView(HubSubView.MAIN)} currentLevel={stats.level} />}
          {hubSubView === HubSubView.LEAGUE && <RankingModal onClose={() => setHubSubView(HubSubView.MAIN)} stats={stats} />}
          {hubSubView === HubSubView.SETTINGS && <SettingsModal onClose={() => setHubSubView(HubSubView.MAIN)} />}
        </div>
        
        <div className={`w-full h-full flex flex-col items-center transition-all duration-700 z-[10] ${!isMain ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="flex-1 w-full flex flex-col items-center justify-center p-8 relative">
               <Portal3D level={stats.level} active={isMain} />
            </div>

            <div className={`w-full flex flex-col items-center mb-28 px-10 z-20 transition-opacity duration-500 ${!isMain ? 'opacity-0' : 'opacity-100'}`}>
                <Button 
                  variant="cyan" 
                  onClick={onStartGame} 
                  className="w-full !h-32 !rounded-[60px] !text-6xl !border-b-[20px] !border-b-[#0891b2] active:!border-b-0 active:!translate-y-5 !shadow-[0_40px_80px_rgba(34,211,238,0.4)] group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  BAŞLAT
                </Button>
            </div>
        </div>

        <div className="absolute top-0 left-full w-full h-full z-[160] overflow-hidden bg-[#020617]">
          {hubSubView === HubSubView.SHOP && <ShopModal coins={stats.coins} onBuyHearts={onBuyHearts} onClose={() => setHubSubView(HubSubView.MAIN)} />}
          {hubSubView === HubSubView.PROFILE && <ProfileModal level={stats.level} onClose={() => setHubSubView(HubSubView.MAIN)} />}
          {hubSubView === HubSubView.MISSIONS && <MissionsModal onClose={() => setHubSubView(HubSubView.MAIN)} stats={stats} onClaimReward={onClaimMission} />}
        </div>
      </div>

      <div className={`w-full h-[110px] z-[200] pb-safe bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent backdrop-blur-3xl border-t border-white/10 transition-all duration-500 translate-y-0`}>
          <nav className="w-full h-full flex px-8 items-center justify-between">
              {navItems.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setHubSubView(item.view as HubSubView)} 
                  className={`flex items-center justify-center relative transition-all duration-300 ${item.isCustom ? 'w-24 h-24 bg-white/5 border-b-[8px] border-[#0891b2]/50 rounded-[32px] -translate-y-4 shadow-2xl' : 'w-16 h-16'}`}
                >
                  {item.isCustom && <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none rounded-[32px]" />}
                  <NavIcon active={hubSubView === item.view} color={item.color || '#fff'} icon={item.icon} />
                </button>
              ))}
          </nav>
      </div>
    </div>
  );
};
