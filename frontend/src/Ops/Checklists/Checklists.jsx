import React, { useState, useEffect } from 'react';
import styles from './Checklists.module.css';

const Checklist = () => {
  // Checklist data structure
  const [checklistData, setChecklistData] = useState({
    // Project Information
    checklistTitle: '',
    creator: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Checklist Configuration
    checklistConfig: {
      purpose: '',
      scope: '',
      frequency: 'one-time', // 'one-time', 'daily', 'weekly', 'monthly', 'as-needed'
      priority: 'medium', // 'low', 'medium', 'high', 'critical'
      category: 'quality', // 'quality', 'safety', 'process', 'maintenance', 'audit'
      estimatedTime: '',
      requiredSkills: '',
      approvalRequired: false
    },
    
    // Checklist Sections
    sections: [
      {
        id: 1,
        title: 'Preparation',
        description: 'Initial setup and preparation tasks',
        items: [
          {
            id: 1,
            text: '',
            completed: false,
            required: true,
            notes: '',
            assignee: '',
            dueDate: '',
            priority: 'medium'
          }
        ],
        collapsed: false
      }
    ],
    
    // Progress Tracking
    progress: {
      totalItems: 0,
      completedItems: 0,
      completionPercentage: 0,
      startDate: '',
      targetDate: '',
      actualCompletionDate: '',
      status: 'not-started' // 'not-started', 'in-progress', 'completed', 'overdue'
    },
    
    // Quality Control
    qualityControl: {
      reviewRequired: false,
      reviewer: '',
      reviewDate: '',
      reviewNotes: '',
      approved: false,
      approver: '',
      approvalDate: '',
      rejectionReason: ''
    },
    
    // Documentation
    documentation: {
      completionNotes: '',
      lessonsLearned: '',
      improvements: '',
      nextActions: '',
      attachments: []
    }
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching other tools structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Checklist Management! I'll help you create comprehensive checklists for quality control, process verification, and task management. Effective checklists ensure consistency, reduce errors, and improve compliance. What type of checklist are you creating?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'checklist': "Effective checklists have clear, actionable items with specific criteria. Use simple language, logical order, and include verification steps. Consider who will use it and in what conditions.",
      'quality': "Quality checklists should include verification points, measurement criteria, and clear pass/fail conditions. Include inspection steps, documentation requirements, and escalation procedures for non-conformances.",
      'safety': "Safety checklists are critical for preventing incidents. Include all safety equipment checks, environmental assessments, emergency procedures, and mandatory safety protocols. Never skip safety items.",
      'process': "Process checklists ensure consistency and compliance. Include all critical steps, decision points, quality checks, and handoff procedures. Consider process variations and exception handling.",
      'items': "Good checklist items are specific, measurable, and actionable. Use active verbs, include acceptance criteria, and specify who does what. Avoid vague language like 'check if okay'.",
      'review': "Checklist reviews ensure accuracy and completeness. Have subject matter experts review content, test the checklist in real conditions, and gather feedback from users. Update based on lessons learned.",
      'completion': "Track completion rates, time to complete, and common failure points. Use this data to improve the checklist. Consider digital tracking for better analytics and accountability.",
      'default': "I can help you with checklist design, item creation, quality control, progress tracking, or completion verification. What specific aspect would you like guidance on?"
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
      if (checklistData.checklistTitle) completedFields++;
      if (checklistData.creator) completedFields++;
      if (checklistData.checklistConfig.purpose) completedFields++;

      // Configuration (2 fields)
      totalFields += 2;
      if (checklistData.checklistConfig.scope) completedFields++;
      if (checklistData.checklistConfig.category) completedFields++;

      // Sections and items (2 fields)
      totalFields += 2;
      const hasItems = checklistData.sections.some(section => 
        section.items.some(item => item.text.trim() !== '')
      );
      if (hasItems) completedFields++;
      if (checklistData.sections.length > 1) completedFields++;

      // Progress tracking (1 field)
      totalFields += 1;
      if (checklistData.progress.targetDate) completedFields++;

      // Documentation (2 fields)
      totalFields += 2;
      if (checklistData.documentation.completionNotes) completedFields++;
      if (checklistData.documentation.improvements) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);

      // Update progress tracking
      const totalItems = checklistData.sections.reduce((total, section) => 
        total + section.items.filter(item => item.text.trim() !== '').length, 0
      );
      const completedItems = checklistData.sections.reduce((total, section) => 
        total + section.items.filter(item => item.completed && item.text.trim() !== '').length, 0
      );
      const itemCompletionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      setChecklistData(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          totalItems,
          completedItems,
          completionPercentage: itemCompletionPercentage,
          status: itemCompletionPercentage === 100 ? 'completed' : 
                  itemCompletionPercentage > 0 ? 'in-progress' : 'not-started'
        }
      }));
    };

    calculateCompletion();
  }, [checklistData.checklistTitle, checklistData.creator, checklistData.checklistConfig, checklistData.sections, checklistData.progress.targetDate, checklistData.documentation]);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setChecklistData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle config changes
  const handleConfigChange = (field, value) => {
    setChecklistData(prev => ({
      ...prev,
      checklistConfig: {
        ...prev.checklistConfig,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle section changes
  const handleSectionChange = (sectionId, field, value) => {
    setChecklistData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle item changes
  const handleItemChange = (sectionId, itemId, field, value) => {
    setChecklistData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          items: section.items.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
          )
        } : section
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add section
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${checklistData.sections.length + 1}`,
      description: '',
      items: [
        {
          id: Date.now() + 1,
          text: '',
          completed: false,
          required: true,
          notes: '',
          assignee: '',
          dueDate: '',
          priority: 'medium'
        }
      ],
      collapsed: false
    };
    
    setChecklistData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove section
  const removeSection = (sectionId) => {
    if (checklistData.sections.length > 1) {
      setChecklistData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId),
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
    }
  };

  // Add item to section
  const addItem = (sectionId) => {
    const newItem = {
      id: Date.now(),
      text: '',
      completed: false,
      required: true,
      notes: '',
      assignee: '',
      dueDate: '',
      priority: 'medium'
    };
    
    setChecklistData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          items: [...section.items, newItem]
        } : section
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove item from section
  const removeItem = (sectionId, itemId) => {
    setChecklistData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        } : section
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Toggle section collapse
  const toggleSectionCollapse = (sectionId) => {
    setChecklistData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, collapsed: !section.collapsed } : section
      )
    }));
  };

  // Handle progress changes
  const handleProgressChange = (field, value) => {
    setChecklistData(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle quality control changes
  const handleQualityControlChange = (field, value) => {
    setChecklistData(prev => ({
      ...prev,
      qualityControl: {
        ...prev.qualityControl,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle documentation changes
  const handleDocumentationChange = (field, value) => {
    setChecklistData(prev => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Save draft
  const handleSave = () => {
    console.log('Saving Checklist draft:', checklistData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting Checklist to PDF:', checklistData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to other tools */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Checklist Management</h1>
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
        {/* Top Section: Checklist Information + AI Helper - Exact match to other tools */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Checklist Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Checklist Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={checklistData.checklistTitle}
                onChange={(e) => handleBasicInfoChange('checklistTitle', e.target.value)}
                placeholder="Enter the title for your checklist"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Creator <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={checklistData.creator}
                  onChange={(e) => handleBasicInfoChange('creator', e.target.value)}
                  placeholder="Who is creating this checklist?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={checklistData.dateCreated}
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
                value={checklistData.checklistConfig.purpose}
                onChange={(e) => handleConfigChange('purpose', e.target.value)}
                placeholder="What is the purpose of this checklist?"
                rows={2}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Category</label>
                <select
                  className={styles.selectInput}
                  value={checklistData.checklistConfig.category}
                  onChange={(e) => handleConfigChange('category', e.target.value)}
                >
                  <option value="quality">Quality Control</option>
                  <option value="safety">Safety</option>
                  <option value="process">Process</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="audit">Audit</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Priority</label>
                <select
                  className={styles.selectInput}
                  value={checklistData.checklistConfig.priority}
                  onChange={(e) => handleConfigChange('priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Frequency</label>
                <select
                  className={styles.selectInput}
                  value={checklistData.checklistConfig.frequency}
                  onChange={(e) => handleConfigChange('frequency', e.target.value)}
                >
                  <option value="one-time">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Estimated Time</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={checklistData.checklistConfig.estimatedTime}
                  onChange={(e) => handleConfigChange('estimatedTime', e.target.value)}
                  placeholder="e.g., 30 minutes"
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  Checklist AI Guide
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
                  placeholder="Ask me about checklists..."
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
                    onClick={() => handleQuickAction('How do I create effective checklist items?')}
                  >
                    Effective Items
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What makes a good quality checklist?')}
                  >
                    Quality Checklists
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I track completion?')}
                  >
                    Track Progress
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How should I review checklists?')}
                  >
                    Review Process
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What are safety checklist best practices?')}
                  >
                    Safety Best Practices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview Section */}
        <div className={styles.analysisCard}>
          <h2>Progress Overview</h2>
          <div className={styles.progressGrid}>
            <div className={styles.progressStats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{checklistData.progress.totalItems}</div>
                <div className={styles.statLabel}>Total Items</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{checklistData.progress.completedItems}</div>
                <div className={styles.statLabel}>Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{checklistData.progress.completionPercentage}%</div>
                <div className={styles.statLabel}>Progress</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statNumber} ${styles[checklistData.progress.status]}`}>
                  {checklistData.progress.status.replace('-', ' ').toUpperCase()}
                </div>
                <div className={styles.statLabel}>Status</div>
              </div>
            </div>
            <div className={styles.progressDates}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Start Date</label>
                  <input
                    type="date"
                    className={styles.textInput}
                    value={checklistData.progress.startDate}
                    onChange={(e) => handleProgressChange('startDate', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Target Date</label>
                  <input
                    type="date"
                    className={styles.textInput}
                    value={checklistData.progress.targetDate}
                    onChange={(e) => handleProgressChange('targetDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Sections */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Checklist Items</h2>
            <button className={styles.addBtn} onClick={addSection}>
              <i className="fas fa-plus"></i> Add Section
            </button>
          </div>
          
          <div className={styles.checklistSections}>
            {checklistData.sections.map((section) => (
              <div key={section.id} className={styles.checklistSection}>
                <div className={styles.sectionHeaderRow}>
                  <div className={styles.sectionTitleGroup}>
                    <button
                      className={styles.collapseBtn}
                      onClick={() => toggleSectionCollapse(section.id)}
                    >
                      <i className={`fas fa-chevron-${section.collapsed ? 'right' : 'down'}`}></i>
                    </button>
                    <input
                      type="text"
                      className={styles.sectionTitleInput}
                      value={section.title}
                      onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                      placeholder="Section title"
                    />
                  </div>
                  <div className={styles.sectionActions}>
                    <button
                      className={styles.addItemBtn}
                      onClick={() => addItem(section.id)}
                    >
                      <i className="fas fa-plus"></i> Add Item
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeSection(section.id)}
                      disabled={checklistData.sections.length <= 1}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                
                <div className={styles.sectionDescription}>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={section.description}
                    onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)}
                    placeholder="Section description (optional)"
                  />
                </div>

                {!section.collapsed && (
                  <div className={styles.sectionItems}>
                    {section.items.map((item) => (
                      <div key={item.id} className={styles.checklistItem}>
                        <div className={styles.itemMainRow}>
                          <div className={styles.itemCheckbox}>
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={(e) => handleItemChange(section.id, item.id, 'completed', e.target.checked)}
                            />
                          </div>
                          <div className={styles.itemContent}>
                            <input
                              type="text"
                              className={styles.itemTextInput}
                              value={item.text}
                              onChange={(e) => handleItemChange(section.id, item.id, 'text', e.target.value)}
                              placeholder="Enter checklist item"
                            />
                          </div>
                          <div className={styles.itemPriority}>
                            <select
                              className={styles.prioritySelect}
                              value={item.priority}
                              onChange={(e) => handleItemChange(section.id, item.id, 'priority', e.target.value)}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>
                          </div>
                          <div className={styles.itemActions}>
                            <label className={styles.requiredToggle}>
                              <input
                                type="checkbox"
                                checked={item.required}
                                onChange={(e) => handleItemChange(section.id, item.id, 'required', e.target.checked)}
                              />
                              Required
                            </label>
                            <button
                              className={styles.removeBtn}
                              onClick={() => removeItem(section.id, item.id)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className={styles.itemDetailsRow}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Assignee</label>
                            <input
                              type="text"
                              className={styles.textInput}
                              value={item.assignee}
                              onChange={(e) => handleItemChange(section.id, item.id, 'assignee', e.target.value)}
                              placeholder="Who is responsible?"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Due Date</label>
                            <input
                              type="date"
                              className={styles.textInput}
                              value={item.dueDate}
                              onChange={(e) => handleItemChange(section.id, item.id, 'dueDate', e.target.value)}
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Notes</label>
                            <input
                              type="text"
                              className={styles.textInput}
                              value={item.notes}
                              onChange={(e) => handleItemChange(section.id, item.id, 'notes', e.target.value)}
                              placeholder="Additional notes or instructions"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quality Control Section */}
        <div className={styles.analysisCard}>
          <div className={styles.sectionHeader}>
            <h2>Quality Control</h2>
            <label className={styles.enableToggle}>
              <input
                type="checkbox"
                checked={checklistData.qualityControl.reviewRequired}
                onChange={(e) => handleQualityControlChange('reviewRequired', e.target.checked)}
              />
              Require Review
            </label>
          </div>
          
          {checklistData.qualityControl.reviewRequired && (
            <div className={styles.qualityControlGrid}>
              <div className={styles.reviewSection}>
                <h3>Review Process</h3>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Reviewer</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={checklistData.qualityControl.reviewer}
                      onChange={(e) => handleQualityControlChange('reviewer', e.target.value)}
                      placeholder="Who will review this checklist?"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Review Date</label>
                    <input
                      type="date"
                      className={styles.textInput}
                      value={checklistData.qualityControl.reviewDate}
                      onChange={(e) => handleQualityControlChange('reviewDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Review Notes</label>
                  <textarea
                    className={styles.textareaInput}
                    value={checklistData.qualityControl.reviewNotes}
                    onChange={(e) => handleQualityControlChange('reviewNotes', e.target.value)}
                    placeholder="Review comments and feedback"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className={styles.approvalSection}>
                <h3>Approval</h3>
                <div className={styles.approvalStatus}>
                  <label className={styles.approvalToggle}>
                    <input
                      type="checkbox"
                      checked={checklistData.qualityControl.approved}
                      onChange={(e) => handleQualityControlChange('approved', e.target.checked)}
                    />
                    <span className={styles.approvalLabel}>
                      {checklistData.qualityControl.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </label>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Approver</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={checklistData.qualityControl.approver}
                      onChange={(e) => handleQualityControlChange('approver', e.target.value)}
                      placeholder="Who approved this checklist?"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Approval Date</label>
                    <input
                      type="date"
                      className={styles.textInput}
                      value={checklistData.qualityControl.approvalDate}
                      onChange={(e) => handleQualityControlChange('approvalDate', e.target.value)}
                    />
                  </div>
                </div>
                {!checklistData.qualityControl.approved && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Rejection Reason</label>
                    <textarea
                      className={styles.textareaInput}
                      value={checklistData.qualityControl.rejectionReason}
                      onChange={(e) => handleQualityControlChange('rejectionReason', e.target.value)}
                      placeholder="If rejected, explain why"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Documentation Section */}
        <div className={styles.analysisCard}>
          <h2>Documentation & Lessons Learned</h2>
          <div className={styles.documentationGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Completion Notes</label>
              <textarea
                className={styles.textareaInput}
                value={checklistData.documentation.completionNotes}
                onChange={(e) => handleDocumentationChange('completionNotes', e.target.value)}
                placeholder="Document any issues, observations, or notes from checklist execution"
                rows={3}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Lessons Learned</label>
              <textarea
                className={styles.textareaInput}
                value={checklistData.documentation.lessonsLearned}
                onChange={(e) => handleDocumentationChange('lessonsLearned', e.target.value)}
                placeholder="What did you learn from using this checklist?"
                rows={3}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Improvements <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={checklistData.documentation.improvements}
                onChange={(e) => handleDocumentationChange('improvements', e.target.value)}
                placeholder="How can this checklist be improved for future use?"
                rows={3}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Next Actions</label>
              <textarea
                className={styles.textareaInput}
                value={checklistData.documentation.nextActions}
                onChange={(e) => handleDocumentationChange('nextActions', e.target.value)}
                placeholder="What follow-up actions are needed?"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklist;

