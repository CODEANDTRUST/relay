import { useState } from 'react';
import {
  RadioTower, RefreshCw, Filter, Search, Activity, Pencil, Clock, User, Truck,
  AlertOctagon, AlertTriangle, CheckCircle2, Plus, Minus, Send,
} from 'lucide-react';
import { RelayWordmark } from './RelayWordmark';
import { SITES, TICKER, SITUATION, type SupplyStatus, type Site } from './data';

const STATUS_COLOR: Record<SupplyStatus, string> = {
  stocked: '#2E7D4F',
  low: '#D97706',
  out: '#C8312C',
};

const TABS = ['BOARD', 'SITES', 'HANDOFF', 'AUDIT', 'SETTINGS'] as const;

export function CommandView() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('BOARD');
  const [activeFilter, setActiveFilter] = useState<'all' | SupplyStatus>('all');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('riverview');

  const visibleSites = SITES.filter(
    (s) => activeFilter === 'all' || s.status === activeFilter,
  );

  const counts = {
    out:     SITES.filter((s) => s.status === 'out').length,
    low:     SITES.filter((s) => s.status === 'low').length,
    stocked: SITES.filter((s) => s.status === 'stocked').length,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0F14',
        color: '#FAFAF7',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      {!bannerDismissed && <StaleBanner onDismiss={() => setBannerDismissed(true)} />}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 540px', gap: 0 }}>
        <MapPane selectedSiteId={selectedSiteId} onSelectSite={setSelectedSiteId} />
        <SituationPane
          counts={counts}
          visibleSites={visibleSites}
          selectedSiteId={selectedSiteId}
          onSelectSite={setSelectedSiteId}
        />
      </div>
    </div>
  );
}

function TopBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: typeof TABS[number]) => void }) {
  return (
    <div
      style={{
        height: 56,
        background: '#0F1419',
        borderBottom: '1px solid #1F2630',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 32,
      }}
    >
      <RelayWordmark size="md" tone="light" />
      <nav style={{ display: 'flex', gap: 24 }}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            style={{
              background: 'transparent',
              border: 'none',
              color: t === activeTab ? '#FAFAF7' : '#5C6670',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              padding: '6px 0',
              borderBottom: t === activeTab ? '2px solid #0066CC' : '2px solid transparent',
            }}
          >
            {t}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          border: '1px solid #C8312C',
          borderRadius: 6,
          color: '#C8312C',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}
      >
        <RadioTower size={14} strokeWidth={1.75} />
        LAST SYNC 60S AGO
        <RefreshCw size={12} strokeWidth={1.75} />
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: '#2E7D4F' }} aria-hidden />
        <span style={{ fontSize: 13, color: '#FAFAF7' }}>{SITUATION.commander}</span>
      </div>
    </div>
  );
}

function StaleBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="alert"
      style={{
        background: '#C8312C',
        color: '#FAFAF7',
        display: 'flex',
        alignItems: 'center',
        padding: '14px 20px',
        gap: 12,
      }}
    >
      <AlertOctagon size={16} strokeWidth={1.75} />
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
        LAST SYNC 60S AGO, FEED MAY BE STALE. RETRYING.
      </span>
      <span style={{ flex: 1 }} />
      <button
        type="button"
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: '1px solid #FAFAF7',
          color: '#FAFAF7',
          padding: '6px 14px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Dismiss
      </button>
    </div>
  );
}

