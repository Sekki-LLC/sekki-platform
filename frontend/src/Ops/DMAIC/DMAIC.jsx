// src/components/DMAIC.js

import React, { useState, useEffect } from 'react';
import styles from './DMAIC.module.css';

const DMAIC = () => {
  // Phase definitions
  const phases = [
    { id: 'charter', name: 'Charter', order: 1 },
    { id: 'define', name: 'Define', order: 2 },
    { id: 'measure', name: 'Measure', order: 3 },
    { id: 'analyze', name: 'Analyze', order: 4 },
    { id: 'improve', name: 'Improve', order: 5 },
    { id: 'control', name: 'Control', order: 6 }
  ];

  // Status options
  const statusOptions = [
    'Draft',
    'Submitted',
    'Under Review',
    'Pending Approval',
    'Approved',
    'Rejected',
    'Revision Required'
  ];

  // Financial impact types
  const financialTypes = [
    'Cost Savings',
    'Revenue Increase',
    'Cost Avoidance',
    'Cost Out'
  ];

  // Team roles
  const teamRoles = [
    'Sponsor',
    'Process Owner',
    'Black Belt',
    'Green Belt',
    'Team Member',
    'Subject Matter Expert',
    'Finance Representative'
  ];

  // State management
  const [currentPhase, setCurrentPhase] = useState('charter');
  const [projectData, setProjectData] = useState({
    // Project basic info
    projectName: '',
    projectId: '',
    startDate: '',
    targetEndDate: '',

    // Charter data
    problemStatement: '',
    businessCase: '',
    scope: '',
    outOfScope: '',
    financialType: 'Cost Savings',
    financialAmount: '',
    currency: 'USD',

    // Team members
    teamMembers: [
      { id: 1, name: '', email: '', role: 'Sponsor', department: '' }
    ],

    // KPIs
    kpis: [
      { id: 1, metric: '', baseline: '', target: '', unit: '', frequency: 'Monthly' }
    ],

    // Phase tracking
    phaseData: {
      charter: { status: 'Draft', startDate: '', endDate: '', daysInPhase: 0, approvals: [], comments: [] },
      define: { status: 'Not Started', startDate: '', endDate: '', daysInPhase: 0, approvals: [], comments: [] },
      measure: { status: 'Not Started', startDate: '', endDate: '', daysInPhase: 0, approvals: [], comments: [] },
      analyze: { status: 'Not Started', startDate: '', endDate: '', daysInPhase: 0, approvals: [], comments: [] },
      improve: { status: 'Not Started', startDate: '', endDate: '', daysInPhase: 0, approvals: [], comments: [] },
      control: { status: 'Not Started', startDate: '', endDate: '', daysInPhase: 0, approvals: [], comments: [] }
    },

    // Tools data
    toolsData: {
      projectCharter: null,
      businessCase: null,
      finYBenefit: null,             // <-- Added new FinY Benefit tool
      problemStatement: null,
      sipoc: null,
      stakeholderAnalysis: null,
      processMap: null,
      dataCollection: null,
      controlChart: null,
      histogram: null,
      checksheet: null,
      scatterPlot: null,
      boxPlot: null,
      anova: null,
      gapAnalysis: null,
      effortImpactMatrix: null,
      projectPlanning: null,
      controlPlan: null,
      sustainmentPlan: null
    }
  });

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showAIHelper, setShowAIHelper] = useState(true);
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to your DMAIC project! I'm here to guide you through each phase. Let's start with your project charter.",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Calculate days in current phase
  useEffect(() => {
    const updateDaysInPhase = () => {
      const currentPhaseData = projectData.phaseData[currentPhase];
      if (currentPhaseData.startDate) {
        const startDate = new Date(currentPhaseData.startDate);
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setProjectData(prev => ({
          ...prev,
          phaseData: {
            ...prev.phaseData,
            [currentPhase]: {
              ...prev.phaseData[currentPhase],
              daysInPhase: diffDays
            }
          }
        }));
      }
    };

    updateDaysInPhase();
    const interval = setInterval(updateDaysInPhase, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentPhase, projectData.phaseData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle team member changes
  const handleTeamMemberChange = (id, field, value) => {
    setProjectData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  // Add team member
  const addTeamMember = () => {
    const newId = Math.max(...projectData.teamMembers.map(m => m.id)) + 1;
    setProjectData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { id: newId, name: '', email: '', role: 'Team Member', department: '' }
      ]
    }));
  };

  // Remove team member
  const removeTeamMember = id => {
    setProjectData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  // Handle KPI changes
  const handleKpiChange = (id, field, value) => {
    setProjectData(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi =>
        kpi.id === id ? { ...kpi, [field]: value } : kpi
      )
    }));
  };

  // Add KPI
  const addKpi = () => {
    const newId = Math.max(...projectData.kpis.map(k => k.id)) + 1;
    setProjectData(prev => ({
      ...prev,
      kpis: [
        ...prev.kpis,
        { id: newId, metric: '', baseline: '', target: '', unit: '', frequency: 'Monthly' }
      ]
    }));
  };

  // Remove KPI
  const removeKpi = id => {
    setProjectData(prev => ({
      ...prev,
      kpis: prev.kpis.filter(kpi => kpi.id !== id)
    }));
  };

  // Submit phase for approval
  const submitPhaseForApproval = phaseId => {
    setProjectData(prev => ({
      ...prev,
      phaseData: {
        ...prev.phaseData,
        [phaseId]: {
          ...prev.phaseData[phaseId],
          status: 'Submitted',
          startDate: prev.phaseData[phaseId].startDate || new Date().toISOString().split('T')[0]
        }
      }
    }));
    setShowApprovalModal(true);
  };

  // Launch tool
  const launchTool = toolName => {
    setSelectedTool(toolName);
    setShowToolsModal(true);
  };

  // Get phase status color
  const getPhaseStatusColor = status => {
    switch (status) {
      case 'Approved':
        return 'var(--lss-success)';
      case 'Rejected':
        return 'var(--lss-danger)';
      case 'Under Review':
        return 'var(--lss-warning)';
      case 'Submitted':
        return 'var(--lss-info)';
      case 'Draft':
        return 'var(--lss-gray-500)';
      default:
        return 'var(--lss-gray-400)';
    }
  };

  // AI Helper Functions
  const sendAIMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getContextualAIResponse(currentPhase, currentMessage),
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getContextualAIResponse = (phase, message) => {
    const responses = {
      charter: [
        "Great question! For the project charter, focus on clearly defining the problem and its business impact. What specific issue are you trying to solve?",
        "Make sure your financial impact is quantifiable and realistic. Consider both hard and soft savings.",
        "Your project team should include stakeholders who can influence the outcome. Who are the key players in this process?"
      ],
      define: [
        "In the Define phase, we need to clearly understand the current state. Have you completed your SIPOC analysis?",
        "The Problem Statement should be specific and measurable. What is the gap between current and desired performance?",
        "Stakeholder analysis is crucial here. Who will be impacted by this improvement?"
      ],
      measure: [
        "Data collection is key in the Measure phase. What metrics will help you understand the current state?",
        "Make sure your measurement system is reliable and valid. Have you considered a measurement system analysis?",
        "Baseline data is critical. How will you establish your current performance level?"
      ],
      analyze: [
        "Now we're looking for root causes. What analysis tools will help you identify the key drivers?",
        "Statistical analysis can reveal patterns. Have you considered correlation or regression analysis?",
        "Don't forget to validate your root causes with data. What evidence supports your hypothesis?"
      ],
      improve: [
        "Time to develop solutions! What improvement ideas address your root causes?",
        "Pilot testing is important before full implementation. How will you test your solutions?",
        "Consider the effort vs impact of each improvement. Which solutions give you the biggest bang for your buck?"
      ],
      control: [
        "Sustainability is key in the Control phase. How will you ensure improvements stick?",
        "Control plans should include monitoring, response plans, and ownership. Who will maintain these improvements?",
        "Documentation and training are crucial. How will you transfer knowledge to the team?"
      ]
    };
    const phaseResponses = responses[phase] || responses.charter;
    return phaseResponses[Math.floor(Math.random() * phaseResponses.length)];
  };

  const handleQuickAction = action => {
    setCurrentMessage(action);
  };

  // Tool status helpers
  const getToolStatus = toolKey => {
    const toolData = projectData.toolsData[toolKey];
    if (!toolData) return 'notStarted';
    if (toolData.status === 'completed') return 'completed';
    if (toolData.status === 'in-progress') return 'inProgress';
    return 'notStarted';
  };

  const getToolStatusText = toolKey => {
    const status = getToolStatus(toolKey);
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inProgress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getToolStatusIcon = toolKey => {
    const status = getToolStatus(toolKey);
    switch (status) {
      case 'completed':
        return <i className="fas fa-check-circle" />;
      case 'inProgress':
        return <i className="fas fa-clock" />;
      default:
        return <i className="fas fa-circle" />;
    }
  };

  // Completion percentage
  const calculateCompletion = () => {
    const approvedPhases = Object.values(projectData.phaseData).filter(
      phase => phase.status === 'Approved'
    ).length;
    return Math.round((approvedPhases / phases.length) * 100);
  };

  return (
    <div className={styles.dmaic}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.projectInfo}>
            <h1>DMAIC Workflow</h1>
            <div className={styles.projectDetails}>
              <span className={styles.projectId}>
                Project: {projectData.projectId || 'New Project'}
              </span>
              <span className={styles.projectName}>
                {projectData.projectName || 'Untitled Project'}
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.helperToggleBtn}
              onClick={() => setShowAIHelper(!showAIHelper)}
            >
              <i className={showAIHelper ? 'fas fa-eye-slash' : 'fas fa-eye'} />
              {showAIHelper ? 'Hide Helper' : 'Show Helper'}
            </button>
            <button className={styles.saveBtn}>
              <i className="fas fa-save" /> Save Project
            </button>
            <button className={styles.exportBtn}>
              <i className="fas fa-download" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Phase Stepper */}
      <div className={styles.phaseStepper}>
        <div className={styles.stepperContainer}>
          {phases.map((phase, index) => {
            const phaseData = projectData.phaseData[phase.id];
            const isActive = currentPhase === phase.id;
            const isCompleted = phaseData.status === 'Approved';
            const isInProgress =
              phaseData.status === 'Submitted' || phaseData.status === 'Under Review';

            return (
              <div key={phase.id} className={styles.stepperItem}>
                <div
                  className={`${styles.stepperNode} ${
                    isActive ? styles.active : ''
                  } ${isCompleted ? styles.completed : ''} ${
                    isInProgress ? styles.inProgress : ''
                  }`}
                  onClick={() => setCurrentPhase(phase.id)}
                  style={{
                    backgroundColor: isCompleted ? 'var(--lss-success)' : '',
                    color: isCompleted ? 'var(--lss-white)' : ''
                  }}
                >
                  <div className={styles.stepNumber}>
                    {isCompleted ? <i className="fas fa-check" /> : phase.order}
                  </div>
                  <div className={styles.stepLabel}>{phase.name}</div>
                  <div
                    className={styles.stepStatus}
                    style={{ color: getPhaseStatusColor(phaseData.status) }}
                  >
                    {phaseData.status}
                  </div>
                  {phaseData.daysInPhase > 0 && (
                    <div className={styles.stepDays}>{phaseData.daysInPhase} days</div>
                  )}
                </div>
                {index < phases.length - 1 && (
                  <div
                    className={`${styles.stepperLine} ${
                      phaseData.status === 'Approved' ? styles.completed : ''
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className={styles.progressSummary}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${calculateCompletion()}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {calculateCompletion()}% Complete
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>

        {/* Charter Phase */}
        {currentPhase === 'charter' && (
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h2>Charter Phase</h2>
              <div className={styles.phaseActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => submitPhaseForApproval('charter')}
                >
                  Submit for Approval
                </button>
              </div>
            </div>

            {/* Charter Tools Section */}
            <div className={styles.section}>
              <h3>Charter Phase Activities</h3>
              <div className={styles.toolsGrid}>
                {/* 1. Business Case */}
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('businessCase')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-chart-line" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Business Case</h4>
                    <p>Document financial impact, ROI, and business justification</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('businessCase')]
                        }`}
                      >
                        {getToolStatusIcon('businessCase')}{' '}
                        {getToolStatusText('businessCase')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Project Charter */}
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('projectCharter')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-file-contract" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Project Charter</h4>
                    <p>Define project scope, objectives, team, and success criteria</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('projectCharter')]
                        }`}
                      >
                        {getToolStatusIcon('projectCharter')}{' '}
                        {getToolStatusText('projectCharter')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. FinY Benefit */}
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('finYBenefit')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-dollar-sign" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>FinY Benefit</h4>
                    <p>Document financial gains and ROI estimates</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('finYBenefit')]
                        }`}
                      >
                        {getToolStatusIcon('finYBenefit')}{' '}
                        {getToolStatusText('finYBenefit')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 1 Deliverables */}
            <div className={styles.section}>
              <h3>Phase 1 Deliverables</h3>
              <div className={styles.deliverablesList}>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="charter-1" />
                  <label htmlFor="charter-1">
                    Business Case documented with financial impact
                  </label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="charter-2" />
                  <label htmlFor="charter-2">
                    Project Charter completed and approved
                  </label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="charter-3" />
                  <label htmlFor="charter-3">
                    Project team identified and committed
                  </label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="charter-4" />
                  <label htmlFor="charter-4">
                    Success criteria and KPIs defined
                  </label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="charter-5" />
                  <label htmlFor="charter-5">
                    Project timeline and milestones established
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Define Phase */}
        {currentPhase === 'define' && (
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h2>Define Phase</h2>
              <div className={styles.phaseActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => submitPhaseForApproval('define')}
                >
                  Submit for Tollgate Review
                </button>
              </div>
            </div>

            {/* Define Tools Section */}
            <div className={styles.section}>
              <h3>Define Phase Tools</h3>
              <div className={styles.toolsGrid}>
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('problemStatement')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-exclamation-triangle" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Problem Statement</h4>
                    <p>Define the specific problem to be solved with measurable terms</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('problemStatement')]
                        }`}
                      >
                        {getToolStatusIcon('problemStatement')}{' '}
                        {getToolStatusText('problemStatement')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('sipoc')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-project-diagram" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>SIPOC</h4>
                    <p>Map suppliers, inputs, process, outputs, and customers</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${styles[getToolStatus('sipoc')]}`}
                      >
                        {getToolStatusIcon('sipoc')} {getToolStatusText('sipoc')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('stakeholderAnalysis')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-users" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Stakeholder Analysis</h4>
                    <p>Identify and analyze project stakeholders and their influence</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('stakeholderAnalysis')]
                        }`}
                      >
                        {getToolStatusIcon('stakeholderAnalysis')}{' '}
                        {getToolStatusText('stakeholderAnalysis')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('processMap')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-route" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Process Map</h4>
                    <p>Create detailed process flow and identify improvement opportunities</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('processMap')]
                        }`}
                      >
                        {getToolStatusIcon('processMap')}{' '}
                        {getToolStatusText('processMap')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Define Deliverables */}
            <div className={styles.section}>
              <h3>Define Phase Deliverables</h3>
              <div className={styles.deliverablesList}>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="define-1" />
                  <label htmlFor="define-1">Problem Statement refined and validated</label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="define-2" />
                  <label htmlFor="define-2">SIPOC diagram completed</label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="define-3" />
                  <label htmlFor="define-3">Stakeholder analysis completed</label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="define-4" />
                  <label htmlFor="define-4">Process map created</label>
                </div>
                <div className={styles.deliverable}>
                  <input type="checkbox" id="define-5" />
                  <label htmlFor="define-5">Voice of Customer (VOC) captured</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Measure Phase */}
        {currentPhase === 'measure' && (
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h2>Measure Phase</h2>
              <div className={styles.phaseActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => submitPhaseForApproval('measure')}
                >
                  Submit for Tollgate Review
                </button>
              </div>
            </div>

            {/* Measure Tools Section */}
            <div className={styles.section}>
              <h3>Measure Phase Tools</h3>
              <div className={styles.toolsGrid}>
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('dataCollection')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-database" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Data Collection</h4>
                    <p>Collect and organize data to establish baseline performance</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('dataCollection')]
                        }`}
                      >
                        {getToolStatusIcon('dataCollection')}{' '}
                        {getToolStatusText('dataCollection')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('controlChart')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-chart-line" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Control Chart</h4>
                    <p>Monitor process stability and identify special cause variation</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('controlChart')]
                        }`}
                      >
                        {getToolStatusIcon('controlChart')}{' '}
                        {getToolStatusText('controlChart')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('histogram')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-chart-bar" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Histogram</h4>
                    <p>Visualize data distribution and identify patterns</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('histogram')]
                        }`}
                      >
                        {getToolStatusIcon('histogram')}{' '}
                        {getToolStatusText('histogram')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('checksheet')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-clipboard-check" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Checksheet</h4>
                    <p>Systematically collect and tally data for analysis</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('checksheet')]
                        }`}
                      >
                        {getToolStatusIcon('checksheet')}{' '}
                        {getToolStatusText('checksheet')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Phase */}
        {currentPhase === 'analyze' && (
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h2>Analyze Phase</h2>
              <div className={styles.phaseActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => submitPhaseForApproval('analyze')}
                >
                  Submit for Tollgate Review
                </button>
              </div>
            </div>

            {/* Analyze Tools Section */}
            <div className={styles.section}>
              <h3>Analyze Phase Tools</h3>
              <div className={styles.toolsGrid}>
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('scatterPlot')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-chart-scatter" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Scatter Plot</h4>
                    <p>Analyze relationships and correlations between variables</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('scatterPlot')]
                        }`}
                      >
                        {getToolStatusIcon('scatterPlot')}{' '}
                        {getToolStatusText('scatterPlot')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('boxPlot')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-box" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Box Plot</h4>
                    <p>Visualize data distribution and identify outliers</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('boxPlot')]
                        }`}
                      >
                        {getToolStatusIcon('boxPlot')}{' '}
                        {getToolStatusText('boxPlot')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('anova')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-microscope" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>ANOVA</h4>
                    <p>Analyze variance between groups and identify significant differences</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('anova')]
                        }`}
                      >
                        {getToolStatusIcon('anova')}{' '}
                        {getToolStatusText('anova')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('gapAnalysis')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-bullseye" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Gap Analysis</h4>
                    <p>Identify gaps between current and desired performance</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('gapAnalysis')]
                        }`}
                      >
                        {getToolStatusIcon('gapAnalysis')}{' '}
                        {getToolStatusText('gapAnalysis')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Improve Phase */}
        {currentPhase === 'improve' && (
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h2>Improve Phase</h2>
              <div className={styles.phaseActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => submitPhaseForApproval('improve')}
                >
                  Submit for Tollgate Review
                </button>
              </div>
            </div>

            {/* Improve Tools Section */}
            <div className={styles.section}>
              <h3>Improve Phase Tools</h3>
              <div className={styles.toolsGrid}>
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('effortImpactMatrix')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-balance-scale" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Effort Impact Matrix</h4>
                    <p>Prioritize improvement opportunities based on effort and impact</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('effortImpactMatrix')]
                        }`}
                      >
                        {getToolStatusIcon('effortImpactMatrix')}{' '}
                        {getToolStatusText('effortImpactMatrix')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('projectPlanning')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-calendar-alt" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Project Planning</h4>
                    <p>Plan implementation timeline and resource allocation</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('projectPlanning')]
                        }`}
                      >
                        {getToolStatusIcon('projectPlanning')}{' '}
                        {getToolStatusText('projectPlanning')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Control Phase */}
        {currentPhase === 'control' && (
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h2>Control Phase</h2>
              <div className={styles.phaseActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => submitPhaseForApproval('control')}
                >
                  Submit for Final Review
                </button>
              </div>
            </div>

            {/* Control Tools Section */}
            <div className={styles.section}>
              <h3>Control Phase Tools</h3>
              <div className={styles.toolsGrid}>
                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('controlPlan')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-sliders-h" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Control Plan</h4>
                    <p>Establish monitoring and control systems for sustained improvement</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('controlPlan')]
                        }`}
                      >
                        {getToolStatusIcon('controlPlan')}{' '}
                        {getToolStatusText('controlPlan')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.toolCard}
                  onClick={() => launchTool('sustainmentPlan')}
                >
                  <div className={styles.toolIcon}>
                    <i className="fas fa-sync-alt" />
                  </div>
                  <div className={styles.toolInfo}>
                    <h4>Sustainment Plan</h4>
                    <p>Ensure long-term sustainability of improvements</p>
                    <div className={styles.toolStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[getToolStatus('sustainmentPlan')]
                        }`}
                      >
                        {getToolStatusIcon('sustainmentPlan')}{' '}
                        {getToolStatusText('sustainmentPlan')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Submit for Approval</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowApprovalModal(false)}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to submit this phase for approval?</p>
              <p>Once submitted, you will not be able to make changes until the review is complete.</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowApprovalModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  setShowApprovalModal(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tools Modal */}
      {showToolsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Launch Tool: {selectedTool}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowToolsModal(false)}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>This will open the {selectedTool} tool in a new window.</p>
              <p>Any data you create will be automatically linked to this DMAIC project.</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowToolsModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  setShowToolsModal(false);
                }}
              >
                Launch Tool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Helper */}
      {showAIHelper ? (
        <div className={styles.aiHelper}>
          <div className={styles.aiHeader}>
            <div className={styles.aiTitle}>
              <span className={styles.aiIcon}>AI</span>
              DMAIC Assistant
            </div>
            <button
              className={styles.aiToggle}
              onClick={() => setShowAIHelper(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.aiMessages}>
            {aiMessages.map(message => (
              <div
                key={message.id}
                className={`${styles.aiMessage} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.aiMessage} ${styles.ai}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.aiQuickActions}>
            <button
              className={styles.quickAction}
              onClick={() => handleQuickAction('How do I write a good problem statement?')}
            >
              Problem Statement Help
            </button>
            <button
              className={styles.quickAction}
              onClick={() => handleQuickAction('What tools should I use in this phase?')}
            >
              Recommended Tools
            </button>
            <button
              className={styles.quickAction}
              onClick={() => handleQuickAction('How do I calculate financial impact?')}
            >
              Financial Impact
            </button>
          </div>

          <div className={styles.aiInput}>
            <input
              type="text"
              className={styles.messageInput}
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendAIMessage()}
              placeholder="Ask me anything about DMAIC..."
            />
            <button
              className={styles.sendBtn}
              onClick={sendAIMessage}
              disabled={!currentMessage.trim()}
            >
              →
            </button>
          </div>
        </div>
      ) : (
        <button
          className={styles.aiToggleBtn}
          onClick={() => setShowAIHelper(true)}
        >
          <span className={styles.aiIcon}>AI</span>
          DMAIC Assistant
        </button>
      )}
    </div>
  );
};

export default DMAIC;
