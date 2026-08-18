type Step = { label: string; detail: string };

export function SolutionSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="rounded border border-border bg-card p-3">
          <p className="text-xs font-semibold uppercase text-muted">
            {step.label}
          </p>
          <p className="mt-1">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
