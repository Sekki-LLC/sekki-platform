import React, { useState, useCallback, useEffect } from 'react';
import ChatPane from '../components/common/ChatPane/ChatPane';
import '../styles/index.css'; // Import your shared styles

const FMEA = () => {
  // FMEA data structure
  const [fmeaData, setFmeaData] = useState({
    processName: '',
    processOwner: '',
    fmeaTeam: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    fmeaItems: [
      {
        id: 1,
        processStep: '',
        processFunction: '',
        failureMode: '',
        effectsOfFailure: '',
        severity: 1,
        causes: '',
        occurrence: 1,
        currentControls: '',
        detection: 1,
        rpn: 1,
        recommendedActions: '',
        responsibility: '',
        targetDate: '',
        actionsTaken: '',
        newSeverity: 1,
        newOccurrence: 1,
        newDetection: 1,
        newRpn: 1
      }
    ]
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Chat configuration for FMEA
  const chatConfig = {
    title: 'FMEA AI Guide',
    welcomeMessage: "Welcome to FMEA! I'll help you identify potential failure modes and assess their risks. Let's start by defining your process and then systematically analyze what could go wrong. What process are you analyzing?",
    inputPlaceholder: "Ask me about FMEA analysis...",
    responses: {
      'failure mode': "Great question about failure modes! Think about all the ways each process step could fail to meet its intended function. Common failure modes include: delays, defects, omissions, incorrect outputs, system failures, or human errors. For each process step, ask 'What could go wrong here?'",
      'severity': "Severity rates the impact of the failure on the customer or end user. Use 1-10 scale: 1-3 (Minor impact), 4-6 (Moderate impact), 7-8 (High impact), 9-10 (Critical/catastrophic impact). Consider: safety risks, customer satisfaction, regulatory compliance, and business impact.",
      'occurrence': "Occurrence rates how frequently the failure mode happens. Use 1-10 scale: 1-2 (Very unlikely), 3-4 (Low), 5-6 (Moderate), 7-8 (High), 9-10 (Very high/almost certain). Base this on historical data, similar processes, or expert judgment.",
      'detection': "Detection rates how likely you are to detect the failure before it reaches the customer. Use 1-10 scale: 1-2 (Almost certain to detect), 3-4 (High detection), 5-6 (Moderate), 7-8 (Low detection), 9-10 (Almost certain NOT to detect). Consider your current inspection and testing methods.",
      'rpn': "RPN (Risk Priority Number) = Severity × Occurrence × Detection. Higher RPNs indicate higher risk priorities. Typically: RPN 1-100 (Low priority), 101-300 (Medium priority), 301+ (High priority requiring immediate action). Focus improvement efforts on highest RPNs first.",
      'controls': "Current controls are existing measures that prevent failure modes or detect them early. Include: preventive controls (training, procedures, design features), detective controls (inspections, tests, alarms), and corrective controls (error-proofing, redundancy).",
      'actions': "Recommended actions should target the highest RPNs first. Focus on: reducing severity (design changes, safety features), reducing occurrence (training, procedures, error-proofing), or improving detection (inspections, sensors, testing). Assign clear responsibility and target dates."
    },
    defaultResponse: "I can help you with any aspect of FMEA. Try asking about failure modes, severity ratings, occurrence ratings, detection ratings, RPN calculations, current controls, or recommended actions. What would you like to explore?",
    quickActions: [
      { label: "Identify Failure Modes", message: "How do I identify failure modes?" },
      { label: "Severity Ratings", message: "Explain severity ratings" },
      { label: "RPN Calculation", message: "How to calculate RPN?" },
      { label: "Current Controls", message: "What are current controls?" },
      { label: "Recommended Actions", message: "How to prioritize actions?" }
    ]
  };

  // Calculate RPN automatically
  const calculateRPN = useCallback((severity, occurrence, detection) => {
    return severity * occurrence * detection;
  }, []);

  // Calculate completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      let totalFields = 0;
      let completedFields = 0;

      // Process info
      totalFields += 4;
      if (fmeaData.processName) completedFields++;
      if (fmeaData.processOwner) completedFields++;
      if (fmeaData.fmeaTeam) completedFields++;
      if (fmeaData.dateCreated) completedFields++;

      // FMEA items - count essential fields
      fmeaData.fmeaItems.forEach(item => {
        const essentialFields = [
          'processStep', 'failureMode', 'effectsOfFailure', 'causes', 'currentControls'
        ];
        totalFields += essentialFields.length + 3; // +3 for severity, occurrence, detection
        
        essentialFields.forEach(field => {
          if (item[field] && item[field].trim() !== '') completedFields++;
        });
        
        // Count ratings (they default to 1, so always completed)
        completedFields += 3;
      });

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [fmeaData]);

  // Handle field changes
  const handleProcessInfoChange = useCallback((field, value) => {
    setFmeaData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const handleFmeaItemChange = useCallback((id, field, value) => {
    setFmeaData(prev => ({
      ...prev,
      fmeaItems: prev.fmeaItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-calculate RPN when severity, occurrence, or detection changes
          if (['severity', 'occurrence', 'detection'].includes(field)) {
            updatedItem.rpn = calculateRPN(
              field === 'severity' ? parseInt(value) : item.severity,
              field === 'occurrence' ? parseInt(value) : item.occurrence,
              field === 'detection' ? parseInt(value) : item.detection
            );
          }
          
          // Auto-calculate new RPN when new ratings change
          if (['newSeverity', 'newOccurrence', 'newDetection'].includes(field)) {
            updatedItem.newRpn = calculateRPN(
              field === 'newSeverity' ? parseInt(value) : item.newSeverity,
              field === 'newOccurrence' ? parseInt(value) : item.newOccurrence,
              field === 'newDetection' ? parseInt(value) : item.newDetection
            );
          }
          
          return updatedItem;
        }
        return item;
      }),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, [calculateRPN]);

  // Add new FMEA item
  const addFmeaItem = useCallback(() => {
    const newId = Math.max(...fmeaData.fmeaItems.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      processStep: '',
      processFunction: '',
      failureMode: '',
      effectsOfFailure: '',
      severity: 1,
      causes: '',
      occurrence: 1,
      currentControls: '',
      detection: 1,
      rpn: 1,
      recommendedActions: '',
      responsibility: '',
      targetDate: '',
      actionsTaken: '',
      newSeverity: 1,
      newOccurrence: 1,
      newDetection: 1,
      newRpn: 1
    };

    setFmeaData(prev => ({
      ...prev,
      fmeaItems: [...prev.fmeaItems, newItem],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, [fmeaData.fmeaItems]);

  // Remove FMEA item
  const removeFmeaItem = useCallback((id) => {
    if (fmeaData.fmeaItems.length > 1) {
      setFmeaData(prev => ({
        ...prev,
        fmeaItems: prev.fmeaItems.filter(item => item.id !== id),
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
    }
  }, [fmeaData.fmeaItems.length]);

  // Get RPN risk level
  const getRpnRiskLevel = useCallback((rpn) => {
    if (rpn >= 300) return { level: 'High', color: 'var(--lss-error)' };
    if (rpn >= 100) return { level: 'Medium', color: 'var(--lss-warning)' };
    return { level: 'Low', color: 'var(--lss-success)' };
  }, []);

  // Calculate risk summary
  const getRiskSummary = useCallback(() => {
    const summary = { high: 0, medium: 0, low: 0 };
    fmeaData.fmeaItems.forEach(item => {
      const risk = getRpnRiskLevel(item.rpn);
      if (risk.level === 'High') summary.high++;
      else if (risk.level === 'Medium') summary.medium++;
      else summary.low++;
    });
    return summary;
  }, [fmeaData.fmeaItems, getRpnRiskLevel]);

  // Save draft
  const handleSave = () => {
    console.log('Saving FMEA draft:', fmeaData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting FMEA to PDF:', fmeaData);
    // Implement export functionality
  };

  const riskSummary = getRiskSummary();

  return (
    <div className="tool-container">
      {/* Header */}
      <div className="tool-header">
        <div className="tool-header-content">
          <h1>FMEA Analysis</h1>
          <div className="tool-progress-section">
            <div className="tool-progress-bar">
              <div 
                className="tool-progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="tool-progress-text">{completionPercentage}% Complete</span>
          </div>
        </div>
        <div className="tool-header-actions">
          <button className="tool-btn tool-btn-primary" onClick={handleSave}>
            <i className="fas fa-save"></i> Save Draft
          </button>
          <button className="tool-btn tool-btn-accent" onClick={handleExport}>
            <i className="fas fa-download"></i> Export PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="tool-main-content">
        {/* Top Section - Process Info + Chat */}
        <div className="tool-top-section">
          {/* Process Information Card (Left Column) */}
          <div className="tool-process-info-card">
            <h2>FMEA Information</h2>
            
            <div className="tool-field-group">
              <label className="tool-field-label">
                Process Name <span className="tool-field-required">*</span>
              </label>
              <input
                type="text"
                className="tool-input"
                value={fmeaData.processName}
                onChange={(e) => handleProcessInfoChange('processName', e.target.value)}
                placeholder="Enter the process name for FMEA analysis"
              />
            </div>

            <div className="tool-field-row">
              <div className="tool-field-group">
                <label className="tool-field-label">
                  Process Owner <span className="tool-field-required">*</span>
                </label>
                <input
                  type="text"
                  className="tool-input"
                  value={fmeaData.processOwner}
                  onChange={(e) => handleProcessInfoChange('processOwner', e.target.value)}
                  placeholder="Who owns this process?"
                />
              </div>
              <div className="tool-field-group">
                <label className="tool-field-label">
                  FMEA Team <span className="tool-field-required">*</span>
                </label>
                <input
                  type="text"
                  className="tool-input"
                  value={fmeaData.fmeaTeam}
                  onChange={(e) => handleProcessInfoChange('fmeaTeam', e.target.value)}
                  placeholder="List team members involved in this FMEA"
                />
              </div>
            </div>

            <div className="tool-field-row">
              <div className="tool-field-group">
                <label className="tool-field-label">
                  Date Created
                </label>
                <input
                  type="date"
                  className="tool-input"
                  value={fmeaData.dateCreated}
                  onChange={(e) => handleProcessInfoChange('dateCreated', e.target.value)}
                />
              </div>
              <div className="tool-field-group">
                <label className="tool-field-label">
                  Last Updated
                </label>
                <input
                  type="date"
                  className="tool-input"
                  value={fmeaData.lastUpdated}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Chat Section (Right Column) */}
          <ChatPane 
            toolConfig={chatConfig}
            currentData={fmeaData}
            onDataUpdate={setFmeaData}
          />
        </div>

        {/* Risk Summary Dashboard - Full Width */}
        <div className="tool-card">
          <h2>Risk Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl border">
              <div className="text-4xl font-bold mb-2 risk-high">
                {riskSummary.high}
              </div>
              <div className="text-sm font-semibold text-gray-600">High Risk Items</div>
              <div className="text-xs text-gray-500 mt-1">RPN ≥ 300</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border">
              <div className="text-4xl font-bold mb-2 risk-medium">
                {riskSummary.medium}
              </div>
              <div className="text-sm font-semibold text-gray-600">Medium Risk Items</div>
              <div className="text-xs text-gray-500 mt-1">RPN 100-299</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border">
              <div className="text-4xl font-bold mb-2 risk-low">
                {riskSummary.low}
              </div>
              <div className="text-sm font-semibold text-gray-600">Low Risk Items</div>
              <div className="text-xs text-gray-500 mt-1">RPN &lt; 100</div>
            </div>
          </div>
        </div>

        {/* FMEA Table - Full Width */}
        <div className="tool-card">
          <div className="tool-table-header">
            <h2>FMEA Analysis Table</h2>
            <button className="tool-btn tool-btn-success" onClick={addFmeaItem}>
              <i className="fas fa-plus"></i> Add FMEA Item
            </button>
          </div>
          
          <div className="tool-table-container">
            <div className="tool-table" style={{ minWidth: '1400px' }}>
              {/* Table Header */}
              <div className="grid" style={{ 
                gridTemplateColumns: '150px 150px 150px 50px 150px 50px 150px 50px 80px 200px 80px',
                backgroundColor: 'var(--lss-gray-100)',
                borderBottom: '1px solid var(--lss-gray-200)'
              }}>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">Process Step</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">Failure Mode</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">Effects</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">S</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">Causes</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">O</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">Controls</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">D</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">RPN</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center border-r border-gray-200">Recommended Actions</div>
                <div className="p-4 text-xs font-semibold text-gray-700 text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col">
                {fmeaData.fmeaItems.map((item, index) => {
                  const riskLevel = getRpnRiskLevel(item.rpn);
                  return (
                    <div 
                      key={item.id} 
                      className={`grid hover:bg-gray-50 ${index !== fmeaData.fmeaItems.length - 1 ? 'border-b border-gray-200' : ''}`}
                      style={{ gridTemplateColumns: '150px 150px 150px 50px 150px 50px 150px 50px 80px 200px 80px' }}
                    >
                      <div className="p-3 border-r border-gray-200 flex items-center">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded p-2 resize-none"
                          value={item.processStep}
                          onChange={(e) => handleFmeaItemChange(item.id, 'processStep', e.target.value)}
                          placeholder="Process step"
                          rows={2}
                        />
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded p-2 resize-none"
                          value={item.failureMode}
                          onChange={(e) => handleFmeaItemChange(item.id, 'failureMode', e.target.value)}
                          placeholder="Failure mode"
                          rows={2}
                        />
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded p-2 resize-none"
                          value={item.effectsOfFailure}
                          onChange={(e) => handleFmeaItemChange(item.id, 'effectsOfFailure', e.target.value)}
                          placeholder="Effects"
                          rows={2}
                        />
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center justify-center">
                        <select
                          className="w-full text-xs border border-gray-300 rounded p-1"
                          value={item.severity}
                          onChange={(e) => handleFmeaItemChange(item.id, 'severity', parseInt(e.target.value))}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded p-2 resize-none"
                          value={item.causes}
                          onChange={(e) => handleFmeaItemChange(item.id, 'causes', e.target.value)}
                          placeholder="Causes"
                          rows={2}
                        />
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center justify-center">
                        <select
                          className="w-full text-xs border border-gray-300 rounded p-1"
                          value={item.occurrence}
                          onChange={(e) => handleFmeaItemChange(item.id, 'occurrence', parseInt(e.target.value))}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded p-2 resize-none"
                          value={item.currentControls}
                          onChange={(e) => handleFmeaItemChange(item.id, 'currentControls', e.target.value)}
                          placeholder="Controls"
                          rows={2}
                        />
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center justify-center">
                        <select
                          className="w-full text-xs border border-gray-300 rounded p-1"
                          value={item.detection}
                          onChange={(e) => handleFmeaItemChange(item.id, 'detection', parseInt(e.target.value))}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center justify-center">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: riskLevel.color }}
                        >
                          {item.rpn}
                        </div>
                      </div>
                      <div className="p-3 border-r border-gray-200 flex items-center">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded p-2 resize-none"
                          value={item.recommendedActions}
                          onChange={(e) => handleFmeaItemChange(item.id, 'recommendedActions', e.target.value)}
                          placeholder="Recommended actions"
                          rows={2}
                        />
                      </div>
                      <div className="p-3 flex items-center justify-center">
                        <button
                          type="button"
                          className="tool-remove-btn"
                          onClick={() => removeFmeaItem(item.id)}
                          disabled={fmeaData.fmeaItems.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FMEA;

