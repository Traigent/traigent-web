import OptimizationTable from '../components/OptimizationTable';
import { birdDemo, replayColumns } from '../data/demoArtifacts/replays';

export default function TableDemo() {
  return (
    <OptimizationTable
      dataset={birdDemo.dataset}
      columns={replayColumns(birdDemo.dataset)}
      demoLabel={birdDemo.label}
      autoPlay={true}
    />
  );
}
