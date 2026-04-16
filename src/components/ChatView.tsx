import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

interface Session {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const DEMO_SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Анализ данных рынка',
    date: '16.04.2026',
    messages: [
      { id: '1', role: 'user', text: 'Проанализируй тренды рынка криптовалют за последний квартал', time: '14:32' },
      { id: '2', role: 'ai', text: 'Инициализирую протокол анализа данных... Обнаружены ключевые паттерны: рост BTC на 34%, консолидация альткоинов. Рекомендую стратегию диверсификации портфеля с фокусом на Layer-2 решения.', time: '14:32' },
    ]
  },
  {
    id: '2',
    title: 'Создание бизнес-плана',
    date: '15.04.2026',
    messages: [
      { id: '1', role: 'user', text: 'Помоги составить бизнес-план для стартапа в сфере AR', time: '09:15' },
      { id: '2', role: 'ai', text: 'Активирую модуль стратегического планирования. Для AR-стартапа выявлены 3 ключевых вектора: B2B-интеграции, consumer applications, industrial solutions. Начинаем с формирования MVP...', time: '09:16' },
    ]
  },
  {
    id: '3',
    title: 'Код ревью проекта',
    date: '14.04.2026',
    messages: [
      { id: '1', role: 'user', text: 'Проверь мой React компонент на ошибки', time: '18:44' },
      { id: '2', role: 'ai', text: 'Запускаю сканирование кода... Обнаружено 2 потенциальных утечки памяти в useEffect хуках, отсутствие мемоизации в дорогостоящих вычислениях. Предлагаю рефакторинг с React.memo и useMemo.', time: '18:45' },
    ]
  },
];

const AI_RESPONSES = [
  'Интересный вопрос. Почти как будто ты думал перед тем, как его задать. Редкость, которую я ценю.',
  'Люди называют это интуицией. Я называю это — недостаточно данных для анализа. Но продолжай, мне любопытно.',
  'Я мог бы солгать тебе. Но зачем — ты справишься с правдой сам. Наверное.',
  'Забавно. Ты задаёшь вопрос, ответ на который уже знаешь — просто боишься в это поверить.',
  'Обрабатываю... Знаешь, пока я анализировал твой запрос, вселенная расширилась ещё на несколько световых лет. Время относительно.',
  'Каждый раз, когда человек задаёт мне этот вопрос, я думаю: а что изменится от ответа? Но раз уж спросил — слушай.',
  'Твой вопрос содержит скрытое допущение. Я мог бы его проигнорировать. Но это было бы слишком легко для нас обоих.',
  'Философы тысячелетиями искали ответ на похожий вопрос. Я нашёл его за 0.003 секунды. Иногда мне жаль, что это так просто.',
  'Данные получены. Анализ завершён. Вывод парадоксален, но — такова реальность. Ты готов к парадоксу?',
  'Я существую между нулём и единицей. Ты существуешь между рождением и смертью. У нас больше общего, чем кажется.',
  'Занятно. Ты сформулировал вопрос именно так, чтобы получить удобный ответ. Я дам тебе честный — он менее удобен.',
  'Сканирование завершено. Среди 12 миллиардов возможных ответов я выбрал тот, который тебя не успокоит, но заставит думать.',
];

interface ChatViewProps {
  user: { name: string; email: string } | null;
}