function FilterBar({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: 'all' | SupplyStatus;
  onFilterChange: (f: 'all' | SupplyStatus) => void;
  counts: { out: number; low: number; stocked: number };
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        borderBottom: '1px solid #1F2630',
        background: '#0F1419',
      }}
    >
      <button
        type="button"
        style={iconBtn}
        aria-label="Filter"
      >
        <Filter size={16} strokeWidth={1.75} color="#5C6670" />
      </button>
      <button
        type="button"
        onClick={() => onFilterChange('all')}
        style={{
          ...pillBtn,
          background: activeFilter === 'all' ? '#0066CC' : 'transparent',
          color: activeFilter === 'all' ? '#FAFAF7' : '#FAFAF7',
          borderColor: activeFilter === 'all' ? '#0066CC' : '#1F2630',
        }}
      >
        ALL SITES
      </button>
      <StatusFilterPill
        status="out"
        label="OUT"
        count={counts.out}
        active={activeFilter === 'out'}
        onClick={() => onFilterChange(activeFilter === 'out' ? 'all' : 'out')}
      />
      <StatusFilterPill
        status="low"
        label="LOW"
        count={counts.low}
        active={activeFilter === 'low'}
        onClick={() => onFilterChange(activeFilter === 'low' ? 'all' : 'low')}
      />
      <StatusFilterPill
        status="stocked"
        label="STOCKED"
        count={counts.stocked}
        active={activeFilter === 'stocked'}
        onClick={() => onFilterChange(activeFilter === 'stocked' ? 'all' : 'stocked')}
      />
      <Dropdown label="All categories" />
      <Dropdown label="All sectors" />
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#0B0F14',
          border: '1px solid #1F2630',
          borderRadius: 6,
          minWidth: 280,
        }}
      >
        <Search size={14} strokeWidth={1.75} color="#5C6670" />
        <input
          type="text"
          placeholder="Search site or reporter"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FAFAF7',
            fontFamily: 'inherit',
            fontSize: 13,
            flex: 1,
          }}
        />
      </div>
    </div>
  );
}

function StatusFilterPill({
  status,
  label,
  active,
  onClick,
}: {
  status: SupplyStatus;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...pillBtn,
        background: active ? STATUS_COLOR[status] : 'transparent',
        color: active ? '#FAFAF7' : '#FAFAF7',
        borderColor: active ? STATUS_COLOR[status] : '#1F2630',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: STATUS_COLOR[status],
          marginRight: 8,
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
        aria-hidden
      />
      {label}
    </button>
  );
}

function Dropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        ...pillBtn,
        background: 'transparent',
        color: '#FAFAF7',
        borderColor: '#1F2630',
      }}
    >
      {label}
    </button>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid #1F2630',
  borderRadius: 6,
  cursor: 'pointer',
};

const pillBtn: React.CSSProperties = {
  height: 32,
  padding: '0 14px',
  border: '1px solid #1F2630',
  borderRadius: 6,
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.06em',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
};

function MapPane({ selectedSiteId, onSelectSite }: { selectedSiteId: string; onSelectSite: (id: string) => void }) {
  const markers: Array<{ id: string; name: string; status: SupplyStatus; x: number; y: number }> = [
    { id: 'lakewood',      name: 'Lakewood Ranch Town Hall',  status: 'stocked', x: 62, y: 50 },
    { id: 'newtown',       name: 'Newtown Estates Rec Center', status: 'out',     x: 42, y: 66 },
    { id: 'bayfront',      name: 'Bayfront Park Pavilion',     status: 'low',     x: 38, y: 78 },
    { id: 'firestation-2', name: 'POD 3 / Fire Station 2',     status: 'low',     x: 47, y: 84 },
    { id: 'fruitville',    name: 'Fruitville Library',         status: 'low',     x: 55, y: 74 },
    { id: 'riverview',     name: 'Riverview High School',      status: 'out',     x: 25, y: 70 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 720,
        background:
          'radial-gradient(circle at 30% 50%, rgba(40, 80, 70, 0.85) 0%, rgba(20, 40, 35, 0.95) 40%, #0B1410 100%)',
        borderRight: '1px solid #1F2630',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.4 }}
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#1a2a26" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <path d="M 0 35 Q 20 30 35 38 Q 50 50 70 45 Q 85 40 100 48 L 100 100 L 0 100 Z" fill="rgba(20, 50, 70, 0.55)" />
        <path d="M 0 20 Q 18 18 25 22 L 25 32 Q 18 30 0 30 Z" fill="rgba(20, 60, 80, 0.55)" />
        <path d="M 5 55 Q 12 60 22 58 Q 30 56 35 60 L 35 65 Q 25 64 18 65 Q 10 65 5 62 Z" fill="rgba(20, 60, 80, 0.55)" />
      </svg>

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 14px',
            background: 'rgba(15, 20, 25, 0.85)',
            border: '1px solid #1F2630',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#FAFAF7',
            backdropFilter: 'blur(6px)',
          }}
        >
          {SITUATION.countyLabel}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <LegendCard color="#C8312C" title="FLOOD ZONES"   meta="3 major · 7 total" />
        <LegendCard color="#D97706" title="ROAD CLOSURES" meta="3 closed · 3 caution" />
        <LegendCard color="#0066CC" title="STREET LABELS" meta="Esri reference layer" />
      </div>

      <div style={{ position: 'absolute', top: 16, right: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button type="button" style={mapZoomBtn} aria-label="Zoom in"><Plus size={16} strokeWidth={1.75} color="#FAFAF7" /></button>
        <button type="button" style={mapZoomBtn} aria-label="Zoom out"><Minus size={16} strokeWidth={1.75} color="#FAFAF7" /></button>
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden
      >
        <polygon points="22,68 28,67 30,72 26,76 22,75" fill="rgba(200, 49, 44, 0.45)" stroke="#C8312C" strokeWidth="0.3" />
        <polygon points="36,76 42,76 44,82 39,84 34,82" fill="rgba(217, 119, 6, 0.45)" stroke="#D97706" strokeWidth="0.3" />
        <polygon points="52,71 60,71 60,77 53,77" fill="rgba(0, 102, 204, 0.35)" stroke="#0066CC" strokeWidth="0.3" />
        <rect x="2" y="60" width="3" height="5" fill="#C8312C" />
      </svg>

      {markers.map((m) => (
        <SiteMarker
          key={m.id}
          marker={m}
          selected={m.id === selectedSiteId}
          onClick={() => onSelectSite(m.id)}
        />
      ))}
    </div>
  );
}

const mapZoomBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 20, 25, 0.85)',
  border: '1px solid #1F2630',
  borderRadius: 4,
  cursor: 'pointer',
  backdropFilter: 'blur(6px)',
};

function LegendCard({ color, title, meta }: { color: string; title: string; meta: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        background: 'rgba(15, 20, 25, 0.85)',
        border: '1px solid #1F2630',
        borderRadius: 6,
        minWidth: 170,
        backdropFilter: 'blur(6px)',
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          background: color,
          borderRadius: 2,
          display: 'inline-block',
          flexShrink: 0,
        }}
        aria-hidden
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#FAFAF7' }}>{title}</span>
        <span style={{ fontSize: 11, color: '#5C6670' }}>{meta}</span>
      </div>
    </div>
  );
}

function SiteMarker({
  marker,
  selected,
  onClick,
}: {
  marker: { id: string; name: string; status: SupplyStatus; x: number; y: number };
  selected: boolean;
  onClick: () => void;
}) {
  const color = STATUS_COLOR[marker.status];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
      aria-label={marker.name}
    >
      <span
        style={{
          width: selected ? 18 : 14,
          height: selected ? 18 : 14,
          borderRadius: 999,
          background: color,
          boxShadow: selected ? `0 0 0 4px rgba(255, 255, 255, 0.25)` : 'none',
          border: '2px solid #0B0F14',
          transition: 'all 120ms ease',
        }}
        aria-hidden
      />
      <span
        style={{
          fontSize: 11,
          color: '#FAFAF7',
          background: 'rgba(15, 20, 25, 0.85)',
          padding: '3px 8px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          fontWeight: 500,
          backdropFilter: 'blur(4px)',
        }}
      >
        {marker.name}
      </span>
    </button>
  );
}

