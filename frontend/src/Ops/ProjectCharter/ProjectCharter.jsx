import React, { useState, useEffect } from 'react';
import styles from './ProjectCharter.module.css';

const ProjectCharter = () => {
  // Form state for Project Charter fields
  const [charterData, setCharterData] = useState({
    projectName: '',
    projectLead: '',
    sponsor: '',
    teamMembers: [],
    businessCase: '',
    problemStatement: '',
    goalStatement: '',
    scope: {
      inScope: '',
      outOfScope: ''
    },
    timeline: {
      startDate: '',
      endDate: '',
      milestones: []
    },
    resources: {
      budget: '',
      personnel: '',
      equipment: ''
    },
    successMetrics: [],
    risks: [],
    stakeholders: []
  });

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your LSS AI mentor. I'll help you create a comprehensive Project Charter. Let's start with your project name and the business problem you're trying to solve.",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Mock AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState({
    problemStatement: '',
    goalStatement: '',
    scope: '',
    metrics: []
  });

  // Calculate completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      const requiredFields = [
        charterData.projectName,
        charterData.projectLead,
        charterData.sponsor,
        charterData.businessCase,
        charterData.problemStatement,
        charterData.goalStatement,
        charterData.scope.inScope,
        charterData.timeline.startDate,
        charterData.timeline.endDate
      ];
      
      const completedFields = requiredFields.filter(field => field && field.trim() !== '').length;
      const percentage = Math.round((completedFields / requiredFields.length) * 100);
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [charterData]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCharterData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCharterData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Mock AI response generation
  const generateAIResponse = (userMessage) => {
    const responses = {
      'project name': "Great! For your project name, consider something specific and action-oriented. For example: 'Reduce Customer Service Response Time' or 'Improve Manufacturing Quality Control'. What specific process or problem are you focusing on?",
      'problem': "A strong problem statement should be specific, measurable, and focused on the gap between current and desired performance. Try this format: 'Currently [current state], but we need [desired state] because [business impact]'. What's the specific problem you're observing?",
      'goal': "Your goal statement should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound). For example: 'Reduce customer service response time from 24 hours to 4 hours by Q4 2024, resulting in improved customer satisfaction scores.' What specific improvement are you targeting?",
      'scope': "Scope definition is crucial for project success. In-scope should include specific processes, departments, or systems you'll focus on. Out-of-scope should clearly state what you won't address to prevent scope creep. What boundaries do you want to set?",
      'default': "I can help you with any aspect of your Project Charter. Try asking about problem statements, goal setting, scope definition, or team structure. What would you like to work on next?"
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

  // Handle AI suggestions
  const applySuggestion = (field, suggestion) => {
    handleFieldChange(field, suggestion);
  };

  // Mock AI suggestions based on current data
  const generateSuggestions = () => {
    if (charterData.businessCase && !charterData.problemStatement) {
      setAiSuggestions(prev => ({
        ...prev,
        problemStatement: `Based on your business case, consider: "Currently, ${charterData.businessCase.toLowerCase()} is causing delays and inefficiencies, but we need streamlined processes to improve customer satisfaction and reduce costs."`
      }));
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, [charterData.businessCase]);

  return (
    <div className={styles.projectCharterContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Project Charter</h1>
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

      <div className={styles.mainContent}>
        {/* Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h2>Project Information</h2>
            
            {/* Project Name */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={charterData.projectName}
                onChange={(e) => handleFieldChange('projectName', e.target.value)}
                placeholder="Enter a descriptive project name"
              />
            </div>

            {/* Project Lead & Sponsor */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Project Lead <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={charterData.projectLead}
                  onChange={(e) => handleFieldChange('projectLead', e.target.value)}
                  placeholder="Project lead name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Executive Sponsor <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={charterData.sponsor}
                  onChange={(e) => handleFieldChange('sponsor', e.target.value)}
                  placeholder="Executive sponsor name"
                />
              </div>
            </div>

            {/* Business Case */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Business Case <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textArea}
                value={charterData.businessCase}
                onChange={(e) => handleFieldChange('businessCase', e.target.value)}
                placeholder="Describe the business justification for this project..."
                rows={4}
              />
            </div>

            {/* Problem Statement */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Problem Statement <span className={styles.required}>*</span>
              </label>
              {aiSuggestions.problemStatement && (
                <div className={styles.aiSuggestion}>
                  <div className={styles.suggestionHeader}>
                    <i className="fas fa-lightbulb"></i>
                    <span>AI Suggestion</span>
                  </div>
                  <p>{aiSuggestions.problemStatement}</p>
                  <button 
                    className={styles.applySuggestionBtn}
                    onClick={() => applySuggestion('problemStatement', aiSuggestions.problemStatement)}
                  >
                    Apply Suggestion
                  </button>
                </div>
              )}
              <textarea
                className={styles.textArea}
                value={charterData.problemStatement}
                onChange={(e) => handleFieldChange('problemStatement', e.target.value)}
                placeholder="Clearly define the problem this project will solve..."
                rows={4}
              />
            </div>

            {/* Goal Statement */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Goal Statement <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textArea}
                value={charterData.goalStatement}
                onChange={(e) => handleFieldChange('goalStatement', e.target.value)}
                placeholder="Define SMART goals for this project..."
                rows={3}
              />
            </div>

            {/* Scope */}
            <div className={styles.scopeSection}>
              <h3>Project Scope</h3>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>In Scope</label>
                  <textarea
                    className={styles.textArea}
                    value={charterData.scope.inScope}
                    onChange={(e) => handleFieldChange('scope.inScope', e.target.value)}
                    placeholder="What will be included in this project..."
                    rows={4}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Out of Scope</label>
                  <textarea
                    className={styles.textArea}
                    value={charterData.scope.outOfScope}
                    onChange={(e) => handleFieldChange('scope.outOfScope', e.target.value)}
                    placeholder="What will NOT be included..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.timelineSection}>
              <h3>Project Timeline</h3>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Start Date</label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={charterData.timeline.startDate}
                    onChange={(e) => handleFieldChange('timeline.startDate', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Target End Date</label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={charterData.timeline.endDate}
                    onChange={(e) => handleFieldChange('timeline.endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className={styles.resourcesSection}>
              <h3>Required Resources</h3>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Budget</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={charterData.resources.budget}
                  onChange={(e) => handleFieldChange('resources.budget', e.target.value)}
                  placeholder="Estimated budget requirements"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Personnel</label>
                <textarea
                  className={styles.textArea}
                  value={charterData.resources.personnel}
                  onChange={(e) => handleFieldChange('resources.personnel', e.target.value)}
                  placeholder="Team members and their roles..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Section */}
        <div className={styles.chatSection}>
          <div className={styles.chatCard}>
            <div className={styles.chatHeader}>
              <h3>
                <i className="fas fa-robot"></i>
                AI LSS Mentor
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
                placeholder="Ask me about any aspect of your Project Charter..."
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
                  onClick={() => setCurrentMessage('Help me write a problem statement')}
                >
                  Problem Statement
                </button>
                <button 
                  className={styles.quickBtn}
                  onClick={() => setCurrentMessage('How do I define project scope?')}
                >
                  Define Scope
                </button>
                <button 
                  className={styles.quickBtn}
                  onClick={() => setCurrentMessage('What makes a good goal statement?')}
                >
                  SMART Goals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.completionStatus}>
            <i className={`fas ${completionPercentage === 100 ? 'fa-check-circle' : 'fa-clock'}`}></i>
            <span>
              {completionPercentage === 100 
                ? 'Charter Complete - Ready for Review' 
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

export default ProjectCharter;

