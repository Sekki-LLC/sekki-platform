import React, { useState, useEffect } from 'react';
import styles from './RootCauseAnalysis.module.css';

const RootCauseAnalysis = () => {
  // RCA data structure
  const [rcaData, setRcaData] = useState({
    problemStatement: '',
    problemOwner: '',
    rcaTeam: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    analysisMethod: '5whys', // '5whys', 'fishbone', 'causeeffect'
    
    // 5 Whys data
    fiveWhys: [
      { id: 1, question: 'Why did this problem occur?', answer: '' },
      { id: 2, question: 'Why did that happen?', answer: '' },
      { id: 3, question: 'Why did that happen?', answer: '' },
      { id: 4, question: 'Why did that happen?', answer: '' },
      { id: 5, question: 'Why did that happen?', answer: '' }
    ],
    
    // Fishbone data
    fishbone: {
      people: [],
      process: [],
      equipment: [],
      materials: [],
      environment: [],
      methods: []
    },
    
    // Root causes and actions
    identifiedRootCauses: [],
    actionPlan: []
  });

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Root Cause Analysis! I'll help you systematically identify the true root causes of your problem. Let's start by clearly defining the problem you're investigating. What specific issue are you analyzing?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Calculate completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      let totalFields = 0;
      let completedFields = 0;

      // Basic info
      totalFields += 3;
      if (rcaData.problemStatement) completedFields++;
      if (rcaData.problemOwner) completedFields++;
      if (rcaData.rcaTeam) completedFields++;

      // Analysis method specific completion
      if (rcaData.analysisMethod === '5whys') {
        totalFields += 5;
        rcaData.fiveWhys.forEach(why => {
          if (why.answer && why.answer.trim() !== '') completedFields++;
        });
      } else if (rcaData.analysisMethod === 'fishbone') {
        const categories = Object.keys(rcaData.fishbone);
        totalFields += categories.length;
        categories.forEach(category => {
          if (rcaData.fishbone[category].length > 0) completedFields++;
        });
      }

      // Root causes and actions
      totalFields += 2;
      if (rcaData.identifiedRootCauses.length > 0) completedFields++;
      if (rcaData.actionPlan.length > 0) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [rcaData]);

  // Handle field changes
  const handleBasicInfoChange = (field, value) => {
    setRcaData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle 5 Whys changes
  const handleWhyChange = (id, answer) => {
    setRcaData(prev => ({
      ...prev,
      fiveWhys: prev.fiveWhys.map(why => 
        why.id === id ? { ...why, answer } : why
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle Fishbone changes
  const addFishboneCause = (category) => {
    const newCause = prompt(`Add a potential cause for ${category.charAt(0).toUpperCase() + category.slice(1)}:`);
    if (newCause && newCause.trim()) {
      setRcaData(prev => ({
        ...prev,
        fishbone: {
          ...prev.fishbone,
          [category]: [...prev.fishbone[category], { id: Date.now(), cause: newCause.trim() }]
        },
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
    }
  };

  const removeFishboneCause = (category, id) => {
    setRcaData(prev => ({
      ...prev,
      fishbone: {
        ...prev.fishbone,
        [category]: prev.fishbone[category].filter(cause => cause.id !== id)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle root causes
  const addRootCause = () => {
    const newRootCause = {
      id: Date.now(),
      cause: '',
      evidence: '',
      validation: '',
      priority: 'medium'
    };
    setRcaData(prev => ({
      ...prev,
      identifiedRootCauses: [...prev.identifiedRootCauses, newRootCause],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const updateRootCause = (id, field, value) => {
    setRcaData(prev => ({
      ...prev,
      identifiedRootCauses: prev.identifiedRootCauses.map(cause =>
        cause.id === id ? { ...cause, [field]: value } : cause
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const removeRootCause = (id) => {
    setRcaData(prev => ({
      ...prev,
      identifiedRootCauses: prev.identifiedRootCauses.filter(cause => cause.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle action plan
  const addAction = () => {
    const newAction = {
      id: Date.now(),
      action: '',
      owner: '',
      targetDate: '',
      status: 'planned'
    };
    setRcaData(prev => ({
      ...prev,
      actionPlan: [...prev.actionPlan, newAction],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const updateAction = (id, field, value) => {
    setRcaData(prev => ({
      ...prev,
      actionPlan: prev.actionPlan.map(action =>
        action.id === id ? { ...action, [field]: value } : action
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const removeAction = (id) => {
    setRcaData(prev => ({
      ...prev,
      actionPlan: prev.actionPlan.filter(action => action.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Mock AI response generation
  const generateAIResponse = (userMessage) => {
    const responses = {
      'problem statement': "A good problem statement should be specific, measurable, and factual. Avoid assumptions or solutions. Focus on WHAT happened, WHEN it happened, WHERE it occurred, and WHO was affected. For example: 'Customer complaints increased by 25% in Q3 due to delayed shipments' rather than 'We have shipping problems.'",
      '5 whys': "The 5 Whys technique helps you drill down to root causes by asking 'Why?' repeatedly. Each answer becomes the basis for the next 'Why?' question. Don't stop at 5 if you haven't reached the root cause, and don't assume you need exactly 5 levels. The goal is to find actionable root causes you can control.",
      'fishbone': "The Fishbone (Ishikawa) diagram organizes potential causes into categories: People (skills, training), Process (procedures, workflow), Equipment (machines, tools), Materials (supplies, inputs), Environment (conditions, location), and Methods (techniques, approaches). Brainstorm causes in each category.",
      'root cause': "A true root cause is something that, if eliminated, would prevent the problem from recurring. Test your root causes by asking: 'If we fix this, will the problem go away?' and 'Is this something we can control?' Focus on systemic issues, not individual blame.",
      'validation': "Validate root causes with data and evidence. Use techniques like: data analysis, process observation, interviews with stakeholders, testing hypotheses, or pilot improvements. Don't rely on assumptions - prove your root causes with facts.",
      'action plan': "Effective corrective actions should address root causes, not just symptoms. Prioritize actions by impact and feasibility. Include: specific actions, clear ownership, realistic timelines, and success metrics. Consider both immediate fixes and long-term prevention.",
      'default': "I can help you with any aspect of Root Cause Analysis. Try asking about problem statements, 5 Whys technique, fishbone diagrams, root cause validation, or action planning. What would you like to explore?"
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  // Handle sending chat messages
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

  // Quick action handlers
  const handleQuickAction = (message) => {
    setCurrentMessage(message);
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Root Cause Analysis</h1>
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
          <button className={styles.saveBtn}>
            <i className="fas fa-save"></i> Save Draft
          </button>
          <button className={styles.exportBtn}>
            <i className="fas fa-download"></i> Export PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Section: RCA Information + AI Helper */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>RCA Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Problem Statement <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={rcaData.problemStatement}
                onChange={(e) => handleBasicInfoChange('problemStatement', e.target.value)}
                placeholder="Clearly describe the specific problem you're investigating..."
                rows={3}
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
                  value={rcaData.problemOwner}
                  onChange={(e) => handleBasicInfoChange('problemOwner', e.target.value)}
                  placeholder="Who owns this problem?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  RCA Team <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={rcaData.rcaTeam}
                  onChange={(e) => handleBasicInfoChange('rcaTeam', e.target.value)}
                  placeholder="List team members involved in this RCA"
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
                  value={rcaData.dateCreated}
                  onChange={(e) => handleBasicInfoChange('dateCreated', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Analysis Method
                </label>
                <select
                  className={styles.selectInput}
                  value={rcaData.analysisMethod}
                  onChange={(e) => handleBasicInfoChange('analysisMethod', e.target.value)}
                >
                  <option value="5whys">5 Whys</option>
                  <option value="fishbone">Fishbone Diagram</option>
                  <option value="causeeffect">Cause & Effect</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  RCA AI Guide
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
                  placeholder="Ask me about root cause analysis..."
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
                    Problem Statement
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('Explain the 5 Whys technique')}
                  >
                    5 Whys Method
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I validate root causes?')}
                  >
                    Root Cause Validation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Method Section */}
        <div className={styles.analysisCard}>
          <h2>
            {rcaData.analysisMethod === '5whys' && '5 Whys Analysis'}
            {rcaData.analysisMethod === 'fishbone' && 'Fishbone Diagram'}
            {rcaData.analysisMethod === 'causeeffect' && 'Cause & Effect Analysis'}
          </h2>

          {rcaData.analysisMethod === '5whys' && (
            <div className={styles.fiveWhysSection}>
              {rcaData.fiveWhys.map((why, index) => (
                <div key={why.id} className={styles.whyItem}>
                  <div className={styles.whyNumber}>{index + 1}</div>
                  <div className={styles.whyContent}>
                    <label className={styles.whyQuestion}>{why.question}</label>
                    <textarea
                      className={styles.whyAnswer}
                      value={why.answer}
                      onChange={(e) => handleWhyChange(why.id, e.target.value)}
                      placeholder="Enter your answer here..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {rcaData.analysisMethod === 'fishbone' && (
            <div className={styles.fishboneSection}>
              <div className={styles.fishboneGrid}>
                {Object.entries(rcaData.fishbone).map(([category, causes]) => (
                  <div key={category} className={styles.fishboneCategory}>
                    <div className={styles.categoryHeader}>
                      <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                      <button 
                        className={styles.addCauseBtn}
                        onClick={() => addFishboneCause(category)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className={styles.causesList}>
                      {causes.map((cause) => (
                        <div key={cause.id} className={styles.causeItem}>
                          <span>{cause.cause}</span>
                          <button 
                            className={styles.removeCauseBtn}
                            onClick={() => removeFishboneCause(category, cause.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Root Causes Section */}
        <div className={styles.rootCausesCard}>
          <div className={styles.sectionHeader}>
            <h2>Identified Root Causes</h2>
            <button className={styles.addBtn} onClick={addRootCause}>
              <i className="fas fa-plus"></i> Add Root Cause
            </button>
          </div>

          <div className={styles.rootCausesList}>
            {rcaData.identifiedRootCauses.map((rootCause) => (
              <div key={rootCause.id} className={styles.rootCauseItem}>
                <div className={styles.rootCauseHeader}>
                  <input
                    type="text"
                    className={styles.rootCauseTitle}
                    value={rootCause.cause}
                    onChange={(e) => updateRootCause(rootCause.id, 'cause', e.target.value)}
                    placeholder="Describe the root cause..."
                  />
                  <select
                    className={styles.prioritySelect}
                    value={rootCause.priority}
                    onChange={(e) => updateRootCause(rootCause.id, 'priority', e.target.value)}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeRootCause(rootCause.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className={styles.rootCauseDetails}>
                  <div className={styles.detailField}>
                    <label>Evidence/Data Supporting This Root Cause:</label>
                    <textarea
                      value={rootCause.evidence}
                      onChange={(e) => updateRootCause(rootCause.id, 'evidence', e.target.value)}
                      placeholder="What evidence supports this as a root cause?"
                      rows={2}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Validation Method:</label>
                    <textarea
                      value={rootCause.validation}
                      onChange={(e) => updateRootCause(rootCause.id, 'validation', e.target.value)}
                      placeholder="How will you validate this root cause?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan Section */}
        <div className={styles.actionPlanCard}>
          <div className={styles.sectionHeader}>
            <h2>Corrective Action Plan</h2>
            <button className={styles.addBtn} onClick={addAction}>
              <i className="fas fa-plus"></i> Add Action
            </button>
          </div>

          <div className={styles.actionsList}>
            {rcaData.actionPlan.map((action) => (
              <div key={action.id} className={styles.actionItem}>
                <div className={styles.actionHeader}>
                  <input
                    type="text"
                    className={styles.actionTitle}
                    value={action.action}
                    onChange={(e) => updateAction(action.id, 'action', e.target.value)}
                    placeholder="Describe the corrective action..."
                  />
                  <input
                    type="text"
                    className={styles.actionOwner}
                    value={action.owner}
                    onChange={(e) => updateAction(action.id, 'owner', e.target.value)}
                    placeholder="Owner"
                  />
                  <input
                    type="date"
                    className={styles.actionDate}
                    value={action.targetDate}
                    onChange={(e) => updateAction(action.id, 'targetDate', e.target.value)}
                  />
                  <select
                    className={styles.statusSelect}
                    value={action.status}
                    onChange={(e) => updateAction(action.id, 'status', e.target.value)}
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeAction(action.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.completionStatus}>
            <i className={`fas ${completionPercentage === 100 ? 'fa-check-circle' : 'fa-clock'}`}></i>
            <span>
              {completionPercentage === 100 
                ? 'RCA Complete - Ready for Review' 
                : `${completionPercentage}% Complete`
              }
            </span>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.secondaryBtn}>
              <i className="fas fa-eye"></i> Preview
            </button>
            <button 
              className={styles.primaryBtn}
              disabled={completionPercentage < 100}
            >
              <i className="fas fa-check"></i> Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;

