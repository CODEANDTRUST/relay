type Props = { size?: 'sm' | 'md' | 'lg'; tone?: 'dark' | 'light' };

export function RelayWordmark({ size = 'md', tone = 'dark' }: Props) {
  const config = {
    sm: { square: 4, text: 14, gap: 6 },
    md: { square: 6, text: 18, gap: 8 },
    lg: { square: 10, text: 32, gap: 12 },
  }[size];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: config.gap }}>
      <span
        style={{
          width: config.square,
          height: config.square,
          background: '#0066CC',
          display: 'inline-block',
        }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: config.text,
          lineHeight: 1,
          color: tone === 'dark' ? '#0F1419' : '#FAFAF7',
          letterSpacing: '-0.01em',
        }}
      >
        Relay
      </span>
    </span>
  );
}
