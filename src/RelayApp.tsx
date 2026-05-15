import { useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { VolunteerView } from './VolunteerView';
import { CommandView } from './CommandView';

type View = 'volunteer' | 'command';

function readHashView(): View {
  if (typeof window === 'undefined') return 'volunteer';
  return window.location.hash === '#command' ? 'command' : 'volunteer';
}

export function RelayApp() {
  const [view, setView] = useState<View>(readHashView);

  useEffect(() => {
    function onHash() { setView(readHashView()); }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function switchTo(next: View) {
    setView(next);
    if (typeof window !== 'undefined') {
      window.location.hash = next === 'command' ? '#command' : '';
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {view === 'volunteer' ? <VolunteerView /> : <CommandView />}
      <ViewToggle view={view} onSwitch={switchTo} />
    </div>
  );
}

function ViewToggle({ view, onSwitch }: { view: View; onSwitch: (v: View) => void }) {
  const next: View = view === 'volunteer' ? 'command' : 'volunteer';
  const Icon = view === 'volunteer' ? Monitor : Smartphone;
  const label = view === 'volunteer' ? 'View command center' : 'View field volunteer';

  return (
    <button
      type="button"
      onClick={() => onSwitch(next)}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: view === 'volunteer' ? '#0F1419' : '#0066CC',
        color: '#FAFAF7',
        border: 'none',
        borderRadius: 8,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(15, 20, 25, 0.18)',
        zIndex: 50,
      }}
      aria-label={label}
    >
      <Icon size={14} strokeWidth={1.75} />
      {label}
    </button>
  );
}
