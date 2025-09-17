import React, { useState, useCallback, useEffect } from 'react';
import styles from './A3.module.css';

const A3 = () => {
  // A3 data structure
  const [a3Data, setA3Data] = useState({
    // Project Information
    projectTitle: '',
    problemOwner: '',
    teamMembers: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    targetCompletionDate: '',
    
    // Step 1: Background/Problem Statement
    background: '',
    problemStatement: '',
    businessImpact: '',
    
    // Step 2: Current State Analysis
    currentStateDescription: '',
    currentStateMetrics: [{ id: 1, metric: '', current: '', target: '', unit: '' }],
    
    // Step 3: Goal/Target State
    goalStatement: '',
    targetStateDescription: '',
    successCriteria: [{ id: 1, criteria: '', measurement: '' }],
    
    // Step 4: Root Cause Analysis
    rootCauseMethod: 'Five Whys',
    rootCauseAnalysis: [{ id: 1, cause: '', category: 'People', priority: 'High' }],
    
    // Step 5: Countermeasures
    countermeasures: [{ id: 1, action: '', owner: '', dueDate: '', status: 'Not Started' }],
    
    // Step 6: Implementation Plan
    implementationSteps: [{ id: 1, step: '', owner: '', startDate: '', endDate: '', dependencies: '' }],
    
    // Step 7: Follow-up Actions
    followUpActions: [{ id: 1, action: '', frequency: 'Weekly', owner: '', nextReview: '' }],
    
    // Step 8: Results/Lessons Learned
    results: '',
    lessonsLearned: '',
    nextSteps: '',
    approvalStatus: 'Draft'
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching RCA structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to A3 Problem Solving! I'll guide you through the 8-step structured approach to identify, analyze, and solve problems systematically. Let's start by clearly defining your problem and its impact.",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'background': "The background section should provide context about why this problem is important to solve now. Include relevant history, previous attempts, and why this problem was selected for A3 analysis.",
      'problem statement': "A good problem statement is specific, measurable, and describes the gap between current and desired state. Avoid solutions in the problem statement - focus on what is happening, not why or how to fix it.",
      'current state': "Document the current state with facts and data. Use metrics, observations, and measurements. Avoid opinions or assumptions. This creates a baseline for measuring improvement.",
      'target state': "Define what success looks like with specific, measurable outcomes. Your target state should be achievable and directly address the problem statement.",
      'root cause': "Use structured methods like Five Whys, Fishbone Diagram, or Fault Tree Analysis. Dig deep to find the true root cause, not just symptoms. Ask 'why' multiple times to get to the underlying issue.",
      'countermeasures': "Countermeasures should directly address the root causes identified. Each countermeasure should have a clear owner, timeline, and success criteria. Focus on prevention, not just correction.",
      'implementation': "Create a detailed plan with specific steps, timelines, and responsibilities. Consider dependencies, resources needed, and potential obstacles. Build in checkpoints to monitor progress.",
      'follow-up': "Establish regular review cycles to ensure countermeasures are working and problems don't recur. Define what will be monitored, how often, and by whom.",
      'default': "I can help you with any aspect of A3 problem solving. Ask about problem definition, root cause analysis, countermeasures, implementation planning, or any of the 8 A3 steps."
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  // Handle sending chat messages - matching RCA structure
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

      // Project info (6 fields)
      totalFields += 6;
      if (a3Data.projectTitle) completedFields++;
      if (a3Data.problemOwner) completedFields++;
      if (a3Data.teamMembers) completedFields++;
      if (a3Data.targetCompletionDate) completedFields++;
      if (a3Data.background) completedFields++;
      if (a3Data.problemStatement) completedFields++;

      // Step sections (6 main sections)
      const stepSections = [
        'currentStateDescription', 'goalStatement', 'targetStateDescription', 
        'results', 'lessonsLearned', 'nextSteps'
      ];
      totalFields += stepSections.length;
      stepSections.forEach(section => {
        if (a3Data[section] && a3Data[section].trim() !== '') completedFields++;
      });

      // Array sections - count essential fields
      const arraySections = ['currentStateMetrics', 'successCriteria', 'rootCauseAnalysis', 'countermeasures', 'implementationSteps', 'followUpActions'];
      arraySections.forEach(section => {
        a3Data[section].forEach(item => {
          totalFields += 2; // Count 2 essential fields per item
          const keys = Object.keys(item).filter(key => key !== 'id');
          let filledCount = 0;
          keys.forEach(key => {
            if (item[key] && item[key].toString().trim() !== '') filledCount++;
          });
          completedFields += Math.min(filledCount, 2); // Cap at 2 per item
        });
      });

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [a3Data]);

  // Handle project info changes
  const handleProjectInfoChange = useCallback((field, value) => {
    setA3Data(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, []);

  // Handle array item changes
  const handleArrayItemChange = useCallback((section, id, field, value) => {
    setA3Data(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, []);

  // Add new array item
  const addArrayItem = useCallback((section) => {
    setA3Data(prev => {
      const newId = Math.max(...prev[section].map(item => item.id)) + 1;
      let newItem = { id: newId };
      
      // Add section-specific fields
      switch (section) {
        case 'currentStateMetrics':
          newItem = { ...newItem, metric: '', current: '', target: '', unit: '' };
          break;
        case 'successCriteria':
          newItem = { ...newItem, criteria: '', measurement: '' };
          break;
        case 'rootCauseAnalysis':
          newItem = { ...newItem, cause: '', category: 'People', priority: 'High' };
          break;
        case 'countermeasures':
          newItem = { ...newItem, action: '', owner: '', dueDate: '', status: 'Not Started' };
          break;
        case 'implementationSteps':
          newItem = { ...newItem, step: '', owner: '', startDate: '', endDate: '', dependencies: '' };
          break;
        case 'followUpActions':
          newItem = { ...newItem, action: '', frequency: 'Weekly', owner: '', nextReview: '' };
          break;
        default:
          break;
      }

      return {
        ...prev,
        [section]: [...prev[section], newItem],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    });
  }, []);

  // Remove array item
  const removeArrayItem = useCallback((section, id) => {
    setA3Data(prev => {
      if (prev[section].length > 1) {
        return {
          ...prev,
          [section]: prev[section].filter(item => item.id !== id),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return prev;
    });
  }, []);

  // Save draft
  const handleSave = () => {
    console.log('Saving A3 draft:', a3Data);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting A3 to PDF:', a3Data);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to RCA */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>A3 Problem Solving</h1>
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
        {/* Top Section: A3 Information + AI Helper - Exact match to RCA */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>A3 Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={a3Data.projectTitle}
                onChange={(e) => handleProjectInfoChange('projectTitle', e.target.value)}
                placeholder="Enter the project title for A3 analysis"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Problem Owner <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={a3Data.problemOwner}
                  onChange={(e) => handleProjectInfoChange('problemOwner', e.target.value)}
                  placeholder="Who owns this problem?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Team Members <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={a3Data.teamMembers}
                  onChange={(e) => handleProjectInfoChange('teamMembers', e.target.value)}
                  placeholder="List team members involved in this A3"
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={a3Data.dateCreated}
                  onChange={(e) => handleProjectInfoChange('dateCreated', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Target Completion
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={a3Data.targetCompletionDate}
                  onChange={(e) => handleProjectInfoChange('targetCompletionDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  A3 AI Guide
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
                  placeholder="Ask me about A3 problem solving..."
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
                    onClick={() => handleQuickAction('How do I write an effective problem statement?')}
                  >
                    Problem Statement
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What methods can I use for root cause analysis?')}
                  >
                    Root Cause Methods
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I develop effective countermeasures?')}
                  >
                    Countermeasures
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I create a good implementation plan?')}
                  >
                    Implementation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDCA Cycle Section */}
        <div className={styles.analysisCard}>
          <h2>Plan-Do-Check-Act (PDCA) Cycle</h2>
          <div className={styles.pdcaCycle}>
            <div className={`${styles.pdcaQuadrant} ${styles.pdcaPlan}`}>
              <div className={styles.pdcaHeader}>
                <div className={styles.pdcaLetter}>P</div>
                <h3>PLAN</h3>
              </div>
              <div className={styles.pdcaContent}>
                <p>Steps 1-4: Define problem, analyze current state, set goals, identify root causes</p>
                <div className={styles.pdcaSteps}>
                  <span>1. Background & Problem</span>
                  <span>2. Current State</span>
                  <span>3. Target State</span>
                  <span>4. Root Cause Analysis</span>
                </div>
              </div>
            </div>
            
            <div className={`${styles.pdcaQuadrant} ${styles.pdcaDo}`}>
              <div className={styles.pdcaHeader}>
                <div className={styles.pdcaLetter}>D</div>
                <h3>DO</h3>
              </div>
              <div className={styles.pdcaContent}>
                <p>Steps 5-6: Develop and implement countermeasures</p>
                <div className={styles.pdcaSteps}>
                  <span>5. Countermeasures</span>
                  <span>6. Implementation Plan</span>
                </div>
              </div>
            </div>
            
            <div className={`${styles.pdcaQuadrant} ${styles.pdcaCheck}`}>
              <div className={styles.pdcaHeader}>
                <div className={styles.pdcaLetter}>C</div>
                <h3>CHECK</h3>
              </div>
              <div className={styles.pdcaContent}>
                <p>Step 7: Monitor and evaluate results</p>
                <div className={styles.pdcaSteps}>
                  <span>7. Follow-up Actions</span>
                </div>
              </div>
            </div>
            
            <div className={`${styles.pdcaQuadrant} ${styles.pdcaAct}`}>
              <div className={styles.pdcaHeader}>
                <div className={styles.pdcaLetter}>A</div>
                <h3>ACT</h3>
              </div>
              <div className={styles.pdcaContent}>
                <p>Step 8: Standardize and learn from results</p>
                <div className={styles.pdcaSteps}>
                  <span>8. Results & Lessons</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* A3 Steps Section - Full Width */}
        <div className={styles.analysisCard}>
          <h2>A3 Problem Solving Steps</h2>
          
          {/* Top Steps (1-4) */}
          <div className={styles.topSteps}>
            {/* Step 1: Background & Problem Statement */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>1</div>
                <h3>Background & Problem Statement</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.toolFieldRow}>
                  <div className={styles.toolFieldGroup}>
                    <label className={styles.toolFieldLabel}>
                      Background <span className={styles.toolFieldRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.toolTextarea}
                      value={a3Data.background}
                      onChange={(e) => handleProjectInfoChange('background', e.target.value)}
                      placeholder="Provide context and background for this problem"
                      rows={3}
                    />
                  </div>
                  <div className={styles.toolFieldGroup}>
                    <label className={styles.toolFieldLabel}>
                      Problem Statement <span className={styles.toolFieldRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.toolTextarea}
                      value={a3Data.problemStatement}
                      onChange={(e) => handleProjectInfoChange('problemStatement', e.target.value)}
                      placeholder="Clearly define the problem without solutions"
                      rows={3}
                    />
                  </div>
                </div>
                <div className={styles.toolFieldGroup}>
                  <label className={styles.toolFieldLabel}>
                    Business Impact
                  </label>
                  <textarea
                    className={styles.toolTextarea}
                    value={a3Data.businessImpact}
                    onChange={(e) => handleProjectInfoChange('businessImpact', e.target.value)}
                    placeholder="Describe the business impact of this problem"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Current State Analysis */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>2</div>
                <h3>Current State Analysis</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.toolFieldGroup}>
                  <label className={styles.toolFieldLabel}>
                    Current State Description <span className={styles.toolFieldRequired}>*</span>
                  </label>
                  <textarea
                    className={styles.toolTextarea}
                    value={a3Data.currentStateDescription}
                    onChange={(e) => handleProjectInfoChange('currentStateDescription', e.target.value)}
                    placeholder="Describe the current state with facts and data"
                    rows={3}
                  />
                </div>
                
                <div className={styles.a3Subsection}>
                  <h4>Current State Metrics</h4>
                  <div className={`${styles.a3Table} ${styles.metricsTable}`}>
                    <div className={styles.a3TableHeader}>
                      <div>Metric</div>
                      <div>Current Value</div>
                      <div>Target Value</div>
                      <div>Unit</div>
                      <div>Actions</div>
                    </div>
                    {a3Data.currentStateMetrics.map((metric) => (
                      <div key={metric.id} className={styles.a3TableRow}>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={metric.metric}
                          onChange={(e) => handleArrayItemChange('currentStateMetrics', metric.id, 'metric', e.target.value)}
                          placeholder="Metric name"
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={metric.current}
                          onChange={(e) => handleArrayItemChange('currentStateMetrics', metric.id, 'current', e.target.value)}
                          placeholder="Current"
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={metric.target}
                          onChange={(e) => handleArrayItemChange('currentStateMetrics', metric.id, 'target', e.target.value)}
                          placeholder="Target"
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={metric.unit}
                          onChange={(e) => handleArrayItemChange('currentStateMetrics', metric.id, 'unit', e.target.value)}
                          placeholder="Unit"
                        />
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('currentStateMetrics', metric.id)}
                          disabled={a3Data.currentStateMetrics.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('currentStateMetrics')}
                  >
                    <i className="fas fa-plus"></i> Add Metric
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Goal/Target State */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>3</div>
                <h3>Goal & Target State</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.toolFieldRow}>
                  <div className={styles.toolFieldGroup}>
                    <label className={styles.toolFieldLabel}>
                      Goal Statement <span className={styles.toolFieldRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.toolTextarea}
                      value={a3Data.goalStatement}
                      onChange={(e) => handleProjectInfoChange('goalStatement', e.target.value)}
                      placeholder="Define the goal for solving this problem"
                      rows={3}
                    />
                  </div>
                  <div className={styles.toolFieldGroup}>
                    <label className={styles.toolFieldLabel}>
                      Target State Description <span className={styles.toolFieldRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.toolTextarea}
                      value={a3Data.targetStateDescription}
                      onChange={(e) => handleProjectInfoChange('targetStateDescription', e.target.value)}
                      placeholder="Describe what success looks like"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className={styles.a3Subsection}>
                  <h4>Success Criteria</h4>
                  <div className={`${styles.a3Table} ${styles.criteriaTable}`}>
                    <div className={styles.a3TableHeader}>
                      <div>Success Criteria</div>
                      <div>Measurement Method</div>
                      <div>Actions</div>
                    </div>
                    {a3Data.successCriteria.map((criteria) => (
                      <div key={criteria.id} className={styles.a3TableRow}>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={criteria.criteria}
                          onChange={(e) => handleArrayItemChange('successCriteria', criteria.id, 'criteria', e.target.value)}
                          placeholder="Success criteria"
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={criteria.measurement}
                          onChange={(e) => handleArrayItemChange('successCriteria', criteria.id, 'measurement', e.target.value)}
                          placeholder="How will this be measured?"
                        />
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('successCriteria', criteria.id)}
                          disabled={a3Data.successCriteria.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('successCriteria')}
                  >
                    <i className="fas fa-plus"></i> Add Criteria
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Root Cause Analysis */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>4</div>
                <h3>Root Cause Analysis</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.toolFieldGroup}>
                  <label className={styles.toolFieldLabel}>
                    Analysis Method
                  </label>
                  <select
                    className={styles.toolInput}
                    value={a3Data.rootCauseMethod}
                    onChange={(e) => handleProjectInfoChange('rootCauseMethod', e.target.value)}
                  >
                    <option value="Five Whys">Five Whys</option>
                    <option value="Fishbone Diagram">Fishbone Diagram</option>
                    <option value="Fault Tree Analysis">Fault Tree Analysis</option>
                    <option value="Pareto Analysis">Pareto Analysis</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className={styles.a3Subsection}>
                  <h4>Root Causes</h4>
                  <div className={`${styles.a3Table} ${styles.causesTable}`}>
                    <div className={styles.a3TableHeader}>
                      <div>Root Cause</div>
                      <div>Category</div>
                      <div>Priority</div>
                      <div>Actions</div>
                    </div>
                    {a3Data.rootCauseAnalysis.map((cause) => (
                      <div key={cause.id} className={styles.a3TableRow}>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={cause.cause}
                          onChange={(e) => handleArrayItemChange('rootCauseAnalysis', cause.id, 'cause', e.target.value)}
                          placeholder="Describe the root cause"
                        />
                        <select
                          className={styles.a3TableSelect}
                          value={cause.category}
                          onChange={(e) => handleArrayItemChange('rootCauseAnalysis', cause.id, 'category', e.target.value)}
                        >
                          <option value="People">People</option>
                          <option value="Process">Process</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Material">Material</option>
                          <option value="Environment">Environment</option>
                          <option value="Method">Method</option>
                        </select>
                        <select
                          className={styles.a3TableSelect}
                          value={cause.priority}
                          onChange={(e) => handleArrayItemChange('rootCauseAnalysis', cause.id, 'priority', e.target.value)}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('rootCauseAnalysis', cause.id)}
                          disabled={a3Data.rootCauseAnalysis.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('rootCauseAnalysis')}
                  >
                    <i className="fas fa-plus"></i> Add Root Cause
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Steps (5-8) with Enhanced UI */}
          <div className={styles.bottomSteps}>
            {/* Step 5: Countermeasures */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>5</div>
                <h3>Countermeasures</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.a3Subsection}>
                  <div className={`${styles.a3Table} ${styles.countermeasuresTable}`}>
                    <div className={styles.a3TableHeader}>
                      <div>Countermeasure Action</div>
                      <div>Owner</div>
                      <div>Due Date</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    {a3Data.countermeasures.map((countermeasure) => (
                      <div key={countermeasure.id} className={styles.a3TableRow}>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={countermeasure.action}
                          onChange={(e) => handleArrayItemChange('countermeasures', countermeasure.id, 'action', e.target.value)}
                          placeholder="Describe the countermeasure"
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={countermeasure.owner}
                          onChange={(e) => handleArrayItemChange('countermeasures', countermeasure.id, 'owner', e.target.value)}
                          placeholder="Owner"
                        />
                        <input
                          type="date"
                          className={styles.a3TableInput}
                          value={countermeasure.dueDate}
                          onChange={(e) => handleArrayItemChange('countermeasures', countermeasure.id, 'dueDate', e.target.value)}
                        />
                        <select
                          className={styles.a3TableSelect}
                          value={countermeasure.status}
                          onChange={(e) => handleArrayItemChange('countermeasures', countermeasure.id, 'status', e.target.value)}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('countermeasures', countermeasure.id)}
                          disabled={a3Data.countermeasures.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('countermeasures')}
                  >
                    <i className="fas fa-plus"></i> Add Countermeasure
                  </button>
                </div>
              </div>
            </div>

            {/* Step 6: Implementation Plan */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>6</div>
                <h3>Implementation Plan</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.a3Subsection}>
                  <div className={`${styles.a3Table} ${styles.implementationTable}`}>
                    <div className={styles.a3TableHeader}>
                      <div>Implementation Step</div>
                      <div>Owner</div>
                      <div>Start Date</div>
                      <div>End Date</div>
                      <div>Dependencies</div>
                      <div>Actions</div>
                    </div>
                    {a3Data.implementationSteps.map((step) => (
                      <div key={step.id} className={styles.a3TableRow}>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={step.step}
                          onChange={(e) => handleArrayItemChange('implementationSteps', step.id, 'step', e.target.value)}
                          placeholder="Implementation step"
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={step.owner}
                          onChange={(e) => handleArrayItemChange('implementationSteps', step.id, 'owner', e.target.value)}
                          placeholder="Owner"
                        />
                        <input
                          type="date"
                          className={styles.a3TableInput}
                          value={step.startDate}
                          onChange={(e) => handleArrayItemChange('implementationSteps', step.id, 'startDate', e.target.value)}
                        />
                        <input
                          type="date"
                          className={styles.a3TableInput}
                          value={step.endDate}
                          onChange={(e) => handleArrayItemChange('implementationSteps', step.id, 'endDate', e.target.value)}
                        />
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={step.dependencies}
                          onChange={(e) => handleArrayItemChange('implementationSteps', step.id, 'dependencies', e.target.value)}
                          placeholder="Dependencies"
                        />
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('implementationSteps', step.id)}
                          disabled={a3Data.implementationSteps.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('implementationSteps')}
                  >
                    <i className="fas fa-plus"></i> Add Step
                  </button>
                </div>
              </div>
            </div>

            {/* Step 7: Follow-up Actions */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>7</div>
                <h3>Follow-up Actions</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.a3Subsection}>
                  <div className={`${styles.a3Table} ${styles.followupTable}`}>
                    <div className={styles.a3TableHeader}>
                      <div>Follow-up Action</div>
                      <div>Frequency</div>
                      <div>Owner</div>
                      <div>Next Review</div>
                      <div>Actions</div>
                    </div>
                    {a3Data.followUpActions.map((action) => (
                      <div key={action.id} className={styles.a3TableRow}>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={action.action}
                          onChange={(e) => handleArrayItemChange('followUpActions', action.id, 'action', e.target.value)}
                          placeholder="Follow-up action"
                        />
                        <select
                          className={styles.a3TableSelect}
                          value={action.frequency}
                          onChange={(e) => handleArrayItemChange('followUpActions', action.id, 'frequency', e.target.value)}
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="As Needed">As Needed</option>
                        </select>
                        <input
                          type="text"
                          className={styles.a3TableInput}
                          value={action.owner}
                          onChange={(e) => handleArrayItemChange('followUpActions', action.id, 'owner', e.target.value)}
                          placeholder="Owner"
                        />
                        <input
                          type="date"
                          className={styles.a3TableInput}
                          value={action.nextReview}
                          onChange={(e) => handleArrayItemChange('followUpActions', action.id, 'nextReview', e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('followUpActions', action.id)}
                          disabled={a3Data.followUpActions.length <= 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('followUpActions')}
                  >
                    <i className="fas fa-plus"></i> Add Follow-up Action
                  </button>
                </div>
              </div>
            </div>

            {/* Step 8: Results & Lessons Learned */}
            <div className={styles.a3Step}>
              <div className={styles.a3StepHeader}>
                <div className={styles.a3StepNumber}>8</div>
                <h3>Results & Lessons Learned</h3>
              </div>
              <div className={styles.a3StepContent}>
                <div className={styles.toolFieldGroup}>
                  <label className={styles.toolFieldLabel}>
                    Results <span className={styles.toolFieldRequired}>*</span>
                  </label>
                  <textarea
                    className={styles.toolTextarea}
                    value={a3Data.results}
                    onChange={(e) => handleProjectInfoChange('results', e.target.value)}
                    placeholder="Document the results achieved"
                    rows={3}
                  />
                </div>
                
                <div className={styles.toolFieldRow}>
                  <div className={styles.toolFieldGroup}>
                    <label className={styles.toolFieldLabel}>
                      Lessons Learned <span className={styles.toolFieldRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.toolTextarea}
                      value={a3Data.lessonsLearned}
                      onChange={(e) => handleProjectInfoChange('lessonsLearned', e.target.value)}
                      placeholder="What did you learn from this process?"
                      rows={3}
                    />
                  </div>
                  <div className={styles.toolFieldGroup}>
                    <label className={styles.toolFieldLabel}>
                      Next Steps <span className={styles.toolFieldRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.toolTextarea}
                      value={a3Data.nextSteps}
                      onChange={(e) => handleProjectInfoChange('nextSteps', e.target.value)}
                      placeholder="What are the next steps?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A3;

