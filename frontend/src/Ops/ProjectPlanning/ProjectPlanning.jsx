import React, { useState, useEffect } from 'react';
import styles from './ProjectPlanning.module.css';

const ProjectPlanning = () => {
  // Project Planning structure
  const [projectData, setProjectData] = useState({
    // Basic Information
    projectName: '',
    projectManager: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    version: '1.0',
    
    // Project Overview
    projectOverview: {
      purpose: '',
      objectives: '',
      scope: '',
      deliverables: '',
      constraints: '',
      assumptions: '',
      successCriteria: ''
    },
    
    // Stakeholders
    stakeholders: [],
    
    // Work Breakdown Structure
    workPackages: [],
    
    // Timeline & Milestones
    timeline: {
      startDate: '',
      endDate: '',
      duration: '',
      milestones: []
    },
    
    // Resources
    resources: {
      teamMembers: [],
      budget: {
        totalBudget: '',
        categories: []
      },
      equipment: [],
      facilities: []
    },
    
    // Risk Management
    riskManagement: {
      risks: [],
      mitigation: [],
      contingency: ''
    },
    
    // Communication Plan
    communicationPlan: {
      meetings: [],
      reports: [],
      stakeholderComm: []
    },
    
    // Quality Management
    qualityManagement: {
      standards: '',
      reviews: [],
      metrics: []
    },
    
    // Change Management
    changeManagement: {
      process: '',
      approvals: [],
      tracking: []
    }
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching other tools structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Project Planning! I'll help you create a comprehensive project plan that covers all aspects from initiation to closure. Good project planning is crucial for success - it helps define scope, allocate resources, manage risks, and ensure stakeholder alignment. What type of project are you planning?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'project charter': "A project charter formally authorizes the project and defines high-level scope, objectives, and stakeholders. Include business case, success criteria, assumptions, constraints, and initial resource estimates.",
      'work breakdown': "Work Breakdown Structure (WBS) decomposes project deliverables into manageable work packages. Use the 100% rule - each level must account for 100% of work above it. Aim for 8-80 hour work packages.",
      'stakeholder': "Stakeholder analysis identifies all parties affected by the project. Map them by influence vs interest. Develop engagement strategies for each group: manage closely, keep satisfied, keep informed, or monitor.",
      'timeline': "Create realistic timelines using bottom-up estimation. Identify critical path, dependencies, and buffers. Use techniques like PERT (Program Evaluation Review Technique) for uncertain durations.",
      'risk management': "Risk management is proactive identification and mitigation of threats and opportunities. Use risk registers, probability/impact matrices, and develop response strategies: avoid, mitigate, transfer, or accept.",
      'resource planning': "Resource planning ensures right people, skills, and materials are available when needed. Consider resource leveling, skill gaps, training needs, and procurement lead times.",
      'communication': "Communication planning defines who needs what information, when, and how. Include status reports, meetings, escalation procedures, and stakeholder-specific communication preferences.",
      'quality planning': "Quality planning defines standards, processes, and metrics to ensure deliverables meet requirements. Include reviews, testing, acceptance criteria, and continuous improvement processes.",
      'change control': "Change control manages scope, schedule, and budget changes. Establish change request process, impact assessment procedures, approval authorities, and change log tracking.",
      'default': "I can help with project charter development, work breakdown structure, stakeholder analysis, timeline planning, risk management, resource allocation, communication planning, quality management, or change control. What area needs guidance?"
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
      if (projectData.projectName) completedFields++;
      if (projectData.projectManager) completedFields++;
      if (projectData.projectOverview.purpose) completedFields++;

      // Project overview (3 fields)
      totalFields += 3;
      if (projectData.projectOverview.objectives) completedFields++;
      if (projectData.projectOverview.scope) completedFields++;
      if (projectData.projectOverview.deliverables) completedFields++;

      // Stakeholders (1 field)
      totalFields += 1;
      if (projectData.stakeholders.length > 0) completedFields++;

      // Work packages (1 field)
      totalFields += 1;
      if (projectData.workPackages.length > 0) completedFields++;

      // Timeline (1 field)
      totalFields += 1;
      if (projectData.timeline.startDate && projectData.timeline.endDate) completedFields++;

      // Resources (1 field)
      totalFields += 1;
      if (projectData.resources.teamMembers.length > 0) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [projectData]);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle project overview changes
  const handleProjectOverviewChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      projectOverview: {
        ...prev.projectOverview,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle timeline changes
  const handleTimelineChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add stakeholder
  const addStakeholder = () => {
    const newStakeholder = {
      id: Date.now(),
      name: '',
      role: '',
      organization: '',
      influence: 'medium', // 'low', 'medium', 'high'
      interest: 'medium', // 'low', 'medium', 'high'
      engagement: '', // 'manage closely', 'keep satisfied', 'keep informed', 'monitor'
      communication: '',
      expectations: ''
    };
    
    setProjectData(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, newStakeholder],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove stakeholder
  const removeStakeholder = (stakeholderId) => {
    setProjectData(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.filter(stakeholder => stakeholder.id !== stakeholderId),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle stakeholder changes
  const handleStakeholderChange = (stakeholderId, field, value) => {
    setProjectData(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.map(stakeholder =>
        stakeholder.id === stakeholderId ? { ...stakeholder, [field]: value } : stakeholder
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add work package
  const addWorkPackage = () => {
    const newWorkPackage = {
      id: Date.now(),
      wbsCode: '',
      name: '',
      description: '',
      deliverables: '',
      responsible: '',
      startDate: '',
      endDate: '',
      duration: '',
      effort: '',
      dependencies: '',
      resources: '',
      budget: ''
    };
    
    setProjectData(prev => ({
      ...prev,
      workPackages: [...prev.workPackages, newWorkPackage],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove work package
  const removeWorkPackage = (packageId) => {
    setProjectData(prev => ({
      ...prev,
      workPackages: prev.workPackages.filter(pkg => pkg.id !== packageId),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle work package changes
  const handleWorkPackageChange = (packageId, field, value) => {
    setProjectData(prev => ({
      ...prev,
      workPackages: prev.workPackages.map(pkg =>
        pkg.id === packageId ? { ...pkg, [field]: value } : pkg
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add milestone
  const addMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      name: '',
      description: '',
      targetDate: '',
      criteria: '',
      responsible: '',
      status: 'planned' // 'planned', 'in-progress', 'completed', 'delayed'
    };
    
    setProjectData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: [...prev.timeline.milestones, newMilestone]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove milestone
  const removeMilestone = (milestoneId) => {
    setProjectData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.filter(milestone => milestone.id !== milestoneId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle milestone changes
  const handleMilestoneChange = (milestoneId, field, value) => {
    setProjectData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.map(milestone =>
          milestone.id === milestoneId ? { ...milestone, [field]: value } : milestone
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add team member
  const addTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      role: '',
      skills: '',
      availability: '',
      startDate: '',
      endDate: '',
      cost: '',
      responsibilities: ''
    };
    
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        teamMembers: [...prev.resources.teamMembers, newMember]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove team member
  const removeTeamMember = (memberId) => {
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        teamMembers: prev.resources.teamMembers.filter(member => member.id !== memberId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle team member changes
  const handleTeamMemberChange = (memberId, field, value) => {
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        teamMembers: prev.resources.teamMembers.map(member =>
          member.id === memberId ? { ...member, [field]: value } : member
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add budget category
  const addBudgetCategory = () => {
    const newCategory = {
      id: Date.now(),
      category: '',
      description: '',
      budgetAmount: '',
      actualAmount: '',
      variance: '',
      notes: ''
    };
    
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        budget: {
          ...prev.resources.budget,
          categories: [...prev.resources.budget.categories, newCategory]
        }
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove budget category
  const removeBudgetCategory = (categoryId) => {
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        budget: {
          ...prev.resources.budget,
          categories: prev.resources.budget.categories.filter(category => category.id !== categoryId)
        }
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle budget category changes
  const handleBudgetCategoryChange = (categoryId, field, value) => {
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        budget: {
          ...prev.resources.budget,
          categories: prev.resources.budget.categories.map(category =>
            category.id === categoryId ? { ...category, [field]: value } : category
          )
        }
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle budget total change
  const handleBudgetTotalChange = (value) => {
    setProjectData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        budget: {
          ...prev.resources.budget,
          totalBudget: value
        }
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add risk
  const addRisk = () => {
    const newRisk = {
      id: Date.now(),
      risk: '',
      category: '', // 'technical', 'schedule', 'budget', 'resource', 'external'
      probability: 'medium', // 'low', 'medium', 'high'
      impact: 'medium', // 'low', 'medium', 'high'
      response: '', // 'avoid', 'mitigate', 'transfer', 'accept'
      mitigation: '',
      owner: '',
      status: 'identified' // 'identified', 'analyzing', 'planning', 'implementing', 'monitoring', 'closed'
    };
    
    setProjectData(prev => ({
      ...prev,
      riskManagement: {
        ...prev.riskManagement,
        risks: [...prev.riskManagement.risks, newRisk]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove risk
  const removeRisk = (riskId) => {
    setProjectData(prev => ({
      ...prev,
      riskManagement: {
        ...prev.riskManagement,
        risks: prev.riskManagement.risks.filter(risk => risk.id !== riskId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle risk changes
  const handleRiskChange = (riskId, field, value) => {
    setProjectData(prev => ({
      ...prev,
      riskManagement: {
        ...prev.riskManagement,
        risks: prev.riskManagement.risks.map(risk =>
          risk.id === riskId ? { ...risk, [field]: value } : risk
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Add communication item
  const addCommunicationItem = (type) => {
    const newItem = {
      id: Date.now(),
      type: type, // 'meeting', 'report', 'stakeholder'
      name: '',
      description: '',
      frequency: '',
      audience: '',
      method: '',
      responsible: '',
      template: ''
    };
    
    setProjectData(prev => ({
      ...prev,
      communicationPlan: {
        ...prev.communicationPlan,
        [type === 'meeting' ? 'meetings' : type === 'report' ? 'reports' : 'stakeholderComm']: [
          ...prev.communicationPlan[type === 'meeting' ? 'meetings' : type === 'report' ? 'reports' : 'stakeholderComm'],
          newItem
        ]
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Remove communication item
  const removeCommunicationItem = (type, itemId) => {
    const arrayName = type === 'meeting' ? 'meetings' : type === 'report' ? 'reports' : 'stakeholderComm';
    setProjectData(prev => ({
      ...prev,
      communicationPlan: {
        ...prev.communicationPlan,
        [arrayName]: prev.communicationPlan[arrayName].filter(item => item.id !== itemId)
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Handle communication item changes
  const handleCommunicationItemChange = (type, itemId, field, value) => {
    const arrayName = type === 'meeting' ? 'meetings' : type === 'report' ? 'reports' : 'stakeholderComm';
    setProjectData(prev => ({
      ...prev,
      communicationPlan: {
        ...prev.communicationPlan,
        [arrayName]: prev.communicationPlan[arrayName].map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Save draft
  const handleSave = () => {
    console.log('Saving Project Planning draft:', projectData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting Project Planning to PDF:', projectData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to other tools */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Project Planning</h1>
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
        {/* Top Section: Project Information + AI Helper - Exact match to other tools */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Project Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={projectData.projectName}
                onChange={(e) => handleBasicInfoChange('projectName', e.target.value)}
                placeholder="Enter the project name"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Project Manager <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={projectData.projectManager}
                  onChange={(e) => handleBasicInfoChange('projectManager', e.target.value)}
                  placeholder="Project manager name"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Version
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={projectData.version}
                  onChange={(e) => handleBasicInfoChange('version', e.target.value)}
                  placeholder="Project plan version"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Purpose <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={projectData.projectOverview.purpose}
                onChange={(e) => handleProjectOverviewChange('purpose', e.target.value)}
                placeholder="What is the purpose and business case for this project?"
                rows={3}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Start Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={projectData.timeline.startDate}
                  onChange={(e) => handleTimelineChange('startDate', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>End Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={projectData.timeline.endDate}
                  onChange={(e) => handleTimelineChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  Project Planning AI Guide
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
                  placeholder="Ask me about project planning..."
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
                    onClick={() => handleQuickAction('How do I create a project charter?')}
                  >
                    Project Charter
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What is work breakdown structure?')}
                  >
                    Work Breakdown
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I analyze stakeholders?')}
                  >
                    Stakeholders
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I create realistic timelines?')}
                  >
                    Timeline Planning
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What is risk management in projects?')}
                  >
                    Risk Management
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview Section */}
        <div className={styles.analysisCard}>
          <h2>Project Overview</h2>
          <div className={styles.projectOverviewSection}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Objectives <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={projectData.projectOverview.objectives}
                onChange={(e) => handleProjectOverviewChange('objectives', e.target.value)}
                placeholder="What are the specific, measurable objectives of this project?"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Scope <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={projectData.projectOverview.scope}
                onChange={(e) => handleProjectOverviewChange('scope', e.target.value)}
                placeholder="Define what is included and excluded from the project scope"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Deliverables <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={projectData.projectOverview.deliverables}
                onChange={(e) => handleProjectOverviewChange('deliverables', e.target.value)}
                placeholder="List the key deliverables and outcomes"
                rows={3}
              />
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Constraints</label>
                <textarea
                  className={styles.textareaInput}
                  value={projectData.projectOverview.constraints}
                  onChange={(e) => handleProjectOverviewChange('constraints', e.target.value)}
                  placeholder="Budget, time, resource, or other constraints"
                  rows={2}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Assumptions</label>
                <textarea
                  className={styles.textareaInput}
                  value={projectData.projectOverview.assumptions}
                  onChange={(e) => handleProjectOverviewChange('assumptions', e.target.value)}
                  placeholder="Key assumptions the project is based on"
                  rows={2}
                />
              </div>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Success Criteria</label>
              <textarea
                className={styles.textareaInput}
                value={projectData.projectOverview.successCriteria}
                onChange={(e) => handleProjectOverviewChange('successCriteria', e.target.value)}
                placeholder="How will project success be measured?"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Stakeholder Analysis Section */}
        <div className={styles.analysisCard}>
          <h2>Stakeholder Analysis</h2>
          <div className={styles.stakeholdersSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionDescription}>
                Identify all stakeholders and analyze their influence, interest, and engagement requirements.
              </p>
              <button className={styles.addBtn} onClick={addStakeholder}>
                <i className="fas fa-plus"></i> Add Stakeholder
              </button>
            </div>
            
            <div className={styles.stakeholdersTable}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Organization</th>
                    <th>Influence</th>
                    <th>Interest</th>
                    <th>Engagement Strategy</th>
                    <th>Communication</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.stakeholders.map((stakeholder) => (
                    <tr key={stakeholder.id}>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={stakeholder.name}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'name', e.target.value)}
                          placeholder="Stakeholder name"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={stakeholder.role}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'role', e.target.value)}
                          placeholder="Role/Title"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={stakeholder.organization}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'organization', e.target.value)}
                          placeholder="Organization"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={stakeholder.influence}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'influence', e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={stakeholder.interest}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'interest', e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={stakeholder.engagement}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'engagement', e.target.value)}
                        >
                          <option value="">Select strategy</option>
                          <option value="manage closely">Manage Closely</option>
                          <option value="keep satisfied">Keep Satisfied</option>
                          <option value="keep informed">Keep Informed</option>
                          <option value="monitor">Monitor</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={stakeholder.communication}
                          onChange={(e) => handleStakeholderChange(stakeholder.id, 'communication', e.target.value)}
                          placeholder="Communication method"
                        />
                      </td>
                      <td>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeStakeholder(stakeholder.id)}
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
        </div>

        {/* Work Breakdown Structure Section */}
        <div className={styles.analysisCard}>
          <h2>Work Breakdown Structure (WBS)</h2>
          <div className={styles.wbsSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionDescription}>
                Break down project deliverables into manageable work packages. Aim for 8-80 hour work packages.
              </p>
              <button className={styles.addBtn} onClick={addWorkPackage}>
                <i className="fas fa-plus"></i> Add Work Package
              </button>
            </div>
            
            <div className={styles.wbsTable}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>WBS Code</th>
                    <th>Work Package</th>
                    <th>Description</th>
                    <th>Responsible</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Effort (hrs)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.workPackages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={pkg.wbsCode}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'wbsCode', e.target.value)}
                          placeholder="1.1.1"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={pkg.name}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'name', e.target.value)}
                          placeholder="Work package name"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={pkg.description}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'description', e.target.value)}
                          placeholder="Description"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={pkg.responsible}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'responsible', e.target.value)}
                          placeholder="Responsible person"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className={styles.tableInput}
                          value={pkg.startDate}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'startDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className={styles.tableInput}
                          value={pkg.endDate}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'endDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={pkg.duration}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'duration', e.target.value)}
                          placeholder="5 days"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={styles.tableInput}
                          value={pkg.effort}
                          onChange={(e) => handleWorkPackageChange(pkg.id, 'effort', e.target.value)}
                          placeholder="40"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeWorkPackage(pkg.id)}
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
        </div>

        {/* Timeline & Milestones Section */}
        <div className={styles.analysisCard}>
          <h2>Timeline & Milestones</h2>
          <div className={styles.timelineSection}>
            <div className={styles.timelineOverview}>
              <h3>Project Timeline</h3>
              <div className={styles.timelineGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Project Duration</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={projectData.timeline.duration}
                    onChange={(e) => handleTimelineChange('duration', e.target.value)}
                    placeholder="e.g., 6 months, 120 days"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.milestonesSection}>
              <div className={styles.sectionHeader}>
                <h3>Milestones</h3>
                <button className={styles.addBtn} onClick={addMilestone}>
                  <i className="fas fa-plus"></i> Add Milestone
                </button>
              </div>
              
              <div className={styles.milestonesTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Milestone Name</th>
                      <th>Description</th>
                      <th>Target Date</th>
                      <th>Success Criteria</th>
                      <th>Responsible</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.timeline.milestones.map((milestone) => (
                      <tr key={milestone.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={milestone.name}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'name', e.target.value)}
                            placeholder="Milestone name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={milestone.description}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'description', e.target.value)}
                            placeholder="Description"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className={styles.tableInput}
                            value={milestone.targetDate}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'targetDate', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={milestone.criteria}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'criteria', e.target.value)}
                            placeholder="Success criteria"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={milestone.responsible}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'responsible', e.target.value)}
                            placeholder="Responsible person"
                          />
                        </td>
                        <td>
                          <select
                            className={styles.tableSelect}
                            value={milestone.status}
                            onChange={(e) => handleMilestoneChange(milestone.id, 'status', e.target.value)}
                          >
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="delayed">Delayed</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeMilestone(milestone.id)}
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
          </div>
        </div>

        {/* Resource Planning Section */}
        <div className={styles.analysisCard}>
          <h2>Resource Planning</h2>
          <div className={styles.resourcesSection}>
            <div className={styles.teamSection}>
              <div className={styles.sectionHeader}>
                <h3>Team Members</h3>
                <button className={styles.addBtn} onClick={addTeamMember}>
                  <i className="fas fa-plus"></i> Add Team Member
                </button>
              </div>
              
              <div className={styles.teamTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Skills</th>
                      <th>Availability</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Cost/Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.resources.teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                            placeholder="Team member name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                            placeholder="Role"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={member.skills}
                            onChange={(e) => handleTeamMemberChange(member.id, 'skills', e.target.value)}
                            placeholder="Key skills"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={member.availability}
                            onChange={(e) => handleTeamMemberChange(member.id, 'availability', e.target.value)}
                            placeholder="50%, Full-time"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className={styles.tableInput}
                            value={member.startDate}
                            onChange={(e) => handleTeamMemberChange(member.id, 'startDate', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className={styles.tableInput}
                            value={member.endDate}
                            onChange={(e) => handleTeamMemberChange(member.id, 'endDate', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={member.cost}
                            onChange={(e) => handleTeamMemberChange(member.id, 'cost', e.target.value)}
                            placeholder="$100/hr"
                          />
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeTeamMember(member.id)}
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
            
            <div className={styles.budgetSection}>
              <div className={styles.budgetOverview}>
                <h3>Budget Overview</h3>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Total Project Budget</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={projectData.resources.budget.totalBudget}
                    onChange={(e) => handleBudgetTotalChange(e.target.value)}
                    placeholder="$100,000"
                  />
                </div>
              </div>
              
              <div className={styles.sectionHeader}>
                <h3>Budget Categories</h3>
                <button className={styles.addBtn} onClick={addBudgetCategory}>
                  <i className="fas fa-plus"></i> Add Category
                </button>
              </div>
              
              <div className={styles.budgetTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Budget Amount</th>
                      <th>Actual Amount</th>
                      <th>Variance</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.resources.budget.categories.map((category) => (
                      <tr key={category.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={category.category}
                            onChange={(e) => handleBudgetCategoryChange(category.id, 'category', e.target.value)}
                            placeholder="Labor, Equipment, etc."
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={category.description}
                            onChange={(e) => handleBudgetCategoryChange(category.id, 'description', e.target.value)}
                            placeholder="Description"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={category.budgetAmount}
                            onChange={(e) => handleBudgetCategoryChange(category.id, 'budgetAmount', e.target.value)}
                            placeholder="$25,000"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={category.actualAmount}
                            onChange={(e) => handleBudgetCategoryChange(category.id, 'actualAmount', e.target.value)}
                            placeholder="$23,500"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={category.variance}
                            onChange={(e) => handleBudgetCategoryChange(category.id, 'variance', e.target.value)}
                            placeholder="+$1,500"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={category.notes}
                            onChange={(e) => handleBudgetCategoryChange(category.id, 'notes', e.target.value)}
                            placeholder="Notes"
                          />
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeBudgetCategory(category.id)}
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
          </div>
        </div>

        {/* Risk Management Section */}
        <div className={styles.analysisCard}>
          <h2>Risk Management</h2>
          <div className={styles.riskSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionDescription}>
                Identify, assess, and plan responses for project risks. Use probability/impact matrix for prioritization.
              </p>
              <button className={styles.addBtn} onClick={addRisk}>
                <i className="fas fa-plus"></i> Add Risk
              </button>
            </div>
            
            <div className={styles.riskTable}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Risk Description</th>
                    <th>Category</th>
                    <th>Probability</th>
                    <th>Impact</th>
                    <th>Response Strategy</th>
                    <th>Mitigation Plan</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.riskManagement.risks.map((risk) => (
                    <tr key={risk.id}>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={risk.risk}
                          onChange={(e) => handleRiskChange(risk.id, 'risk', e.target.value)}
                          placeholder="Risk description"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={risk.category}
                          onChange={(e) => handleRiskChange(risk.id, 'category', e.target.value)}
                        >
                          <option value="">Select category</option>
                          <option value="technical">Technical</option>
                          <option value="schedule">Schedule</option>
                          <option value="budget">Budget</option>
                          <option value="resource">Resource</option>
                          <option value="external">External</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={risk.probability}
                          onChange={(e) => handleRiskChange(risk.id, 'probability', e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={risk.impact}
                          onChange={(e) => handleRiskChange(risk.id, 'impact', e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={risk.response}
                          onChange={(e) => handleRiskChange(risk.id, 'response', e.target.value)}
                        >
                          <option value="">Select response</option>
                          <option value="avoid">Avoid</option>
                          <option value="mitigate">Mitigate</option>
                          <option value="transfer">Transfer</option>
                          <option value="accept">Accept</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={risk.mitigation}
                          onChange={(e) => handleRiskChange(risk.id, 'mitigation', e.target.value)}
                          placeholder="Mitigation plan"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={risk.owner}
                          onChange={(e) => handleRiskChange(risk.id, 'owner', e.target.value)}
                          placeholder="Risk owner"
                        />
                      </td>
                      <td>
                        <select
                          className={styles.tableSelect}
                          value={risk.status}
                          onChange={(e) => handleRiskChange(risk.id, 'status', e.target.value)}
                        >
                          <option value="identified">Identified</option>
                          <option value="analyzing">Analyzing</option>
                          <option value="planning">Planning</option>
                          <option value="implementing">Implementing</option>
                          <option value="monitoring">Monitoring</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeRisk(risk.id)}
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
        </div>

        {/* Communication Plan Section */}
        <div className={styles.analysisCard}>
          <h2>Communication Plan</h2>
          <div className={styles.communicationSection}>
            <div className={styles.meetingsSection}>
              <div className={styles.sectionHeader}>
                <h3>Meetings</h3>
                <button className={styles.addBtn} onClick={() => addCommunicationItem('meeting')}>
                  <i className="fas fa-plus"></i> Add Meeting
                </button>
              </div>
              
              <div className={styles.communicationTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Meeting Name</th>
                      <th>Description</th>
                      <th>Frequency</th>
                      <th>Audience</th>
                      <th>Method</th>
                      <th>Responsible</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.communicationPlan.meetings.map((meeting) => (
                      <tr key={meeting.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={meeting.name}
                            onChange={(e) => handleCommunicationItemChange('meeting', meeting.id, 'name', e.target.value)}
                            placeholder="Meeting name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={meeting.description}
                            onChange={(e) => handleCommunicationItemChange('meeting', meeting.id, 'description', e.target.value)}
                            placeholder="Purpose and agenda"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={meeting.frequency}
                            onChange={(e) => handleCommunicationItemChange('meeting', meeting.id, 'frequency', e.target.value)}
                            placeholder="Weekly, Monthly"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={meeting.audience}
                            onChange={(e) => handleCommunicationItemChange('meeting', meeting.id, 'audience', e.target.value)}
                            placeholder="Who attends"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={meeting.method}
                            onChange={(e) => handleCommunicationItemChange('meeting', meeting.id, 'method', e.target.value)}
                            placeholder="In-person, Video call"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={meeting.responsible}
                            onChange={(e) => handleCommunicationItemChange('meeting', meeting.id, 'responsible', e.target.value)}
                            placeholder="Meeting organizer"
                          />
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeCommunicationItem('meeting', meeting.id)}
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
            
            <div className={styles.reportsSection}>
              <div className={styles.sectionHeader}>
                <h3>Reports</h3>
                <button className={styles.addBtn} onClick={() => addCommunicationItem('report')}>
                  <i className="fas fa-plus"></i> Add Report
                </button>
              </div>
              
              <div className={styles.communicationTable}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Description</th>
                      <th>Frequency</th>
                      <th>Audience</th>
                      <th>Method</th>
                      <th>Responsible</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.communicationPlan.reports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={report.name}
                            onChange={(e) => handleCommunicationItemChange('report', report.id, 'name', e.target.value)}
                            placeholder="Report name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={report.description}
                            onChange={(e) => handleCommunicationItemChange('report', report.id, 'description', e.target.value)}
                            placeholder="Report content and purpose"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={report.frequency}
                            onChange={(e) => handleCommunicationItemChange('report', report.id, 'frequency', e.target.value)}
                            placeholder="Weekly, Monthly"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={report.audience}
                            onChange={(e) => handleCommunicationItemChange('report', report.id, 'audience', e.target.value)}
                            placeholder="Who receives"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={report.method}
                            onChange={(e) => handleCommunicationItemChange('report', report.id, 'method', e.target.value)}
                            placeholder="Email, Dashboard"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.tableInput}
                            value={report.responsible}
                            onChange={(e) => handleCommunicationItemChange('report', report.id, 'responsible', e.target.value)}
                            placeholder="Report author"
                          />
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeCommunicationItem('report', report.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlanning;

