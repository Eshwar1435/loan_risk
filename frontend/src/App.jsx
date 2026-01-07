import { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import BorrowerForm from "./components/BorrowerForm";
import RiskGauge from "./components/RiskGauge";
import ModelComparison from "./components/ModelComparison";
import RecommendationPanel from "./components/RecommendationPanel";
import "./App.css";
import { predictRisk } from "./api/riskApi";
import { AlertCircle, Sparkles } from "lucide-react";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentFormData, setCurrentFormData] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setCurrentFormData(formData);

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

    try {
      const data = await predictRisk(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || "Prediction failed. Please check your inputs or backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="grid">
        {/* Column 1 */}
        <BorrowerForm onSubmit={handleSubmit} isLoading={loading} />

        {/* Column 2 */}
        <div className="column-middle">
          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {!result && !loading && !error && (
            <div className="card empty-state">
              <Sparkles size={48} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
              <h2>Welcome to CreditPathAI</h2>
              <p>Fill out the borrower information form to get started with ML-powered risk prediction</p>
            </div>
          )}
          
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
          {result && <RecommendationPanel result={result} formData={currentFormData} />}
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', padding: '20px' }}>
        This dashboard uses machine learning models for credit risk assessment. All predictions should be reviewed by analysts.
      </p>
    </>
  );
};

export default App;
