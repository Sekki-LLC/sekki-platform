import React, { useState, useEffect } from 'react';
import styles from './ProblemStatement.module.css';

const ProblemStatement = () => {
  // Problem Statement structure
  const [problemData, setProblemData] = useState({
    // Basic Information
    statementTitle: '',
    author: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Problem Definition
    problemDefinition: {
      problemDescription: '',
      problemType: '', // 'quality', 'cost', 'delivery', 'safety', 'morale', 'other'
      businessImpact: '',
      urgency: '', // 'low', 'medium', 'high', 'critical'
      scope: '',
      boundaries: ''
    },
    
    // Current State
    currentState: {
      whatIsHappening: '',
      whereIsItOccurring: '',
      whenDoesItOccur: '',
      whoIsAffected: '',
      howOftenDoesItOccur: '',
      magnitude: ''
    },
    
    // Quantification
    quantification: {
      metrics: [],
      baseline: '',
      target: '',
      gap: '',
      financialImpact: '',
      customerImpact: '',
      operationalImpact: ''
    },
    
    // Stakeholders
    stakeholders: {
      primaryStakeholders: [],
      secondaryStakeholders: [],
      processOwner: '',
      sponsor: '',
      teamMembers: []
    },
    
    // Context & Background
    context: {
      backgroundInformation: '',
      previousAttempts: '',
      constraints: '',
      assumptions: '',
      dependencies: ''
    },
    
    // Success Criteria
    successCriteria: {
      primaryObjectives: [],
      secondaryObjectives: [],
      successMetrics: [],
      timeline: '',
      resources: ''
    },
    
    // Validation
    validation: {
      dataSource: '',
      evidenceType: '', // 'quantitative', 'qualitative', 'mixed'
      validationMethod: '',
      confidence: '', // 'low', 'medium', 'high'
      reviewers: [],
      approvalStatus: 'draft' // 'draft', 'review', 'approved', 'rejected'
    }
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching other tools structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Problem Statement Development! I'll help you create a clear, concise, and actionable problem statement. A well-defined problem statement is the foundation of successful improvement projects. It should clearly describe what's wrong, where it's happening, when it occurs, and the impact. What problem are you working to define?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'problem statement': "A good problem statement answers: What is wrong? Where is it happening? When does it occur? Who is affected? How big is the impact? It should be specific, measurable, and focused on the gap between current and desired state.",
      'what where when': "The 5W framework helps structure problem statements: What (the problem), Where (location/process), When (timing/frequency), Who (affected parties), Why (business impact). This ensures comprehensive problem definition.",
      'quantify': "Quantifying problems makes them actionable. Use metrics like defect rates, cycle times, costs, customer complaints, or revenue impact. Include baseline data, targets, and the gap between them.",
      'scope': "Problem scope defines boundaries - what's included and excluded. Clear scope prevents project creep and ensures focused solutions. Consider process boundaries, organizational boundaries, and time boundaries.",
      'stakeholders': "Identify all affected parties: process owners, customers, employees, suppliers, and leadership. Understanding stakeholder perspectives ensures comprehensive problem understanding and solution buy-in.",
      'impact': "Business impact justifies improvement efforts. Consider financial impact (cost, revenue), customer impact (satisfaction, retention), operational impact (efficiency, quality), and strategic impact (competitive advantage).",
      'validation': "Validate problems with data: customer feedback, process metrics, financial reports, or observational studies. Strong evidence builds credibility and ensures you're solving real problems.",
      'success criteria': "Define what success looks like: specific metrics, target values, timelines, and measurement methods. Clear success criteria guide solution development and measure project effectiveness.",
      'default': "I can help with problem definition, quantification, stakeholder analysis, scope setting, impact assessment, validation methods, or success criteria. What aspect needs guidance?"
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
      if (problemData.statementTitle) completedFields++;
      if (problemData.author) completedFields++;
      if (problemData.problemDefinition.problemDescription) completedFields++;

      // Problem definition (3 fields)
      totalFields += 3;
      if (problemData.problemDefinition.problemType) completedFields++;
      if (problemData.problemDefinition.businessImpact) completedFields++;
      if (problemData.problemDefinition.scope) completedFields++;

      // Current state (3 fields)
      totalFields += 3;
      if (problemData.currentState.whatIsHappening) completedFields++;
      if (problemData.currentState.whereIsItOccurring) completedFields++;
      if (problemData.currentState.whenDoesItOccur) completedFields++;

      // Quantification (2 fields)
      totalFields += 2;
      if (problemData.quantification.baseline) completedFields++;
      if (problemData.quantification.target) completedFields++;

      // Stakeholders (1 field)
      totalFields += 1;
      if (problemData.stakeholders.processOwner) completedFields++;

      // Success criteria (1 field)
      totalFields += 1;
      if (problemData.successCriteria.primaryObjectives.length > 0) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [problemData]);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle problem definition changes
  const handleProblemDefinitionChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      problemDefinition: {
        ...prev.problemDefinition,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle current state changes
  const handleCurrentStateChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      currentState: {
        ...prev.currentState,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle quantification changes
  const handleQuantificationChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      quantification: {
        ...prev.quantification,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle stakeholder changes
  const handleStakeholderChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      stakeholders: {
        ...prev.stakeholders,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle context changes
  const handleContextChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      context: {
        ...prev.context,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle success criteria changes
  const handleSuccessCriteriaChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle validation changes
  const handleValidationChange = (field, value) => {
    setProblemData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add metric
  const addMetric = () => {
    const newMetric = {
      id: Date.now(),
      name: '',
      currentValue: '',
      targetValue: '',
      unit: '',
      frequency: 'daily'
    };
    
    setProblemData(prev => ({
      ...prev,
      quantification: {
        ...prev.quantification,
        metrics: [...prev.quantification.metrics, newMetric]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove metric
  const removeMetric = (metricId) => {
    setProblemData(prev => ({
      ...prev,
      quantification: {
        ...prev.quantification,
        metrics: prev.quantification.metrics.filter(metric => metric.id !== metricId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle metric changes
  const handleMetricChange = (metricId, field, value) => {
    setProblemData(prev => ({
      ...prev,
      quantification: {
        ...prev.quantification,
        metrics: prev.quantification.metrics.map(metric =>
          metric.id === metricId ? { ...metric, [field]: value } : metric
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add stakeholder
  const addStakeholder = (type) => {
    const newStakeholder = {
      id: Date.now(),
      name: '',
      role: '',
      department: '',
      influence: 'medium',
      interest: 'medium'
    };
    
    setProblemData(prev => ({
      ...prev,
      stakeholders: {
        ...prev.stakeholders,
        [type]: [...prev.stakeholders[type], newStakeholder]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove stakeholder
  const removeStakeholder = (type, stakeholderId) => {
    setProblemData(prev => ({
      ...prev,
      stakeholders: {
        ...prev.stakeholders,
        [type]: prev.stakeholders[type].filter(stakeholder => stakeholder.id !== stakeholderId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle stakeholder changes
  const handleStakeholderItemChange = (type, stakeholderId, field, value) => {
    setProblemData(prev => ({
      ...prev,
      stakeholders: {
        ...prev.stakeholders,
        [type]: prev.stakeholders[type].map(stakeholder =>
          stakeholder.id === stakeholderId ? { ...stakeholder, [field]: value } : stakeholder
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add objective
  const addObjective = (type) => {
    const newObjective = {
      id: Date.now(),
      objective: '',
      metric: '',
      target: '',
      timeline: ''
    };
    
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        [type]: [...prev.successCriteria[type], newObjective]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove objective
  const removeObjective = (type, objectiveId) => {
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        [type]: prev.successCriteria[type].filter(objective => objective.id !== objectiveId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle objective changes
  const handleObjectiveChange = (type, objectiveId, field, value) => {
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        [type]: prev.successCriteria[type].map(objective =>
          objective.id === objectiveId ? { ...objective, [field]: value } : objective
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add success metric
  const addSuccessMetric = () => {
    const newMetric = {
      id: Date.now(),
      metric: '',
      baseline: '',
      target: '',
      measurement: ''
    };
    
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        successMetrics: [...prev.successCriteria.successMetrics, newMetric]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove success metric
  const removeSuccessMetric = (metricId) => {
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        successMetrics: prev.successCriteria.successMetrics.filter(metric => metric.id !== metricId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle success metric changes
  const handleSuccessMetricChange = (metricId, field, value) => {
    setProblemData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        successMetrics: prev.successCriteria.successMetrics.map(metric =>
          metric.id === metricId ? { ...metric, [field]: value } : metric
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add reviewer
  const addReviewer = () => {
    const newReviewer = {
      id: Date.now(),
      name: '',
      role: '',
      reviewDate: '',
      status: 'pending',
      comments: ''
    };
    
    setProblemData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        reviewers: [...prev.validation.reviewers, newReviewer]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove reviewer
  const removeReviewer = (reviewerId) => {
    setProblemData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        reviewers: prev.validation.reviewers.filter(reviewer => reviewer.id !== reviewerId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle reviewer changes
  const handleReviewerChange = (reviewerId, field, value) => {
    setProblemData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        reviewers: prev.validation.reviewers.map(reviewer =>
          reviewer.id === reviewerId ? { ...reviewer, [field]: value } : reviewer
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Save draft
  const handleSave = () => {
    console.log('Saving Problem Statement draft:', problemData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting Problem Statement to PDF:', problemData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to other tools */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Problem Statement</h1>
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
        {/* Top Section: Statement Information + AI Helper - Exact match to other tools */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Statement Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Problem Statement Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={problemData.statementTitle}
                onChange={(e) => handleBasicInfoChange('statementTitle', e.target.value)}
                placeholder="Enter a descriptive title for your problem statement"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Author <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={problemData.author}
                  onChange={(e) => handleBasicInfoChange('author', e.target.value)}
                  placeholder="Who is creating this problem statement?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={problemData.dateCreated}
                  onChange={(e) => handleBasicInfoChange('dateCreated', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Problem Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={problemData.problemDefinition.problemDescription}
                onChange={(e) => handleProblemDefinitionChange('problemDescription', e.target.value)}
                placeholder="Provide a clear, concise description of the problem"
                rows={3}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Problem Type</label>
                <select
                  className={styles.selectInput}
                  value={problemData.problemDefinition.problemType}
                  onChange={(e) => handleProblemDefinitionChange('problemType', e.target.value)}
                >
                  <option value="">Select problem type</option>
                  <option value="quality">Quality</option>
                  <option value="cost">Cost</option>
                  <option value="delivery">Delivery</option>
                  <option value="safety">Safety</option>
                  <option value="morale">Morale</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Urgency</label>
                <select
                  className={styles.selectInput}
                  value={problemData.problemDefinition.urgency}
                  onChange={(e) => handleProblemDefinitionChange('urgency', e.target.value)}
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  Problem Statement AI Guide
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
                  placeholder="Ask me about problem statements..."
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
                    onClick={() => handleQuickAction('How do I write a good problem statement?')}
                  >
                    Writing Guidelines
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What are the 5Ws for problem definition?')}
                  >
                    5W Framework
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I quantify the problem?')}
                  >
                    Quantification
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I define scope and boundaries?')}
                  >
                    Scope Definition
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I validate the problem?')}
                  >
                    Validation Methods
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Definition Section */}
        <div className={styles.analysisCard}>
          <h2>Problem Definition</h2>
          <div className={styles.problemDefinitionSection}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Business Impact <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={problemData.problemDefinition.businessImpact}
                onChange={(e) => handleProblemDefinitionChange('businessImpact', e.target.value)}
                placeholder="Describe the business impact of this problem"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Scope <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={problemData.problemDefinition.scope}
                onChange={(e) => handleProblemDefinitionChange('scope', e.target.value)}
                placeholder="Define what is included and excluded from this problem"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Boundaries</label>
              <textarea
                className={styles.textareaInput}
                value={problemData.problemDefinition.boundaries}
                onChange={(e) => handleProblemDefinitionChange('boundaries', e.target.value)}
                placeholder="Define the boundaries of the problem (process, organizational, time)"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Current State Analysis Section */}
        <div className={styles.analysisCard}>
          <h2>Current State Analysis (5W Framework)</h2>
          <div className={styles.currentStateGrid}>
            <div className={styles.currentStateCard}>
              <h3>What is happening?</h3>
              <textarea
                className={styles.textareaInput}
                value={problemData.currentState.whatIsHappening}
                onChange={(e) => handleCurrentStateChange('whatIsHappening', e.target.value)}
                placeholder="Describe what exactly is happening"
                rows={3}
              />
            </div>
            
            <div className={styles.currentStateCard}>
              <h3>Where is it occurring?</h3>
              <textarea
                className={styles.textareaInput}
                value={problemData.currentState.whereIsItOccurring}
                onChange={(e) => handleCurrentStateChange('whereIsItOccurring', e.target.value)}
                placeholder="Specify the location, process, or area where the problem occurs"
                rows={3}
              />
            </div>
            
            <div className={styles.currentStateCard}>
              <h3>When does it occur?</h3>
              <textarea
                className={styles.textareaInput}
                value={problemData.currentState.whenDoesItOccur}
                onChange={(e) => handleCurrentStateChange('whenDoesItOccur', e.target.value)}
                placeholder="Describe the timing, frequency, or conditions when the problem occurs"
                rows={3}
              />
            </div>
            
            <div className={styles.currentStateCard}>
              <h3>Who is affected?</h3>
              <textarea
                className={styles.textareaInput}
                value={problemData.currentState.whoIsAffected}
                onChange={(e) => handleCurrentStateChange('whoIsAffected', e.target.value)}
                placeholder="Identify who is impacted by this problem"
                rows={3}
              />
            </div>
            
            <div className={styles.currentStateCard}>
              <h3>How often does it occur?</h3>
              <textarea
                className={styles.textareaInput}
                value={problemData.currentState.howOftenDoesItOccur}
                onChange={(e) => handleCurrentStateChange('howOftenDoesItOccur', e.target.value)}
                placeholder="Describe the frequency or pattern of occurrence"
                rows={3}
              />
            </div>
            
            <div className={styles.currentStateCard}>
              <h3>What is the magnitude?</h3>
              <textarea
                className={styles.textareaInput}
                value={problemData.currentState.magnitude}
                onChange={(e) => handleCurrentStateChange('magnitude', e.target.value)}
                placeholder="Quantify the size or scale of the problem"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Quantification Section */}
        <div className={styles.analysisCard}>
          <h2>Problem Quantification</h2>
          <div className={styles.quantificationSection}>
            <div className={styles.metricsSection}>
              <div className={styles.sectionHeader}>
                <h3>Key Metrics</h3>
                <button className={styles.addBtn} onClick={addMetric}>
                  <i className="fas fa-plus"></i> Add Metric
                </button>
              </div>
              
              <div className={styles.metricsTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Metric Name</th>
                      <th>Current Value</th>
                      <th>Target Value</th>
                      <th>Unit</th>
                      <th>Frequency</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problemData.quantification.metrics.map((metric) => (
                      <tr key={metric.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.name}
                            onChange={(e) => handleMetricChange(metric.id, 'name', e.target.value)}
                            placeholder="Metric name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.currentValue}
                            onChange={(e) => handleMetricChange(metric.id, 'currentValue', e.target.value)}
                            placeholder="Current"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.targetValue}
                            onChange={(e) => handleMetricChange(metric.id, 'targetValue', e.target.value)}
                            placeholder="Target"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.unit}
                            onChange={(e) => handleMetricChange(metric.id, 'unit', e.target.value)}
                            placeholder="Unit"
                          />
                        </td>
                        <td>
                          <select
                            className={styles.tableSelect}
                            value={metric.frequency}
                            onChange={(e) => handleMetricChange(metric.id, 'frequency', e.target.value)}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeMetric(metric.id)}
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
            
            <div className={styles.impactAssessment}>
              <h3>Impact Assessment</h3>
              <div className={styles.impactGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Baseline Performance</label>
                  <textarea
                    className={styles.textareaInput}
                    value={problemData.quantification.baseline}
                    onChange={(e) => handleQuantificationChange('baseline', e.target.value)}
                    placeholder="Describe current baseline performance"
                    rows={2}
                  />
                </div>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Target Performance</label>
                  <textarea
                    className={styles.textareaInput}
                    value={problemData.quantification.target}
                    onChange={(e) => handleQuantificationChange('target', e.target.value)}
                    placeholder="Describe desired target performance"
                    rows={2}
                  />
                </div>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Performance Gap</label>
                  <textarea
                    className={styles.textareaInput}
                    value={problemData.quantification.gap}
                    onChange={(e) => handleQuantificationChange('gap', e.target.value)}
                    placeholder="Quantify the gap between current and target"
                    rows={2}
                  />
                </div>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Financial Impact</label>
                  <textarea
                    className={styles.textareaInput}
                    value={problemData.quantification.financialImpact}
                    onChange={(e) => handleQuantificationChange('financialImpact', e.target.value)}
                    placeholder="Estimate financial impact (cost, revenue, savings)"
                    rows={2}
                  />
                </div>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Customer Impact</label>
                  <textarea
                    className={styles.textareaInput}
                    value={problemData.quantification.customerImpact}
                    onChange={(e) => handleQuantificationChange('customerImpact', e.target.value)}
                    placeholder="Describe impact on customers"
                    rows={2}
                  />
                </div>
                
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Operational Impact</label>
                  <textarea
                    className={styles.textareaInput}
                    value={problemData.quantification.operationalImpact}
                    onChange={(e) => handleQuantificationChange('operationalImpact', e.target.value)}
                    placeholder="Describe operational impact"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholders Section */}
        <div className={styles.analysisCard}>
          <h2>Stakeholder Analysis</h2>
          <div className={styles.stakeholdersSection}>
            <div className={styles.stakeholderRoles}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Process Owner</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={problemData.stakeholders.processOwner}
                    onChange={(e) => handleStakeholderChange('processOwner', e.target.value)}
                    placeholder="Who owns the process?"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Sponsor</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={problemData.stakeholders.sponsor}
                    onChange={(e) => handleStakeholderChange('sponsor', e.target.value)}
                    placeholder="Who is sponsoring this initiative?"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.stakeholderGroups}>
              <div className={styles.stakeholderGroup}>
                <div className={styles.sectionHeader}>
                  <h3>Primary Stakeholders</h3>
                  <button className={styles.addBtn} onClick={() => addStakeholder('primaryStakeholders')}>
                    <i className="fas fa-plus"></i> Add Primary
                  </button>
                </div>
                
                <div className={styles.stakeholderList}>
                  {problemData.stakeholders.primaryStakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className={styles.stakeholderCard}>
                      <div className={styles.stakeholderInputs}>
                        <input
                          type="text"
                          className={styles.stakeholderInput}
                          value={stakeholder.name}
                          onChange={(e) => handleStakeholderItemChange('primaryStakeholders', stakeholder.id, 'name', e.target.value)}
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          className={styles.stakeholderInput}
                          value={stakeholder.role}
                          onChange={(e) => handleStakeholderItemChange('primaryStakeholders', stakeholder.id, 'role', e.target.value)}
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          className={styles.stakeholderInput}
                          value={stakeholder.department}
                          onChange={(e) => handleStakeholderItemChange('primaryStakeholders', stakeholder.id, 'department', e.target.value)}
                          placeholder="Department"
                        />
                        <select
                          className={styles.stakeholderSelect}
                          value={stakeholder.influence}
                          onChange={(e) => handleStakeholderItemChange('primaryStakeholders', stakeholder.id, 'influence', e.target.value)}
                        >
                          <option value="low">Low Influence</option>
                          <option value="medium">Medium Influence</option>
                          <option value="high">High Influence</option>
                        </select>
                        <select
                          className={styles.stakeholderSelect}
                          value={stakeholder.interest}
                          onChange={(e) => handleStakeholderItemChange('primaryStakeholders', stakeholder.id, 'interest', e.target.value)}
                        >
                          <option value="low">Low Interest</option>
                          <option value="medium">Medium Interest</option>
                          <option value="high">High Interest</option>
                        </select>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeStakeholder('primaryStakeholders', stakeholder.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.stakeholderGroup}>
                <div className={styles.sectionHeader}>
                  <h3>Secondary Stakeholders</h3>
                  <button className={styles.addBtn} onClick={() => addStakeholder('secondaryStakeholders')}>
                    <i className="fas fa-plus"></i> Add Secondary
                  </button>
                </div>
                
                <div className={styles.stakeholderList}>
                  {problemData.stakeholders.secondaryStakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className={styles.stakeholderCard}>
                      <div className={styles.stakeholderInputs}>
                        <input
                          type="text"
                          className={styles.stakeholderInput}
                          value={stakeholder.name}
                          onChange={(e) => handleStakeholderItemChange('secondaryStakeholders', stakeholder.id, 'name', e.target.value)}
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          className={styles.stakeholderInput}
                          value={stakeholder.role}
                          onChange={(e) => handleStakeholderItemChange('secondaryStakeholders', stakeholder.id, 'role', e.target.value)}
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          className={styles.stakeholderInput}
                          value={stakeholder.department}
                          onChange={(e) => handleStakeholderItemChange('secondaryStakeholders', stakeholder.id, 'department', e.target.value)}
                          placeholder="Department"
                        />
                        <select
                          className={styles.stakeholderSelect}
                          value={stakeholder.influence}
                          onChange={(e) => handleStakeholderItemChange('secondaryStakeholders', stakeholder.id, 'influence', e.target.value)}
                        >
                          <option value="low">Low Influence</option>
                          <option value="medium">Medium Influence</option>
                          <option value="high">High Influence</option>
                        </select>
                        <select
                          className={styles.stakeholderSelect}
                          value={stakeholder.interest}
                          onChange={(e) => handleStakeholderItemChange('secondaryStakeholders', stakeholder.id, 'interest', e.target.value)}
                        >
                          <option value="low">Low Interest</option>
                          <option value="medium">Medium Interest</option>
                          <option value="high">High Interest</option>
                        </select>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeStakeholder('secondaryStakeholders', stakeholder.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context & Background Section */}
        <div className={styles.analysisCard}>
          <h2>Context & Background</h2>
          <div className={styles.contextSection}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Background Information</label>
              <textarea
                className={styles.textareaInput}
                value={problemData.context.backgroundInformation}
                onChange={(e) => handleContextChange('backgroundInformation', e.target.value)}
                placeholder="Provide relevant background information and context"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Previous Attempts</label>
              <textarea
                className={styles.textareaInput}
                value={problemData.context.previousAttempts}
                onChange={(e) => handleContextChange('previousAttempts', e.target.value)}
                placeholder="Describe any previous attempts to solve this problem"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Constraints</label>
                <textarea
                  className={styles.textareaInput}
                  value={problemData.context.constraints}
                  onChange={(e) => handleContextChange('constraints', e.target.value)}
                  placeholder="List any constraints or limitations"
                  rows={3}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Assumptions</label>
                <textarea
                  className={styles.textareaInput}
                  value={problemData.context.assumptions}
                  onChange={(e) => handleContextChange('assumptions', e.target.value)}
                  placeholder="List key assumptions"
                  rows={3}
                />
              </div>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Dependencies</label>
              <textarea
                className={styles.textareaInput}
                value={problemData.context.dependencies}
                onChange={(e) => handleContextChange('dependencies', e.target.value)}
                placeholder="Identify dependencies on other projects, systems, or resources"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Success Criteria Section */}
        <div className={styles.analysisCard}>
          <h2>Success Criteria</h2>
          <div className={styles.successCriteriaSection}>
            <div className={styles.objectivesSection}>
              <div className={styles.objectiveGroup}>
                <div className={styles.sectionHeader}>
                  <h3>Primary Objectives</h3>
                  <button className={styles.addBtn} onClick={() => addObjective('primaryObjectives')}>
                    <i className="fas fa-plus"></i> Add Primary
                  </button>
                </div>
                
                <div className={styles.objectivesList}>
                  {problemData.successCriteria.primaryObjectives.map((objective) => (
                    <div key={objective.id} className={styles.objectiveCard}>
                      <div className={styles.objectiveInputs}>
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.objective}
                          onChange={(e) => handleObjectiveChange('primaryObjectives', objective.id, 'objective', e.target.value)}
                          placeholder="Objective description"
                        />
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.metric}
                          onChange={(e) => handleObjectiveChange('primaryObjectives', objective.id, 'metric', e.target.value)}
                          placeholder="Success metric"
                        />
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.target}
                          onChange={(e) => handleObjectiveChange('primaryObjectives', objective.id, 'target', e.target.value)}
                          placeholder="Target value"
                        />
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.timeline}
                          onChange={(e) => handleObjectiveChange('primaryObjectives', objective.id, 'timeline', e.target.value)}
                          placeholder="Timeline"
                        />
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeObjective('primaryObjectives', objective.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.objectiveGroup}>
                <div className={styles.sectionHeader}>
                  <h3>Secondary Objectives</h3>
                  <button className={styles.addBtn} onClick={() => addObjective('secondaryObjectives')}>
                    <i className="fas fa-plus"></i> Add Secondary
                  </button>
                </div>
                
                <div className={styles.objectivesList}>
                  {problemData.successCriteria.secondaryObjectives.map((objective) => (
                    <div key={objective.id} className={styles.objectiveCard}>
                      <div className={styles.objectiveInputs}>
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.objective}
                          onChange={(e) => handleObjectiveChange('secondaryObjectives', objective.id, 'objective', e.target.value)}
                          placeholder="Objective description"
                        />
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.metric}
                          onChange={(e) => handleObjectiveChange('secondaryObjectives', objective.id, 'metric', e.target.value)}
                          placeholder="Success metric"
                        />
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.target}
                          onChange={(e) => handleObjectiveChange('secondaryObjectives', objective.id, 'target', e.target.value)}
                          placeholder="Target value"
                        />
                        <input
                          type="text"
                          className={styles.objectiveInput}
                          value={objective.timeline}
                          onChange={(e) => handleObjectiveChange('secondaryObjectives', objective.id, 'timeline', e.target.value)}
                          placeholder="Timeline"
                        />
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeObjective('secondaryObjectives', objective.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.successMetricsSection}>
              <div className={styles.sectionHeader}>
                <h3>Success Metrics</h3>
                <button className={styles.addBtn} onClick={addSuccessMetric}>
                  <i className="fas fa-plus"></i> Add Metric
                </button>
              </div>
              
              <div className={styles.successMetricsTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Baseline</th>
                      <th>Target</th>
                      <th>Measurement Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problemData.successCriteria.successMetrics.map((metric) => (
                      <tr key={metric.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.metric}
                            onChange={(e) => handleSuccessMetricChange(metric.id, 'metric', e.target.value)}
                            placeholder="Success metric"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.baseline}
                            onChange={(e) => handleSuccessMetricChange(metric.id, 'baseline', e.target.value)}
                            placeholder="Baseline"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.target}
                            onChange={(e) => handleSuccessMetricChange(metric.id, 'target', e.target.value)}
                            placeholder="Target"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={metric.measurement}
                            onChange={(e) => handleSuccessMetricChange(metric.id, 'measurement', e.target.value)}
                            placeholder="How to measure"
                          />
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeSuccessMetric(metric.id)}
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
            
            <div className={styles.projectDetails}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Timeline</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={problemData.successCriteria.timeline}
                    onChange={(e) => handleSuccessCriteriaChange('timeline', e.target.value)}
                    placeholder="Project timeline"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Resources Required</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={problemData.successCriteria.resources}
                    onChange={(e) => handleSuccessCriteriaChange('resources', e.target.value)}
                    placeholder="Required resources"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Section */}
        <div className={styles.analysisCard}>
          <h2>Validation & Approval</h2>
          <div className={styles.validationSection}>
            <div className={styles.validationDetails}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Data Source</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={problemData.validation.dataSource}
                    onChange={(e) => handleValidationChange('dataSource', e.target.value)}
                    placeholder="Source of validation data"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Evidence Type</label>
                  <select
                    className={styles.selectInput}
                    value={problemData.validation.evidenceType}
                    onChange={(e) => handleValidationChange('evidenceType', e.target.value)}
                  >
                    <option value="">Select evidence type</option>
                    <option value="quantitative">Quantitative</option>
                    <option value="qualitative">Qualitative</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Validation Method</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={problemData.validation.validationMethod}
                    onChange={(e) => handleValidationChange('validationMethod', e.target.value)}
                    placeholder="How was the problem validated?"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Confidence Level</label>
                  <select
                    className={styles.selectInput}
                    value={problemData.validation.confidence}
                    onChange={(e) => handleValidationChange('confidence', e.target.value)}
                  >
                    <option value="">Select confidence</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.reviewersSection}>
              <div className={styles.sectionHeader}>
                <h3>Reviewers & Approval</h3>
                <button className={styles.addBtn} onClick={addReviewer}>
                  <i className="fas fa-plus"></i> Add Reviewer
                </button>
              </div>
              
              <div className={styles.reviewersTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Reviewer Name</th>
                      <th>Role</th>
                      <th>Review Date</th>
                      <th>Status</th>
                      <th>Comments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problemData.validation.reviewers.map((reviewer) => (
                      <tr key={reviewer.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={reviewer.name}
                            onChange={(e) => handleReviewerChange(reviewer.id, 'name', e.target.value)}
                            placeholder="Reviewer name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={reviewer.role}
                            onChange={(e) => handleReviewerChange(reviewer.id, 'role', e.target.value)}
                            placeholder="Role"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className={styles.tableInput}
                            value={reviewer.reviewDate}
                            onChange={(e) => handleReviewerChange(reviewer.id, 'reviewDate', e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            className={styles.tableSelect}
                            value={reviewer.status}
                            onChange={(e) => handleReviewerChange(reviewer.id, 'status', e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="needs-revision">Needs Revision</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={reviewer.comments}
                            onChange={(e) => handleReviewerChange(reviewer.id, 'comments', e.target.value)}
                            placeholder="Comments"
                          />
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeReviewer(reviewer.id)}
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
            
            <div className={styles.approvalStatus}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Approval Status</label>
                <select
                  className={styles.selectInput}
                  value={problemData.validation.approvalStatus}
                  onChange={(e) => handleValidationChange('approvalStatus', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;

