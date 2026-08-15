import { SkeletonGrid } from '@/components/SkeletonRow';

export default function BrowseLoading() {
  return (
    <div className="min-h-[80vh] px-4 pt-8 pb-10 sm:px-6 lg:px-10">
      <div className="skeleton mb-3 h-10 w-[240px] rounded-lg" />
      <div className="skeleton mb-7 h-5 w-[420px] max-w-full rounded-md" />
      <div className="mb-7 flex flex-wrap gap-2.5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-full" />
        ))}
      </div>
      <SkeletonGrid />
    </div>
  );
}
