import { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import BorrowerForm from "./components/BorrowerForm";
import RiskGauge from "./components/RiskGauge";
import ModelComparison from "./components/ModelComparison";
import RecommendationPanel from "./components/RecommendationPanel";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);

    // 🔑 MAP FRONTEND → BACKEND SCHEMA
    const payload = {
      purpose: formData.loanPurpose,
      grade: formData.loanGrade,
      residentialstate: formData.state,
      homeownership: formData.homeOwnership,

      loanamount: Number(formData.loanAmount),
      interestrate: Number(formData.interestRate),
      monthlypayment: Number(formData.monthlyPayment),
      annualincome: Number(formData.annualIncome),
      dtiratio: Number(formData.dtiRatio),
      lengthcredithistory: Number(formData.creditHistoryYears),
      term_months: Number(formData.loanTerm),
    };

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

return (
    <>
      <DashboardHeader />
      <div className="grid">
        {/* Column 1 */}
        <BorrowerForm onSubmit={handleSubmit} isLoading={loading} />

        {/* Column 2 */}
        <div className="column-middle">
          {result && <RiskGauge probability={result.default_probability * 100} />}
          {result?.model_comparison && (
            <ModelComparison
              logistic={result.model_comparison.logistic_regression * 100}
              xgboost={result.model_comparison.xgboost * 100}
              lightgbm={result.model_comparison.lightgbm * 100}
            />
          )}
        </div>

        {/* Column 3 */}
        <div className="column-right">
          {result && <RecommendationPanel result={result} />}
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', padding: '20px' }}>
        This dashboard uses machine learning models for credit risk assessment. All predictions should be reviewed by analysts.
      </p>
    </>
  );
};

export default App;
