import { TrendingDown, Brain } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="header">
      <div>
        <h1>CreditPathAI Dashboard</h1>
        <p>Loan Default Prediction & Analysis</p>
      </div>

      <div className="header-right">
        <span>
          <Brain size={14} />
          ML-Powered Risk Assessment
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;
