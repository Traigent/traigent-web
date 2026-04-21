export default function MarketingCard({ children, className = "" }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
