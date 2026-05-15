import { useState } from 'react';
import { MapPin, CheckCircle2, AlertTriangle, AlertOctagon, User, ArrowRight } from 'lucide-react';
import { SUPPLY_CATEGORIES, type SupplyStatus, type SupplyCategory } from './data';

const STATUS_COLOR: Record<SupplyStatus, string> = {
  stocked: '#2E7D4F',
  low: '#D97706',
  out: '#C8312C',
};

const STATUS_LABEL: Record<SupplyStatus, string> = {
  stocked: 'STOCKED',
  low: 'LOW',
  out: 'OUT',
};

type FeedItem = {
  id: number;
  category: string;
  status: SupplyStatus;
  who: string;
  at: number;
};

export function VolunteerView() {
  const [categories, setCategories] = useState<SupplyCategory[]>(SUPPLY_CATEGORIES);
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: -3, category: 'Hygiene', status: 'stocked', who: 'Guest', at: Date.now() - 5000 },
    { id: -2, category: 'Diapers', status: 'low',     who: 'Guest', at: Date.now() - 12000 },
    { id: -1, category: 'Water',   status: 'out',     who: 'Guest', at: Date.now() - 22000 },
  ]);
  const [name, setName] = useState('');

  function report(categoryId: string, status: SupplyStatus) {
    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId ? { ...c, status, lastUpdate: 'just sent' } : c,
      ),
    );
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;
    setFeed(prev => [
      { id: Date.now(), category: cat.label, status, who: name || 'Guest', at: Date.now() },
      ...prev,
    ].slice(0, 6));
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAFAF7',
        color: '#0F1419',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '32px 24px 120px',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5C6670', fontSize: 14, marginBottom: 12 }}>
          <MapPin size={16} strokeWidth={1.75} />
          <span>Sector A</span>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.1, margin: 0, letterSpacing: '-0.01em' }}>
          Riverview High School
        </h1>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 12,
            color: '#0066CC',
            fontSize: 16,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Wrong site? Pick another <ArrowRight size={16} strokeWidth={1.75} />
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onReport={(s) => report(cat.id, s)} />
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#5C6670',
              marginBottom: 12,
            }}
          >
            Just Sent
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {feed.map((item) => (
              <FeedRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 28,
            padding: '14px 16px',
            border: '1.5px dashed #E4E6E3',
            borderRadius: 8,
            background: '#FAFAF7',
          }}
        >
          <User size={18} strokeWidth={1.75} color="#5C6670" />
          <input
            type="text"
            placeholder="Add my name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 16,
              color: '#0F1419',
            }}
          />
          <span style={{ width: 32, height: 4, borderRadius: 2, background: '#0F1419', opacity: 0.85 }} aria-hidden />
        </label>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  onReport,
}: {
  category: SupplyCategory;
  onReport: (s: SupplyStatus) => void;
}) {
  return (
    <div
      style={{
        background: '#FAFAF7',
        border: '1px solid #E4E6E3',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: STATUS_COLOR[category.status],
              display: 'inline-block',
            }}
            aria-hidden
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0F1419',
            }}
          >
            {category.label}
          </span>
        </div>
        <span style={{ fontSize: 13, color: '#5C6670' }}>{category.lastUpdate}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <StatusButton status="stocked" selected={category.status === 'stocked'} onClick={() => onReport('stocked')} />
        <StatusButton status="low"     selected={category.status === 'low'}     onClick={() => onReport('low')} />
        <StatusButton status="out"     selected={category.status === 'out'}     onClick={() => onReport('out')} />
      </div>
    </div>
  );
}

function StatusButton({
  status,
  selected,
  onClick,
}: {
  status: SupplyStatus;
  selected: boolean;
  onClick: () => void;
}) {
  const color = STATUS_COLOR[status];
  const Icon = status === 'stocked' ? CheckCircle2 : status === 'low' ? AlertTriangle : AlertOctagon;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 56,
        border: `1.5px solid ${color}`,
        borderRadius: 8,
        background: selected ? color : 'transparent',
        color: selected ? '#FAFAF7' : color,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background-color 120ms ease, color 120ms ease',
      }}
    >
      <Icon size={18} strokeWidth={1.75} />
      {STATUS_LABEL[status]}
    </button>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const color = STATUS_COLOR[item.status];
  const ageLabel = ageOf(item.at);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderTop: '1px solid #E4E6E3',
      }}
    >
      <CheckCircle2 size={18} strokeWidth={1.75} color="#2E7D4F" />
      <span style={{ fontSize: 16, fontWeight: 500, color: '#0F1419' }}>{item.category}</span>
      <span style={{ color: '#5C6670', fontSize: 14 }}>,</span>
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color,
      }}>
        {STATUS_LABEL[item.status]}
      </span>
      <span style={{ flex: 1 }} />
      <span style={{ color: '#5C6670', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
        {ageLabel} · as {item.who}
      </span>
    </div>
  );
}

function ageOf(at: number): string {
  const s = Math.floor((Date.now() - at) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.floor(m / 60)}h ago`;
}
