import React, { useState, useEffect } from 'react';
import styles from './BoxPlot.module.css';

const BoxPlot = () => {
  // BoxPlot data structure
  const [boxPlotData, setBoxPlotData] = useState({
    // Project Information
    analysisTitle: '',
    analyst: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Data Configuration
    dataConfig: {
      variable: '',
      units: '',
      dataSource: '',
      collectionMethod: '',
      sampleSize: '',
      timeframe: ''
    },
    
    // Data Input
    dataInput: {
      inputMethod: 'manual', // 'manual', 'upload', 'paste'
      datasets: [
        { 
          id: 1, 
          name: 'Dataset 1', 
          values: [],
          color: '#161f3b'
        }
      ],
      rawData: ''
    },
    
    // Statistical Summary
    statistics: {
      datasets: []
    },
    
    // Box Plot Configuration
    plotConfig: {
      orientation: 'vertical', // 'vertical', 'horizontal'
      showOutliers: true,
      showMean: true,
      showNotches: false,
      outlierMethod: 'iqr', // 'iqr', 'modified-z-score', 'percentile'
      outlierThreshold: 1.5,
      groupComparison: false,
      title: '',
      xAxisLabel: '',
      yAxisLabel: '',
      showGrid: true,
      showLegend: true
    },
    
    // Outlier Analysis
    outlierAnalysis: {
      outliers: [],
      outlierInvestigation: '',
      outlierAction: 'investigate', // 'investigate', 'remove', 'keep', 'transform'
      outlierJustification: ''
    },
    
    // Comparison Analysis
    comparisonAnalysis: {
      enabled: false,
      comparisonType: 'groups', // 'groups', 'time-series', 'conditions'
      statisticalTest: 'none', // 'none', 'anova', 'kruskal-wallis', 't-test'
      testResults: {
        testStatistic: '',
        pValue: '',
        conclusion: ''
      },
      practicalDifferences: ''
    },
    
    // Insights and Conclusions
    insights: {
      distributionShape: '',
      centralTendency: '',
      variability: '',
      outlierInsights: '',
      groupDifferences: '',
      recommendations: '',
      limitations: ''
    }
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching other tools structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Box Plot Analysis! I'll help you create and interpret box plots to visualize data distribution, identify outliers, and compare groups. Box plots show the five-number summary (min, Q1, median, Q3, max) and highlight outliers. What data are you analyzing?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'box plot': "Box plots display the five-number summary: minimum, first quartile (Q1), median, third quartile (Q3), and maximum. The box shows the interquartile range (IQR), and whiskers extend to the furthest points within 1.5×IQR from the box edges.",
      'outliers': "Outliers are data points that fall outside the whiskers. They're typically defined as values beyond 1.5×IQR from Q1 or Q3. Outliers can indicate data errors, special causes, or interesting phenomena worth investigating.",
      'quartiles': "Quartiles divide your data into four equal parts. Q1 (25th percentile) is the median of the lower half, Q2 (50th percentile) is the overall median, and Q3 (75th percentile) is the median of the upper half.",
      'comparison': "Box plots are excellent for comparing distributions across groups. Look for differences in medians, spread (IQR), skewness, and outlier patterns. Statistical tests like ANOVA can confirm if differences are significant.",
      'interpretation': "When interpreting box plots, consider: 1) Central tendency (median position), 2) Spread (box width and whisker length), 3) Skewness (median position within box), 4) Outliers (points beyond whiskers), 5) Group differences.",
      'skewness': "Box plots reveal skewness through median position. If the median is closer to Q1, the distribution is right-skewed. If closer to Q3, it's left-skewed. Symmetric distributions have the median near the box center.",
      'sample size': "Box plots work well with any sample size, but interpretation changes. Small samples (n<30) may not show clear patterns. Large samples (n>100) make outliers more meaningful and quartile estimates more stable.",
      'default': "I can help you with any aspect of box plot analysis. Ask about outliers, quartiles, interpretation, group comparisons, skewness, or statistical testing."
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  // Handle sending chat messages - matching other tools structure
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsAITyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(currentMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsAITyping(false);
    }, 1500);
  };

  // Quick action handler
  const handleQuickAction = (message) => {
    setCurrentMessage(message);
  };

  // Calculate completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      let totalFields = 0;
      let completedFields = 0;

      // Basic info (3 fields)
      totalFields += 3;
      if (boxPlotData.analysisTitle) completedFields++;
      if (boxPlotData.analyst) completedFields++;
      if (boxPlotData.dataConfig.variable) completedFields++;

      // Data configuration (2 fields)
      totalFields += 2;
      if (boxPlotData.dataConfig.dataSource) completedFields++;
      if (boxPlotData.dataConfig.sampleSize) completedFields++;

      // Data input (1 field)
      totalFields += 1;
      const hasData = boxPlotData.dataInput.datasets.some(dataset => dataset.values.length > 0);
      if (hasData) completedFields++;

      // Statistics (1 field)
      totalFields += 1;
      if (boxPlotData.statistics.datasets.length > 0) completedFields++;

      // Plot configuration (2 fields)
      totalFields += 2;
      if (boxPlotData.plotConfig.title) completedFields++;
      if (boxPlotData.plotConfig.yAxisLabel) completedFields++;

      // Insights (2 fields)
      totalFields += 2;
      if (boxPlotData.insights.distributionShape) completedFields++;
      if (boxPlotData.insights.recommendations) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [boxPlotData]);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle data config changes
  const handleDataConfigChange = (field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      dataConfig: {
        ...prev.dataConfig,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle plot config changes
  const handlePlotConfigChange = (field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      plotConfig: {
        ...prev.plotConfig,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle dataset changes
  const handleDatasetChange = (datasetId, field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      dataInput: {
        ...prev.dataInput,
        datasets: prev.dataInput.datasets.map(dataset =>
          dataset.id === datasetId ? { ...dataset, [field]: value } : dataset
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle dataset values change
  const handleDatasetValuesChange = (datasetId, valuesString) => {
    const values = valuesString.split(/[,\s\n]+/).filter(val => val.trim() !== '').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    handleDatasetChange(datasetId, 'values', values);
  };

  // Add dataset
  const addDataset = () => {
    const colors = ['#161f3b', '#2c3e50', '#e9b57b', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
    const newDataset = {
      id: Date.now(),
      name: `Dataset ${boxPlotData.dataInput.datasets.length + 1}`,
      values: [],
      color: colors[boxPlotData.dataInput.datasets.length % colors.length]
    };
    
    setBoxPlotData(prev => ({
      ...prev,
      dataInput: {
        ...prev.dataInput,
        datasets: [...prev.dataInput.datasets, newDataset]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove dataset
  const removeDataset = (datasetId) => {
    if (boxPlotData.dataInput.datasets.length > 1) {
      setBoxPlotData(prev => ({
        ...prev,
        dataInput: {
          ...prev.dataInput,
          datasets: prev.dataInput.datasets.filter(dataset => dataset.id !== datasetId)
        },
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
    }
  };

  // Calculate box plot statistics
  const calculateStatistics = () => {
    const stats = boxPlotData.dataInput.datasets.map(dataset => {
      if (dataset.values.length === 0) {
        return {
          datasetName: dataset.name,
          n: 0,
          min: 0,
          q1: 0,
          median: 0,
          q3: 0,
          max: 0,
          iqr: 0,
          outliers: [],
          mean: 0,
          std: 0
        };
      }
      
      const values = [...dataset.values].sort((a, b) => a - b);
      const n = values.length;
      
      // Calculate quartiles
      const q1Index = Math.floor(n * 0.25);
      const medianIndex = Math.floor(n * 0.5);
      const q3Index = Math.floor(n * 0.75);
      
      const min = values[0];
      const q1 = n % 4 === 0 ? (values[q1Index - 1] + values[q1Index]) / 2 : values[q1Index];
      const median = n % 2 === 0 ? (values[medianIndex - 1] + values[medianIndex]) / 2 : values[medianIndex];
      const q3 = n % 4 === 0 ? (values[q3Index - 1] + values[q3Index]) / 2 : values[q3Index];
      const max = values[n - 1];
      const iqr = q3 - q1;
      
      // Calculate mean and standard deviation
      const mean = values.reduce((sum, val) => sum + val, 0) / n;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
      const std = Math.sqrt(variance);
      
      // Identify outliers using IQR method
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const outliers = values.filter(val => val < lowerFence || val > upperFence);
      
      return {
        datasetName: dataset.name,
        n: n,
        min: parseFloat(min.toFixed(3)),
        q1: parseFloat(q1.toFixed(3)),
        median: parseFloat(median.toFixed(3)),
        q3: parseFloat(q3.toFixed(3)),
        max: parseFloat(max.toFixed(3)),
        iqr: parseFloat(iqr.toFixed(3)),
        outliers: outliers.map(val => parseFloat(val.toFixed(3))),
        mean: parseFloat(mean.toFixed(3)),
        std: parseFloat(std.toFixed(3))
      };
    });
    
    setBoxPlotData(prev => ({
      ...prev,
      statistics: {
        datasets: stats
      },
      outlierAnalysis: {
        ...prev.outlierAnalysis,
        outliers: stats.flatMap(stat => stat.outliers.map(outlier => ({
          dataset: stat.datasetName,
          value: outlier
        })))
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle insights changes
  const handleInsightsChange = (field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      insights: {
        ...prev.insights,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle outlier analysis changes
  const handleOutlierAnalysisChange = (field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      outlierAnalysis: {
        ...prev.outlierAnalysis,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle comparison analysis changes
  const handleComparisonAnalysisChange = (field, value) => {
    setBoxPlotData(prev => ({
      ...prev,
      comparisonAnalysis: {
        ...prev.comparisonAnalysis,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Save draft
  const handleSave = () => {
    console.log('Saving BoxPlot draft:', boxPlotData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting BoxPlot to PDF:', boxPlotData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to other tools */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Box Plot Analysis</h1>
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{completionPercentage}% Complete</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.saveBtn} onClick={handleSave}>
            <i className="fas fa-save"></i> Save Draft
          </button>
          <button className={styles.exportBtn} onClick={handleExport}>
            <i className="fas fa-download"></i> Export PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Section: Analysis Information + AI Helper - Exact match to other tools */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Analysis Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Analysis Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={boxPlotData.analysisTitle}
                onChange={(e) => handleBasicInfoChange('analysisTitle', e.target.value)}
                placeholder="Enter the title for your box plot analysis"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Analyst <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={boxPlotData.analyst}
                  onChange={(e) => handleBasicInfoChange('analyst', e.target.value)}
                  placeholder="Who is conducting this analysis?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={boxPlotData.dateCreated}
                  onChange={(e) => handleBasicInfoChange('dateCreated', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Variable <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={boxPlotData.dataConfig.variable}
                onChange={(e) => handleDataConfigChange('variable', e.target.value)}
                placeholder="What variable are you analyzing?"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Units
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={boxPlotData.dataConfig.units}
                  onChange={(e) => handleDataConfigChange('units', e.target.value)}
                  placeholder="Units of measurement"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Sample Size
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={boxPlotData.dataConfig.sampleSize}
                  onChange={(e) => handleDataConfigChange('sampleSize', e.target.value)}
                  placeholder="Total sample size"
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  Box Plot AI Guide
                </h3>
                <div className={styles.chatStatus}>
                  {isAITyping ? (
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
                {chatMessages.map((message) => (
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
              </div>

              <div className={styles.chatInput}>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about box plots..."
                  className={styles.messageInput}
                />
                <button 
                  onClick={handleSendMessage}
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
                    onClick={() => handleQuickAction('What is a box plot?')}
                  >
                    Box Plot Basics
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I identify outliers?')}
                  >
                    Outlier Detection
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What are quartiles?')}
                  >
                    Quartiles
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I compare groups?')}
                  >
                    Group Comparison
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I interpret box plots?')}
                  >
                    Interpretation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Input Section */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Data Input</h2>
            <div className={styles.dataActions}>
              <button className={styles.addBtn} onClick={addDataset}>
                <i className="fas fa-plus"></i> Add Dataset
              </button>
              <button className={styles.calculateBtn} onClick={calculateStatistics}>
                <i className="fas fa-calculator"></i> Calculate Statistics
              </button>
            </div>
          </div>
          
          <div className={styles.dataInputGrid}>
            {boxPlotData.dataInput.datasets.map((dataset) => (
              <div key={dataset.id} className={styles.datasetCard}>
                <div className={styles.datasetHeader}>
                  <div className={styles.datasetTitle}>
                    <div 
                      className={styles.colorIndicator} 
                      style={{ backgroundColor: dataset.color }}
                    ></div>
                    <input
                      type="text"
                      className={styles.datasetNameInput}
                      value={dataset.name}
                      onChange={(e) => handleDatasetChange(dataset.id, 'name', e.target.value)}
                      placeholder="Dataset name"
                    />
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeDataset(dataset.id)}
                    disabled={boxPlotData.dataInput.datasets.length <= 1}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className={styles.datasetContent}>
                  <label className={styles.fieldLabel}>Data Values</label>
                  <textarea
                    className={styles.dataTextarea}
                    value={dataset.values.join(', ')}
                    onChange={(e) => handleDatasetValuesChange(dataset.id, e.target.value)}
                    placeholder="Enter values separated by commas, spaces, or new lines"
                    rows={5}
                  />
                  <div className={styles.datasetStats}>
                    <span>n = {dataset.values.length}</span>
                    {dataset.values.length > 0 && (
                      <>
                        <span>Range = {Math.min(...dataset.values)} - {Math.max(...dataset.values)}</span>
                        <span>Mean = {(dataset.values.reduce((sum, val) => sum + val, 0) / dataset.values.length).toFixed(3)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plot Configuration Section */}
        <div className={styles.analysisCard}>
          <h2>Plot Configuration</h2>
          <div className={styles.plotConfigGrid}>
            <div className={styles.configSection}>
              <h3>Display Options</h3>
              <div className={styles.configFields}>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Orientation</label>
                    <select
                      className={styles.selectInput}
                      value={boxPlotData.plotConfig.orientation}
                      onChange={(e) => handlePlotConfigChange('orientation', e.target.value)}
                    >
                      <option value="vertical">Vertical</option>
                      <option value="horizontal">Horizontal</option>
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Outlier Method</label>
                    <select
                      className={styles.selectInput}
                      value={boxPlotData.plotConfig.outlierMethod}
                      onChange={(e) => handlePlotConfigChange('outlierMethod', e.target.value)}
                    >
                      <option value="iqr">IQR Method (1.5×IQR)</option>
                      <option value="modified-z-score">Modified Z-Score</option>
                      <option value="percentile">Percentile Method</option>
                    </select>
                  </div>
                </div>
                <div className={styles.checkboxGrid}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={boxPlotData.plotConfig.showOutliers}
                      onChange={(e) => handlePlotConfigChange('showOutliers', e.target.checked)}
                    />
                    Show Outliers
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={boxPlotData.plotConfig.showMean}
                      onChange={(e) => handlePlotConfigChange('showMean', e.target.checked)}
                    />
                    Show Mean
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={boxPlotData.plotConfig.showNotches}
                      onChange={(e) => handlePlotConfigChange('showNotches', e.target.checked)}
                    />
                    Show Notches
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={boxPlotData.plotConfig.showGrid}
                      onChange={(e) => handlePlotConfigChange('showGrid', e.target.checked)}
                    />
                    Show Grid
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.configSection}>
              <h3>Labels & Titles</h3>
              <div className={styles.configFields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Plot Title</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={boxPlotData.plotConfig.title}
                    onChange={(e) => handlePlotConfigChange('title', e.target.value)}
                    placeholder="Enter plot title"
                  />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>X-Axis Label</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={boxPlotData.plotConfig.xAxisLabel}
                      onChange={(e) => handlePlotConfigChange('xAxisLabel', e.target.value)}
                      placeholder="X-axis label"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Y-Axis Label</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={boxPlotData.plotConfig.yAxisLabel}
                      onChange={(e) => handlePlotConfigChange('yAxisLabel', e.target.value)}
                      placeholder="Y-axis label"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Summary Section */}
        <div className={styles.analysisCard}>
          <h2>Statistical Summary</h2>
          <div className={styles.statisticsTable}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>n</th>
                  <th>Min</th>
                  <th>Q1</th>
                  <th>Median</th>
                  <th>Q3</th>
                  <th>Max</th>
                  <th>IQR</th>
                  <th>Mean</th>
                  <th>Std Dev</th>
                  <th>Outliers</th>
                </tr>
              </thead>
              <tbody>
                {boxPlotData.statistics.datasets.map((stat, index) => (
                  <tr key={index}>
                    <td className={styles.datasetNameCell}>{stat.datasetName}</td>
                    <td>{stat.n}</td>
                    <td>{stat.min}</td>
                    <td>{stat.q1}</td>
                    <td className={styles.medianCell}>{stat.median}</td>
                    <td>{stat.q3}</td>
                    <td>{stat.max}</td>
                    <td>{stat.iqr}</td>
                    <td>{stat.mean}</td>
                    <td>{stat.std}</td>
                    <td className={styles.outliersCell}>
                      {stat.outliers.length > 0 ? stat.outliers.join(', ') : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outlier Analysis Section */}
        <div className={styles.analysisCard}>
          <h2>Outlier Analysis</h2>
          <div className={styles.outlierGrid}>
            <div className={styles.outlierSummary}>
              <h3>Detected Outliers</h3>
              <div className={styles.outlierList}>
                {boxPlotData.outlierAnalysis.outliers.length > 0 ? (
                  boxPlotData.outlierAnalysis.outliers.map((outlier, index) => (
                    <div key={index} className={styles.outlierItem}>
                      <span className={styles.outlierDataset}>{outlier.dataset}:</span>
                      <span className={styles.outlierValue}>{outlier.value}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noOutliers}>No outliers detected</div>
                )}
              </div>
            </div>
            <div className={styles.outlierActions}>
              <h3>Outlier Treatment</h3>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Action</label>
                <select
                  className={styles.selectInput}
                  value={boxPlotData.outlierAnalysis.outlierAction}
                  onChange={(e) => handleOutlierAnalysisChange('outlierAction', e.target.value)}
                >
                  <option value="investigate">Investigate Further</option>
                  <option value="keep">Keep in Analysis</option>
                  <option value="remove">Remove from Analysis</option>
                  <option value="transform">Apply Transformation</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Investigation Notes</label>
                <textarea
                  className={styles.textareaInput}
                  value={boxPlotData.outlierAnalysis.outlierInvestigation}
                  onChange={(e) => handleOutlierAnalysisChange('outlierInvestigation', e.target.value)}
                  placeholder="Document your outlier investigation and findings"
                  rows={3}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Justification</label>
                <textarea
                  className={styles.textareaInput}
                  value={boxPlotData.outlierAnalysis.outlierJustification}
                  onChange={(e) => handleOutlierAnalysisChange('outlierJustification', e.target.value)}
                  placeholder="Justify your decision about outlier treatment"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Group Comparison Section */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Group Comparison</h2>
            <label className={styles.enableToggle}>
              <input
                type="checkbox"
                checked={boxPlotData.comparisonAnalysis.enabled}
                onChange={(e) => handleComparisonAnalysisChange('enabled', e.target.checked)}
              />
              Enable Comparison Analysis
            </label>
          </div>
          
          {boxPlotData.comparisonAnalysis.enabled && (
            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonConfig}>
                <h3>Comparison Configuration</h3>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Comparison Type</label>
                    <select
                      className={styles.selectInput}
                      value={boxPlotData.comparisonAnalysis.comparisonType}
                      onChange={(e) => handleComparisonAnalysisChange('comparisonType', e.target.value)}
                    >
                      <option value="groups">Between Groups</option>
                      <option value="time-series">Time Series</option>
                      <option value="conditions">Different Conditions</option>
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Statistical Test</label>
                    <select
                      className={styles.selectInput}
                      value={boxPlotData.comparisonAnalysis.statisticalTest}
                      onChange={(e) => handleComparisonAnalysisChange('statisticalTest', e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="anova">ANOVA</option>
                      <option value="kruskal-wallis">Kruskal-Wallis</option>
                      <option value="t-test">T-Test</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.testResults}>
                <h3>Test Results</h3>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Test Statistic</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={boxPlotData.comparisonAnalysis.testResults.testStatistic}
                      onChange={(e) => handleComparisonAnalysisChange('testResults', {
                        ...boxPlotData.comparisonAnalysis.testResults,
                        testStatistic: e.target.value
                      })}
                      placeholder="Enter test statistic value"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>P-Value</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={boxPlotData.comparisonAnalysis.testResults.pValue}
                      onChange={(e) => handleComparisonAnalysisChange('testResults', {
                        ...boxPlotData.comparisonAnalysis.testResults,
                        pValue: e.target.value
                      })}
                      placeholder="Enter p-value"
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Statistical Conclusion</label>
                  <textarea
                    className={styles.textareaInput}
                    value={boxPlotData.comparisonAnalysis.testResults.conclusion}
                    onChange={(e) => handleComparisonAnalysisChange('testResults', {
                      ...boxPlotData.comparisonAnalysis.testResults,
                      conclusion: e.target.value
                    })}
                    placeholder="Interpret the statistical test results"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Insights and Interpretation Section */}
        <div className={styles.analysisCard}>
          <h2>Insights & Interpretation</h2>
          <div className={styles.insightsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Distribution Shape</label>
              <textarea
                className={styles.textareaInput}
                value={boxPlotData.insights.distributionShape}
                onChange={(e) => handleInsightsChange('distributionShape', e.target.value)}
                placeholder="Describe the shape of the distribution (symmetric, skewed, etc.)"
                rows={2}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Central Tendency</label>
              <textarea
                className={styles.textareaInput}
                value={boxPlotData.insights.centralTendency}
                onChange={(e) => handleInsightsChange('centralTendency', e.target.value)}
                placeholder="Comment on the central tendency (median, mean comparison)"
                rows={2}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Variability</label>
              <textarea
                className={styles.textareaInput}
                value={boxPlotData.insights.variability}
                onChange={(e) => handleInsightsChange('variability', e.target.value)}
                placeholder="Describe the variability and spread of the data"
                rows={2}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Outlier Insights</label>
              <textarea
                className={styles.textareaInput}
                value={boxPlotData.insights.outlierInsights}
                onChange={(e) => handleInsightsChange('outlierInsights', e.target.value)}
                placeholder="What do the outliers tell us about the process or data?"
                rows={2}
              />
            </div>
            {boxPlotData.dataInput.datasets.length > 1 && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Group Differences</label>
                <textarea
                  className={styles.textareaInput}
                  value={boxPlotData.insights.groupDifferences}
                  onChange={(e) => handleInsightsChange('groupDifferences', e.target.value)}
                  placeholder="Compare the distributions between groups"
                  rows={2}
                />
              </div>
            )}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Recommendations <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={boxPlotData.insights.recommendations}
                onChange={(e) => handleInsightsChange('recommendations', e.target.value)}
                placeholder="What actions or decisions are recommended based on this analysis?"
                rows={3}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Limitations</label>
              <textarea
                className={styles.textareaInput}
                value={boxPlotData.insights.limitations}
                onChange={(e) => handleInsightsChange('limitations', e.target.value)}
                placeholder="What are the limitations of this analysis?"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxPlot;

