import React, { useState, useEffect } from 'react';
import styles from './StakeholderAnalysis.module.css';

const StakeholderAnalysis = () => {
  const [analysisData, setAnalysisData] = useState({
    // Analysis Information
    analysisName: '',
    projectName: '',
    analyst: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    scope: '',
    timeframe: '',
    
    // Stakeholder Identification
    stakeholders: [],
    
    // Influence-Interest Matrix
    matrixData: {
      highInfluenceHighInterest: [],
      highInfluenceLowInterest: [],
      lowInfluenceHighInterest: [],
      lowInfluenceLowInterest: []
    },
    
    // Engagement Strategies
    engagementStrategies: [],
    
    // Communication Plan
    communicationPlan: [],
    
    // Risk Assessment
    stakeholderRisks: [],
    
    // Action Planning
    actionItems: []
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m here to help you conduct a comprehensive stakeholder analysis. I can assist you with stakeholder identification, influence-interest mapping, engagement strategies, and communication planning. What would you like to start with?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Chat responses for stakeholder analysis
  const chatResponses = {
    'stakeholder identification': 'Great! Let\'s identify your stakeholders. Consider internal stakeholders (employees, management, shareholders), external stakeholders (customers, suppliers, regulators, community), and those who are affected by or can affect your project. For each stakeholder, we\'ll assess their influence level and interest level.',
    'influence interest matrix': 'The Influence-Interest Matrix is a powerful tool for stakeholder prioritization. High Influence + High Interest stakeholders need to be managed closely. High Influence + Low Interest stakeholders should be kept satisfied. Low Influence + High Interest stakeholders should be kept informed. Low Influence + Low Interest stakeholders require minimal effort.',
    'engagement strategies': 'Effective engagement strategies depend on stakeholder positioning in the matrix. For high-influence stakeholders, consider regular meetings, formal reports, and decision involvement. For high-interest stakeholders, focus on information sharing and feedback collection. Tailor your approach to each stakeholder\'s preferences and communication style.',
    'communication planning': 'A solid communication plan ensures stakeholders receive the right information at the right time through the right channels. Consider frequency (daily, weekly, monthly), method (email, meetings, reports), content (updates, decisions, issues), and feedback mechanisms.',
    'risk assessment': 'Stakeholder risks can significantly impact project success. Consider risks like stakeholder opposition, lack of engagement, conflicting interests, resource constraints, or communication breakdowns. For each risk, assess probability and impact, then develop mitigation strategies.',
    'action planning': 'Action planning translates your stakeholder analysis into concrete steps. Prioritize actions based on stakeholder importance and urgency. Include specific tasks, responsible parties, deadlines, and success metrics. Regular review and updates ensure your stakeholder management remains effective.'
  };

  const quickActions = [
    'Help with stakeholder identification',
    'Explain influence-interest matrix',
    'Suggest engagement strategies',
    'Guide communication planning',
    'Assess stakeholder risks',
    'Create action plans'
  ];

  const calculateProgress = () => {
    let completed = 0;
    let total = 8;

    if (analysisData.analysisName && analysisData.projectName && analysisData.analyst) completed++;
    if (analysisData.stakeholders.length > 0) completed++;
    if (Object.values(analysisData.matrixData).some(arr => arr.length > 0)) completed++;
    if (analysisData.engagementStrategies.length > 0) completed++;
    if (analysisData.communicationPlan.length > 0) completed++;
    if (analysisData.stakeholderRisks.length > 0) completed++;
    if (analysisData.actionItems.length > 0) completed++;
    if (analysisData.purpose && analysisData.scope) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleInputChange = (field, value) => {
    setAnalysisData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setAnalysisData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleMatrixInputChange = (quadrant, index, field, value) => {
    setAnalysisData(prev => ({
      ...prev,
      matrixData: {
        ...prev.matrixData,
        [quadrant]: prev.matrixData[quadrant].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addStakeholder = () => {
    setAnalysisData(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, {
        id: Date.now(),
        name: '',
        organization: '',
        role: '',
        category: 'Internal',
        influence: 'Medium',
        interest: 'Medium',
        attitude: 'Neutral',
        contactInfo: '',
        notes: ''
      }]
    }));
  };

  const removeStakeholder = (index) => {
    setAnalysisData(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.filter((_, i) => i !== index)
    }));
  };

  const addToMatrix = (quadrant) => {
    setAnalysisData(prev => ({
      ...prev,
      matrixData: {
        ...prev.matrixData,
        [quadrant]: [...prev.matrixData[quadrant], {
          id: Date.now(),
          stakeholder: '',
          strategy: '',
          priority: 'Medium',
          notes: ''
        }]
      }
    }));
  };

  const removeFromMatrix = (quadrant, index) => {
    setAnalysisData(prev => ({
      ...prev,
      matrixData: {
        ...prev.matrixData,
        [quadrant]: prev.matrixData[quadrant].filter((_, i) => i !== index)
      }
    }));
  };

  const addEngagementStrategy = () => {
    setAnalysisData(prev => ({
      ...prev,
      engagementStrategies: [...prev.engagementStrategies, {
        id: Date.now(),
        stakeholder: '',
        strategy: '',
        approach: '',
        frequency: '',
        method: '',
        owner: '',
        notes: ''
      }]
    }));
  };

  const removeEngagementStrategy = (index) => {
    setAnalysisData(prev => ({
      ...prev,
      engagementStrategies: prev.engagementStrategies.filter((_, i) => i !== index)
    }));
  };

  const addCommunicationPlan = () => {
    setAnalysisData(prev => ({
      ...prev,
      communicationPlan: [...prev.communicationPlan, {
        id: Date.now(),
        stakeholder: '',
        message: '',
        method: '',
        frequency: '',
        owner: '',
        timing: '',
        feedback: ''
      }]
    }));
  };

  const removeCommunicationPlan = (index) => {
    setAnalysisData(prev => ({
      ...prev,
      communicationPlan: prev.communicationPlan.filter((_, i) => i !== index)
    }));
  };

  const addStakeholderRisk = () => {
    setAnalysisData(prev => ({
      ...prev,
      stakeholderRisks: [...prev.stakeholderRisks, {
        id: Date.now(),
        stakeholder: '',
        risk: '',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: '',
        owner: '',
        status: 'Open'
      }]
    }));
  };

  const removeStakeholderRisk = (index) => {
    setAnalysisData(prev => ({
      ...prev,
      stakeholderRisks: prev.stakeholderRisks.filter((_, i) => i !== index)
    }));
  };

  const addActionItem = () => {
    setAnalysisData(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, {
        id: Date.now(),
        action: '',
        stakeholder: '',
        owner: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Not Started',
        notes: ''
      }]
    }));
  };

  const removeActionItem = (index) => {
    setAnalysisData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index)
    }));
  };

  const handleQuickAction = (action) => {
    const key = action.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
    const response = chatResponses[key] || chatResponses[Object.keys(chatResponses).find(k => key.includes(k))] || 
      'I can help you with stakeholder identification, influence-interest mapping, engagement strategies, communication planning, risk assessment, and action planning. What specific aspect would you like to explore?';
    
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
        'I can help you with all aspects of stakeholder analysis. Could you be more specific about what you\'d like assistance with?';
      
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
    console.log('Saving stakeholder analysis:', analysisData);
    // Implement save functionality
  };

  const handleExport = () => {
    console.log('Exporting stakeholder analysis:', analysisData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Stakeholder Analysis</h1>
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
              Save Analysis
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
          {/* Analysis Info Card */}
          <div className={styles.processInfoCard}>
            <h2>Analysis Information</h2>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Analysis Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={analysisData.analysisName}
                  onChange={(e) => handleInputChange('analysisName', e.target.value)}
                  placeholder="Enter analysis name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Project Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={analysisData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Analyst <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={analysisData.analyst}
                  onChange={(e) => handleInputChange('analyst', e.target.value)}
                  placeholder="Enter analyst name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={analysisData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Purpose</label>
              <textarea
                className={styles.textareaInput}
                value={analysisData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Describe the purpose of this stakeholder analysis"
                rows="3"
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Scope</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={analysisData.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  placeholder="Define the scope of analysis"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Timeframe</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={analysisData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  placeholder="e.g., Q1 2024, 6 months"
                />
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>Analysis Assistant</h3>
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
                  placeholder="Ask about stakeholder analysis..."
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

        {/* Stakeholder Identification */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Stakeholder Identification</h2>
            <p className={styles.sectionDescription}>
              Identify all individuals, groups, or organizations that can affect or are affected by the project.
            </p>
            <button className={styles.addBtn} onClick={addStakeholder}>
              <i className="fas fa-plus"></i>
              Add Stakeholder
            </button>
          </div>

          {analysisData.stakeholders.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Category</th>
                  <th>Influence</th>
                  <th>Interest</th>
                  <th>Attitude</th>
                  <th>Contact Info</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.stakeholders.map((stakeholder, index) => (
                  <tr key={stakeholder.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={stakeholder.name}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'name', e.target.value)}
                        placeholder="Stakeholder name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={stakeholder.organization}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'organization', e.target.value)}
                        placeholder="Organization"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={stakeholder.role}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'role', e.target.value)}
                        placeholder="Role/Position"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={stakeholder.category}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'category', e.target.value)}
                      >
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                        <option value="Key">Key</option>
                        <option value="Secondary">Secondary</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={stakeholder.influence}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'influence', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={stakeholder.interest}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'interest', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={stakeholder.attitude}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'attitude', e.target.value)}
                      >
                        <option value="Supportive">Supportive</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Resistant">Resistant</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={stakeholder.contactInfo}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'contactInfo', e.target.value)}
                        placeholder="Email/Phone"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={stakeholder.notes}
                        onChange={(e) => handleArrayInputChange('stakeholders', index, 'notes', e.target.value)}
                        placeholder="Additional notes"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeStakeholder(index)}
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

        {/* Influence-Interest Matrix */}
        <div className={styles.analysisCard}>
          <h2>Influence-Interest Matrix</h2>
          <p className={styles.sectionDescription}>
            Map stakeholders based on their level of influence and interest to determine appropriate engagement strategies.
          </p>

          <div className={styles.matrixGrid}>
            {/* High Influence, High Interest */}
            <div className={styles.matrixQuadrant}>
              <div className={styles.quadrantHeader} style={{ backgroundColor: 'var(--lss-danger)' }}>
                <h4>Manage Closely</h4>
                <p>High Influence, High Interest</p>
                <button className={styles.addBtn} onClick={() => addToMatrix('highInfluenceHighInterest')}>
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
              {analysisData.matrixData.highInfluenceHighInterest.map((item, index) => (
                <div key={item.id} className={styles.matrixItem}>
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.stakeholder}
                    onChange={(e) => handleMatrixInputChange('highInfluenceHighInterest', index, 'stakeholder', e.target.value)}
                    placeholder="Stakeholder name"
                  />
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.strategy}
                    onChange={(e) => handleMatrixInputChange('highInfluenceHighInterest', index, 'strategy', e.target.value)}
                    placeholder="Engagement strategy"
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromMatrix('highInfluenceHighInterest', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* High Influence, Low Interest */}
            <div className={styles.matrixQuadrant}>
              <div className={styles.quadrantHeader} style={{ backgroundColor: 'var(--lss-warning)' }}>
                <h4>Keep Satisfied</h4>
                <p>High Influence, Low Interest</p>
                <button className={styles.addBtn} onClick={() => addToMatrix('highInfluenceLowInterest')}>
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
              {analysisData.matrixData.highInfluenceLowInterest.map((item, index) => (
                <div key={item.id} className={styles.matrixItem}>
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.stakeholder}
                    onChange={(e) => handleMatrixInputChange('highInfluenceLowInterest', index, 'stakeholder', e.target.value)}
                    placeholder="Stakeholder name"
                  />
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.strategy}
                    onChange={(e) => handleMatrixInputChange('highInfluenceLowInterest', index, 'strategy', e.target.value)}
                    placeholder="Engagement strategy"
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromMatrix('highInfluenceLowInterest', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Low Influence, High Interest */}
            <div className={styles.matrixQuadrant}>
              <div className={styles.quadrantHeader} style={{ backgroundColor: 'var(--lss-info)' }}>
                <h4>Keep Informed</h4>
                <p>Low Influence, High Interest</p>
                <button className={styles.addBtn} onClick={() => addToMatrix('lowInfluenceHighInterest')}>
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
              {analysisData.matrixData.lowInfluenceHighInterest.map((item, index) => (
                <div key={item.id} className={styles.matrixItem}>
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.stakeholder}
                    onChange={(e) => handleMatrixInputChange('lowInfluenceHighInterest', index, 'stakeholder', e.target.value)}
                    placeholder="Stakeholder name"
                  />
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.strategy}
                    onChange={(e) => handleMatrixInputChange('lowInfluenceHighInterest', index, 'strategy', e.target.value)}
                    placeholder="Engagement strategy"
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromMatrix('lowInfluenceHighInterest', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Low Influence, Low Interest */}
            <div className={styles.matrixQuadrant}>
              <div className={styles.quadrantHeader} style={{ backgroundColor: 'var(--lss-gray-500)' }}>
                <h4>Monitor</h4>
                <p>Low Influence, Low Interest</p>
                <button className={styles.addBtn} onClick={() => addToMatrix('lowInfluenceLowInterest')}>
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
              {analysisData.matrixData.lowInfluenceLowInterest.map((item, index) => (
                <div key={item.id} className={styles.matrixItem}>
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.stakeholder}
                    onChange={(e) => handleMatrixInputChange('lowInfluenceLowInterest', index, 'stakeholder', e.target.value)}
                    placeholder="Stakeholder name"
                  />
                  <input
                    type="text"
                    className={styles.tableInput}
                    value={item.strategy}
                    onChange={(e) => handleMatrixInputChange('lowInfluenceLowInterest', index, 'strategy', e.target.value)}
                    placeholder="Engagement strategy"
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromMatrix('lowInfluenceLowInterest', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Strategies */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Engagement Strategies</h2>
            <p className={styles.sectionDescription}>
              Define specific strategies for engaging with each stakeholder or stakeholder group.
            </p>
            <button className={styles.addBtn} onClick={addEngagementStrategy}>
              <i className="fas fa-plus"></i>
              Add Strategy
            </button>
          </div>

          {analysisData.engagementStrategies.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stakeholder</th>
                  <th>Strategy</th>
                  <th>Approach</th>
                  <th>Frequency</th>
                  <th>Method</th>
                  <th>Owner</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.engagementStrategies.map((strategy, index) => (
                  <tr key={strategy.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={strategy.stakeholder}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'stakeholder', e.target.value)}
                        placeholder="Stakeholder name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={strategy.strategy}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'strategy', e.target.value)}
                        placeholder="Engagement strategy"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={strategy.approach}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'approach', e.target.value)}
                        placeholder="Approach/Tactics"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={strategy.frequency}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'frequency', e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={strategy.method}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'method', e.target.value)}
                      >
                        <option value="">Select method</option>
                        <option value="Face-to-face">Face-to-face</option>
                        <option value="Video call">Video call</option>
                        <option value="Phone call">Phone call</option>
                        <option value="Email">Email</option>
                        <option value="Report">Report</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Survey">Survey</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={strategy.owner}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'owner', e.target.value)}
                        placeholder="Responsible person"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={strategy.notes}
                        onChange={(e) => handleArrayInputChange('engagementStrategies', index, 'notes', e.target.value)}
                        placeholder="Additional notes"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeEngagementStrategy(index)}
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

        {/* Communication Plan */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Communication Plan</h2>
            <p className={styles.sectionDescription}>
              Plan specific communications to ensure stakeholders receive the right information at the right time.
            </p>
            <button className={styles.addBtn} onClick={addCommunicationPlan}>
              <i className="fas fa-plus"></i>
              Add Communication
            </button>
          </div>

          {analysisData.communicationPlan.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stakeholder</th>
                  <th>Message/Content</th>
                  <th>Method</th>
                  <th>Frequency</th>
                  <th>Owner</th>
                  <th>Timing</th>
                  <th>Feedback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.communicationPlan.map((comm, index) => (
                  <tr key={comm.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={comm.stakeholder}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'stakeholder', e.target.value)}
                        placeholder="Stakeholder name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={comm.message}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'message', e.target.value)}
                        placeholder="Message content"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={comm.method}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'method', e.target.value)}
                      >
                        <option value="">Select method</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Report">Report</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Newsletter">Newsletter</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={comm.frequency}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'frequency', e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Milestone-based">Milestone-based</option>
                        <option value="Ad-hoc">Ad-hoc</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={comm.owner}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'owner', e.target.value)}
                        placeholder="Responsible person"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={comm.timing}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'timing', e.target.value)}
                        placeholder="When to communicate"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={comm.feedback}
                        onChange={(e) => handleArrayInputChange('communicationPlan', index, 'feedback', e.target.value)}
                        placeholder="Feedback mechanism"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeCommunicationPlan(index)}
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

        {/* Risk Assessment */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Stakeholder Risk Assessment</h2>
            <p className={styles.sectionDescription}>
              Identify and assess risks related to stakeholder management and engagement.
            </p>
            <button className={styles.addBtn} onClick={addStakeholderRisk}>
              <i className="fas fa-plus"></i>
              Add Risk
            </button>
          </div>

          {analysisData.stakeholderRisks.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stakeholder</th>
                  <th>Risk Description</th>
                  <th>Probability</th>
                  <th>Impact</th>
                  <th>Mitigation Strategy</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.stakeholderRisks.map((risk, index) => (
                  <tr key={risk.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.stakeholder}
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'stakeholder', e.target.value)}
                        placeholder="Stakeholder name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.risk}
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'risk', e.target.value)}
                        placeholder="Risk description"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={risk.probability}
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'probability', e.target.value)}
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
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'impact', e.target.value)}
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
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'mitigation', e.target.value)}
                        placeholder="Mitigation strategy"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={risk.owner}
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'owner', e.target.value)}
                        placeholder="Risk owner"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={risk.status}
                        onChange={(e) => handleArrayInputChange('stakeholderRisks', index, 'status', e.target.value)}
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
                        onClick={() => removeStakeholderRisk(index)}
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

        {/* Action Planning */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Action Planning</h2>
            <p className={styles.sectionDescription}>
              Define specific actions to implement stakeholder engagement strategies and manage relationships.
            </p>
            <button className={styles.addBtn} onClick={addActionItem}>
              <i className="fas fa-plus"></i>
              Add Action
            </button>
          </div>

          {analysisData.actionItems.length > 0 && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Stakeholder</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.actionItems.map((action, index) => (
                  <tr key={action.id}>
                    <td>
                      <span className={styles.sequenceNumber}>{index + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={action.action}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'action', e.target.value)}
                        placeholder="Action description"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={action.stakeholder}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'stakeholder', e.target.value)}
                        placeholder="Related stakeholder"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={action.owner}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'owner', e.target.value)}
                        placeholder="Action owner"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className={styles.tableInput}
                        value={action.dueDate}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'dueDate', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={action.priority}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'priority', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.tableSelect}
                        value={action.status}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'status', e.target.value)}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.tableInput}
                        value={action.notes}
                        onChange={(e) => handleArrayInputChange('actionItems', index, 'notes', e.target.value)}
                        placeholder="Additional notes"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeActionItem(index)}
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

export default StakeholderAnalysis;

