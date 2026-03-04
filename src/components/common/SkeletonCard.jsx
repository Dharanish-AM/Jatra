export default function SkeletonCard() {
  return (
    <div className="glass-card p-6 animate-pulse h-48 border-border-light flex flex-col justify-between mb-4" aria-hidden="true">
      <div className="flex justify-between items-start">
        <div className="w-1/3 h-6 bg-border-light/50 rounded-md" />
        <div className="w-1/4 h-6 bg-border-light/50 rounded-md" />
      </div>
      <div className="flex justify-between items-end mt-6">
        <div className="w-1/2 h-8 bg-border-light/50 rounded-md" />
        <div className="w-28 h-12 bg-border-light/50 rounded-xl" />
      </div>
    </div>
  );
}
