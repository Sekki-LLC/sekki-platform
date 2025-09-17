import React, { useState, useEffect } from 'react';
import styles from './SustainmentPlan.module.css';

const SustainmentPlan = () => {
  const [planData, setPlanData] = useState({
    // Plan Information
    planName: '',
    projectName: '',
    planOwner: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    scope: '',
    timeframe: '',
    
    // Improvement Summary
    improvementSummary: {
      problemStatement: '',
      solutionImplemented: '',
      keyBenefits: '',
      metricsImproved: '',
      stakeholdersImpacted: ''
    },
    
    // Critical Success Factors
    criticalFactors: [],
    
    // Process Documentation
    processDocumentation: [],
    
    // Training & Knowledge Transfer
    trainingPlan: [],
    
    // Monitoring & Control
    monitoringPlan: [],
    
    // Risk Management
    sustainmentRisks: [],
    
    // Governance & Ownership
    governance: {
      processOwner: '',
      reviewFrequency: '',
      escalationPath: '',
      decisionAuthority: '',
      budgetOwner: ''
    },
    
    // Continuous Improvement
    continuousImprovement: []
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m here to help you create a comprehensive sustainment plan to ensure your improvements are maintained long-term. I can assist you with process documentation, training plans, monitoring strategies, risk management, and governance structures. What would you like to start with?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Chat responses for sustainment planning
  const chatResponses = {
    'improvement summary': 'Let\'s document your improvement summary. This should capture the original problem, the solution implemented, key benefits achieved, metrics improved, and stakeholders impacted. This provides context for why sustainment is critical and what needs to be maintained.',
    'critical success factors': 'Critical success factors are the essential elements that must remain in place for your improvement to be sustained. These might include leadership support, resource allocation, process adherence, training effectiveness, or technology reliability. Identify what could cause your improvement to fail if not maintained.',
    'process documentation': 'Comprehensive process documentation ensures your improvements can be replicated and maintained consistently. Include standard operating procedures, work instructions, process maps, decision trees, and quality standards. Make sure documentation is accessible, current, and user-friendly.',
    'training plan': 'A robust training plan ensures knowledge transfer and capability building. Include initial training for new team members, refresher training schedules, competency assessments, training materials, and knowledge management systems. Consider different learning styles and skill levels.',
    'monitoring plan': 'Effective monitoring ensures early detection of process drift or performance degradation. Define key performance indicators, measurement frequency, data collection methods, reporting mechanisms, and review cycles. Include both leading and lagging indicators.',
    'risk management': 'Sustainment risks can threaten long-term success. Consider risks like staff turnover, process drift, technology changes, resource constraints, or competing priorities. For each risk, assess probability and impact, then develop mitigation and contingency plans.',
    'governance': 'Strong governance provides structure and accountability for sustainment. Define clear roles and responsibilities, decision-making authority, review processes, escalation paths, and budget ownership. Ensure governance is proportional to the improvement\'s importance.',
    'continuous improvement': 'Continuous improvement ensures your solution evolves and improves over time. Establish feedback mechanisms, improvement suggestion processes, regular review cycles, and innovation opportunities. Create a culture of ongoing enhancement rather than static maintenance.'
  };

  const quickActions = [
    'Help with improvement summary',
    'Identify critical success factors',
    'Guide process documentation',
    'Plan training strategy',
    'Design monitoring approach',
    'Assess sustainment risks',
    'Structure governance model',
    'Enable continuous improvement'
  ];

  const calculateProgress = () => {
    let completed = 0;
    let total = 9;

    if (planData.planName && planData.projectName && planData.planOwner) completed++;
    if (planData.improvementSummary.problemStatement && planData.improvementSummary.solutionImplemented) completed++;
    if (planData.criticalFactors.length > 0) completed++;
    if (planData.processDocumentation.length > 0) completed++;
    if (planData.trainingPlan.length > 0) completed++;
    if (planData.monitoringPlan.length > 0) completed++;
    if (planData.sustainmentRisks.length > 0) completed++;
    if (planData.governance.processOwner && planData.governance.reviewFrequency) completed++;
    if (planData.continuousImprovement.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleInputChange = (field, value) => {
    setPlanData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setPlanData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setPlanData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addCriticalFactor = () => {
    setPlanData(prev => ({
      ...prev,
      criticalFactors: [...prev.criticalFactors, {
        id: Date.now(),
        factor: '',
        description: '',
        owner: '',
        riskLevel: 'Medium',
        monitoringMethod: '',
        notes: ''
      }]
    }));
  };

  const removeCriticalFactor = (index) => {
    setPlanData(prev => ({
      ...prev,
      criticalFactors: prev.criticalFactors.filter((_, i) => i !== index)
    }));
  };

  const addProcessDoc = () => {
    setPlanData(prev => ({
      ...prev,
      processDocumentation: [...prev.processDocumentation, {
        id: Date.now(),
        documentType: '',
        title: '',
        description: '',
        owner: '',
        location: '',
        reviewFrequency: '',
        lastUpdated: '',
        status: 'Draft'
      }]
    }));
  };

  const removeProcessDoc = (index) => {
    setPlanData(prev => ({
      ...prev,
      processDocumentation: prev.processDocumentation.filter((_, i) => i !== index)
    }));
  };

  const addTrainingItem = () => {
    setPlanData(prev => ({
      ...prev,
      trainingPlan: [...prev.trainingPlan, {
        id: Date.now(),
        audience: '',
        trainingType: '',
        content: '',
        method: '',
        frequency: '',
        duration: '',
        owner: '',
        competencyCheck: ''
      }]
    }));
  };

  const removeTrainingItem = (index) => {
    setPlanData(prev => ({
      ...prev,
      trainingPlan: prev.trainingPlan.filter((_, i) => i !== index)
    }));
  };

  const addMonitoringItem = () => {
    setPlanData(prev => ({
      ...prev,
      monitoringPlan: [...prev.monitoringPlan, {
        id: Date.now(),
        metric: '',
        target: '',
        frequency: '',
        method: '',
        owner: '',
        reportingTo: '',
        escalationTrigger: '',
        actionRequired: ''
      }]
    }));
  };

  const removeMonitoringItem = (index) => {
    setPlanData(prev => ({
      ...prev,
      monitoringPlan: prev.monitoringPlan.filter((_, i) => i !== index)
    }));
  };

  const addSustainmentRisk = () => {
    setPlanData(prev => ({
      ...prev,
      sustainmentRisks: [...prev.sustainmentRisks, {
        id: Date.now(),
        risk: '',
        category: '',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: '',
        contingency: '',
        owner: '',
        status: 'Open'
      }]
    }));
  };

  const removeSustainmentRisk = (index) => {
    setPlanData(prev => ({
      ...prev,
      sustainmentRisks: prev.sustainmentRisks.filter((_, i) => i !== index)
    }));
  };

  const addContinuousImprovement = () => {
    setPlanData(prev => ({
      ...prev,
      continuousImprovement: [...prev.continuousImprovement, {
        id: Date.now(),
        mechanism: '',
        description: '',
        frequency: '',
        owner: '',
        reviewProcess: '',
        implementationPath: '',
        successMetrics: ''
      }]
    }));
  };

  const removeContinuousImprovement = (index) => {
    setPlanData(prev => ({
      ...prev,
      continuousImprovement: prev.continuousImprovement.filter((_, i) => i !== index)
    }));
  };

  const handleQuickAction = (action) => {
    const key = action.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
    const response = chatResponses[key] || chatResponses[Object.keys(chatResponses).find(k => key.includes(k))] || 
      'I can help you with all aspects of sustainment planning. Could you be more specific about what you\'d like assistance with?';
    
    setCurrentMessage(action);
    handleSendMessage(action, response);
  };

  const handleSendMessage = (userMessage = currentMessage, aiResponse = null) => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponse || chatResponses[userMessage.toLowerCase()] || 
        'I can help you with all aspects of sustainment planning. Could you be more specific about what you\'d like assistance with?';
      
      const aiMessage = {
        type: 'ai',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSave = () => {
    console.log('Saving sustainment plan:', planData);
    // Implement save functionality
  };

  const handleExport = () => {
    console.log('Exporting sustainment plan:', planData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Sustainment Plan</h1>
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{calculateProgress()}% Complete</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.saveBtn} onClick={handleSave}>
              <i className="fas fa-save"></i>
              Save Plan
            </button>
            <button className={styles.exportBtn} onClick={handleExport}>
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Section */}
        <div className={styles.topSection}>
          {/* Plan Info Card */}
          <div className={styles.processInfoCard}>
            <h2>Plan Information</h2>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Plan Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={planData.planName}
                  onChange={(e) => handleInputChange('planName', e.target.value)}
                  placeholder="Enter sustainment plan name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Project Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={planData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Plan Owner <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={planData.planOwner}
                  onChange={(e) => handleInputChange('planOwner', e.target.value)}
                  placeholder="Enter plan owner name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={planData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Purpose</label>
              <textarea
                className={styles.textareaInput}
                value={planData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Describe the purpose of this sustainment plan"
                rows="3"
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Scope</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={planData.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  placeholder="Define the scope of sustainment"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Timeframe</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={planData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  placeholder="e.g., 12 months, Ongoing"
                />
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>Sustainment Assistant</h3>
                <div className={styles.chatStatus}>
                  <span className={styles.online}>Online</span>
                  {isTyping && (
                    <div className={styles.typing}>
                      <i></i><i></i><i></i>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.chatMessages}>
                {messages.map((message, index) => (
                  <div key={index} className={`${styles.message} ${styles[message.type]}`}>
                    <div className={styles.messageContent}>
                      {message.content}
                    </div>
                    <div className={styles.messageTime}>
                      {message.timestamp}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.chatInput}>
                <input
                  type="text"
                  className={styles.messageInput}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about sustainment planning..."
                />
                <button 
                  className={styles.sendBtn}
                  onClick={() => handleSendMessage()}
                  disabled={!currentMessage.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>

              <div className={styles.quickActions}>
                <h4>Quick Actions</h4>
                <div className={styles.actionButtons}>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className={styles.quickBtn}
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Summary */}
        <div className={styles.analysisCard}>
          <h2>Improvement Summary</h2>
          <p className={styles.sectionDescription}>
            Document the improvement that needs to be sustained, including the original problem, solution, and benefits achieved.
          </p>

          <div className={styles.summaryGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Problem Statement</label>
              <textarea
                className={styles.textareaInput}
                value={planData.improvementSummary.problemStatement}
                onChange={(e) => handleNestedInputChange('improvementSummary', 'problemStatement', e.target.value)}
                placeholder="Describe the original problem that was addressed"
                rows="3"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Solution Implemented</label>
              <textarea
                className={styles.textareaInput}
                value={planData.improvementSummary.solutionImplemented}
                onChange={(e) => handleNestedInputChange('improvementSummary', 'solutionImplemented', e.target.value)}
                placeholder="Describe the solution that was implemented"
                rows="3"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Key Benefits</label>
              <textarea
                className={styles.textareaInput}
                value={planData.improvementSummary.keyBenefits}
                onChange={(e) => handleNestedInputChange('improvementSummary', 'keyBenefits', e.target.value)}
                placeholder="List the key benefits achieved"
                rows="3"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Metrics Improved</label>
              <textarea
                className={styles.textareaInput}
                value={planData.improvementSummary.metricsImproved}
                onChange={(e) => handleNestedInputChange('improvementSummary', 'metricsImproved', e.target.value)}
                placeholder="List the metrics that were improved and by how much"
                rows="3"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Stakeholders Impacted</label>
              <textarea
                className={styles.textareaInput}
                value={planData.improvementSummary.stakeholdersImpacted}
                onChange={(e) => handleNestedInputChange('improvementSummary', 'stakeholdersImpacted', e.target.value)}
                placeholder="Identify stakeholders impacted by the improvement"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Critical Success Factors */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Critical Success Factors</h2>
            <p className={styles.sectionDescription}>
              Identify the essential elements that must remain in place for the improvement to be sustained.
            </p>
            <button className={styles.addBtn} onClick={addCriticalFactor}>
              <i className="fas fa-plus"></i>
              Add Factor
            </button>
          </div>

          {planData.criticalFactors.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Critical Factor</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Risk Level</th>
                  <th>Monitoring Method</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planData.criticalFactors.map((factor, index) => (
                  <tr key={factor.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={factor.factor}
                        onChange={(e) => handleArrayInputChange('criticalFactors', index, 'factor', e.target.value)}
                        placeholder="Critical success factor"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={factor.description}
                        onChange={(e) => handleArrayInputChange('criticalFactors', index, 'description', e.target.value)}
                        placeholder="Detailed description"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={factor.owner}
                        onChange={(e) => handleArrayInputChange('criticalFactors', index, 'owner', e.target.value)}
                        placeholder="Responsible owner"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={factor.riskLevel}
                        onChange={(e) => handleArrayInputChange('criticalFactors', index, 'riskLevel', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={factor.monitoringMethod}
                        onChange={(e) => handleArrayInputChange('criticalFactors', index, 'monitoringMethod', e.target.value)}
                        placeholder="How to monitor"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={factor.notes}
                        onChange={(e) => handleArrayInputChange('criticalFactors', index, 'notes', e.target.value)}
                        placeholder="Additional notes"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeCriticalFactor(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Process Documentation */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Process Documentation</h2>
            <p className={styles.sectionDescription}>
              Ensure comprehensive documentation exists to maintain consistency and enable knowledge transfer.
            </p>
            <button className={styles.addBtn} onClick={addProcessDoc}>
              <i className="fas fa-plus"></i>
              Add Document
            </button>
          </div>

          {planData.processDocumentation.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Type</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Review Frequency</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planData.processDocumentation.map((doc, index) => (
                  <tr key={doc.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={doc.documentType}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'documentType', e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="SOP">SOP</option>
                        <option value="Work Instruction">Work Instruction</option>
                        <option value="Process Map">Process Map</option>
                        <option value="Decision Tree">Decision Tree</option>
                        <option value="Quality Standard">Quality Standard</option>
                        <option value="Training Material">Training Material</option>
                        <option value="Checklist">Checklist</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={doc.title}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'title', e.target.value)}
                        placeholder="Document title"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={doc.description}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'description', e.target.value)}
                        placeholder="Brief description"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={doc.owner}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'owner', e.target.value)}
                        placeholder="Document owner"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={doc.location}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'location', e.target.value)}
                        placeholder="File location/URL"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={doc.reviewFrequency}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'reviewFrequency', e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-annually">Semi-annually</option>
                        <option value="Annually">Annually</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        className={styles.tableInput}
                        value={doc.lastUpdated}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'lastUpdated', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={doc.status}
                        onChange={(e) => handleArrayInputChange('processDocumentation', index, 'status', e.target.value)}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Review">Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Current">Current</option>
                        <option value="Outdated">Outdated</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeProcessDoc(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Training & Knowledge Transfer */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Training & Knowledge Transfer</h2>
            <p className={styles.sectionDescription}>
              Plan training and knowledge transfer activities to ensure capability is maintained across the organization.
            </p>
            <button className={styles.addBtn} onClick={addTrainingItem}>
              <i className="fas fa-plus"></i>
              Add Training
            </button>
          </div>

          {planData.trainingPlan.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Audience</th>
                  <th>Training Type</th>
                  <th>Content</th>
                  <th>Method</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Owner</th>
                  <th>Competency Check</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planData.trainingPlan.map((training, index) => (
                  <tr key={training.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={training.audience}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'audience', e.target.value)}
                        placeholder="Target audience"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={training.trainingType}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'trainingType', e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="Initial Training">Initial Training</option>
                        <option value="Refresher Training">Refresher Training</option>
                        <option value="Advanced Training">Advanced Training</option>
                        <option value="Cross-training">Cross-training</option>
                        <option value="On-the-job Training">On-the-job Training</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={training.content}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'content', e.target.value)}
                        placeholder="Training content/topics"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={training.method}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'method', e.target.value)}
                      >
                        <option value="">Select method</option>
                        <option value="Classroom">Classroom</option>
                        <option value="Online">Online</option>
                        <option value="Hands-on">Hands-on</option>
                        <option value="Mentoring">Mentoring</option>
                        <option value="Job shadowing">Job shadowing</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={training.frequency}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'frequency', e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="One-time">One-time</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-annually">Semi-annually</option>
                        <option value="Annually">Annually</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={training.duration}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'duration', e.target.value)}
                        placeholder="Duration (hours/days)"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={training.owner}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'owner', e.target.value)}
                        placeholder="Training owner"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={training.competencyCheck}
                        onChange={(e) => handleArrayInputChange('trainingPlan', index, 'competencyCheck', e.target.value)}
                        placeholder="Assessment method"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeTrainingItem(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Monitoring & Control */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Monitoring & Control</h2>
            <p className={styles.sectionDescription}>
              Define monitoring mechanisms to detect performance drift and ensure sustained improvement.
            </p>
            <button className={styles.addBtn} onClick={addMonitoringItem}>
              <i className="fas fa-plus"></i>
              Add Metric
            </button>
          </div>

          {planData.monitoringPlan.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Metric</th>
                  <th>Target</th>
                  <th>Frequency</th>
                  <th>Method</th>
                  <th>Owner</th>
                  <th>Reporting To</th>
                  <th>Escalation Trigger</th>
                  <th>Action Required</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planData.monitoringPlan.map((metric, index) => (
                  <tr key={metric.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.metric}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'metric', e.target.value)}
                        placeholder="Metric name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.target}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'target', e.target.value)}
                        placeholder="Target value"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={metric.frequency}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'frequency', e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="Real-time">Real-time</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.method}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'method', e.target.value)}
                        placeholder="Measurement method"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.owner}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'owner', e.target.value)}
                        placeholder="Metric owner"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.reportingTo}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'reportingTo', e.target.value)}
                        placeholder="Reports to"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.escalationTrigger}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'escalationTrigger', e.target.value)}
                        placeholder="When to escalate"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={metric.actionRequired}
                        onChange={(e) => handleArrayInputChange('monitoringPlan', index, 'actionRequired', e.target.value)}
                        placeholder="Required action"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeMonitoringItem(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Risk Management */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Sustainment Risk Management</h2>
            <p className={styles.sectionDescription}>
              Identify and manage risks that could threaten the long-term sustainability of the improvement.
            </p>
            <button className={styles.addBtn} onClick={addSustainmentRisk}>
              <i className="fas fa-plus"></i>
              Add Risk
            </button>
          </div>

          {planData.sustainmentRisks.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Risk</th>
                  <th>Category</th>
                  <th>Probability</th>
                  <th>Impact</th>
                  <th>Mitigation</th>
                  <th>Contingency</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planData.sustainmentRisks.map((risk, index) => (
                  <tr key={risk.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.risk}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'risk', e.target.value)}
                        placeholder="Risk description"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={risk.category}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'category', e.target.value)}
                      >
                        <option value="">Select category</option>
                        <option value="People">People</option>
                        <option value="Process">Process</option>
                        <option value="Technology">Technology</option>
                        <option value="Resources">Resources</option>
                        <option value="External">External</option>
                        <option value="Organizational">Organizational</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={risk.probability}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'probability', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={risk.impact}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'impact', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.mitigation}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'mitigation', e.target.value)}
                        placeholder="Mitigation strategy"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.contingency}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'contingency', e.target.value)}
                        placeholder="Contingency plan"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.owner}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'owner', e.target.value)}
                        placeholder="Risk owner"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={risk.status}
                        onChange={(e) => handleArrayInputChange('sustainmentRisks', index, 'status', e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Mitigated">Mitigated</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeSustainmentRisk(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Governance & Ownership */}
        <div className={styles.analysisCard}>
          <h2>Governance & Ownership</h2>
          <p className={styles.sectionDescription}>
            Define governance structure, roles, and responsibilities for sustaining the improvement.
          </p>

          <div className={styles.governanceGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Process Owner</label>
              <input
                type="text"
                className={styles.textInput}
                value={planData.governance.processOwner}
                onChange={(e) => handleNestedInputChange('governance', 'processOwner', e.target.value)}
                placeholder="Primary process owner"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Review Frequency</label>
              <select
                className={styles.textInput}
                value={planData.governance.reviewFrequency}
                onChange={(e) => handleNestedInputChange('governance', 'reviewFrequency', e.target.value)}
              >
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-annually">Semi-annually</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Escalation Path</label>
              <input
                type="text"
                className={styles.textInput}
                value={planData.governance.escalationPath}
                onChange={(e) => handleNestedInputChange('governance', 'escalationPath', e.target.value)}
                placeholder="Escalation hierarchy"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Decision Authority</label>
              <input
                type="text"
                className={styles.textInput}
                value={planData.governance.decisionAuthority}
                onChange={(e) => handleNestedInputChange('governance', 'decisionAuthority', e.target.value)}
                placeholder="Who has decision authority"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Budget Owner</label>
              <input
                type="text"
                className={styles.textInput}
                value={planData.governance.budgetOwner}
                onChange={(e) => handleNestedInputChange('governance', 'budgetOwner', e.target.value)}
                placeholder="Budget responsibility"
              />
            </div>
          </div>
        </div>

        {/* Continuous Improvement */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Continuous Improvement</h2>
            <p className={styles.sectionDescription}>
              Establish mechanisms for ongoing improvement and evolution of the sustained solution.
            </p>
            <button className={styles.addBtn} onClick={addContinuousImprovement}>
              <i className="fas fa-plus"></i>
              Add Mechanism
            </button>
          </div>

          {planData.continuousImprovement.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mechanism</th>
                  <th>Description</th>
                  <th>Frequency</th>
                  <th>Owner</th>
                  <th>Review Process</th>
                  <th>Implementation Path</th>
                  <th>Success Metrics</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planData.continuousImprovement.map((improvement, index) => (
                  <tr key={improvement.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={improvement.mechanism}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'mechanism', e.target.value)}
                      >
                        <option value="">Select mechanism</option>
                        <option value="Feedback System">Feedback System</option>
                        <option value="Suggestion Box">Suggestion Box</option>
                        <option value="Regular Reviews">Regular Reviews</option>
                        <option value="Kaizen Events">Kaizen Events</option>
                        <option value="Innovation Sessions">Innovation Sessions</option>
                        <option value="Benchmarking">Benchmarking</option>
                        <option value="Customer Feedback">Customer Feedback</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={improvement.description}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'description', e.target.value)}
                        placeholder="Detailed description"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={improvement.frequency}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'frequency', e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="Continuous">Continuous</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-annually">Semi-annually</option>
                        <option value="Annually">Annually</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={improvement.owner}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'owner', e.target.value)}
                        placeholder="Responsible owner"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={improvement.reviewProcess}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'reviewProcess', e.target.value)}
                        placeholder="Review process"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={improvement.implementationPath}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'implementationPath', e.target.value)}
                        placeholder="How to implement"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={improvement.successMetrics}
                        onChange={(e) => handleArrayInputChange('continuousImprovement', index, 'successMetrics', e.target.value)}
                        placeholder="Success metrics"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeContinuousImprovement(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainmentPlan;

