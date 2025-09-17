import React, { useState, useEffect, useCallback } from 'react';
import styles from './FinY.module.css';
import { aiPredictionEngine } from './aiPredictionEngine';

const FinY = () => {
  // Project information
  const [projectInfo, setProjectInfo] = useState({
    name: 'Financial Benefits Analysis',
    startDate: '',
    endDate: '',
    totalInvestment: 0,
    discountRate: 10,
    currency: 'USD'
  });

  // AI Settings
  const [aiSettings, setAiSettings] = useState({
    enabled: false,
    model: 'linear_regression',
    confidence: 95,
    seasonality: true,
    trendAnalysis: true
  });

  // Section order state
  const [sectionOrder, setSectionOrder] = useState(['baseline', 'actual', 'projected']);

  // Metrics data
  const [metrics, setMetrics] = useState([
    {
      id: 1,
      name: 'Process Cycle Time',
      category: 'Efficiency',
      unit: 'Hours',
      financialImpact: 'Cost Reduction',
      costPerUnit: 50,
      baseline: Array(12).fill(0),
      actual: Array(12).fill(0),
      projected: Array(12).fill(0),
      target: Array(12).fill(0)
    },
    {
      id: 2,
      name: 'Quality Score',
      category: 'Quality',
      unit: 'Percentage',
      financialImpact: 'Revenue Increase',
      costPerUnit: 100,
      baseline: Array(12).fill(0),
      actual: Array(12).fill(0),
      projected: Array(12).fill(0),
      target: Array(12).fill(0)
    }
  ]);

  // Time periods
  const [periods] = useState([
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]);

  // Financial summary
  const [financialSummary, setFinancialSummary] = useState({
    totalBenefit: 0,
    totalCost: 0,
    netBenefit: 0,
    roi: 0,
    paybackPeriod: 0,
    npv: 0,
    irr: 0
  });

  // Chat state for AI helper
  const [showAIHelper, setShowAIHelper] = useState(true);
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Welcome to the FinY Benefit Model! I can help you with financial projections, ROI calculations, and benefit tracking. What would you like to analyze?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Section info helper
  const getSectionInfo = (sectionType) => {
    const sectionMap = {
      baseline: {
        title: 'Baseline Values',
        description: 'Starting performance metrics before improvements',
        icon: 'fas fa-chart-line',
        editable: true
      },
      actual: {
        title: 'Actual Values',
        description: 'Real performance data as improvements are implemented',
        icon: 'fas fa-chart-bar',
        editable: true
      },
      projected: {
        title: 'AI Projected Values',
        description: 'AI-generated predictions based on current trends',
        icon: 'fas fa-robot',
        editable: false
      }
    };
    return sectionMap[sectionType];
  };

  // Section reordering functions
  const moveSectionUp = (index) => {
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setSectionOrder(newOrder);
    }
  };

  const moveSectionDown = (index) => {
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSectionOrder(newOrder);
    }
  };

  // Handle metric data updates
  const updateMetricValue = (metricIndex, periodIndex, type, value) => {
    setMetrics(prev => prev.map((metric, index) => {
      if (index === metricIndex) {
        const newData = [...metric[type]];
        newData[periodIndex] = parseFloat(value) || 0;
        return { ...metric, [type]: newData };
      }
      return metric;
    }));
  };

  // Update metric financial impact
  const updateMetricImpact = (metricIndex, impact) => {
    setMetrics(prev => prev.map((metric, index) => {
      if (index === metricIndex) {
        return { ...metric, financialImpact: impact };
      }
      return metric;
    }));
  };

  // Update metric cost per unit
  const updateMetricCostPerUnit = (metricIndex, cost) => {
    setMetrics(prev => prev.map((metric, index) => {
      if (index === metricIndex) {
        return { ...metric, costPerUnit: parseFloat(cost) || 0 };
      }
      return metric;
    }));
  };

  // Add new metric
  const addMetric = () => {
    const newMetric = {
      id: Date.now(),
      name: 'New Metric',
      category: 'Efficiency',
      unit: 'Units',
      financialImpact: 'Cost Reduction',
      costPerUnit: 0,
      baseline: Array(12).fill(0),
      actual: Array(12).fill(0),
      projected: Array(12).fill(0),
      target: Array(12).fill(0)
    };
    setMetrics(prev => [...prev, newMetric]);
  };

  // Remove metric
  const removeMetric = (metricIndex) => {
    if (metrics.length > 1) {
      setMetrics(prev => prev.filter((_, index) => index !== metricIndex));
    }
  };

  // AI Prediction Engine
  const generateAIPredictions = useCallback(async (metricData, metricIndex) => {
    if (!aiSettings.enabled) {
      return metricData.baseline;
    }

    try {
      const predictions = await aiPredictionEngine.generatePredictions(
        metricData, 
        aiSettings.model, 
        {
          confidence: aiSettings.confidence,
          seasonality: aiSettings.seasonality,
          trendAnalysis: aiSettings.trendAnalysis
        }
      );
      
      // Handle both confidence interval objects and simple arrays
      if (Array.isArray(predictions)) {
        return predictions;
      } else if (predictions && typeof predictions === 'object') {
        // Extract values from confidence interval objects
        return predictions.map(pred => pred.value || pred);
      }
      
      return metricData.baseline;
    } catch (error) {
      console.error('AI prediction failed:', error);
      // Fallback to simple prediction logic
      return metricData.baseline.map((val, i) => val * (1 + 0.05 * (i + 1) / 12));
    }
  }, [aiSettings]);

  // Update projections when AI settings or baseline/actual data changes
  useEffect(() => {
    if (aiSettings.enabled) {
      const updateProjections = async () => {
        const updatedMetrics = await Promise.all(
          metrics.map(async (metric, index) => {
            const predictions = await generateAIPredictions(metric, index);
            return { ...metric, projected: predictions };
          })
        );
        
        // Only update if projections actually changed
        setMetrics(prevMetrics => {
          const hasChanged = prevMetrics.some((metric, index) => {
            return JSON.stringify(metric.projected) !== JSON.stringify(updatedMetrics[index].projected);
          });
          
          return hasChanged ? updatedMetrics : prevMetrics;
        });
      };
      
      updateProjections();
    }
  }, [metrics.map(m => JSON.stringify(m.baseline)).join(','), 
      metrics.map(m => JSON.stringify(m.actual)).join(','), 
      aiSettings.enabled, aiSettings.model, aiSettings.confidence, 
      aiSettings.seasonality, aiSettings.trendAnalysis, generateAIPredictions]);

  // Calculate financial summary
  useEffect(() => {
    const calculateSummary = () => {
      let totalBenefit = 0;
      let totalCost = projectInfo.totalInvestment;

      metrics.forEach(metric => {
        const actualSum = metric.actual.reduce((sum, val) => sum + val, 0);
        const baselineSum = metric.baseline.reduce((sum, val) => sum + val, 0);
        const improvement = actualSum - baselineSum;
        const benefit = improvement * metric.costPerUnit;
        
        if (metric.financialImpact === 'Cost Reduction' || metric.financialImpact === 'Cost Avoidance') {
          totalBenefit += Math.abs(benefit);
        } else if (metric.financialImpact === 'Revenue Increase') {
          totalBenefit += benefit;
        }
      });

      const netBenefit = totalBenefit - totalCost;
      const roi = totalCost > 0 ? (netBenefit / totalCost) * 100 : 0;
      const paybackPeriod = totalBenefit > 0 ? Math.ceil(totalCost / (totalBenefit / 12)) : 0;

      const newSummary = {
        totalBenefit,
        totalCost,
        netBenefit,
        roi,
        paybackPeriod,
        npv: netBenefit, // Simplified NPV calculation
        irr: roi // Simplified IRR approximation
      };

      // Debounce and only update if there's a significant change
      const timeoutId = setTimeout(() => {
        setFinancialSummary(prevSummary => {
          const hasSignificantChange = Object.keys(newSummary).some(key => {
            const diff = Math.abs(newSummary[key] - (prevSummary[key] || 0));
            return diff > 0.01;
          });
          
          return hasSignificantChange ? newSummary : prevSummary;
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    };

    calculateSummary();
  }, [metrics, projectInfo.totalInvestment, projectInfo.discountRate]);

  // AI Chat functions
  const sendAIMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(currentMessage),
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      'roi': `Your current ROI is ${financialSummary.roi.toFixed(1)}%. This ${financialSummary.roi >= 0 ? 'positive' : 'negative'} return indicates ${financialSummary.roi >= 0 ? 'value creation' : 'value destruction'} from your investment.`,
      'payback': `Your payback period is ${financialSummary.paybackPeriod} months. Consider focusing on high-impact, low-effort improvements to accelerate payback.`,
      'metrics': 'Focus on metrics with the highest financial impact per unit. Cost reduction metrics typically show faster returns than revenue increase metrics.',
      'predictions': 'AI predictions are based on trend analysis and seasonality patterns. Enable different models (neural network, time series) for more sophisticated forecasting.',
      'default': 'I can help with ROI analysis, payback calculations, metric prioritization, and AI prediction insights. What specific aspect would you like to explore?'
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const handleQuickAction = (message) => {
    setCurrentMessage(message);
  };

  // Export data
  const exportData = () => {
    const exportObj = {
      projectInfo,
      metrics,
      financialSummary,
      aiSettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finy-analysis-${projectInfo.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.finYContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.projectInfo}>
            <h1>FinY Benefit Model</h1>
            <div className={styles.projectDetails}>
              <span className={styles.projectName}>{projectInfo.name}</span>
              <span className={styles.projectTimeline}>
                Set project timeline: {projectInfo.startDate || 'Not set'} - {projectInfo.endDate || 'Not set'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.helperToggleBtn}
            onClick={() => setShowAIHelper(!showAIHelper)}
          >
            <i className={showAIHelper ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            {showAIHelper ? 'Hide Helper' : 'Show Helper'}
          </button>
          <button className={styles.saveBtn}>
            <i className="fas fa-save"></i> Save Model
          </button>
          <button className={styles.exportBtn} onClick={exportData}>
            <i className="fas fa-download"></i> Export Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Section - Financial Summary, Settings, and AI Helper */}
        <div className={`${styles.topSection} ${showAIHelper ? styles.threeColumns : styles.twoColumns}`}>
          <div className={styles.summaryCard}>
            <h3>Financial Summary</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Benefit</span>
                <span className={styles.summaryValue}>
                  {projectInfo.currency} {financialSummary.totalBenefit.toLocaleString()}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Investment</span>
                <span className={styles.summaryValue}>
                  {projectInfo.currency} {financialSummary.totalCost.toLocaleString()}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Net Benefit</span>
                <span className={`${styles.summaryValue} ${financialSummary.netBenefit >= 0 ? styles.positive : styles.negative}`}>
                  {projectInfo.currency} {financialSummary.netBenefit.toLocaleString()}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>ROI</span>
                <span className={`${styles.summaryValue} ${financialSummary.roi >= 0 ? styles.positive : styles.negative}`}>
                  {financialSummary.roi.toFixed(1)}%
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Payback Period</span>
                <span className={styles.summaryValue}>
                  {financialSummary.paybackPeriod} months
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>NPV</span>
                <span className={`${styles.summaryValue} ${financialSummary.npv >= 0 ? styles.positive : styles.negative}`}>
                  {projectInfo.currency} {financialSummary.npv.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <h3>Project Settings</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.fieldGroup}>
                <label>Project Name</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={projectInfo.name}
                  onChange={(e) => setProjectInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Start Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={projectInfo.startDate}
                  onChange={(e) => setProjectInfo(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>End Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={projectInfo.endDate}
                  onChange={(e) => setProjectInfo(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Total Investment</label>
                <input
                  type="number"
                  className={styles.textInput}
                  value={projectInfo.totalInvestment}
                  onChange={(e) => setProjectInfo(prev => ({ ...prev, totalInvestment: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Discount Rate (%)</label>
                <input
                  type="number"
                  className={styles.textInput}
                  value={projectInfo.discountRate}
                  onChange={(e) => setProjectInfo(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Currency</label>
                <select
                  className={styles.selectInput}
                  value={projectInfo.currency}
                  onChange={(e) => setProjectInfo(prev => ({ ...prev, currency: e.target.value }))}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={aiSettings.enabled}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                  Enable AI Predictions
                </label>
              </div>
              <div className={styles.fieldGroup}>
                <label>AI Model</label>
                <select
                  className={styles.selectInput}
                  value={aiSettings.model}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, model: e.target.value }))}
                  disabled={!aiSettings.enabled}
                >
                  <option value="linear_regression">Linear Regression</option>
                  <option value="polynomial">Polynomial</option>
                  <option value="neural_network">Neural Network</option>
                  <option value="time_series">Time Series</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Helper Card in Top Section */}
          {showAIHelper && (
            <div className={styles.chatSection}>
              <div className={styles.chatCard}>
                <div className={styles.chatHeader}>
                  <h3>
                    <i className="fas fa-robot"></i>
                    FinY AI Assistant
                  </h3>
                  <div className={styles.chatStatus}>
                    {isTyping ? (
                      <span className={styles.typing}>
                        <i className="fas fa-circle"></i>
                        <i className="fas fa-circle"></i>
                        <i className="fas fa-circle"></i>
                      </span>
                    ) : (
                      <span className={styles.online}>Online</span>
                    )}
                  </div>
                </div>

                <div className={styles.chatMessages}>
                  {aiMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`${styles.message} ${styles[message.type]}`}
                    >
                      <div className={styles.messageContent}>
                        {message.content}
                      </div>
                      <div className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className={`${styles.message} ${styles.ai}`}>
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.chatInput}>
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                    placeholder="Ask me about ROI, predictions, or financial analysis..."
                    className={styles.messageInput}
                  />
                  <button 
                    onClick={sendAIMessage}
                    className={styles.sendBtn}
                    disabled={!currentMessage.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>

                <div className={styles.quickActions}>
                  <h4>Quick Help</h4>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.quickBtn}
                      onClick={() => handleQuickAction('What is my current ROI?')}
                    >
                      ROI Analysis
                    </button>
                    <button 
                      className={styles.quickBtn}
                      onClick={() => handleQuickAction('How can I improve payback period?')}
                    >
                      Payback Tips
                    </button>
                    <button 
                      className={styles.quickBtn}
                      onClick={() => handleQuickAction('Which metrics have highest impact?')}
                    >
                      Top Metrics
                    </button>
                    <button 
                      className={styles.quickBtn}
                      onClick={() => handleQuickAction('Explain AI predictions')}
                    >
                      AI Insights
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Sections - Full Width */}
        <div className={styles.analysisCard}>
          <h2>Metrics & Financial Data</h2>
          <div className={styles.tableActions}>
            <button className={styles.addBtn} onClick={addMetric}>
              <i className="fas fa-plus"></i> Add Metric
            </button>
          </div>

          {/* Render sections in user-defined order */}
          {sectionOrder.map((sectionType, sectionIndex) => {
            const sectionInfo = getSectionInfo(sectionType);
            return (
              <div key={sectionType} className={styles.dataSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <h4>
                      <i className={sectionInfo.icon}></i>
                      {sectionInfo.title}
                    </h4>
                    <span className={styles.sectionDescription}>{sectionInfo.description}</span>
                  </div>
                  <div className={styles.sectionControls}>
                    <button 
                      className={styles.moveBtn}
                      onClick={() => moveSectionUp(sectionIndex)}
                      disabled={sectionIndex === 0}
                      title="Move section up"
                    >
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <button 
                      className={styles.moveBtn}
                      onClick={() => moveSectionDown(sectionIndex)}
                      disabled={sectionIndex === sectionOrder.length - 1}
                      title="Move section down"
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>
                </div>

                <div className={styles.sectionTableContainer}>
                  <table className={styles.sectionTable}>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Impact</th>
                        <th>$/Unit</th>
                        {periods.map(period => (
                          <th key={period}>{period}</th>
                        ))}
                        {sectionType === 'baseline' && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric, metricIndex) => (
                        <tr key={metric.id}>
                          <td className={styles.metricName}>
                            <div className={styles.metricInfo}>
                              <strong>{metric.name}</strong>
                            </div>
                          </td>
                          <td>{metric.category}</td>
                          <td>{metric.unit}</td>
                          <td>
                            <select
                              className={styles.selectInput}
                              value={metric.financialImpact}
                              onChange={(e) => updateMetricImpact(metricIndex, e.target.value)}
                              disabled={!sectionInfo.editable}
                            >
                              <option value="Cost Reduction">Cost Reduction</option>
                              <option value="Revenue Increase">Revenue Increase</option>
                              <option value="Cost Avoidance">Cost Avoidance</option>
                              <option value="Quality Improvement">Quality Improvement</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className={styles.tableInput}
                              value={metric.costPerUnit}
                              onChange={(e) => updateMetricCostPerUnit(metricIndex, e.target.value)}
                              step="0.01"
                              min="0"
                              placeholder="0"
                              disabled={!sectionInfo.editable}
                            />
                          </td>
                          {periods.map((period, periodIndex) => (
                            <td key={period}>
                              {sectionType === 'projected' ? (
                                <span className={styles.projectedValue}>
                                  {metric.projected[periodIndex]?.toFixed(2) || '0.00'}
                                </span>
                              ) : (
                                <input
                                  type="number"
                                  className={styles.tableInput}
                                  value={metric[sectionType][periodIndex]}
                                  onChange={(e) => updateMetricValue(metricIndex, periodIndex, sectionType, e.target.value)}
                                  step="0.01"
                                  min="0"
                                  placeholder="0"
                                />
                              )}
                            </td>
                          ))}
                          {sectionType === 'baseline' && (
                            <td>
                              <button
                                className={styles.removeBtn}
                                onClick={() => removeMetric(metricIndex)}
                                disabled={metrics.length <= 1}
                                title="Remove metric"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinY;

