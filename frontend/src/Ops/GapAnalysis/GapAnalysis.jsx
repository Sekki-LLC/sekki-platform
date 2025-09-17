import React, { useState, useEffect } from 'react';
import styles from './GapAnalysis.module.css';

const GapAnalysis = () => {
  // Gap Analysis structure
  const [gapData, setGapData] = useState({
    // Analysis Information
    analysisTitle: '',
    analyst: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Analysis Setup
    analysisSetup: {
      purpose: '',
      scope: '',
      timeframe: '',
      stakeholders: '',
      successCriteria: ''
    },
    
    // Current State Assessment
    currentState: {
      description: '',
      strengths: [],
      weaknesses: [],
      capabilities: [],
      resources: [],
      processes: [],
      performance: []
    },
    
    // Future State Vision
    futureState: {
      description: '',
      vision: '',
      objectives: [],
      requirements: [],
      capabilities: [],
      resources: [],
      processes: [],
      performance: []
    },
    
    // Gap Identification
    gaps: [],
    
    // Gap Prioritization
    prioritization: {
      criteria: {
        impact: 'High impact on business objectives',
        urgency: 'Time-sensitive requirements',
        feasibility: 'Realistic to implement',
        cost: 'Cost-effective solution'
      },
      prioritizedGaps: []
    },
    
    // Action Planning
    actionPlan: {
      initiatives: [],
      timeline: '',
      budget: '',
      resources: '',
      risks: '',
      dependencies: ''
    },
    
    // Monitoring & Measurement
    monitoring: {
      kpis: [],
      milestones: [],
      reviewFrequency: 'monthly',
      reportingStructure: '',
      successMetrics: ''
    },
    
    // Documentation
    documentation: {
      assumptions: '',
      constraints: '',
      recommendations: '',
      nextSteps: '',
      approver: '',
      approvalDate: ''
    }
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching other tools structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Gap Analysis! I'll help you systematically identify and analyze gaps between your current state and desired future state. This tool guides you through current state assessment, future state visioning, gap identification, prioritization, and action planning. What area are you analyzing?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'current state': "Current state assessment involves documenting existing capabilities, resources, processes, and performance. Be thorough and objective - include both strengths and weaknesses. Use data and evidence where possible.",
      'future state': "Future state visioning defines where you want to be. Be specific about objectives, required capabilities, resources, and expected performance. Ensure alignment with strategic goals and stakeholder expectations.",
      'gap identification': "Gap identification compares current vs future state to find differences. Look for capability gaps, resource gaps, process gaps, and performance gaps. Categorize gaps by type and assess their significance.",
      'prioritization': "Gap prioritization helps focus efforts on the most critical gaps first. Consider impact on objectives, urgency, implementation feasibility, and cost. Use consistent criteria for fair comparison.",
      'action planning': "Action planning translates gap analysis into executable initiatives. Define specific actions, timelines, owners, resources, and success metrics. Consider dependencies and risks in your planning.",
      'monitoring': "Monitoring ensures gap closure progress is tracked. Define KPIs, milestones, review frequency, and reporting structure. Regular monitoring enables course correction and ensures accountability.",
      'stakeholders': "Involve key stakeholders in gap analysis for accuracy and buy-in. Different perspectives help identify blind spots and ensure comprehensive analysis. Document stakeholder input and concerns.",
      'assessment': "Effective assessment requires both quantitative and qualitative data. Use surveys, interviews, observations, and metrics. Be objective and evidence-based in your current state evaluation.",
      'default': "I can help with current state assessment, future state visioning, gap identification, prioritization, action planning, monitoring setup, or stakeholder engagement. What specific aspect needs guidance?"
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
      if (gapData.analysisTitle) completedFields++;
      if (gapData.analyst) completedFields++;
      if (gapData.analysisSetup.purpose) completedFields++;

      // Setup (2 fields)
      totalFields += 2;
      if (gapData.analysisSetup.scope) completedFields++;
      if (gapData.currentState.description) completedFields++;

      // States (2 fields)
      totalFields += 2;
      if (gapData.futureState.description) completedFields++;
      if (gapData.gaps.length > 0) completedFields++;

      // Planning (2 fields)
      totalFields += 2;
      if (gapData.actionPlan.timeline) completedFields++;
      if (gapData.monitoring.reviewFrequency) completedFields++;

      // Documentation (1 field)
      totalFields += 1;
      if (gapData.documentation.assumptions) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [gapData]);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle setup changes
  const handleSetupChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      analysisSetup: {
        ...prev.analysisSetup,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle current state changes
  const handleCurrentStateChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      currentState: {
        ...prev.currentState,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle future state changes
  const handleFutureStateChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      futureState: {
        ...prev.futureState,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add item to array field
  const addArrayItem = (section, field) => {
    const newItem = {
      id: Date.now(),
      description: '',
      category: '',
      priority: 'medium',
      status: 'identified'
    };
    
    setGapData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], newItem]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove item from array field
  const removeArrayItem = (section, field, itemId) => {
    setGapData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter(item => item.id !== itemId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle array item changes
  const handleArrayItemChange = (section, field, itemId, property, value) => {
    setGapData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map(item =>
          item.id === itemId ? { ...item, [property]: value } : item
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add gap
  const addGap = () => {
    const newGap = {
      id: Date.now(),
      title: '',
      description: '',
      category: 'capability', // 'capability', 'resource', 'process', 'performance', 'technology', 'skill'
      currentState: '',
      futureState: '',
      gapSize: 'medium', // 'small', 'medium', 'large'
      impact: 'medium', // 'low', 'medium', 'high'
      urgency: 'medium', // 'low', 'medium', 'high'
      feasibility: 'medium', // 'low', 'medium', 'high'
      cost: 'medium', // 'low', 'medium', 'high'
      priority: '', // Will be calculated
      riskOfNotAddressing: '',
      potentialSolutions: '',
      estimatedEffort: '',
      estimatedCost: '',
      expectedBenefit: '',
      dependencies: '',
      status: 'identified' // 'identified', 'analyzed', 'planned', 'in-progress', 'closed'
    };
    
    setGapData(prev => ({
      ...prev,
      gaps: [...prev.gaps, newGap],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove gap
  const removeGap = (gapId) => {
    setGapData(prev => ({
      ...prev,
      gaps: prev.gaps.filter(gap => gap.id !== gapId),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle gap changes
  const handleGapChange = (gapId, field, value) => {
    setGapData(prev => ({
      ...prev,
      gaps: prev.gaps.map(gap => {
        if (gap.id === gapId) {
          const updatedGap = { ...gap, [field]: value };
          
          // Calculate priority when impact, urgency, or feasibility changes
          if (field === 'impact' || field === 'urgency' || field === 'feasibility') {
            const impact = field === 'impact' ? value : gap.impact;
            const urgency = field === 'urgency' ? value : gap.urgency;
            const feasibility = field === 'feasibility' ? value : gap.feasibility;
            
            // Calculate priority score
            const scores = { low: 1, medium: 2, high: 3 };
            const priorityScore = (scores[impact] + scores[urgency] + scores[feasibility]) / 3;
            
            let priority = '';
            if (priorityScore >= 2.5) priority = 'High';
            else if (priorityScore >= 2) priority = 'Medium';
            else priority = 'Low';
            
            updatedGap.priority = priority;
          }
          
          return updatedGap;
        }
        return gap;
      }),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle prioritization changes
  const handlePrioritizationChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      prioritization: {
        ...prev.prioritization,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle action plan changes
  const handleActionPlanChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle monitoring changes
  const handleMonitoringChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle documentation changes
  const handleDocumentationChange = (field, value) => {
    setGapData(prev => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add initiative
  const addInitiative = () => {
    const newInitiative = {
      id: Date.now(),
      title: '',
      description: '',
      gapAddressed: '',
      owner: '',
      startDate: '',
      endDate: '',
      budget: '',
      resources: '',
      milestones: '',
      status: 'planned' // 'planned', 'in-progress', 'completed', 'on-hold'
    };
    
    setGapData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        initiatives: [...prev.actionPlan.initiatives, newInitiative]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove initiative
  const removeInitiative = (initiativeId) => {
    setGapData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        initiatives: prev.actionPlan.initiatives.filter(initiative => initiative.id !== initiativeId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle initiative changes
  const handleInitiativeChange = (initiativeId, field, value) => {
    setGapData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        initiatives: prev.actionPlan.initiatives.map(initiative =>
          initiative.id === initiativeId ? { ...initiative, [field]: value } : initiative
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add KPI
  const addKPI = () => {
    const newKPI = {
      id: Date.now(),
      metric: '',
      currentValue: '',
      targetValue: '',
      unit: '',
      frequency: 'monthly',
      owner: '',
      status: 'active'
    };
    
    setGapData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        kpis: [...prev.monitoring.kpis, newKPI]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove KPI
  const removeKPI = (kpiId) => {
    setGapData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        kpis: prev.monitoring.kpis.filter(kpi => kpi.id !== kpiId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle KPI changes
  const handleKPIChange = (kpiId, field, value) => {
    setGapData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        kpis: prev.monitoring.kpis.map(kpi =>
          kpi.id === kpiId ? { ...kpi, [field]: value } : kpi
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Save draft
  const handleSave = () => {
    console.log('Saving Gap Analysis draft:', gapData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting Gap Analysis to PDF:', gapData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to other tools */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Gap Analysis</h1>
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
                value={gapData.analysisTitle}
                onChange={(e) => handleBasicInfoChange('analysisTitle', e.target.value)}
                placeholder="Enter the title for your gap analysis"
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
                  value={gapData.analyst}
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
                  value={gapData.dateCreated}
                  onChange={(e) => handleBasicInfoChange('dateCreated', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Purpose <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={gapData.analysisSetup.purpose}
                onChange={(e) => handleSetupChange('purpose', e.target.value)}
                placeholder="What is the purpose of this gap analysis?"
                rows={2}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Scope</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={gapData.analysisSetup.scope}
                  onChange={(e) => handleSetupChange('scope', e.target.value)}
                  placeholder="What is included in this analysis?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Timeframe</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={gapData.analysisSetup.timeframe}
                  onChange={(e) => handleSetupChange('timeframe', e.target.value)}
                  placeholder="What timeframe are we analyzing?"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Key Stakeholders</label>
              <textarea
                className={styles.textareaInput}
                value={gapData.analysisSetup.stakeholders}
                onChange={(e) => handleSetupChange('stakeholders', e.target.value)}
                placeholder="Who are the key stakeholders involved?"
                rows={2}
              />
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  Gap Analysis AI Guide
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
                  placeholder="Ask me about gap analysis..."
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
                    onClick={() => handleQuickAction('How do I assess current state?')}
                  >
                    Current State Assessment
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I define future state?')}
                  >
                    Future State Vision
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I identify gaps?')}
                  >
                    Gap Identification
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I prioritize gaps?')}
                  >
                    Gap Prioritization
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I create action plans?')}
                  >
                    Action Planning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current State Assessment Section */}
        <div className={styles.analysisCard}>
          <h2>Current State Assessment</h2>
          <div className={styles.stateGrid}>
            <div className={styles.stateDescription}>
              <label className={styles.fieldLabel}>
                Current State Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={gapData.currentState.description}
                onChange={(e) => handleCurrentStateChange('description', e.target.value)}
                placeholder="Describe the current state in detail"
                rows={4}
              />
            </div>
            
            <div className={styles.stateCategories}>
              <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3>Strengths</h3>
                  <button className={styles.addBtn} onClick={() => addArrayItem('currentState', 'strengths')}>
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
                <div className={styles.categoryList}>
                  {gapData.currentState.strengths.map((strength) => (
                    <div key={strength.id} className={styles.categoryItem}>
                      <input
                        type="text"
                        className={styles.categoryInput}
                        value={strength.description}
                        onChange={(e) => handleArrayItemChange('currentState', 'strengths', strength.id, 'description', e.target.value)}
                        placeholder="Describe a current strength"
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeArrayItem('currentState', 'strengths', strength.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3>Weaknesses</h3>
                  <button className={styles.addBtn} onClick={() => addArrayItem('currentState', 'weaknesses')}>
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
                <div className={styles.categoryList}>
                  {gapData.currentState.weaknesses.map((weakness) => (
                    <div key={weakness.id} className={styles.categoryItem}>
                      <input
                        type="text"
                        className={styles.categoryInput}
                        value={weakness.description}
                        onChange={(e) => handleArrayItemChange('currentState', 'weaknesses', weakness.id, 'description', e.target.value)}
                        placeholder="Describe a current weakness"
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeArrayItem('currentState', 'weaknesses', weakness.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3>Current Capabilities</h3>
                  <button className={styles.addBtn} onClick={() => addArrayItem('currentState', 'capabilities')}>
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
                <div className={styles.categoryList}>
                  {gapData.currentState.capabilities.map((capability) => (
                    <div key={capability.id} className={styles.categoryItem}>
                      <input
                        type="text"
                        className={styles.categoryInput}
                        value={capability.description}
                        onChange={(e) => handleArrayItemChange('currentState', 'capabilities', capability.id, 'description', e.target.value)}
                        placeholder="Describe a current capability"
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeArrayItem('currentState', 'capabilities', capability.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future State Vision Section */}
        <div className={styles.analysisCard}>
          <h2>Future State Vision</h2>
          <div className={styles.stateGrid}>
            <div className={styles.stateDescription}>
              <label className={styles.fieldLabel}>
                Future State Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={gapData.futureState.description}
                onChange={(e) => handleFutureStateChange('description', e.target.value)}
                placeholder="Describe the desired future state in detail"
                rows={4}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Vision Statement</label>
              <textarea
                className={styles.textareaInput}
                value={gapData.futureState.vision}
                onChange={(e) => handleFutureStateChange('vision', e.target.value)}
                placeholder="What is the vision for the future state?"
                rows={2}
              />
            </div>
            
            <div className={styles.stateCategories}>
              <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3>Future Objectives</h3>
                  <button className={styles.addBtn} onClick={() => addArrayItem('futureState', 'objectives')}>
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
                <div className={styles.categoryList}>
                  {gapData.futureState.objectives.map((objective) => (
                    <div key={objective.id} className={styles.categoryItem}>
                      <input
                        type="text"
                        className={styles.categoryInput}
                        value={objective.description}
                        onChange={(e) => handleArrayItemChange('futureState', 'objectives', objective.id, 'description', e.target.value)}
                        placeholder="Describe a future objective"
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeArrayItem('futureState', 'objectives', objective.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3>Required Capabilities</h3>
                  <button className={styles.addBtn} onClick={() => addArrayItem('futureState', 'capabilities')}>
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
                <div className={styles.categoryList}>
                  {gapData.futureState.capabilities.map((capability) => (
                    <div key={capability.id} className={styles.categoryItem}>
                      <input
                        type="text"
                        className={styles.categoryInput}
                        value={capability.description}
                        onChange={(e) => handleArrayItemChange('futureState', 'capabilities', capability.id, 'description', e.target.value)}
                        placeholder="Describe a required capability"
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeArrayItem('futureState', 'capabilities', capability.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gap Identification Section */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Gap Identification</h2>
            <button className={styles.addBtn} onClick={addGap}>
              <i className="fas fa-plus"></i> Add Gap
            </button>
          </div>
          
          <div className={styles.gapsTable}>
            <table className={styles.gapTable}>
              <thead>
                <tr>
                  <th>Gap Title</th>
                  <th>Category</th>
                  <th>Current State</th>
                  <th>Future State</th>
                  <th>Gap Size</th>
                  <th>Impact</th>
                  <th>Urgency</th>
                  <th>Feasibility</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gapData.gaps.map((gap) => (
                  <tr key={gap.id}>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={gap.title}
                        onChange={(e) => handleGapChange(gap.id, 'title', e.target.value)}
                        placeholder="Gap title"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={gap.category}
                        onChange={(e) => handleGapChange(gap.id, 'category', e.target.value)}
                      >
                        <option value="capability">Capability</option>
                        <option value="resource">Resource</option>
                        <option value="process">Process</option>
                        <option value="performance">Performance</option>
                        <option value="technology">Technology</option>
                        <option value="skill">Skill</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={gap.currentState}
                        onChange={(e) => handleGapChange(gap.id, 'currentState', e.target.value)}
                        placeholder="Current state"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={gap.futureState}
                        onChange={(e) => handleGapChange(gap.id, 'futureState', e.target.value)}
                        placeholder="Future state"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.gapSizeSelect}
                        value={gap.gapSize}
                        onChange={(e) => handleGapChange(gap.id, 'gapSize', e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.impactSelect}
                        value={gap.impact}
                        onChange={(e) => handleGapChange(gap.id, 'impact', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.urgencySelect}
                        value={gap.urgency}
                        onChange={(e) => handleGapChange(gap.id, 'urgency', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.feasibilitySelect}
                        value={gap.feasibility}
                        onChange={(e) => handleGapChange(gap.id, 'feasibility', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td>
                      <span className={`${styles.priorityBadge} ${styles[gap.priority?.toLowerCase()]}`}>
                        {gap.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={gap.status}
                        onChange={(e) => handleGapChange(gap.id, 'status', e.target.value)}
                      >
                        <option value="identified">Identified</option>
                        <option value="analyzed">Analyzed</option>
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeGap(gap.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gap Prioritization Section */}
        <div className={styles.analysisCard}>
          <h2>Gap Prioritization</h2>
          <div className={styles.prioritizationGrid}>
            <div className={styles.prioritySection}>
              <h3>High Priority Gaps</h3>
              <div className={styles.priorityList}>
                {gapData.gaps
                  .filter(gap => gap.priority === 'High')
                  .map((gap) => (
                    <div key={gap.id} className={styles.gapCard}>
                      <div className={styles.gapCardHeader}>
                        <span className={styles.gapTitle}>{gap.title}</span>
                        <span className={`${styles.priorityBadge} ${styles.high}`}>High</span>
                      </div>
                      <div className={styles.gapCardDetails}>
                        <span>Category: {gap.category}</span>
                        <span>Size: {gap.gapSize}</span>
                        <span>Impact: {gap.impact}</span>
                        <span>Urgency: {gap.urgency}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className={styles.prioritySection}>
              <h3>Medium Priority Gaps</h3>
              <div className={styles.priorityList}>
                {gapData.gaps
                  .filter(gap => gap.priority === 'Medium')
                  .map((gap) => (
                    <div key={gap.id} className={styles.gapCard}>
                      <div className={styles.gapCardHeader}>
                        <span className={styles.gapTitle}>{gap.title}</span>
                        <span className={`${styles.priorityBadge} ${styles.medium}`}>Medium</span>
                      </div>
                      <div className={styles.gapCardDetails}>
                        <span>Category: {gap.category}</span>
                        <span>Size: {gap.gapSize}</span>
                        <span>Impact: {gap.impact}</span>
                        <span>Urgency: {gap.urgency}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className={styles.prioritySection}>
              <h3>Low Priority Gaps</h3>
              <div className={styles.priorityList}>
                {gapData.gaps
                  .filter(gap => gap.priority === 'Low')
                  .map((gap) => (
                    <div key={gap.id} className={styles.gapCard}>
                      <div className={styles.gapCardHeader}>
                        <span className={styles.gapTitle}>{gap.title}</span>
                        <span className={`${styles.priorityBadge} ${styles.low}`}>Low</span>
                      </div>
                      <div className={styles.gapCardDetails}>
                        <span>Category: {gap.category}</span>
                        <span>Size: {gap.gapSize}</span>
                        <span>Impact: {gap.impact}</span>
                        <span>Urgency: {gap.urgency}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Planning Section */}
        <div className={styles.analysisCard}>
          <h2>Action Planning</h2>
          <div className={styles.actionPlanSection}>
            <div className={styles.sectionHeader}>
              <h3>Gap Closure Initiatives</h3>
              <button className={styles.addBtn} onClick={addInitiative}>
                <i className="fas fa-plus"></i> Add Initiative
              </button>
            </div>
            
            <div className={styles.initiativesTable}>
              <table className={styles.initiativeTable}>
                <thead>
                  <tr>
                    <th>Initiative Title</th>
                    <th>Gap Addressed</th>
                    <th>Owner</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gapData.actionPlan.initiatives.map((initiative) => (
                    <tr key={initiative.id}>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={initiative.title}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'title', e.target.value)}
                          placeholder="Initiative title"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={initiative.gapAddressed}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'gapAddressed', e.target.value)}
                        >
                          <option value="">Select gap</option>
                          {gapData.gaps.map((gap) => (
                            <option key={gap.id} value={gap.title}>
                              {gap.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={initiative.owner}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'owner', e.target.value)}
                          placeholder="Owner"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className={styles.tableInput}
                          value={initiative.startDate}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'startDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className={styles.tableInput}
                          value={initiative.endDate}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'endDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={initiative.budget}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'budget', e.target.value)}
                          placeholder="Budget"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={initiative.status}
                          onChange={(e) => handleInitiativeChange(initiative.id, 'status', e.target.value)}
                        >
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeInitiative(initiative.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={styles.actionPlanDetails}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Overall Timeline</label>
                  <textarea
                    className={styles.textareaInput}
                    value={gapData.actionPlan.timeline}
                    onChange={(e) => handleActionPlanChange('timeline', e.target.value)}
                    placeholder="What is the overall timeline for gap closure?"
                    rows={2}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Total Budget</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={gapData.actionPlan.budget}
                    onChange={(e) => handleActionPlanChange('budget', e.target.value)}
                    placeholder="Total budget required"
                  />
                </div>
              </div>
              
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Resources Required</label>
                  <textarea
                    className={styles.textareaInput}
                    value={gapData.actionPlan.resources}
                    onChange={(e) => handleActionPlanChange('resources', e.target.value)}
                    placeholder="What resources are needed?"
                    rows={2}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Key Dependencies</label>
                  <textarea
                    className={styles.textareaInput}
                    value={gapData.actionPlan.dependencies}
                    onChange={(e) => handleActionPlanChange('dependencies', e.target.value)}
                    placeholder="What are the key dependencies?"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring & Measurement Section */}
        <div className={styles.analysisCard}>
          <h2>Monitoring & Measurement</h2>
          <div className={styles.monitoringSection}>
            <div className={styles.sectionHeader}>
              <h3>Key Performance Indicators</h3>
              <button className={styles.addBtn} onClick={addKPI}>
                <i className="fas fa-plus"></i> Add KPI
              </button>
            </div>
            
            <div className={styles.kpiTable}>
              <table className={styles.monitoringTable}>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Current Value</th>
                    <th>Target Value</th>
                    <th>Unit</th>
                    <th>Frequency</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gapData.monitoring.kpis.map((kpi) => (
                    <tr key={kpi.id}>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={kpi.metric}
                          onChange={(e) => handleKPIChange(kpi.id, 'metric', e.target.value)}
                          placeholder="KPI metric"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={kpi.currentValue}
                          onChange={(e) => handleKPIChange(kpi.id, 'currentValue', e.target.value)}
                          placeholder="Current"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={kpi.targetValue}
                          onChange={(e) => handleKPIChange(kpi.id, 'targetValue', e.target.value)}
                          placeholder="Target"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={kpi.unit}
                          onChange={(e) => handleKPIChange(kpi.id, 'unit', e.target.value)}
                          placeholder="Unit"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={kpi.frequency}
                          onChange={(e) => handleKPIChange(kpi.id, 'frequency', e.target.value)}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={kpi.owner}
                          onChange={(e) => handleKPIChange(kpi.id, 'owner', e.target.value)}
                          placeholder="Owner"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={kpi.status}
                          onChange={(e) => handleKPIChange(kpi.id, 'status', e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="achieved">Achieved</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeKPI(kpi.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={styles.monitoringDetails}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Review Frequency</label>
                  <select
                    className={styles.selectInput}
                    value={gapData.monitoring.reviewFrequency}
                    onChange={(e) => handleMonitoringChange('reviewFrequency', e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Reporting Structure</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={gapData.monitoring.reportingStructure}
                    onChange={(e) => handleMonitoringChange('reportingStructure', e.target.value)}
                    placeholder="Who reports to whom?"
                  />
                </div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Success Metrics</label>
                <textarea
                  className={styles.textareaInput}
                  value={gapData.monitoring.successMetrics}
                  onChange={(e) => handleMonitoringChange('successMetrics', e.target.value)}
                  placeholder="How will success be measured?"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documentation & Summary Section */}
        <div className={styles.analysisCard}>
          <h2>Documentation & Summary</h2>
          <div className={styles.documentationGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Assumptions <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={gapData.documentation.assumptions}
                onChange={(e) => handleDocumentationChange('assumptions', e.target.value)}
                placeholder="What assumptions were made during the analysis?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Constraints</label>
              <textarea
                className={styles.textareaInput}
                value={gapData.documentation.constraints}
                onChange={(e) => handleDocumentationChange('constraints', e.target.value)}
                placeholder="What constraints affect the gap closure?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Recommendations</label>
              <textarea
                className={styles.textareaInput}
                value={gapData.documentation.recommendations}
                onChange={(e) => handleDocumentationChange('recommendations', e.target.value)}
                placeholder="What are your recommendations for gap closure?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Next Steps</label>
                <textarea
                  className={styles.textareaInput}
                  value={gapData.documentation.nextSteps}
                  onChange={(e) => handleDocumentationChange('nextSteps', e.target.value)}
                  placeholder="What are the immediate next steps?"
                  rows={2}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Approver</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={gapData.documentation.approver}
                  onChange={(e) => handleDocumentationChange('approver', e.target.value)}
                  placeholder="Who approved this analysis?"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysis;

