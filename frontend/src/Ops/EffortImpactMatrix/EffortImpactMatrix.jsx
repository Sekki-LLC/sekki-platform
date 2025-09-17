import React, { useState, useEffect } from 'react';
import styles from './EffortImpactMatrix.module.css';

const EffortImpactMatrix = () => {
  // Effort Impact Matrix structure
  const [matrixData, setMatrixData] = useState({
    // Matrix Information
    matrixTitle: '',
    facilitator: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Matrix Setup
    matrixSetup: {
      purpose: '',
      scope: '',
      timeframe: '',
      criteria: {
        effort: {
          low: 'Low effort (< 1 week)',
          medium: 'Medium effort (1-4 weeks)',
          high: 'High effort (> 4 weeks)'
        },
        impact: {
          low: 'Low impact (minimal improvement)',
          medium: 'Medium impact (moderate improvement)',
          high: 'High impact (significant improvement)'
        }
      }
    },
    
    // Items to evaluate
    items: [],
    
    // Matrix quadrants
    quadrants: {
      quickWins: [], // High Impact, Low Effort
      majorProjects: [], // High Impact, High Effort
      fillIns: [], // Low Impact, Low Effort
      thanklessJobs: [] // Low Impact, High Effort
    },
    
    // Prioritization results
    prioritization: {
      recommended: [],
      deferred: [],
      rejected: [],
      rationale: ''
    },
    
    // Action planning
    actionPlan: {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      resources: '',
      timeline: '',
      owner: ''
    },
    
    // Documentation
    documentation: {
      assumptions: '',
      constraints: '',
      risks: '',
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
      content: "Welcome to the Effort Impact Matrix! I'll help you prioritize initiatives by evaluating their effort requirements versus expected impact. This tool helps identify 'Quick Wins' (high impact, low effort) and avoid 'Thankless Jobs' (low impact, high effort). What initiatives are you looking to prioritize?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'effort impact': "The Effort Impact Matrix helps prioritize by plotting initiatives on effort (x-axis) vs impact (y-axis). Focus on Quick Wins first, plan Major Projects carefully, minimize Fill-ins, and avoid Thankless Jobs.",
      'quick wins': "Quick Wins are high impact, low effort initiatives - your best ROI. These should be your immediate priority. Look for process improvements, automation opportunities, or simple fixes with big benefits.",
      'major projects': "Major Projects are high impact but high effort. These require careful planning, resource allocation, and stakeholder buy-in. Plan these for when you have adequate resources and time.",
      'prioritization': "Effective prioritization considers: strategic alignment, resource availability, risk tolerance, dependencies, and timing. Use objective criteria and involve stakeholders in the evaluation process.",
      'criteria': "Define clear criteria for effort (time, resources, complexity) and impact (revenue, cost savings, customer satisfaction, strategic value). Use consistent scales like 1-3 or 1-5 for evaluation.",
      'evaluation': "Evaluate each initiative objectively using your defined criteria. Consider both direct and indirect impacts, hidden efforts, and long-term implications. Involve subject matter experts for accuracy.",
      'matrix': "The 2x2 matrix creates four quadrants: Quick Wins (do first), Major Projects (plan carefully), Fill-ins (do if time permits), Thankless Jobs (avoid or redesign). Plot items based on effort vs impact scores.",
      'stakeholders': "Involve key stakeholders in evaluation to ensure accuracy and buy-in. Different perspectives help identify hidden efforts or impacts. Document assumptions and get consensus on criteria.",
      'default': "I can help with matrix setup, evaluation criteria, item prioritization, quadrant analysis, action planning, or stakeholder engagement. What specific aspect needs guidance?"
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
      if (matrixData.matrixTitle) completedFields++;
      if (matrixData.facilitator) completedFields++;
      if (matrixData.matrixSetup.purpose) completedFields++;

      // Setup (2 fields)
      totalFields += 2;
      if (matrixData.matrixSetup.scope) completedFields++;
      if (matrixData.matrixSetup.timeframe) completedFields++;

      // Items (1 field)
      totalFields += 1;
      if (matrixData.items.length > 0) completedFields++;

      // Prioritization (1 field)
      totalFields += 1;
      if (matrixData.prioritization.rationale) completedFields++;

      // Action plan (1 field)
      totalFields += 1;
      if (matrixData.actionPlan.timeline) completedFields++;

      // Documentation (1 field)
      totalFields += 1;
      if (matrixData.documentation.assumptions) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [matrixData]);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setMatrixData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle setup changes
  const handleSetupChange = (field, value) => {
    setMatrixData(prev => ({
      ...prev,
      matrixSetup: {
        ...prev.matrixSetup,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle criteria changes
  const handleCriteriaChange = (type, level, value) => {
    setMatrixData(prev => ({
      ...prev,
      matrixSetup: {
        ...prev.matrixSetup,
        criteria: {
          ...prev.matrixSetup.criteria,
          [type]: {
            ...prev.matrixSetup.criteria[type],
            [level]: value
          }
        }
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add item
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      description: '',
      category: 'process-improvement', // 'process-improvement', 'technology', 'training', 'policy', 'other'
      effortScore: 2, // 1-3 scale
      impactScore: 2, // 1-3 scale
      effortJustification: '',
      impactJustification: '',
      quadrant: '', // Will be calculated
      priority: '', // Will be calculated
      estimatedDuration: '',
      estimatedCost: '',
      expectedBenefit: '',
      stakeholders: '',
      dependencies: '',
      risks: '',
      status: 'evaluated' // 'evaluated', 'approved', 'in-progress', 'completed', 'deferred', 'rejected'
    };
    
    setMatrixData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove item
  const removeItem = (itemId) => {
    setMatrixData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle item changes
  const handleItemChange = (itemId, field, value) => {
    setMatrixData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Calculate quadrant and priority when effort or impact scores change
          if (field === 'effortScore' || field === 'impactScore') {
            const effort = field === 'effortScore' ? value : item.effortScore;
            const impact = field === 'impactScore' ? value : item.impactScore;
            
            // Determine quadrant
            let quadrant = '';
            let priority = '';
            
            if (impact >= 3 && effort <= 2) {
              quadrant = 'Quick Wins';
              priority = 'High';
            } else if (impact >= 3 && effort >= 3) {
              quadrant = 'Major Projects';
              priority = 'Medium';
            } else if (impact <= 2 && effort <= 2) {
              quadrant = 'Fill-ins';
              priority = 'Low';
            } else {
              quadrant = 'Thankless Jobs';
              priority = 'Very Low';
            }
            
            updatedItem.quadrant = quadrant;
            updatedItem.priority = priority;
          }
          
          return updatedItem;
        }
        return item;
      }),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Update quadrants based on items
  useEffect(() => {
    const updateQuadrants = () => {
      const quickWins = matrixData.items.filter(item => item.quadrant === 'Quick Wins');
      const majorProjects = matrixData.items.filter(item => item.quadrant === 'Major Projects');
      const fillIns = matrixData.items.filter(item => item.quadrant === 'Fill-ins');
      const thanklessJobs = matrixData.items.filter(item => item.quadrant === 'Thankless Jobs');
      
      setMatrixData(prev => ({
        ...prev,
        quadrants: {
          quickWins,
          majorProjects,
          fillIns,
          thanklessJobs
        }
      }));
    };
    
    updateQuadrants();
  }, [matrixData.items]);

  // Handle prioritization changes
  const handlePrioritizationChange = (field, value) => {
    setMatrixData(prev => ({
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
    setMatrixData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle documentation changes
  const handleDocumentationChange = (field, value) => {
    setMatrixData(prev => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add action item
  const addActionItem = (timeframe) => {
    const newAction = {
      id: Date.now(),
      item: '',
      owner: '',
      dueDate: '',
      status: 'planned' // 'planned', 'in-progress', 'completed'
    };
    
    setMatrixData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        [timeframe]: [...prev.actionPlan[timeframe], newAction]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove action item
  const removeActionItem = (timeframe, actionId) => {
    setMatrixData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        [timeframe]: prev.actionPlan[timeframe].filter(action => action.id !== actionId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle action item changes
  const handleActionItemChange = (timeframe, actionId, field, value) => {
    setMatrixData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        [timeframe]: prev.actionPlan[timeframe].map(action =>
          action.id === actionId ? { ...action, [field]: value } : action
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Save draft
  const handleSave = () => {
    console.log('Saving Effort Impact Matrix draft:', matrixData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting Effort Impact Matrix to PDF:', matrixData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to other tools */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Effort Impact Matrix</h1>
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
        {/* Top Section: Matrix Information + AI Helper - Exact match to other tools */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Matrix Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Matrix Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={matrixData.matrixTitle}
                onChange={(e) => handleBasicInfoChange('matrixTitle', e.target.value)}
                placeholder="Enter the title for your effort impact matrix"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Facilitator <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={matrixData.facilitator}
                  onChange={(e) => handleBasicInfoChange('facilitator', e.target.value)}
                  placeholder="Who is facilitating this analysis?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={matrixData.dateCreated}
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
                value={matrixData.matrixSetup.purpose}
                onChange={(e) => handleSetupChange('purpose', e.target.value)}
                placeholder="What is the purpose of this prioritization exercise?"
                rows={2}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Scope</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={matrixData.matrixSetup.scope}
                  onChange={(e) => handleSetupChange('scope', e.target.value)}
                  placeholder="What is included in this analysis?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Timeframe</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={matrixData.matrixSetup.timeframe}
                  onChange={(e) => handleSetupChange('timeframe', e.target.value)}
                  placeholder="What timeframe are we considering?"
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  Prioritization AI Guide
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
                  placeholder="Ask me about prioritization..."
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
                    onClick={() => handleQuickAction('What are quick wins?')}
                  >
                    Quick Wins
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I set evaluation criteria?')}
                  >
                    Evaluation Criteria
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How does the matrix work?')}
                  >
                    Matrix Guide
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I prioritize?')}
                  >
                    Prioritization
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I involve stakeholders?')}
                  >
                    Stakeholder Engagement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Criteria Section */}
        <div className={styles.analysisCard}>
          <h2>Evaluation Criteria</h2>
          <div className={styles.criteriaGrid}>
            <div className={styles.criteriaSection}>
              <h3>Effort Criteria</h3>
              <div className={styles.criteriaLevels}>
                <div className={styles.criteriaLevel}>
                  <label className={styles.criteriaLabel}>Low Effort (Score: 1)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={matrixData.matrixSetup.criteria.effort.low}
                    onChange={(e) => handleCriteriaChange('effort', 'low', e.target.value)}
                    placeholder="Define low effort criteria"
                  />
                </div>
                <div className={styles.criteriaLevel}>
                  <label className={styles.criteriaLabel}>Medium Effort (Score: 2)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={matrixData.matrixSetup.criteria.effort.medium}
                    onChange={(e) => handleCriteriaChange('effort', 'medium', e.target.value)}
                    placeholder="Define medium effort criteria"
                  />
                </div>
                <div className={styles.criteriaLevel}>
                  <label className={styles.criteriaLabel}>High Effort (Score: 3)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={matrixData.matrixSetup.criteria.effort.high}
                    onChange={(e) => handleCriteriaChange('effort', 'high', e.target.value)}
                    placeholder="Define high effort criteria"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.criteriaSection}>
              <h3>Impact Criteria</h3>
              <div className={styles.criteriaLevels}>
                <div className={styles.criteriaLevel}>
                  <label className={styles.criteriaLabel}>Low Impact (Score: 1)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={matrixData.matrixSetup.criteria.impact.low}
                    onChange={(e) => handleCriteriaChange('impact', 'low', e.target.value)}
                    placeholder="Define low impact criteria"
                  />
                </div>
                <div className={styles.criteriaLevel}>
                  <label className={styles.criteriaLabel}>Medium Impact (Score: 2)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={matrixData.matrixSetup.criteria.impact.medium}
                    onChange={(e) => handleCriteriaChange('impact', 'medium', e.target.value)}
                    placeholder="Define medium impact criteria"
                  />
                </div>
                <div className={styles.criteriaLevel}>
                  <label className={styles.criteriaLabel}>High Impact (Score: 3)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={matrixData.matrixSetup.criteria.impact.high}
                    onChange={(e) => handleCriteriaChange('impact', 'high', e.target.value)}
                    placeholder="Define high impact criteria"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Evaluation Section */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Items Evaluation</h2>
            <button className={styles.addBtn} onClick={addItem}>
              <i className="fas fa-plus"></i> Add Item
            </button>
          </div>
          
          <div className={styles.itemsTable}>
            <table className={styles.evaluationTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Effort Score</th>
                  <th>Impact Score</th>
                  <th>Quadrant</th>
                  <th>Priority</th>
                  <th>Duration</th>
                  <th>Expected Benefit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={item.title}
                        onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                        placeholder="Item title"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={item.category}
                        onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                      >
                        <option value="process-improvement">Process Improvement</option>
                        <option value="technology">Technology</option>
                        <option value="training">Training</option>
                        <option value="policy">Policy</option>
                        <option value="other">Other</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.effortSelect}
                        value={item.effortScore}
                        onChange={(e) => handleItemChange(item.id, 'effortScore', parseInt(e.target.value))}
                      >
                        <option value={1}>1 - Low</option>
                        <option value={2}>2 - Medium</option>
                        <option value={3}>3 - High</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.impactSelect}
                        value={item.impactScore}
                        onChange={(e) => handleItemChange(item.id, 'impactScore', parseInt(e.target.value))}
                      >
                        <option value={1}>1 - Low</option>
                        <option value={2}>2 - Medium</option>
                        <option value={3}>3 - High</option>
                      </select>
                    </td>
                    <td>
                      <span className={`${styles.quadrantBadge} ${styles[item.quadrant?.toLowerCase()?.replace(/\s+/g, '')]}`}>
                        {item.quadrant}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.priorityBadge} ${styles[item.priority?.toLowerCase()?.replace(/\s+/g, '')]}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={item.estimatedDuration}
                        onChange={(e) => handleItemChange(item.id, 'estimatedDuration', e.target.value)}
                        placeholder="Duration"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={item.expectedBenefit}
                        onChange={(e) => handleItemChange(item.id, 'expectedBenefit', e.target.value)}
                        placeholder="Expected benefit"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={item.status}
                        onChange={(e) => handleItemChange(item.id, 'status', e.target.value)}
                      >
                        <option value="evaluated">Evaluated</option>
                        <option value="approved">Approved</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="deferred">Deferred</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
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

        {/* Matrix Visualization Section */}
        <div className={styles.analysisCard}>
          <h2>Matrix Visualization</h2>
          <div className={styles.matrixContainer}>
            <div className={styles.matrixGrid}>
              <div className={styles.matrixQuadrant + ' ' + styles.quickWins}>
                <div className={styles.quadrantHeader}>
                  <h3>Quick Wins</h3>
                  <span className={styles.quadrantCount}>({matrixData.quadrants.quickWins.length})</span>
                </div>
                <div className={styles.quadrantDescription}>High Impact, Low Effort</div>
                <div className={styles.quadrantItems}>
                  {matrixData.quadrants.quickWins.map((item) => (
                    <div key={item.id} className={styles.matrixItem}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      <div className={styles.itemScores}>E:{item.effortScore} I:{item.impactScore}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.matrixQuadrant + ' ' + styles.majorProjects}>
                <div className={styles.quadrantHeader}>
                  <h3>Major Projects</h3>
                  <span className={styles.quadrantCount}>({matrixData.quadrants.majorProjects.length})</span>
                </div>
                <div className={styles.quadrantDescription}>High Impact, High Effort</div>
                <div className={styles.quadrantItems}>
                  {matrixData.quadrants.majorProjects.map((item) => (
                    <div key={item.id} className={styles.matrixItem}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      <div className={styles.itemScores}>E:{item.effortScore} I:{item.impactScore}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.matrixQuadrant + ' ' + styles.fillIns}>
                <div className={styles.quadrantHeader}>
                  <h3>Fill-ins</h3>
                  <span className={styles.quadrantCount}>({matrixData.quadrants.fillIns.length})</span>
                </div>
                <div className={styles.quadrantDescription}>Low Impact, Low Effort</div>
                <div className={styles.quadrantItems}>
                  {matrixData.quadrants.fillIns.map((item) => (
                    <div key={item.id} className={styles.matrixItem}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      <div className={styles.itemScores}>E:{item.effortScore} I:{item.impactScore}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.matrixQuadrant + ' ' + styles.thanklessJobs}>
                <div className={styles.quadrantHeader}>
                  <h3>Thankless Jobs</h3>
                  <span className={styles.quadrantCount}>({matrixData.quadrants.thanklessJobs.length})</span>
                </div>
                <div className={styles.quadrantDescription}>Low Impact, High Effort</div>
                <div className={styles.quadrantItems}>
                  {matrixData.quadrants.thanklessJobs.map((item) => (
                    <div key={item.id} className={styles.matrixItem}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      <div className={styles.itemScores}>E:{item.effortScore} I:{item.impactScore}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.matrixAxes}>
              <div className={styles.yAxis}>
                <span className={styles.axisLabel}>Impact</span>
                <div className={styles.axisScale}>
                  <span>High</span>
                  <span>Medium</span>
                  <span>Low</span>
                </div>
              </div>
              <div className={styles.xAxis}>
                <span className={styles.axisLabel}>Effort</span>
                <div className={styles.axisScale}>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prioritization Results Section */}
        <div className={styles.analysisCard}>
          <h2>Prioritization Results</h2>
          <div className={styles.prioritizationGrid}>
            <div className={styles.prioritySection}>
              <h3>Recommended (High Priority)</h3>
              <div className={styles.priorityList}>
                {matrixData.items
                  .filter(item => item.priority === 'High')
                  .map((item) => (
                    <div key={item.id} className={styles.priorityItem}>
                      <div className={styles.priorityItemHeader}>
                        <span className={styles.priorityItemTitle}>{item.title}</span>
                        <span className={`${styles.priorityBadge} ${styles.high}`}>High</span>
                      </div>
                      <div className={styles.priorityItemDetails}>
                        <span>Effort: {item.effortScore}/3</span>
                        <span>Impact: {item.impactScore}/3</span>
                        <span>Duration: {item.estimatedDuration}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className={styles.prioritySection}>
              <h3>Consider (Medium Priority)</h3>
              <div className={styles.priorityList}>
                {matrixData.items
                  .filter(item => item.priority === 'Medium')
                  .map((item) => (
                    <div key={item.id} className={styles.priorityItem}>
                      <div className={styles.priorityItemHeader}>
                        <span className={styles.priorityItemTitle}>{item.title}</span>
                        <span className={`${styles.priorityBadge} ${styles.medium}`}>Medium</span>
                      </div>
                      <div className={styles.priorityItemDetails}>
                        <span>Effort: {item.effortScore}/3</span>
                        <span>Impact: {item.impactScore}/3</span>
                        <span>Duration: {item.estimatedDuration}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className={styles.prioritySection}>
              <h3>Avoid (Low Priority)</h3>
              <div className={styles.priorityList}>
                {matrixData.items
                  .filter(item => item.priority === 'Low' || item.priority === 'Very Low')
                  .map((item) => (
                    <div key={item.id} className={styles.priorityItem}>
                      <div className={styles.priorityItemHeader}>
                        <span className={styles.priorityItemTitle}>{item.title}</span>
                        <span className={`${styles.priorityBadge} ${styles.low}`}>{item.priority}</span>
                      </div>
                      <div className={styles.priorityItemDetails}>
                        <span>Effort: {item.effortScore}/3</span>
                        <span>Impact: {item.impactScore}/3</span>
                        <span>Duration: {item.estimatedDuration}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Prioritization Rationale</label>
            <textarea
              className={styles.textareaInput}
              value={matrixData.prioritization.rationale}
              onChange={(e) => handlePrioritizationChange('rationale', e.target.value)}
              placeholder="Explain the rationale behind the prioritization decisions"
              rows={3}
            />
          </div>
        </div>

        {/* Action Planning Section */}
        <div className={styles.analysisCard}>
          <h2>Action Planning</h2>
          <div className={styles.actionPlanGrid}>
            <div className={styles.timeframeSection}>
              <div className={styles.timeframeHeader}>
                <h3>Immediate Actions (0-30 days)</h3>
                <button className={styles.addBtn} onClick={() => addActionItem('immediate')}>
                  <i className="fas fa-plus"></i> Add
                </button>
              </div>
              <div className={styles.actionsList}>
                {matrixData.actionPlan.immediate.map((action) => (
                  <div key={action.id} className={styles.actionItem}>
                    <input
                      type="text"
                      className={styles.actionInput}
                      value={action.item}
                      onChange={(e) => handleActionItemChange('immediate', action.id, 'item', e.target.value)}
                      placeholder="Action item"
                    />
                    <input
                      type="text"
                      className={styles.actionInput}
                      value={action.owner}
                      onChange={(e) => handleActionItemChange('immediate', action.id, 'owner', e.target.value)}
                      placeholder="Owner"
                    />
                    <input
                      type="date"
                      className={styles.actionInput}
                      value={action.dueDate}
                      onChange={(e) => handleActionItemChange('immediate', action.id, 'dueDate', e.target.value)}
                    />
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeActionItem('immediate', action.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.timeframeSection}>
              <div className={styles.timeframeHeader}>
                <h3>Short-term Actions (1-3 months)</h3>
                <button className={styles.addBtn} onClick={() => addActionItem('shortTerm')}>
                  <i className="fas fa-plus"></i> Add
                </button>
              </div>
              <div className={styles.actionsList}>
                {matrixData.actionPlan.shortTerm.map((action) => (
                  <div key={action.id} className={styles.actionItem}>
                    <input
                      type="text"
                      className={styles.actionInput}
                      value={action.item}
                      onChange={(e) => handleActionItemChange('shortTerm', action.id, 'item', e.target.value)}
                      placeholder="Action item"
                    />
                    <input
                      type="text"
                      className={styles.actionInput}
                      value={action.owner}
                      onChange={(e) => handleActionItemChange('shortTerm', action.id, 'owner', e.target.value)}
                      placeholder="Owner"
                    />
                    <input
                      type="date"
                      className={styles.actionInput}
                      value={action.dueDate}
                      onChange={(e) => handleActionItemChange('shortTerm', action.id, 'dueDate', e.target.value)}
                    />
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeActionItem('shortTerm', action.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.timeframeSection}>
              <div className={styles.timeframeHeader}>
                <h3>Long-term Actions (3+ months)</h3>
                <button className={styles.addBtn} onClick={() => addActionItem('longTerm')}>
                  <i className="fas fa-plus"></i> Add
                </button>
              </div>
              <div className={styles.actionsList}>
                {matrixData.actionPlan.longTerm.map((action) => (
                  <div key={action.id} className={styles.actionItem}>
                    <input
                      type="text"
                      className={styles.actionInput}
                      value={action.item}
                      onChange={(e) => handleActionItemChange('longTerm', action.id, 'item', e.target.value)}
                      placeholder="Action item"
                    />
                    <input
                      type="text"
                      className={styles.actionInput}
                      value={action.owner}
                      onChange={(e) => handleActionItemChange('longTerm', action.id, 'owner', e.target.value)}
                      placeholder="Owner"
                    />
                    <input
                      type="date"
                      className={styles.actionInput}
                      value={action.dueDate}
                      onChange={(e) => handleActionItemChange('longTerm', action.id, 'dueDate', e.target.value)}
                    />
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeActionItem('longTerm', action.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.actionPlanDetails}>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Resources Required</label>
                <textarea
                  className={styles.textareaInput}
                  value={matrixData.actionPlan.resources}
                  onChange={(e) => handleActionPlanChange('resources', e.target.value)}
                  placeholder="What resources are needed to execute the action plan?"
                  rows={2}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Overall Timeline</label>
                <textarea
                  className={styles.textareaInput}
                  value={matrixData.actionPlan.timeline}
                  onChange={(e) => handleActionPlanChange('timeline', e.target.value)}
                  placeholder="What is the overall timeline for implementation?"
                  rows={2}
                />
              </div>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Action Plan Owner</label>
              <input
                type="text"
                className={styles.textInput}
                value={matrixData.actionPlan.owner}
                onChange={(e) => handleActionPlanChange('owner', e.target.value)}
                placeholder="Who owns the overall action plan execution?"
              />
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
                value={matrixData.documentation.assumptions}
                onChange={(e) => handleDocumentationChange('assumptions', e.target.value)}
                placeholder="What assumptions were made during the evaluation?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Constraints</label>
              <textarea
                className={styles.textareaInput}
                value={matrixData.documentation.constraints}
                onChange={(e) => handleDocumentationChange('constraints', e.target.value)}
                placeholder="What constraints affect the prioritization and implementation?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Risks</label>
              <textarea
                className={styles.textareaInput}
                value={matrixData.documentation.risks}
                onChange={(e) => handleDocumentationChange('risks', e.target.value)}
                placeholder="What risks should be considered for the prioritized items?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Next Steps</label>
                <textarea
                  className={styles.textareaInput}
                  value={matrixData.documentation.nextSteps}
                  onChange={(e) => handleDocumentationChange('nextSteps', e.target.value)}
                  placeholder="What are the next steps after this prioritization?"
                  rows={2}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Approver</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={matrixData.documentation.approver}
                  onChange={(e) => handleDocumentationChange('approver', e.target.value)}
                  placeholder="Who approved this prioritization?"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffortImpactMatrix;

