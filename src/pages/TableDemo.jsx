import OptimizationTable from '../components/OptimizationTable';
import { usePageView } from '../lib/usePageView';

export default function TableDemo() {
  usePageView();
  return <OptimizationTable autoPlay={true} />;
}