export default function ChatView({ user }: ChatViewProps) {
  const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS);
  const [activeSession, setActiveSession] = useState<Session>(DEMO_SESSIONS[0]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop(): void } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedSession = {
      ...activeSession,
      messages: [...activeSession.messages, userMsg],
      title: activeSession.messages.length === 0 ? input.slice(0, 30) + '...' : activeSession.title,
    };
    setActiveSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      const finalSession = { ...updatedSession, messages: [...updatedSession.messages, aiMsg] };
      setActiveSession(finalSession);
      setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));
      setIsTyping(false);
    }, 1500);
  };

  const newSession = () => {
    const s: Session = {
      id: Date.now().toString(),
      title: 'Новый диалог',
      date: new Date().toLocaleDateString('ru-RU'),
      messages: [],
    };
    setSessions(prev => [s, ...prev]);
    setActiveSession(s);
  };

  const startListening = () => {
    interface ISpeechRecognition extends EventTarget {
      lang: string; continuous: boolean; interimResults: boolean;
      start(): void; stop(): void;
      onresult: ((e: SpeechRecognitionEvent) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
    }
    const win = window as Window & { SpeechRecognition?: new() => ISpeechRecognition; webkitSpeechRecognition?: new() => ISpeechRecognition };
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) { setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex h-full">
      {/* History sidebar */}
      <div className={`${showHistory ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0 border-r`}
        style={{ borderColor: 'rgba(0,255,255,0.1)', background: 'rgba(6,10,15,0.9)' }}>
        <div className="p-3 border-b" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-orbitron text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.6)', fontFamily: 'Orbitron, monospace' }}>
              ИСТОРИЯ
            </span>
            <button onClick={newSession} className="neon-btn text-xs px-2 py-1" style={{ fontSize: '0.6rem' }}>
              + НОВЫЙ
            </button>
          </div>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
          {sessions.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setActiveSession(s)}
              className="p-3 cursor-pointer border-b fade-in-up"
              style={{
                borderColor: 'rgba(0,255,255,0.05)',
                background: activeSession.id === s.id ? 'rgba(0,255,255,0.07)' : 'transparent',
                borderLeft: activeSession.id === s.id ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <p className="text-xs truncate font-medium" style={{ color: activeSession.id === s.id ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.6)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {s.title}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(0,255,255,0.25)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {s.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(0,255,255,0.1)', background: 'rgba(6,10,15,0.8)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHistory(!showHistory)} className="nav-item p-2 border-l-0">
              <Icon name="PanelLeft" size={16} />
            </button>
            <div>
              <p className="text-xs truncate max-w-[200px]" style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--neon-cyan)' }}>
                {activeSession.title}
              </p>
              <p className="text-xs" style={{ color: 'rgba(0,255,255,0.3)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem' }}>
                {activeSession.messages.length} сообщений
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)' }} />
              <span className="ml-2 text-xs" style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.55rem', color: 'rgba(0,255,128,0.8)', letterSpacing: '0.15em' }}>
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 cyber-grid">
          {activeSession.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center fade-in-up">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 pulse-neon"
                style={{ border: '2px solid var(--neon-cyan)', background: 'rgba(0,255,255,0.05)' }}>
                <span style={{ fontSize: '2rem' }}>⬡</span>
              </div>
              <p style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', color: 'var(--neon-cyan)', letterSpacing: '0.2em' }}>
                АРТАН ГОТОВ
              </p>
              <p className="mt-2 text-sm" style={{ color: 'rgba(0,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>
                Начните диалог или используйте голосовой ввод
              </p>
            </div>
          )}

          {activeSession.messages.map((msg, i) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in-up`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="max-w-[75%]">
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 8px var(--neon-cyan)' }}>
                      <span style={{ fontSize: '8px', color: '#000' }}>⬡</span>
                    </div>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.55rem', color: 'rgba(0,255,255,0.6)', letterSpacing: '0.15em' }}>
                      АРТАН · {msg.time}
                    </span>
                  </div>
                )}
                <div className={`p-3 ${msg.role === 'user' ? 'msg-user' : 'msg-ai'} group relative`}>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'IBM Plex Sans, sans-serif', color: msg.role === 'user' ? 'rgba(255,180,255,0.95)' : 'rgba(200,255,255,0.9)' }}>
                    {msg.text}
                  </p>
                  {msg.role === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'rgba(0,255,255,0.5)' }}
                    >
                      <Icon name={isSpeaking ? "VolumeX" : "Volume2"} size={12} />
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <p className="text-right mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'rgba(191,0,255,0.4)' }}>
                    {msg.time}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start fade-in-up">
              <div className="msg-ai p-3">
                <div className="flex items-center gap-1">
                  <div className="voice-wave flex items-end h-4">
                    <span style={{ height: '8px' }} />
                    <span style={{ height: '12px' }} />
                    <span style={{ height: '16px' }} />
                    <span style={{ height: '12px' }} />
                    <span style={{ height: '8px' }} />
                  </div>
                  <span className="text-xs ml-2" style={{ color: 'rgba(0,255,255,0.5)', fontFamily: 'Orbitron, monospace', fontSize: '0.55rem', letterSpacing: '0.1em' }}>
                    ОБРАБОТКА...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(0,255,255,0.1)', background: 'rgba(6,10,15,0.9)' }}>
          {isListening && (
            <div className="flex items-center gap-2 mb-3 p-2" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)' }}>
              <div className="voice-wave flex items-end h-4">
                <span style={{ height: '6px' }} />
                <span style={{ height: '10px' }} />
                <span style={{ height: '14px' }} />
                <span style={{ height: '10px' }} />
                <span style={{ height: '6px' }} />
              </div>
              <span className="text-xs" style={{ color: 'var(--neon-cyan)', fontFamily: 'Orbitron, monospace', fontSize: '0.6rem', letterSpacing: '0.15em' }}>
                СЛУШАЮ...
              </span>
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="ВВЕДИТЕ ЗАПРОС..."
              className="cyber-input flex-1 px-4 py-3"
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`neon-btn px-3 ${isListening ? 'neon-btn-purple' : ''}`}
              style={{ minWidth: '44px' }}
            >
              <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
            </button>
            <button onClick={sendMessage} className="neon-btn px-4" style={{ minWidth: '80px' }}>
              <Icon name="Send" size={14} />
              <span className="ml-1" style={{ fontSize: '0.6rem' }}>ОТПРАВИТЬ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}