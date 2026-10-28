import type { PrintSpecs } from '../../types';

interface PrintSpecsPanelProps {
  specs: PrintSpecs;
}

export function PrintSpecsPanel({ specs }: PrintSpecsPanelProps) {
  const rows = [
    { label: 'Material', value: specs.material },
    { label: 'Layer height', value: specs.layerHeight },
    { label: 'Infill', value: specs.infill },
    { label: 'Dimensions', value: specs.dimensions },
    { label: 'Est. print time', value: `${specs.printTimeHours} hours` },
    ...(specs.weightGrams
      ? [{ label: 'Weight', value: `${specs.weightGrams} g` }]
      : []),
    {
      label: 'Eco filament',
      value: specs.eco ? 'Yes - plant-based PLA option' : 'Standard engineering filament',
    },
  ];

  return (
    <div className="rounded-lg border border-brand-200 overflow-hidden">
      <div className="bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
        Material & print specs
      </div>
      <dl className="divide-y divide-brand-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between gap-4 px-4 py-2.5 text-sm"
          >
            <dt className="text-brand-500">{row.label}</dt>
            <dd className="font-medium text-brand-900 text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
