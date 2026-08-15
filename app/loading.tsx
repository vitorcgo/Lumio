import { SkeletonRow } from '@/components/SkeletonRow';

export default function HomeLoading() {
  return (
    <div className="pb-10">
      <div className="skeleton -mt-16 h-[76vh] min-h-[500px] lg:-mt-[76px] lg:h-[82vh]" />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  );
}
