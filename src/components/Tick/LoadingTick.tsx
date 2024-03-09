import 'react-loading-skeleton/dist/skeleton.css';

import Skeleton from 'react-loading-skeleton';

import { SpotlightCard } from '../Spotlight';

export default function LoadingTick() {
  return (
    <SpotlightCard>
      <div className="flex items-center gap-4 justify-between bg-brand-primary/20 p-3">
        <Skeleton width={200} height={18} />
        <Skeleton width={40} height={22} />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Loan Limit:
          <Skeleton width={172} height={14} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Deposits:
          <Skeleton width={182} height={14} />
        </div>
      </div>
    </SpotlightCard>
  );
}
