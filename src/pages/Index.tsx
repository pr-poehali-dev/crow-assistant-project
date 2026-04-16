import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ChatView from '@/components/ChatView';
import ProfileView from '@/components/ProfileView';

interface User {
  name: string;
  email: string;
  level: number;
  xp: number;
  dialogues: number;
  joined: string;
}

type Tab = 'chat' | 'profile';

const NAV_ITEMS = [
  { id: 'chat' as Tab, label: 'ЧАТ', icon: 'MessageSquare' },
  { id: 'profile' as Tab, label: 'ПРОФИЛЬ', icon: 'User' },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>('chat');
  const [user, setUser] = useState<User | null>(null);
  const [bootDone, setBootDone] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const bootLines = [
    'ИНИЦИАЛИЗАЦИЯ АРТАН v2.047...',
    'ЗАГРУЗКА НЕЙРОННЫХ МАТРИЦ...',
    'ПОДКЛЮЧЕНИЕ К СЕТИ...',
    'КАЛИБРОВКА ГОЛОСОВЫХ МОДУЛЕЙ...',
    'СИСТЕМА ГОТОВА.',
  ];

  useEffect(() => {
    if (bootStep < bootLines.length) {
      const t = setTimeout(() => setBootStep(prev => prev + 1), 300);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setBootDone(true), 400);
      return () => clearTimeout(t);
    }
  }, [bootStep, bootLines.length]);

  if (!bootDone) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center scanlines"
        style={{ background: 'var(--dark-bg)' }}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 pulse-neon flex items-center justify-center"
            style={{ border: '2px solid var(--neon-cyan)', background: 'rgba(0,255,255,0.03)' }}>
            <span style={{ fontSize: '3rem' }}>⬡</span>
          </div>
          <h1 className="glitch mb-8" data-text="АРТАН"
            style={{ fontFamily: 'Orbitron, monospace', fontSize: '3rem', color: 'var(--neon-cyan)', letterSpacing: '0.4em', fontWeight: 900 }}>
            АРТАН
          </h1>
          <div className="space-y-1 w-80 text-left mx-auto">
            {bootLines.slice(0, bootStep).map((line, i) => (
              <div key={i} className="flex items-center gap-2 fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span style={{ color: 'var(--neon-cyan)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem' }}>▶</span>
                <span style={{ color: i === bootStep - 1 ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem' }}
                  className={i === bootStep - 1 ? 'cursor-blink' : ''}>
                  {line}
                </span>
              </div>
            ))}
          </div>
          {bootStep >= bootLines.length && (
            <div className="mt-6 h-0.5 w-80 mx-auto" style={{ background: 'rgba(0,255,255,0.1)' }}>
              <div className="h-full" style={{ width: '100%', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))', boxShadow: '0 0 10px var(--neon-cyan)' }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex scanlines" style={{ background: 'var(--dark-bg)' }}>
      {/* Sidebar nav */}
      <aside className="flex flex-col w-48 flex-shrink-0 border-r"
        style={{ borderColor: 'rgba(0,255,255,0.1)', background: 'rgba(4,8,13,0.97)' }}>
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center pulse-neon"
              style={{ border: '1px solid var(--neon-cyan)', background: 'rgba(0,255,255,0.05)' }}>
              <span style={{ fontSize: '1rem' }}>⬡</span>
            </div>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.8rem', color: 'var(--neon-cyan)', letterSpacing: '0.2em', fontWeight: 700 }}>
              АРТАН
            </span>
          </div>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', color: 'rgba(0,255,255,0.3)', marginTop: '6px', letterSpacing: '0.1em' }}>
            v2.047 · ONLINE
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <div key={item.id} onClick={() => setTab(item.id)}
              className={`nav-item flex items-center gap-3 ${tab === item.id ? 'active' : ''}`}>
              <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={15} />
              {item.label}
            </div>
          ))}
        </nav>

        {/* User status */}
        {user && (
          <div className="p-4 border-t" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', color: '#000' }}>
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(0,255,255,0.8)' }}>
                  {user.name.split(' ')[0].toUpperCase()}
                </p>
                <p style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.5rem', color: 'var(--neon-purple)', letterSpacing: '0.1em' }}>
                  LVL {user.level}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom status */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(0,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', color: 'rgba(0,255,255,0.3)', letterSpacing: '0.1em' }}>
              SYS NOMINAL
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(0,255,255,0.1)', background: 'rgba(6,10,15,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.7rem', color: 'rgba(0,255,255,0.5)', letterSpacing: '0.2em' }}>
              {tab === 'chat' ? '[ ЧАТ-ИНТЕРФЕЙС ]' : '[ ПРОФИЛЬ АГЕНТА ]'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,255,255,0.4)' }}>
                {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,255,255,0.25)' }}>
                SECTOR: 7 · NODE: A12
              </p>
            </div>
            <button
              onClick={() => setTab('profile')}
              className="flex items-center gap-2 px-3 py-1.5"
              style={{ border: '1px solid rgba(0,255,255,0.15)', color: user ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.4)', fontFamily: 'Orbitron, monospace', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
              <Icon name="User" size={12} />
              {user ? user.name.split(' ')[0].toUpperCase() : 'ВОЙТИ'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {tab === 'chat' && <ChatView user={user} />}
          {tab === 'profile' && (
            <div className="h-full overflow-y-auto">
              <ProfileView
                user={user}
                onLogin={setUser}
                onLogout={() => setUser(null)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Decorative corner lines */}
      <div className="fixed top-0 right-0 w-16 h-16 pointer-events-none"
        style={{ borderRight: '1px solid rgba(0,255,255,0.15)', borderTop: '1px solid rgba(0,255,255,0.15)' }} />
      <div className="fixed bottom-0 left-0 w-16 h-16 pointer-events-none"
        style={{ borderLeft: '1px solid rgba(0,255,255,0.1)', borderBottom: '1px solid rgba(0,255,255,0.1)' }} />
    </div>
  );
}
