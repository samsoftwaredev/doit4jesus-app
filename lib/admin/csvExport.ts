/**
 * Convert an array of objects to a CSV string and trigger a browser download.
 */
export function downloadCsv(
  rows: Record<string, any>[],
  filename: string,
  columns?: { key: string; label: string }[],
) {
  if (!rows.length) return;

  const cols =
    columns ?? Object.keys(rows[0]).map((k) => ({ key: k, label: k }));
  const header = cols.map((c) => `"${c.label}"`).join(',');
  const body = rows
    .map((r) =>
      cols
        .map((c) => {
          const v = r[c.key];
          if (v == null) return '';
          const str = String(v).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(','),
    )
    .join('\n');

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
