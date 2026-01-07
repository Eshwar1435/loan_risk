import { Shield, CheckCircle, XCircle, Brain, TrendingUp, AlertTriangle, Info } from "lucide-react";

const RecommendationPanel = ({ result, formData }) => {
  if (!result) return null;
  const isApprove = result.recommended_action?.toLowerCase().includes("approve");
  const defaultProb = (result.default_probability * 100).toFixed(1);
  const riskLevel = result.risk_level || "Unknown";
  const reason = result.reason || "";
  
  // Generate detailed analysis summary
  const generateAnalysisSummary = () => {
    if (!formData) {
      return result.recommendation || reason || "Analysis based on machine learning model predictions.";
    }
    
    const analysis = [];
    
    // Risk probability analysis
    if (defaultProb < 30) {
      analysis.push(`Borrower demonstrates strong creditworthiness with a ${defaultProb}% default probability.`);
    } else if (defaultProb < 60) {
      analysis.push(`Borrower shows moderate risk with a ${defaultProb}% default probability.`);
    } else {
      analysis.push(`Borrower presents high risk with a ${defaultProb}% default probability.`);
    }
    
    // Key factors analysis
    const factors = [];
    
    if (formData.loanGrade) {
      const gradeQuality = ['A', 'B'].includes(formData.loanGrade) ? 'strong' : 'moderate';
      factors.push(`${formData.loanGrade} grade indicates ${gradeQuality} credit quality`);
    }
    
    if (formData.creditHistoryYears) {
      const historyQuality = formData.creditHistoryYears >= 7 ? 'extensive' : 
                            formData.creditHistoryYears >= 4 ? 'adequate' : 'limited';
      factors.push(`${formData.creditHistoryYears} years of credit history shows ${historyQuality} experience`);
    }
    
    if (formData.dtiRatio) {
      const dtiQuality = formData.dtiRatio <= 30 ? 'healthy' : 
                        formData.dtiRatio <= 40 ? 'manageable' : 'concerning';
      factors.push(`${formData.dtiRatio}% DTI ratio indicates ${dtiQuality} debt burden`);
    }
    
    if (formData.annualIncome && formData.loanAmount) {
      const incomeRatio = (formData.loanAmount / formData.annualIncome * 100).toFixed(1);
      if (incomeRatio < 50) {
        factors.push(`Loan amount represents ${incomeRatio}% of annual income, which is reasonable`);
      }
    }
    
    if (factors.length > 0) {
      analysis.push(`The combination of ${factors.join(', ')} ${factors.length > 1 ? 'indicate' : 'indicates'} ${isApprove ? 'reliable repayment capacity' : 'potential repayment challenges'}.`);
    }
    
    // Model consensus
    if (result.model_comparison) {
      const models = result.model_comparison;
      const avgProb = ((models.logistic_regression + models.xgboost + models.lightgbm) / 3 * 100).toFixed(1);
      analysis.push(`Model consensus across three algorithms shows an average default probability of ${avgProb}%.`);
    }
    
    return analysis.join(' ') || reason || "Analysis based on machine learning model predictions.";
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>
          <Shield size={18} />
          Risk Assessment
        </h3>
        <span className="risk-badge" style={{ backgroundColor: isApprove ? '#22c55e' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isApprove ? (
            <>
              <CheckCircle size={14} />
              Low Risk
            </>
          ) : (
            <>
              <XCircle size={14} />
              High Risk
            </>
          )}
        </span>
      </div>

      <div className={`recommend-box ${isApprove ? 'recommend-approve' : 'recommend-reject'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          {isApprove ? (
            <>
              <CheckCircle size={18} />
              Approve
            </>
          ) : (
            <>
              <XCircle size={18} />
              Reject
            </>
          )}
        </div>
        <p style={{ fontSize: '13px', margin: '8px 0 0' }}>
          {isApprove ? "Borrower meets all criteria. Proceed with loan origination." : "High risk detected."}
        </p>
      </div>

      <div className="analysis-summary">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Info size={14} style={{ color: '#64748b' }} />
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', margin: 0 }}>Analysis Summary</p>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.6', color: '#1e293b' }}>
            {generateAnalysisSummary()}
          </p>
        </div>
        
        {/* Key Metrics */}
        <div className="analysis-metrics">
          <div style={{ fontSize: '11px' }}>
            <span style={{ color: '#64748b', display: 'block' }}>Risk Level</span>
            <span style={{ color: '#1e293b', fontWeight: '600', display: 'block', marginTop: '2px' }}>
              {riskLevel}
            </span>
          </div>
          <div style={{ fontSize: '11px' }}>
            <span style={{ color: '#64748b', display: 'block' }}>Default Probability</span>
            <span style={{ color: '#1e293b', fontWeight: '600', display: 'block', marginTop: '2px' }}>
              {defaultProb}%
            </span>
          </div>
        </div>
      </div>

      <p style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <Brain size={12} />
        Powered by LightGBM machine learning model
      </p>
    </div>
  );
};
export default RecommendationPanel;
