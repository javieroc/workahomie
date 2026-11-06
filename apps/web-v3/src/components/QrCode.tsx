import QR from 'qrcode';
import { useEffect, useState } from 'react';

/** Renders a QR as inline SVG (no network, no canvas). */
export function QrCode({
  value,
  className,
  label,
}: {
  value: string;
  className?: string;
  label: string;
}) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    QR.toString(value, {
      type: 'svg',
      margin: 0,
      errorCorrectionLevel: 'M',
      color: { dark: '#24122f', light: '#00000000' },
    })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(''));
    return () => {
      alive = false;
    };
  }, [value]);
  return (
    <div
      role="img"
      aria-label={label}
      className={className}
      // SVG is generated locally by `qrcode` from our own URL, never user input.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
