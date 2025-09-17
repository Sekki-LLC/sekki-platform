import React, { useState, useEffect } from 'react';
import styles from './VoiceOfCustomer.module.css';

const VoiceOfCustomer = () => {
  // VOC data structure
  const [vocData, setVocData] = useState({
    projectName: '',
    customerSegment: '',
    vocTeam: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Customer interviews
    interviews: [],
    
    // Customer requirements
    requirements: [],
    
    // CTQ (Critical to Quality) tree
    ctqTree: {
      customerNeeds: [],
      drivers: [],
      ctqs: []
    },
    
    // Kano analysis
    kanoCategories: {
      basic: [],
      performance: [],
      excitement: [],
      indifferent: [],
      reverse: []
    }
  });

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Voice of Customer analysis! I'll help you capture and analyze customer requirements effectively. Let's start by identifying your customer segment and gathering their voice. What customer group are you focusing on for this project?",
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
      if (vocData.projectName) completedFields++;
      if (vocData.customerSegment) completedFields++;
      if (vocData.vocTeam) completedFields++;

      // Interviews
      totalFields += 1;
      if (vocData.interviews.length > 0) completedFields++;

      // Requirements
      totalFields += 1;
      if (vocData.requirements.length > 0) completedFields++;

      // CTQ Tree
      totalFields += 3;
      if (vocData.ctqTree.customerNeeds.length > 0) completedFields++;
      if (vocData.ctqTree.drivers.length > 0) completedFields++;
      if (vocData.ctqTree.ctqs.length > 0) completedFields++;

      // Kano analysis
      totalFields += 1;
      const kanoTotal = Object.values(vocData.kanoCategories).reduce((sum, arr) => sum + arr.length, 0);
      if (kanoTotal > 0) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [vocData]);

  // Handle field changes
  const handleBasicInfoChange = (field, value) => {
    setVocData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle interviews
  const addInterview = () => {
    const newInterview = {
      id: Date.now(),
      customerName: '',
      role: '',
      date: new Date().toISOString().split('T')[0],
      method: 'in-person', // 'in-person', 'phone', 'video', 'survey'
      keyFindings: '',
      painPoints: '',
      expectations: '',
      satisfactionLevel: 5
    };
    setVocData(prev => ({
      ...prev,
      interviews: [...prev.interviews, newInterview],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const updateInterview = (id, field, value) => {
    setVocData(prev => ({
      ...prev,
      interviews: prev.interviews.map(interview =>
        interview.id === id ? { ...interview, [field]: value } : interview
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const removeInterview = (id) => {
    setVocData(prev => ({
      ...prev,
      interviews: prev.interviews.filter(interview => interview.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle requirements
  const addRequirement = () => {
    const newRequirement = {
      id: Date.now(),
      requirement: '',
      source: '',
      priority: 'medium', // 'high', 'medium', 'low'
      category: 'functional', // 'functional', 'performance', 'usability', 'reliability'
      measurable: '',
      notes: ''
    };
    setVocData(prev => ({
      ...prev,
      requirements: [...prev.requirements, newRequirement],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const updateRequirement = (id, field, value) => {
    setVocData(prev => ({
      ...prev,
      requirements: prev.requirements.map(req =>
        req.id === id ? { ...req, [field]: value } : req
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const removeRequirement = (id) => {
    setVocData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle CTQ Tree
  const addCTQItem = (category) => {
    const newItem = {
      id: Date.now(),
      text: '',
      description: ''
    };
    setVocData(prev => ({
      ...prev,
      ctqTree: {
        ...prev.ctqTree,
        [category]: [...prev.ctqTree[category], newItem]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const updateCTQItem = (category, id, field, value) => {
    setVocData(prev => ({
      ...prev,
      ctqTree: {
        ...prev.ctqTree,
        [category]: prev.ctqTree[category].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const removeCTQItem = (category, id) => {
    setVocData(prev => ({
      ...prev,
      ctqTree: {
        ...prev.ctqTree,
        [category]: prev.ctqTree[category].filter(item => item.id !== id)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle Kano analysis
  const addKanoItem = (category) => {
    const newItem = {
      id: Date.now(),
      feature: '',
      description: '',
      impact: 'medium' // 'high', 'medium', 'low'
    };
    setVocData(prev => ({
      ...prev,
      kanoCategories: {
        ...prev.kanoCategories,
        [category]: [...prev.kanoCategories[category], newItem]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const updateKanoItem = (category, id, field, value) => {
    setVocData(prev => ({
      ...prev,
      kanoCategories: {
        ...prev.kanoCategories,
        [category]: prev.kanoCategories[category].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const removeKanoItem = (category, id) => {
    setVocData(prev => ({
      ...prev,
      kanoCategories: {
        ...prev.kanoCategories,
        [category]: prev.kanoCategories[category].filter(item => item.id !== id)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Mock AI response generation
  const generateAIResponse = (userMessage) => {
    const responses = {
      'customer segment': "Great question! Customer segmentation is crucial for effective VOC. Consider segmenting by: demographics (age, income), behavior (usage patterns, preferences), needs (what problems they're solving), or value (price sensitivity). Start with your primary customer group - who uses your product/service most frequently?",
      'interview': "Effective customer interviews should be structured but conversational. Use open-ended questions like: 'Tell me about your experience with...', 'What frustrates you most about...', 'If you could change one thing...'. Listen for emotions and pain points, not just features. Aim for 5-10 interviews per customer segment.",
      'ctq': "CTQ (Critical to Quality) characteristics are measurable features that directly impact customer satisfaction. They flow from Customer Needs → Drivers → CTQs. For example: Need='Fast service' → Driver='Quick response time' → CTQ='Response within 2 minutes'. Make CTQs specific and measurable.",
      'kano': "The Kano model categorizes features by customer satisfaction impact: Basic (must-haves), Performance (more is better), Excitement (delighters), Indifferent (don't care), Reverse (less is better). Use surveys asking 'How do you feel if this feature is present/absent?' to categorize requirements.",
      'requirements': "Good customer requirements should be: Specific (clear and unambiguous), Measurable (quantifiable), Achievable (realistic), Relevant (important to customers), and Traceable (linked to customer voice). Avoid solution-focused language - focus on the customer need or outcome.",
      'pain points': "Customer pain points often fall into categories: Process (too many steps), Time (takes too long), Cost (too expensive), Quality (doesn't work well), or Experience (frustrating to use). Dig deeper with 'Why?' questions to understand root causes behind stated problems.",
      'default': "I can help you with any aspect of Voice of Customer analysis. Try asking about customer segmentation, interview techniques, CTQ trees, Kano analysis, requirement writing, or identifying pain points. What would you like to explore?"
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
    <div className={styles.vocContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Voice of Customer</h1>
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
        {/* Top Section: VOC Information + AI Helper */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>VOC Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={vocData.projectName}
                onChange={(e) => handleBasicInfoChange('projectName', e.target.value)}
                placeholder="Enter the project name for this VOC analysis"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Customer Segment <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={vocData.customerSegment}
                onChange={(e) => handleBasicInfoChange('customerSegment', e.target.value)}
                placeholder="Define the target customer segment (e.g., Enterprise users, Small businesses)"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  VOC Team <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={vocData.vocTeam}
                  onChange={(e) => handleBasicInfoChange('vocTeam', e.target.value)}
                  placeholder="List team members conducting VOC analysis"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={vocData.dateCreated}
                  onChange={(e) => handleBasicInfoChange('dateCreated', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  VOC AI Guide
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
                  placeholder="Ask me about VOC analysis..."
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
                    onClick={() => handleQuickAction('How do I identify customer segments?')}
                  >
                    Customer Segmentation
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What are good interview techniques?')}
                  >
                    Interview Techniques
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('Explain CTQ trees')}
                  >
                    CTQ Analysis
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How does Kano analysis work?')}
                  >
                    Kano Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Interviews Section */}
        <div className={styles.interviewsCard}>
          <div className={styles.sectionHeader}>
            <h2>Customer Interviews</h2>
            <button className={styles.addBtn} onClick={addInterview}>
              <i className="fas fa-plus"></i> Add Interview
            </button>
          </div>

          <div className={styles.interviewsList}>
            {vocData.interviews.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-comments"></i>
                <p>No customer interviews yet. Click "Add Interview" to start capturing customer voice.</p>
              </div>
            ) : (
              vocData.interviews.map((interview) => (
                <div key={interview.id} className={styles.interviewItem}>
                  <div className={styles.interviewHeader}>
                    <input
                      type="text"
                      className={styles.customerName}
                      value={interview.customerName}
                      onChange={(e) => updateInterview(interview.id, 'customerName', e.target.value)}
                      placeholder="Customer Name"
                    />
                    <input
                      type="text"
                      className={styles.customerRole}
                      value={interview.role}
                      onChange={(e) => updateInterview(interview.id, 'role', e.target.value)}
                      placeholder="Role/Title"
                    />
                    <input
                      type="date"
                      className={styles.interviewDate}
                      value={interview.date}
                      onChange={(e) => updateInterview(interview.id, 'date', e.target.value)}
                    />
                    <select
                      className={styles.methodSelect}
                      value={interview.method}
                      onChange={(e) => updateInterview(interview.id, 'method', e.target.value)}
                    >
                      <option value="in-person">In-Person</option>
                      <option value="phone">Phone</option>
                      <option value="video">Video Call</option>
                      <option value="survey">Survey</option>
                    </select>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeInterview(interview.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className={styles.interviewDetails}>
                    <div className={styles.detailField}>
                      <label>Key Findings</label>
                      <textarea
                        value={interview.keyFindings}
                        onChange={(e) => updateInterview(interview.id, 'keyFindings', e.target.value)}
                        placeholder="What were the main insights from this interview?"
                      />
                    </div>
                    <div className={styles.detailField}>
                      <label>Pain Points</label>
                      <textarea
                        value={interview.painPoints}
                        onChange={(e) => updateInterview(interview.id, 'painPoints', e.target.value)}
                        placeholder="What problems or frustrations did the customer mention?"
                      />
                    </div>
                    <div className={styles.detailField}>
                      <label>Expectations</label>
                      <textarea
                        value={interview.expectations}
                        onChange={(e) => updateInterview(interview.id, 'expectations', e.target.value)}
                        placeholder="What does the customer expect from the solution?"
                      />
                    </div>
                    <div className={styles.satisfactionField}>
                      <label>Current Satisfaction Level</label>
                      <div className={styles.satisfactionSlider}>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={interview.satisfactionLevel}
                          onChange={(e) => updateInterview(interview.id, 'satisfactionLevel', parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <span className={styles.sliderValue}>{interview.satisfactionLevel}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Requirements Section */}
        <div className={styles.requirementsCard}>
          <div className={styles.sectionHeader}>
            <h2>Customer Requirements</h2>
            <button className={styles.addBtn} onClick={addRequirement}>
              <i className="fas fa-plus"></i> Add Requirement
            </button>
          </div>

          <div className={styles.requirementsList}>
            {vocData.requirements.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-list-check"></i>
                <p>No requirements captured yet. Add customer requirements based on your interviews and analysis.</p>
              </div>
            ) : (
              vocData.requirements.map((requirement) => (
                <div key={requirement.id} className={styles.requirementItem}>
                  <div className={styles.requirementHeader}>
                    <input
                      type="text"
                      className={styles.requirementText}
                      value={requirement.requirement}
                      onChange={(e) => updateRequirement(requirement.id, 'requirement', e.target.value)}
                      placeholder="Customer requirement statement"
                    />
                    <select
                      className={styles.prioritySelect}
                      value={requirement.priority}
                      onChange={(e) => updateRequirement(requirement.id, 'priority', e.target.value)}
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <select
                      className={styles.categorySelect}
                      value={requirement.category}
                      onChange={(e) => updateRequirement(requirement.id, 'category', e.target.value)}
                    >
                      <option value="functional">Functional</option>
                      <option value="performance">Performance</option>
                      <option value="usability">Usability</option>
                      <option value="reliability">Reliability</option>
                    </select>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeRequirement(requirement.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className={styles.requirementDetails}>
                    <div className={styles.detailField}>
                      <label>Source</label>
                      <input
                        type="text"
                        value={requirement.source}
                        onChange={(e) => updateRequirement(requirement.id, 'source', e.target.value)}
                        placeholder="Where did this requirement come from? (Interview, survey, etc.)"
                      />
                    </div>
                    <div className={styles.detailField}>
                      <label>Measurable Criteria</label>
                      <input
                        type="text"
                        value={requirement.measurable}
                        onChange={(e) => updateRequirement(requirement.id, 'measurable', e.target.value)}
                        placeholder="How will this requirement be measured?"
                      />
                    </div>
                    <div className={styles.detailField}>
                      <label>Notes</label>
                      <textarea
                        value={requirement.notes}
                        onChange={(e) => updateRequirement(requirement.id, 'notes', e.target.value)}
                        placeholder="Additional context or notes about this requirement"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTQ Tree Section */}
        <div className={styles.ctqCard}>
          <div className={styles.sectionHeader}>
            <h2>CTQ (Critical to Quality) Tree</h2>
            <div className={styles.ctqInfo}>
              <i className="fas fa-info-circle"></i>
              <span>Customer Needs → Drivers → CTQs (Measurable)</span>
            </div>
          </div>

          <div className={styles.ctqTree}>
            {/* Customer Needs */}
            <div className={styles.ctqLevel}>
              <div className={styles.ctqLevelHeader}>
                <h3>Customer Needs</h3>
                <button 
                  className={styles.addCTQBtn}
                  onClick={() => addCTQItem('customerNeeds')}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className={styles.ctqItems}>
                {vocData.ctqTree.customerNeeds.map((need) => (
                  <div key={need.id} className={styles.ctqItem}>
                    <input
                      type="text"
                      value={need.text}
                      onChange={(e) => updateCTQItem('customerNeeds', need.id, 'text', e.target.value)}
                      placeholder="What does the customer need?"
                      className={styles.ctqInput}
                    />
                    <button 
                      className={styles.removeCTQBtn}
                      onClick={() => removeCTQItem('customerNeeds', need.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Drivers */}
            <div className={styles.ctqLevel}>
              <div className={styles.ctqLevelHeader}>
                <h3>Drivers</h3>
                <button 
                  className={styles.addCTQBtn}
                  onClick={() => addCTQItem('drivers')}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className={styles.ctqItems}>
                {vocData.ctqTree.drivers.map((driver) => (
                  <div key={driver.id} className={styles.ctqItem}>
                    <input
                      type="text"
                      value={driver.text}
                      onChange={(e) => updateCTQItem('drivers', driver.id, 'text', e.target.value)}
                      placeholder="What drives this need?"
                      className={styles.ctqInput}
                    />
                    <button 
                      className={styles.removeCTQBtn}
                      onClick={() => removeCTQItem('drivers', driver.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTQs */}
            <div className={styles.ctqLevel}>
              <div className={styles.ctqLevelHeader}>
                <h3>CTQs (Measurable)</h3>
                <button 
                  className={styles.addCTQBtn}
                  onClick={() => addCTQItem('ctqs')}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className={styles.ctqItems}>
                {vocData.ctqTree.ctqs.map((ctq) => (
                  <div key={ctq.id} className={styles.ctqItem}>
                    <input
                      type="text"
                      value={ctq.text}
                      onChange={(e) => updateCTQItem('ctqs', ctq.id, 'text', e.target.value)}
                      placeholder="How will this be measured? (specific metric)"
                      className={styles.ctqInput}
                    />
                    <button 
                      className={styles.removeCTQBtn}
                      onClick={() => removeCTQItem('ctqs', ctq.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kano Analysis Section */}
        <div className={styles.kanoCard}>
          <div className={styles.sectionHeader}>
            <h2>Kano Analysis</h2>
            <div className={styles.kanoInfo}>
              <i className="fas fa-info-circle"></i>
              <span>Categorize features by customer satisfaction impact</span>
            </div>
          </div>

          <div className={styles.kanoGrid}>
            {Object.entries(vocData.kanoCategories).map(([category, items]) => (
              <div key={category} className={styles.kanoCategory}>
                <div className={styles.kanoCategoryHeader}>
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <span className={styles.kanoDescription}>
                    {category === 'basic' && 'Must-have features'}
                    {category === 'performance' && 'More is better'}
                    {category === 'excitement' && 'Delighters'}
                    {category === 'indifferent' && "Customers don't care"}
                    {category === 'reverse' && 'Less is better'}
                  </span>
                  <button 
                    className={styles.addKanoBtn}
                    onClick={() => addKanoItem(category)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>

                <div className={styles.kanoItems}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.kanoItem}>
                      <div className={styles.kanoItemHeader}>
                        <input
                          type="text"
                          value={item.feature}
                          onChange={(e) => updateKanoItem(category, item.id, 'feature', e.target.value)}
                          placeholder="Feature name"
                          className={styles.kanoFeature}
                        />
                        <select
                          className={styles.kanoImpact}
                          value={item.impact}
                          onChange={(e) => updateKanoItem(category, item.id, 'impact', e.target.value)}
                        >
                          <option value="high">High Impact</option>
                          <option value="medium">Medium Impact</option>
                          <option value="low">Low Impact</option>
                        </select>
                        <button 
                          className={styles.removeKanoBtn}
                          onClick={() => removeKanoItem(category, item.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateKanoItem(category, item.id, 'description', e.target.value)}
                        placeholder="Describe this feature and why it fits this category"
                        className={styles.kanoDescription}
                      />
                    </div>
                  ))}
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
            <i className="fas fa-check-circle"></i>
            <span>VOC Analysis {completionPercentage}% Complete</span>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.secondaryBtn}>
              <i className="fas fa-eye"></i> Preview
            </button>
            <button 
              className={styles.primaryBtn}
              disabled={completionPercentage < 80}
            >
              <i className="fas fa-check"></i> Complete VOC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceOfCustomer;

