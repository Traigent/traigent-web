import { Helmet } from "react-helmet-async";
import OptimizationInActionSection from "../_archive/OptimizationInActionSection";

export default function OptimizationInAction() {
  return (
    <>
      <Helmet>
        <title>Optimization in Action · Traigent</title>
        <meta
          name="description"
          content="Watch Traigent sweep hundreds of model and configuration combinations and converge to the optimum — accuracy, cost, latency, or any KPI you choose."
        />
      </Helmet>
      <OptimizationInActionSection />
    </>
  );
}
