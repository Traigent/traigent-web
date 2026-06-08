import OptimizationTable from '../components/OptimizationTable';
import { usePageView } from '../lib/usePageView';
import { birdDemo, replayColumns } from '../data/demoArtifacts/replays';

export default function TableDemo() {
  usePageView();
  return (
    <OptimizationTable
      dataset={birdDemo.dataset}
      columns={replayColumns(birdDemo.dataset)}
      demoLabel={birdDemo.label}
      autoPlay={true}
    />
  );
}
