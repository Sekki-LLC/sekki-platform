import React, { useState, useEffect } from 'react';
import styles from './FiveWhys.module.css';

const FiveWhys = () => {
  // 5 Whys data structure
  const [whysData, setWhysData] = useState({
    projectName: '',
    analyst: '',
    analysisTeam: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Problem information
    problemInfo: {
      problemStatement: '',
      problemCategory: 'quality', // 'quality', 'safety', 'delivery', 'cost', 'morale', 'other'
      impactDescription: '',
      whenOccurred: '',
      whereOccurred: '',
      whoInvolved: '',
      frequency: 'occasional', // 'one-time', 'occasional', 'frequent', 'continuous'
      severity: 'medium' // 'low', 'medium', 'high', 'critical'
    },
    
    // 5 Whys analysis
    whysAnalysis: [
      {
        id: 1,
        question: 'Why did this problem occur?',
        answer: '',
        evidence: '',
        verified: false
      },
      {
        id: 2,
        question: 'Why did that happen?',
        answer: '',
        evidence: '',
        verified: false
      },
      {
        id: 3,
        question: 'Why did that happen?',
        answer: '',
        evidence: '',
        verified: false
      },
      {
        id: 4,
        question: 'Why did that happen?',
        answer: '',
        evidence: '',
        verified: false
      },
      {
        id: 5,
        question: 'Why did that happen?',
        answer: '',
        evidence: '',
        verified: false
      }
    ],
    
    // Root cause and actions
    rootCause: {
      identified: '',
      category: 'process', // 'process', 'people', 'equipment', 'material', 'method', 'environment'
      description: '',
      confidence: 'medium' // 'low', 'medium', 'high'
    },
    
    // Action items
    actionItems: [
      {
        id: 1,
        action: '',
        type: 'corrective', // 'corrective', 'preventive', 'containment'
        assignee: '',
        dueDate: '',
        status: 'not-started', // 'not-started', 'in-progress', 'completed'
        priority: 'medium' // 'low', 'medium', 'high'
      }
    ],
    
    // Verification
    verification: {
      followUpDate: '',
      verificationMethod: '',
      effectivenessCheck: '',
      lessonsLearned: ''
    }
  });

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to 5 Whys Analysis! I'll help you systematically drill down to the root cause of problems using the simple but powerful 5 Whys technique. Start by clearly defining your problem, then ask 'Why?' five times to uncover the true root cause. Remember: focus on process failures, not people failures. What problem would you like to analyze?",
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
      if (whysData.projectName) completedFields++;
      if (whysData.analyst) completedFields++;
      if (whysData.analysisTeam) completedFields++;

      // Problem info
      totalFields += 3;
      if (whysData.problemInfo.problemStatement) completedFields++;
      if (whysData.problemInfo.impactDescription) completedFields++;
      if (whysData.problemInfo.whenOccurred) completedFields++;

      // 5 Whys analysis
      totalFields += 5;
      const completedWhys = whysData.whysAnalysis.filter(why => why.answer.trim() !== '').length;
      completedFields += completedWhys;

      // Root cause
      totalFields += 2;
      if (whysData.rootCause.identified) completedFields++;
      if (whysData.rootCause.description) completedFields++;

      // Action items
      totalFields += 1;
      const hasValidActions = whysData.actionItems.some(action => action.action.trim() !== '');
      if (hasValidActions) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [whysData]);

  // Auto-update questions based on previous answers
  useEffect(() => {
    const updateQuestions = () => {
      const updatedWhys = whysData.whysAnalysis.map((why, index) => {
        if (index === 0) {
          return { ...why, question: 'Why did this problem occur?' };
        } else if (index > 0 && whysData.whysAnalysis[index - 1].answer) {
          return { ...why, question: `Why ${whysData.whysAnalysis[index - 1].answer.toLowerCase()}?` };
        }
        return { ...why, question: 'Why did that happen?' };
      });

      setWhysData(prev => ({
        ...prev,
        whysAnalysis: updatedWhys
      }));
    };

    updateQuestions();
  }, [whysData.whysAnalysis.map(why => why.answer).join(',')]);

  // Handle field changes
  const handleBasicInfoChange = (field, value) => {
    setWhysData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleProblemInfoChange = (field, value) => {
    setWhysData(prev => ({
      ...prev,
      problemInfo: {
        ...prev.problemInfo,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleWhyChange = (whyId, field, value) => {
    setWhysData(prev => ({
      ...prev,
      whysAnalysis: prev.whysAnalysis.map(why =>
        why.id === whyId ? { ...why, [field]: value } : why
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleRootCauseChange = (field, value) => {
    setWhysData(prev => ({
      ...prev,
      rootCause: {
        ...prev.rootCause,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleActionItemChange = (actionId, field, value) => {
    setWhysData(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(action =>
        action.id === actionId ? { ...action, [field]: value } : action
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleVerificationChange = (field, value) => {
    setWhysData(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add new action item
  const addActionItem = () => {
    const newAction = {
      id: Date.now(),
      action: '',
      type: 'corrective',
      assignee: '',
      dueDate: '',
      status: 'not-started',
      priority: 'medium'
    };
    
    setWhysData(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, newAction],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove action item
  const removeActionItem = (actionId) => {
    if (whysData.actionItems.length > 1) {
      setWhysData(prev => ({
        ...prev,
        actionItems: prev.actionItems.filter(action => action.id !== actionId),
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
    }
  };

  // Generate sample data
  const generateSampleData = () => {
    const sampleData = {
      problemStatement: 'Customer complaints about delayed deliveries increased by 40% this month',
      impactDescription: 'Customer satisfaction scores dropped, potential loss of 3 key accounts',
      whenOccurred: 'Started 3 weeks ago, peak during week 2',
      whereOccurred: 'Distribution center and shipping department',
      whoInvolved: 'Shipping team, warehouse staff, logistics coordinator',
      whysAnalysis: [
        {
          id: 1,
          question: 'Why did this problem occur?',
          answer: 'packages are being shipped 2-3 days later than promised',
          evidence: 'Shipping logs show average 2.5 day delay vs promised dates',
          verified: true
        },
        {
          id: 2,
          question: 'Why packages are being shipped 2-3 days later than promised?',
          answer: 'warehouse picking process is taking longer than expected',
          evidence: 'Time studies show 45% increase in pick time per order',
          verified: true
        },
        {
          id: 3,
          question: 'Why warehouse picking process is taking longer than expected?',
          answer: 'new inventory management system is causing confusion',
          evidence: 'Staff interviews reveal 80% report system difficulties',
          verified: true
        },
        {
          id: 4,
          question: 'Why new inventory management system is causing confusion?',
          answer: 'staff received insufficient training on the new system',
          evidence: 'Training records show only 4 hours vs recommended 16 hours',
          verified: true
        },
        {
          id: 5,
          question: 'Why staff received insufficient training on the new system?',
          answer: 'training budget was cut to meet quarterly cost targets',
          evidence: 'Budget documents show 60% reduction in training allocation',
          verified: true
        }
      ],
      rootCause: {
        identified: 'Inadequate training budget allocation leading to insufficient staff preparation for system changes',
        category: 'process',
        description: 'The root cause is a process failure in budget planning that prioritized short-term cost savings over operational readiness, resulting in inadequate training for critical system changes.',
        confidence: 'high'
      }
    };

    setWhysData(prev => ({
      ...prev,
      problemInfo: {
        ...prev.problemInfo,
        ...sampleData
      },
      whysAnalysis: sampleData.whysAnalysis,
      rootCause: sampleData.rootCause,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Mock AI response generation
  const generateAIResponse = (userMessage) => {
    const responses = {
      '5 whys': "The 5 Whys is a simple root cause analysis technique. Ask 'Why?' five times to drill down from symptoms to root cause. Key tips: 1) Focus on process failures, not people, 2) Use facts and evidence, 3) Stop when you reach a process/system issue you can control, 4) Sometimes you need fewer or more than 5 whys.",
      'root cause': "A true root cause is the fundamental reason a problem occurred - if you fix it, the problem won't recur. Look for: Process gaps, System failures, Missing controls, Inadequate training, Poor communication. Avoid blaming people - focus on why the system allowed the error to happen.",
      'problem statement': "A good problem statement is specific, measurable, and factual. Include: What happened, When it happened, Where it occurred, How much/how often, Impact on customers/business. Avoid assumptions or solutions. Example: 'Customer complaints increased 40% in March due to 2-day delivery delays.'",
      'evidence': "Each 'why' answer needs evidence to be credible. Use: Data/metrics, Observations, Documents, Interviews, Physical evidence. Avoid assumptions or opinions. If you can't find evidence, investigate further or mark as unverified. Evidence makes your analysis defensible and actionable.",
      'verification': "Verify each answer by asking: Is this always true? What evidence supports this? Could there be other causes? Get input from people close to the process. Unverified answers can lead you down the wrong path and waste time on ineffective solutions.",
      'action items': "Good action items address the root cause, not just symptoms. Include: Specific action, Responsible person, Due date, Success criteria. Types: Corrective (fix the problem), Preventive (prevent recurrence), Containment (immediate protection). Focus on system/process changes.",
      'process vs people': "Focus on process failures, not people failures. Instead of 'John made an error,' ask 'Why was John able to make this error?' Look for: Missing procedures, Inadequate training, Poor communication, System gaps, Lack of checks. People work within systems - fix the system.",
      'when to stop': "Stop asking 'why' when you reach: 1) A process you can control and improve, 2) A root cause that, if fixed, prevents recurrence, 3) A point where further whys don't add value. Sometimes it's 3 whys, sometimes 7. The number isn't magic - reaching actionable root cause is.",
      'default': "I can help with any aspect of 5 Whys analysis. Ask about writing problem statements, asking effective whys, finding evidence, identifying root causes, or creating action plans. What would you like to know?"
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
    <div className={styles.whysContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>5 Whys Analysis</h1>
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
            <i className="fas fa-save"></i> Save Analysis
          </button>
          <button className={styles.exportBtn}>
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Section: 5 Whys Information + AI Helper */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>5 Whys Analysis Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={whysData.projectName}
                onChange={(e) => handleBasicInfoChange('projectName', e.target.value)}
                placeholder="Enter the project name for this 5 Whys analysis"
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
                  value={whysData.analyst}
                  onChange={(e) => handleBasicInfoChange('analyst', e.target.value)}
                  placeholder="Who is conducting this analysis?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Analysis Team <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={whysData.analysisTeam}
                  onChange={(e) => handleBasicInfoChange('analysisTeam', e.target.value)}
                  placeholder="List team members involved"
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
                  value={whysData.dateCreated}
                  onChange={(e) => handleBasicInfoChange('dateCreated', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Last Updated
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={whysData.lastUpdated}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  5 Whys AI Guide
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
                  placeholder="Ask me about 5 Whys analysis..."
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
                    onClick={() => handleQuickAction('What makes a good root cause?')}
                  >
                    Root Cause
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I find evidence for each why?')}
                  >
                    Evidence
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('When should I stop asking why?')}
                  >
                    When to Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Definition Section */}
        <div className={styles.problemDefinitionCard}>
          <div className={styles.sectionHeader}>
            <h2>Problem Definition</h2>
            <button className={styles.generateBtn} onClick={generateSampleData}>
              <i className="fas fa-random"></i> Sample Data
            </button>
          </div>

          <div className={styles.problemDefinitionGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Problem Statement <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.problemInfo.problemStatement}
                onChange={(e) => handleProblemInfoChange('problemStatement', e.target.value)}
                placeholder="Clearly describe what happened (be specific, factual, and measurable)"
                rows={3}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Impact Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.problemInfo.impactDescription}
                onChange={(e) => handleProblemInfoChange('impactDescription', e.target.value)}
                placeholder="Describe the impact on customers, business, safety, etc."
                rows={3}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                When Did It Occur? <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={whysData.problemInfo.whenOccurred}
                onChange={(e) => handleProblemInfoChange('whenOccurred', e.target.value)}
                placeholder="When did this problem first occur or when was it discovered?"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Where Did It Occur?
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={whysData.problemInfo.whereOccurred}
                onChange={(e) => handleProblemInfoChange('whereOccurred', e.target.value)}
                placeholder="Location, department, process step, etc."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Who Was Involved?
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={whysData.problemInfo.whoInvolved}
                onChange={(e) => handleProblemInfoChange('whoInvolved', e.target.value)}
                placeholder="People, teams, or roles involved"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Problem Category
              </label>
              <select
                className={styles.selectInput}
                value={whysData.problemInfo.problemCategory}
                onChange={(e) => handleProblemInfoChange('problemCategory', e.target.value)}
              >
                <option value="quality">Quality</option>
                <option value="safety">Safety</option>
                <option value="delivery">Delivery</option>
                <option value="cost">Cost</option>
                <option value="morale">Morale</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Frequency
              </label>
              <select
                className={styles.selectInput}
                value={whysData.problemInfo.frequency}
                onChange={(e) => handleProblemInfoChange('frequency', e.target.value)}
              >
                <option value="one-time">One-time occurrence</option>
                <option value="occasional">Occasional</option>
                <option value="frequent">Frequent</option>
                <option value="continuous">Continuous</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Severity
              </label>
              <select
                className={styles.selectInput}
                value={whysData.problemInfo.severity}
                onChange={(e) => handleProblemInfoChange('severity', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5 Whys Analysis Section */}
        <div className={styles.whysAnalysisCard}>
          <div className={styles.sectionHeader}>
            <h2>5 Whys Analysis</h2>
            <div className={styles.whysProgress}>
              <span className={styles.progressLabel}>
                Progress: {whysData.whysAnalysis.filter(why => why.answer.trim() !== '').length}/5 Whys
              </span>
            </div>
          </div>

          <div className={styles.whysChain}>
            {whysData.whysAnalysis.map((why, index) => (
              <div key={why.id} className={styles.whyCard}>
                <div className={styles.whyHeader}>
                  <div className={styles.whyNumber}>Why #{index + 1}</div>
                  <div className={styles.verificationStatus}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={why.verified}
                        onChange={(e) => handleWhyChange(why.id, 'verified', e.target.checked)}
                      />
                      Verified
                    </label>
                  </div>
                </div>

                <div className={styles.whyContent}>
                  <div className={styles.questionSection}>
                    <label className={styles.fieldLabel}>Question</label>
                    <div className={styles.questionText}>{why.question}</div>
                  </div>

                  <div className={styles.answerSection}>
                    <label className={styles.fieldLabel}>
                      Answer {index < 3 && <span className={styles.required}>*</span>}
                    </label>
                    <textarea
                      className={styles.textareaInput}
                      value={why.answer}
                      onChange={(e) => handleWhyChange(why.id, 'answer', e.target.value)}
                      placeholder="Provide a factual answer based on evidence..."
                      rows={2}
                    />
                  </div>

                  <div className={styles.evidenceSection}>
                    <label className={styles.fieldLabel}>Evidence/Source</label>
                    <textarea
                      className={styles.textareaInput}
                      value={why.evidence}
                      onChange={(e) => handleWhyChange(why.id, 'evidence', e.target.value)}
                      placeholder="What evidence supports this answer? (data, observations, documents, etc.)"
                      rows={2}
                    />
                  </div>
                </div>

                {index < whysData.whysAnalysis.length - 1 && why.answer && (
                  <div className={styles.whyConnector}>
                    <i className="fas fa-arrow-down"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Root Cause Section */}
        <div className={styles.rootCauseCard}>
          <div className={styles.sectionHeader}>
            <h2>Root Cause Identification</h2>
          </div>

          <div className={styles.rootCauseGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Root Cause Statement <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.rootCause.identified}
                onChange={(e) => handleRootCauseChange('identified', e.target.value)}
                placeholder="State the fundamental cause that, if addressed, will prevent recurrence"
                rows={3}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Root Cause Description
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.rootCause.description}
                onChange={(e) => handleRootCauseChange('description', e.target.value)}
                placeholder="Provide additional context and explanation of the root cause"
                rows={3}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Root Cause Category
              </label>
              <select
                className={styles.selectInput}
                value={whysData.rootCause.category}
                onChange={(e) => handleRootCauseChange('category', e.target.value)}
              >
                <option value="process">Process</option>
                <option value="people">People</option>
                <option value="equipment">Equipment</option>
                <option value="material">Material</option>
                <option value="method">Method</option>
                <option value="environment">Environment</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Confidence Level
              </label>
              <select
                className={styles.selectInput}
                value={whysData.rootCause.confidence}
                onChange={(e) => handleRootCauseChange('confidence', e.target.value)}
              >
                <option value="low">Low - Needs more investigation</option>
                <option value="medium">Medium - Reasonably confident</option>
                <option value="high">High - Very confident</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Items Section */}
        <div className={styles.actionItemsCard}>
          <div className={styles.sectionHeader}>
            <h2>Action Items</h2>
            <button className={styles.addBtn} onClick={addActionItem}>
              <i className="fas fa-plus"></i> Add Action
            </button>
          </div>

          <div className={styles.actionItemsGrid}>
            {whysData.actionItems.map((action, index) => (
              <div key={action.id} className={styles.actionItemCard}>
                <div className={styles.actionHeader}>
                  <h3>Action Item {index + 1}</h3>
                  {whysData.actionItems.length > 1 && (
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeActionItem(action.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                <div className={styles.actionFields}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                      Action Description {index === 0 && <span className={styles.required}>*</span>}
                    </label>
                    <textarea
                      className={styles.textareaInput}
                      value={action.action}
                      onChange={(e) => handleActionItemChange(action.id, 'action', e.target.value)}
                      placeholder="Describe the specific action to be taken"
                      rows={3}
                    />
                  </div>

                  <div className={styles.actionDetailsGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Action Type</label>
                      <select
                        className={styles.selectInput}
                        value={action.type}
                        onChange={(e) => handleActionItemChange(action.id, 'type', e.target.value)}
                      >
                        <option value="corrective">Corrective (Fix the problem)</option>
                        <option value="preventive">Preventive (Prevent recurrence)</option>
                        <option value="containment">Containment (Immediate protection)</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Assignee</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={action.assignee}
                        onChange={(e) => handleActionItemChange(action.id, 'assignee', e.target.value)}
                        placeholder="Who is responsible?"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Due Date</label>
                      <input
                        type="date"
                        className={styles.textInput}
                        value={action.dueDate}
                        onChange={(e) => handleActionItemChange(action.id, 'dueDate', e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Priority</label>
                      <select
                        className={styles.selectInput}
                        value={action.priority}
                        onChange={(e) => handleActionItemChange(action.id, 'priority', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Status</label>
                      <select
                        className={styles.selectInput}
                        value={action.status}
                        onChange={(e) => handleActionItemChange(action.id, 'status', e.target.value)}
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Section */}
        <div className={styles.verificationCard}>
          <div className={styles.sectionHeader}>
            <h2>Verification & Follow-up</h2>
          </div>

          <div className={styles.verificationGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Follow-up Date
              </label>
              <input
                type="date"
                className={styles.textInput}
                value={whysData.verification.followUpDate}
                onChange={(e) => handleVerificationChange('followUpDate', e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Verification Method
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.verification.verificationMethod}
                onChange={(e) => handleVerificationChange('verificationMethod', e.target.value)}
                placeholder="How will you verify that the actions were effective?"
                rows={3}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Effectiveness Check
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.verification.effectivenessCheck}
                onChange={(e) => handleVerificationChange('effectivenessCheck', e.target.value)}
                placeholder="What metrics or indicators will show the problem is solved?"
                rows={3}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Lessons Learned
              </label>
              <textarea
                className={styles.textareaInput}
                value={whysData.verification.lessonsLearned}
                onChange={(e) => handleVerificationChange('lessonsLearned', e.target.value)}
                placeholder="What did we learn that can prevent similar problems in the future?"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.completionStatus}>
            <i className="fas fa-check-circle"></i>
            <span>5 Whys Analysis {completionPercentage}% Complete</span>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.secondaryBtn}>
              <i className="fas fa-eye"></i> Preview Report
            </button>
            <button 
              className={styles.primaryBtn}
              disabled={completionPercentage < 70}
            >
              <i className="fas fa-check"></i> Complete Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveWhys;

