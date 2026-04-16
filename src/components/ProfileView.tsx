import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface User {
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  dialogues: number;
  joined: string;
}

interface ProfileViewProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const DEMO_USER: User = {
  name: 'Алекс Кириллов',
  email: 'alex@cyber.net',
  level: 7,
  xp: 3480,
  dialogues: 42,
  joined: '12.01.2026',
};

export default function ProfileView({ user, onLogin, onLogout }: ProfileViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError('');
    if (!email || !password) { setError('ЗАПОЛНИТЕ ВСЕ ПОЛЯ'); return; }
    if (mode === 'register' && !name) { setError('ВВЕДИТЕ ИМЯ'); return; }
    setLoading(true);
    setTimeout(() => {
      onLogin({ ...DEMO_USER, name: name || DEMO_USER.name, email });
      setLoading(false);
    }, 1200);
  };

  if (user) {
    const xpPercent = (user.xp % 500) / 5;
    const stats = [
      { label: 'ДИАЛОГИ', value: user.dialogues, icon: 'MessageSquare' },
      { label: 'УРОВЕНЬ', value: user.level, icon: 'Zap' },
      { label: 'ДАТА', value: user.joined, icon: 'Calendar' },
    ];

    return (
      <div className="p-6 max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="relative p-6 mb-6 corner-tl corner-br" style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.15)' }}>
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 hex-avatar flex items-center justify-center text-3xl pulse-neon"
                style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(191,0,255,0.2))', border: '2px solid var(--neon-cyan)' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green)' }}>
                <Icon name="Check" size={10} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 style={{ fontFamily: 'Orbitron, monospace', color: 'var(--neon-cyan)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                {user.name.toUpperCase()}
              </h2>
              <p className="mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(0,255,255,0.5)', fontSize: '0.75rem' }}>
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.6rem', color: 'var(--neon-purple)', letterSpacing: '0.15em', border: '1px solid var(--neon-purple)', padding: '2px 8px' }}>
                  LVL {user.level}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(0,255,255,0.4)' }}>
                  {user.xp} XP
                </span>
              </div>
            </div>

            <button onClick={onLogout} className="neon-btn neon-btn-purple text-xs">
              ВЫЙТИ
            </button>
          </div>

          {/* XP bar */}
          <div className="mt-5">
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.55rem', color: 'rgba(0,255,255,0.5)', letterSpacing: '0.15em' }}>
                ПРОГРЕСС LVL {user.level + 1}
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'var(--neon-cyan)' }}>
                {user.xp % 500}/500 XP
              </span>
            </div>
            <div className="h-1.5 rounded-none" style={{ background: 'rgba(0,255,255,0.1)' }}>
              <div className="h-full transition-all duration-1000"
                style={{ width: `${xpPercent}%`, background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))', boxShadow: '0 0 8px var(--neon-cyan)' }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className="p-4 text-center fade-in-up"
              style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.1)' }}>
              <Icon name={s.icon as Parameters<typeof Icon>[0]['name']} size={20} style={{ color: 'var(--neon-cyan)', margin: '0 auto 8px' }} />
              <p style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                {s.value}
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,255,255,0.4)', letterSpacing: '0.1em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{ border: '1px solid rgba(0,255,255,0.1)', background: 'rgba(0,255,255,0.02)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.65rem', color: 'rgba(0,255,255,0.6)', letterSpacing: '0.15em' }}>
              НАСТРОЙКИ
            </span>
          </div>
          {[
            { icon: 'Bell', label: 'Уведомления', val: 'Включены' },
            { icon: 'Globe', label: 'Язык', val: 'Русский' },
            { icon: 'Shield', label: 'Двухфакторная аутентификация', val: 'Выключена' },
            { icon: 'Volume2', label: 'Голос Артана', val: 'Системный' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 border-b cursor-pointer group"
              style={{ borderColor: 'rgba(0,255,255,0.05)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={16} style={{ color: 'rgba(0,255,255,0.5)' }} />
                <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.85rem', color: 'rgba(200,255,255,0.8)' }}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: 'rgba(0,255,255,0.4)' }}>
                  {item.val}
                </span>
                <Icon name="ChevronRight" size={14} style={{ color: 'rgba(0,255,255,0.3)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="w-full max-w-sm">
        {/* Auth card */}
        <div className="relative p-8 corner-tl corner-br"
          style={{ background: 'rgba(6,10,15,0.95)', border: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 40px rgba(0,255,255,0.05)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 pulse-neon flex items-center justify-center"
              style={{ border: '2px solid var(--neon-cyan)', background: 'rgba(0,255,255,0.05)' }}>
              <span style={{ fontSize: '1.8rem' }}>⬡</span>
            </div>
            <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.2rem', color: 'var(--neon-cyan)', letterSpacing: '0.3em' }}>
              АРТАН
            </h1>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(0,255,255,0.4)', marginTop: '4px', letterSpacing: '0.1em' }}>
              {mode === 'login' ? 'АВТОРИЗАЦИЯ СИСТЕМЫ' : 'РЕГИСТРАЦИЯ АГЕНТА'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6" style={{ border: '1px solid rgba(0,255,255,0.15)' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 text-xs transition-all"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: mode === m ? '#000' : 'rgba(0,255,255,0.5)',
                  background: mode === m ? 'var(--neon-cyan)' : 'transparent',
                }}>
                {m === 'login' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {mode === 'register' && (
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="ИМЯ АГЕНТА" className="cyber-input w-full px-4 py-3 fade-in-up" />
            )}
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="EMAIL" type="email" className="cyber-input w-full px-4 py-3" />
            <input value={password} onChange={e => setPassword(e.target.value)}
              placeholder="ПАРОЛЬ" type="password" className="cyber-input w-full px-4 py-3" />
          </div>

          {error && (
            <p className="mt-3 text-center fade-in-up" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'var(--destructive)', letterSpacing: '0.1em' }}>
              ⚠ {error}
            </p>
          )}

          <button onClick={handleSubmit} className="neon-btn w-full mt-5 py-3 flex items-center justify-center gap-2"
            style={{ clipPath: 'none', borderRadius: '0' }} disabled={loading}>
            {loading ? (
              <div className="loading-bar w-16 h-0.5" style={{ background: 'rgba(0,255,255,0.2)' }} />
            ) : (
              <>
                <Icon name="LogIn" size={14} />
                {mode === 'login' ? 'ВОЙТИ В СИСТЕМУ' : 'СОЗДАТЬ АГЕНТА'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