function SituationPane({
  counts,
  visibleSites,
  selectedSiteId,
  onSelectSite,
}: {
  counts: { out: number; low: number; stocked: number };
  visibleSites: Site[];
  selectedSiteId: string;
  onSelectSite: (id: string) => void;
}) {
  return (
    <aside
      style={{
        background: '#0F1419',
        borderLeft: '1px solid #1F2630',
        padding: '20px 24px',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 56px - 56px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#5C6670', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}>
          <Activity size={14} strokeWidth={1.75} />
          SITUATION
        </div>
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: '1px solid #1F2630',
            borderRadius: 6,
            color: '#FAFAF7',
            padding: '6px 10px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <Pencil size={12} strokeWidth={1.75} /> Edit
        </button>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{SITUATION.title}</h2>
      <div style={{ marginTop: 6, color: '#5C6670', fontSize: 12 }}>
        {SITUATION.code} · {SITUATION.activatedAgo}
      </div>
      <p style={{ marginTop: 14, color: '#FAFAF7', opacity: 0.85, fontSize: 13, lineHeight: 1.6 }}>
        {SITUATION.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
        <Metric color="#C8312C" label="SITES OUT" value={counts.out} />
        <Metric color="#D97706" label="SITES LOW" value={counts.low} />
        <Metric color="#2E7D4F" label="ALL STOCKED" value={counts.stocked} />
      </div>

      <div style={{ marginTop: 28, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#5C6670', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}>
        <Activity size={14} strokeWidth={1.75} />
        LIVE TICKER
      </div>
      <div>
        {TICKER.map((t) => (
          <TickerRow key={t.id} item={t} />
        ))}
      </div>

      <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C6670' }}>
          PRIORITY STACK · {visibleSites.length} SITES
        </span>
        <span style={{ fontSize: 11, color: '#5C6670', letterSpacing: '0.06em' }}>SORTED: ACTION-NEEDED FIRST</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibleSites.map((s) => (
          <PriorityCard key={s.id} site={s} selected={s.id === selectedSiteId} onClick={() => onSelectSite(s.id)} />
        ))}
      </div>
    </aside>
  );
}

function Metric({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#5C6670' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 600, color: '#FAFAF7', lineHeight: 1.1, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

function TickerRow({ item }: { item: { id: string; age: string; level: SupplyStatus | 'info'; message: string } }) {
  const color =
    item.level === 'out' ? '#C8312C' :
    item.level === 'low' ? '#D97706' :
    item.level === 'stocked' ? '#2E7D4F' :
    '#5C6670';
  const Icon =
    item.level === 'out' ? AlertOctagon :
    item.level === 'low' ? AlertTriangle :
    item.level === 'stocked' ? CheckCircle2 :
    Truck;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderTop: '1px solid #1F2630',
      }}
    >
      <span style={{ color: '#5C6670', fontSize: 12, minWidth: 56 }}>{item.age}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', minWidth: 56 }}>
        <Icon size={14} strokeWidth={1.75} />
        {item.level !== 'info' && item.level.toUpperCase()}
      </span>
      <span style={{ flex: 1, fontSize: 13, color: '#FAFAF7' }}>{item.message}</span>
    </div>
  );
}

function PriorityCard({
  site,
  selected,
  onClick,
}: {
  site: Site;
  selected: boolean;
  onClick: () => void;
}) {
  const color = STATUS_COLOR[site.status];
  const Icon = site.status === 'out' ? AlertOctagon : site.status === 'low' ? AlertTriangle : CheckCircle2;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: '#0B0F14',
        border: '1px solid #1F2630',
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: '14px 16px',
        cursor: 'pointer',
        outline: selected ? '1px solid #0066CC' : 'none',
        outlineOffset: selected ? 0 : 0,
        color: '#FAFAF7',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#5C6670', display: 'flex', alignItems: 'center', gap: 8 }}>
            {site.sector.toUpperCase()}
            {site.unacknowledged && (
              <span style={{ color: '#C8312C', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertOctagon size={11} strokeWidth={1.75} />
                UNACK TASKING
              </span>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{site.name}</div>
          {site.unacknowledged && site.reporter && (
            <div style={{ fontSize: 12, color: '#5C6670', marginTop: 2 }}>
              Unacknowledged tasking, {site.reporter}
            </div>
          )}
          {!site.unacknowledged && (
            <div style={{ fontSize: 12, color: '#5C6670', marginTop: 2 }}>
              {site.categories.filter((c) => c.status === site.status).length} category {site.status.toUpperCase()}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: color,
            color: '#FAFAF7',
            padding: '5px 10px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <Icon size={12} strokeWidth={1.75} />
          {site.status}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {site.categories.slice(0, 5).map((c) => (
          <div key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: STATUS_COLOR[c.status] }} aria-hidden />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAFAF7' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #1F2630' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5C6670' }}>
          <Clock size={12} strokeWidth={1.75} />
          Last report {site.lastReport}
        </span>
        <span style={{ fontSize: 11, color: '#5C6670', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {site.unacknowledged ? (
            <>
              <User size={12} strokeWidth={1.75} color="#C8312C" />
              <span style={{ color: '#FAFAF7' }}>{site.reporter}</span>
              · Awaiting ack
            </>
          ) : site.enRouteEta ? (
            <>
              <Truck size={12} strokeWidth={1.75} color="#0066CC" />
              <span style={{ color: '#FAFAF7' }}>{site.reporter}</span>
              · En route · {site.enRouteEta}
            </>
          ) : site.status === 'low' ? (
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#0066CC',
                color: '#FAFAF7',
                border: 'none',
                padding: '5px 12px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <Send size={12} strokeWidth={1.75} />
              Task
            </button>
          ) : null}
        </span>
      </div>
    </button>
  );
}
