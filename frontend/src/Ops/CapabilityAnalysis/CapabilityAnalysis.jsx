import React, { useState, useEffect } from 'react';
import styles from './CapabilityAnalysis.module.css';

const CapabilityAnalysis = () => {
  // Process Capability data structure
  const [capabilityData, setCapabilityData] = useState({
    projectName: '',
    processOwner: '',
    capabilityTeam: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    
    // Process information
    processInfo: {
      processName: '',
      characteristic: '',
      units: '',
      dataType: 'continuous', // 'continuous', 'discrete'
      sampleSize: 100,
      samplingPeriod: '',
      studyPurpose: ''
    },
    
    // Specifications
    specifications: {
      lsl: '', // Lower Specification Limit
      usl: '', // Upper Specification Limit
      target: '', // Target value
      tolerance: '',
      specType: 'bilateral' // 'bilateral', 'unilateral-upper', 'unilateral-lower'
    },
    
    // Data collection
    dataCollection: {
      collectionMethod: 'manual', // 'manual', 'automated', 'sampling'
      measurements: [],
      subgroupSize: 5,
      numberOfSubgroups: 20,
      collectionNotes: ''
    },
    
    // Analysis settings
    analysisSettings: {
      confidenceLevel: 95, // 90, 95, 99
      transformData: false,
      transformation: 'none', // 'none', 'log', 'sqrt', 'box-cox'
      outlierHandling: 'include', // 'include', 'exclude', 'investigate'
      assumeNormality: true
    },
    
    // Results (calculated)
    results: {
      descriptiveStats: {
        mean: 0,
        stdDev: 0,
        variance: 0,
        range: 0,
        minimum: 0,
        maximum: 0,
        median: 0,
        q1: 0,
        q3: 0
      },
      capabilityIndices: {
        cp: 0,
        cpk: 0,
        cpl: 0,
        cpu: 0,
        pp: 0,
        ppk: 0,
        ppl: 0,
        ppu: 0,
        cpm: 0
      },
        processPerformance: {
          processYield: 0,
          defectRate: 0,
          sigmaLevel: 0,
          ppm: 0
        },
      normalityTest: {
        andersonDarling: 0,
        pValue: 0,
        isNormal: false
      },
      processStability: {
        isStable: false,
        outOfControlPoints: 0,
        trends: 0,
        shifts: 0
      }
    }
  });

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to Process Capability Analysis! I'll help you assess your process performance against specifications. Capability studies determine if your process can consistently meet customer requirements. What process would you like to analyze?",
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
      if (capabilityData.projectName) completedFields++;
      if (capabilityData.processOwner) completedFields++;
      if (capabilityData.capabilityTeam) completedFields++;

      // Process info
      totalFields += 5;
      if (capabilityData.processInfo.processName) completedFields++;
      if (capabilityData.processInfo.characteristic) completedFields++;
      if (capabilityData.processInfo.units) completedFields++;
      if (capabilityData.processInfo.samplingPeriod) completedFields++;
      if (capabilityData.processInfo.studyPurpose) completedFields++;

      // Specifications
      totalFields += 3;
      if (capabilityData.specifications.lsl || capabilityData.specifications.usl) completedFields++;
      if (capabilityData.specifications.target) completedFields++;
      if (capabilityData.specifications.tolerance) completedFields++;

      // Data collection
      totalFields += 2;
      if (capabilityData.dataCollection.measurements.length > 0) completedFields++;
      if (capabilityData.dataCollection.collectionNotes) completedFields++;

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [capabilityData]);

  // Handle field changes
  const handleBasicInfoChange = (field, value) => {
    setCapabilityData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleProcessInfoChange = (field, value) => {
    setCapabilityData(prev => ({
      ...prev,
      processInfo: {
        ...prev.processInfo,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setCapabilityData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleDataCollectionChange = (field, value) => {
    setCapabilityData(prev => ({
      ...prev,
      dataCollection: {
        ...prev.dataCollection,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleAnalysisSettingsChange = (field, value) => {
    setCapabilityData(prev => ({
      ...prev,
      analysisSettings: {
        ...prev.analysisSettings,
        [field]: value
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  // Generate sample data
  const generateSampleData = () => {
    const sampleSize = capabilityData.processInfo.sampleSize;
    const target = parseFloat(capabilityData.specifications.target) || 10;
    const stdDev = 0.5; // Sample standard deviation
    
    const measurements = [];
    for (let i = 0; i < sampleSize; i++) {
      // Generate normal distribution around target
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = target + (z0 * stdDev);
      measurements.push({
        id: i + 1,
        value: parseFloat(value.toFixed(3)),
        timestamp: new Date(Date.now() - (sampleSize - i) * 60000).toISOString()
      });
    }
    
    handleDataCollectionChange('measurements', measurements);
  };

  // Import data from CSV
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const measurements = [];
        
        lines.forEach((line, index) => {
          if (line.trim() && index > 0) { // Skip header
            const value = parseFloat(line.trim());
            if (!isNaN(value)) {
              measurements.push({
                id: measurements.length + 1,
                value: value,
                timestamp: new Date().toISOString()
              });
            }
          }
        });
        
        handleDataCollectionChange('measurements', measurements);
      };
      reader.readAsText(file);
    }
  };

  // Calculate capability indices
  const calculateCapability = () => {
    const measurements = capabilityData.dataCollection.measurements;
    if (measurements.length === 0) return;

    const values = measurements.map(m => m.value);
    const n = values.length;
    
    // Descriptive statistics
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const range = maximum - minimum;
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = n % 2 === 0 ? 
      (sortedValues[n/2 - 1] + sortedValues[n/2]) / 2 : 
      sortedValues[Math.floor(n/2)];
    const q1 = sortedValues[Math.floor(n * 0.25)];
    const q3 = sortedValues[Math.floor(n * 0.75)];

    // Specification limits
    const lsl = parseFloat(capabilityData.specifications.lsl);
    const usl = parseFloat(capabilityData.specifications.usl);
    const target = parseFloat(capabilityData.specifications.target);

    // Capability indices
    let cp = 0, cpk = 0, cpl = 0, cpu = 0;
    let pp = 0, ppk = 0, ppl = 0, ppu = 0, cpm = 0;

    if (!isNaN(lsl) && !isNaN(usl)) {
      // Bilateral specifications
      cp = (usl - lsl) / (6 * stdDev);
      cpl = (mean - lsl) / (3 * stdDev);
      cpu = (usl - mean) / (3 * stdDev);
      cpk = Math.min(cpl, cpu);
      
      pp = cp; // Simplified for demo
      ppl = cpl;
      ppu = cpu;
      ppk = cpk;
      
      if (!isNaN(target)) {
        cpm = (usl - lsl) / (6 * Math.sqrt(variance + Math.pow(mean - target, 2)));
      }
    } else if (!isNaN(usl)) {
      // Upper specification only
      cpu = (usl - mean) / (3 * stdDev);
      cpk = cpu;
      ppu = cpu;
      ppk = cpu;
    } else if (!isNaN(lsl)) {
      // Lower specification only
      cpl = (mean - lsl) / (3 * stdDev);
      cpk = cpl;
      ppl = cpl;
      ppk = cpl;
    }

    // Process performance
    let processYield = 100;
    let defectRate = 0;
    let ppm = 0;
    
    if (!isNaN(lsl) && !isNaN(usl)) {
      const defects = values.filter(v => v < lsl || v > usl).length;
      defectRate = (defects / n) * 100;
      processYield = 100 - defectRate;
      ppm = defectRate * 10000; // Convert to parts per million
    }

    const sigmaLevel = cpk > 0 ? (cpk * 3) + 1.5 : 0; // Simplified sigma level

    // Update results
    setCapabilityData(prev => ({
      ...prev,
      results: {
        ...prev.results,
        descriptiveStats: {
          mean: parseFloat(mean.toFixed(4)),
          stdDev: parseFloat(stdDev.toFixed(4)),
          variance: parseFloat(variance.toFixed(4)),
          range: parseFloat(range.toFixed(4)),
          minimum: parseFloat(minimum.toFixed(4)),
          maximum: parseFloat(maximum.toFixed(4)),
          median: parseFloat(median.toFixed(4)),
          q1: parseFloat(q1.toFixed(4)),
          q3: parseFloat(q3.toFixed(4))
        },
        capabilityIndices: {
          cp: parseFloat(cp.toFixed(3)),
          cpk: parseFloat(cpk.toFixed(3)),
          cpl: parseFloat(cpl.toFixed(3)),
          cpu: parseFloat(cpu.toFixed(3)),
          pp: parseFloat(pp.toFixed(3)),
          ppk: parseFloat(ppk.toFixed(3)),
          ppl: parseFloat(ppl.toFixed(3)),
          ppu: parseFloat(ppu.toFixed(3)),
          cpm: parseFloat(cpm.toFixed(3))
        },
        processPerformance: {
          processYield: parseFloat(processYield.toFixed(2)),
          defectRate: parseFloat(defectRate.toFixed(4)),
          sigmaLevel: parseFloat(sigmaLevel.toFixed(2)),
          ppm: parseFloat(ppm.toFixed(0))
        },
        normalityTest: {
          andersonDarling: 0.234, // Mock value
          pValue: 0.156, // Mock value
          isNormal: true
        },
        processStability: {
          isStable: true, // Mock value
          outOfControlPoints: 0,
          trends: 0,
          shifts: 0
        }
      }
    }));
  };

  // Mock AI response generation
  const generateAIResponse = (userMessage) => {
    const responses = {
      'capability': "Process capability measures how well your process meets specifications. Cp measures potential capability (process spread vs. spec width), while Cpk measures actual capability (accounting for centering). Aim for Cp/Cpk ≥ 1.33 for capable processes, ≥ 1.67 for excellent processes.",
      'cpk': "Cpk is the most important capability index. It's the minimum of Cpl (lower capability) and Cpu (upper capability). Cpk < 1.0 means your process produces defects, Cpk = 1.33 means 99.99% yield, Cpk = 2.0 means Six Sigma quality (3.4 PPM defects).",
      'specifications': "Good specifications are critical for capability studies. Ensure specs reflect customer requirements, not just manufacturing convenience. Bilateral specs (LSL and USL) are most common. Target values help calculate Cpm. Verify specs are achievable and measurable.",
      'data collection': "Collect 100+ data points for reliable capability analysis. Data should represent normal operating conditions, include natural variation sources, and be collected over time. Avoid special causes during collection. Use rational subgrouping for control charts.",
      'normality': "Most capability indices assume normal distribution. Test normality using Anderson-Darling, Shapiro-Wilk, or normal probability plots. If data isn't normal, consider transformations (Box-Cox, log, sqrt) or use non-parametric methods.",
      'sample size': "Minimum 30 data points for capability analysis, but 100+ is preferred for reliable estimates. Larger samples give more precise capability estimates. Consider your process variation and required confidence level when determining sample size.",
      'interpretation': "Cp measures potential capability (if perfectly centered). Cpk measures actual capability (with current centering). Pp/Ppk use overall variation vs. within-subgroup variation. Cpm penalizes off-target performance. Focus on Cpk for process decisions.",
      'improvement': "Low capability can be improved by: Reducing variation (better equipment, training, materials), Improving centering (process adjustment, calibration), Widening specifications (if customer allows), Process redesign for fundamental improvement.",
      'default': "I can help with any aspect of process capability analysis. Ask about capability indices (Cp, Cpk, Pp, Ppk), data collection requirements, specification setting, normality testing, or results interpretation. What would you like to know?"
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
    <div className={styles.capabilityContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Process Capability Study</h1>
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
            <i className="fas fa-save"></i> Save Study
          </button>
          <button className={styles.exportBtn}>
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Section: Capability Information + AI Helper */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Process Capability Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Project Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={capabilityData.projectName}
                onChange={(e) => handleBasicInfoChange('projectName', e.target.value)}
                placeholder="Enter the project name for this capability study"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Process Owner <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={capabilityData.processOwner}
                  onChange={(e) => handleBasicInfoChange('processOwner', e.target.value)}
                  placeholder="Who owns this process?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Capability Team <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={capabilityData.capabilityTeam}
                  onChange={(e) => handleBasicInfoChange('capabilityTeam', e.target.value)}
                  placeholder="List team members conducting the study"
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
                  value={capabilityData.dateCreated}
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
                  value={capabilityData.lastUpdated}
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
                  Capability AI Guide
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
                  placeholder="Ask me about process capability..."
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
                    onClick={() => handleQuickAction('What is Cpk and how do I interpret it?')}
                  >
                    Understanding Cpk
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How much data do I need for capability analysis?')}
                  >
                    Sample Size
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I set good specifications?')}
                  >
                    Specifications
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I improve low capability?')}
                  >
                    Improvement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Details Section */}
        <div className={styles.processDetailsCard}>
          <div className={styles.sectionHeader}>
            <h2>Process Details</h2>
          </div>

          <div className={styles.processDetailsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Process Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={capabilityData.processInfo.processName}
                onChange={(e) => handleProcessInfoChange('processName', e.target.value)}
                placeholder="Name of the process being analyzed"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Characteristic <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={capabilityData.processInfo.characteristic}
                onChange={(e) => handleProcessInfoChange('characteristic', e.target.value)}
                placeholder="What characteristic is being measured?"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Units <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={capabilityData.processInfo.units}
                onChange={(e) => handleProcessInfoChange('units', e.target.value)}
                placeholder="Units of measurement (mm, inches, etc.)"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Data Type
              </label>
              <select
                className={styles.selectInput}
                value={capabilityData.processInfo.dataType}
                onChange={(e) => handleProcessInfoChange('dataType', e.target.value)}
              >
                <option value="continuous">Continuous (Variable)</option>
                <option value="discrete">Discrete (Attribute)</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Sample Size
              </label>
              <input
                type="number"
                className={styles.textInput}
                value={capabilityData.processInfo.sampleSize}
                onChange={(e) => handleProcessInfoChange('sampleSize', parseInt(e.target.value) || 100)}
                min="30"
                max="1000"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Sampling Period <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={capabilityData.processInfo.samplingPeriod}
                onChange={(e) => handleProcessInfoChange('samplingPeriod', e.target.value)}
                placeholder="Time period for data collection (e.g., 2 weeks)"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Study Purpose <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={capabilityData.processInfo.studyPurpose}
                onChange={(e) => handleProcessInfoChange('studyPurpose', e.target.value)}
                placeholder="Why is this capability study being conducted?"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className={styles.specificationsCard}>
          <div className={styles.sectionHeader}>
            <h2>Specifications</h2>
          </div>

          <div className={styles.specificationsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Specification Type
              </label>
              <select
                className={styles.selectInput}
                value={capabilityData.specifications.specType}
                onChange={(e) => handleSpecificationChange('specType', e.target.value)}
              >
                <option value="bilateral">Bilateral (LSL and USL)</option>
                <option value="unilateral-upper">Unilateral Upper (USL only)</option>
                <option value="unilateral-lower">Unilateral Lower (LSL only)</option>
              </select>
            </div>

            {(capabilityData.specifications.specType === 'bilateral' || 
              capabilityData.specifications.specType === 'unilateral-lower') && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Lower Specification Limit (LSL)
                </label>
                <input
                  type="number"
                  step="0.001"
                  className={styles.textInput}
                  value={capabilityData.specifications.lsl}
                  onChange={(e) => handleSpecificationChange('lsl', e.target.value)}
                  placeholder="Lower limit"
                />
              </div>
            )}

            {(capabilityData.specifications.specType === 'bilateral' || 
              capabilityData.specifications.specType === 'unilateral-upper') && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Upper Specification Limit (USL)
                </label>
                <input
                  type="number"
                  step="0.001"
                  className={styles.textInput}
                  value={capabilityData.specifications.usl}
                  onChange={(e) => handleSpecificationChange('usl', e.target.value)}
                  placeholder="Upper limit"
                />
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Target Value
              </label>
              <input
                type="number"
                step="0.001"
                className={styles.textInput}
                value={capabilityData.specifications.target}
                onChange={(e) => handleSpecificationChange('target', e.target.value)}
                placeholder="Target or nominal value"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Tolerance
              </label>
              <input
                type="number"
                step="0.001"
                className={styles.textInput}
                value={capabilityData.specifications.tolerance}
                onChange={(e) => handleSpecificationChange('tolerance', e.target.value)}
                placeholder="Total tolerance (USL - LSL)"
              />
            </div>
          </div>
        </div>

        {/* Data Collection Section */}
        <div className={styles.dataCollectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Data Collection</h2>
            <div className={styles.dataActions}>
              <button className={styles.generateBtn} onClick={generateSampleData}>
                <i className="fas fa-random"></i> Generate Sample Data
              </button>
              <label className={styles.importBtn}>
                <i className="fas fa-upload"></i> Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className={styles.dataCollectionGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Collection Method
              </label>
              <select
                className={styles.selectInput}
                value={capabilityData.dataCollection.collectionMethod}
                onChange={(e) => handleDataCollectionChange('collectionMethod', e.target.value)}
              >
                <option value="manual">Manual Measurement</option>
                <option value="automated">Automated System</option>
                <option value="sampling">Statistical Sampling</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Subgroup Size
              </label>
              <input
                type="number"
                className={styles.textInput}
                value={capabilityData.dataCollection.subgroupSize}
                onChange={(e) => handleDataCollectionChange('subgroupSize', parseInt(e.target.value) || 5)}
                min="1"
                max="25"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Number of Subgroups
              </label>
              <input
                type="number"
                className={styles.textInput}
                value={capabilityData.dataCollection.numberOfSubgroups}
                onChange={(e) => handleDataCollectionChange('numberOfSubgroups', parseInt(e.target.value) || 20)}
                min="5"
                max="100"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Collection Notes
              </label>
              <textarea
                className={styles.textareaInput}
                value={capabilityData.dataCollection.collectionNotes}
                onChange={(e) => handleDataCollectionChange('collectionNotes', e.target.value)}
                placeholder="Notes about data collection conditions, methods, etc."
                rows={3}
              />
            </div>
          </div>

          {capabilityData.dataCollection.measurements.length > 0 && (
            <div className={styles.dataPreview}>
              <h3>Data Preview ({capabilityData.dataCollection.measurements.length} measurements)</h3>
              <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                  <div>ID</div>
                  <div>Value</div>
                  <div>Timestamp</div>
                </div>
                {capabilityData.dataCollection.measurements.slice(0, 10).map((measurement) => (
                  <div key={measurement.id} className={styles.tableRow}>
                    <div>{measurement.id}</div>
                    <div>{measurement.value}</div>
                    <div>{new Date(measurement.timestamp).toLocaleString()}</div>
                  </div>
                ))}
                {capabilityData.dataCollection.measurements.length > 10 && (
                  <div className={styles.tableRow}>
                    <div colSpan="3" className={styles.moreData}>
                      ... and {capabilityData.dataCollection.measurements.length - 10} more measurements
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Analysis Settings Section */}
        <div className={styles.analysisSettingsCard}>
          <div className={styles.sectionHeader}>
            <h2>Analysis Settings</h2>
          </div>

          <div className={styles.analysisSettingsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Confidence Level
              </label>
              <select
                className={styles.selectInput}
                value={capabilityData.analysisSettings.confidenceLevel}
                onChange={(e) => handleAnalysisSettingsChange('confidenceLevel', parseInt(e.target.value))}
              >
                <option value={90}>90%</option>
                <option value={95}>95%</option>
                <option value={99}>99%</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Data Transformation
              </label>
              <select
                className={styles.selectInput}
                value={capabilityData.analysisSettings.transformation}
                onChange={(e) => handleAnalysisSettingsChange('transformation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="log">Log Transform</option>
                <option value="sqrt">Square Root</option>
                <option value="box-cox">Box-Cox</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Outlier Handling
              </label>
              <select
                className={styles.selectInput}
                value={capabilityData.analysisSettings.outlierHandling}
                onChange={(e) => handleAnalysisSettingsChange('outlierHandling', e.target.value)}
              >
                <option value="include">Include All Data</option>
                <option value="exclude">Exclude Outliers</option>
                <option value="investigate">Investigate Outliers</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={capabilityData.analysisSettings.assumeNormality}
                  onChange={(e) => handleAnalysisSettingsChange('assumeNormality', e.target.checked)}
                />
                Assume Normal Distribution
              </label>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={styles.resultsCard}>
          <div className={styles.sectionHeader}>
            <h2>Capability Analysis Results</h2>
            <button className={styles.analyzeBtn} onClick={calculateCapability}>
              <i className="fas fa-calculator"></i> Calculate Capability
            </button>
          </div>

          {capabilityData.dataCollection.measurements.length > 0 ? (
            <div className={styles.resultsContent}>
              {/* Capability Indices */}
              <div className={styles.capabilityIndices}>
                <h3>Capability Indices</h3>
                <div className={styles.indicesGrid}>
                  <div className={styles.indexCard}>
                    <h4>Cp</h4>
                    <div className={styles.indexValue}>
                      {capabilityData.results.capabilityIndices.cp}
                    </div>
                    <div className={styles.indexDescription}>Potential Capability</div>
                  </div>
                  <div className={styles.indexCard}>
                    <h4>Cpk</h4>
                    <div className={styles.indexValue}>
                      {capabilityData.results.capabilityIndices.cpk}
                    </div>
                    <div className={styles.indexDescription}>Actual Capability</div>
                  </div>
                  <div className={styles.indexCard}>
                    <h4>Pp</h4>
                    <div className={styles.indexValue}>
                      {capabilityData.results.capabilityIndices.pp}
                    </div>
                    <div className={styles.indexDescription}>Process Performance</div>
                  </div>
                  <div className={styles.indexCard}>
                    <h4>Ppk</h4>
                    <div className={styles.indexValue}>
                      {capabilityData.results.capabilityIndices.ppk}
                    </div>
                    <div className={styles.indexDescription}>Process Performance Index</div>
                  </div>
                </div>
              </div>

              {/* Process Performance */}
              <div className={styles.processPerformance}>
                <h3>Process Performance</h3>
                <div className={styles.performanceGrid}>
                  <div className={styles.performanceCard}>
                    <h4>Yield</h4>
                    <div className={styles.performanceValue}>
                      {capabilityData.results.processPerformance.processYield}%
                    </div>
                  </div>
                  <div className={styles.performanceCard}>
                    <h4>Defect Rate</h4>
                    <div className={styles.performanceValue}>
                      {capabilityData.results.processPerformance.defectRate}%
                    </div>
                  </div>
                  <div className={styles.performanceCard}>
                    <h4>Sigma Level</h4>
                    <div className={styles.performanceValue}>
                      {capabilityData.results.processPerformance.sigmaLevel}σ
                    </div>
                  </div>
                  <div className={styles.performanceCard}>
                    <h4>PPM Defects</h4>
                    <div className={styles.performanceValue}>
                      {capabilityData.results.processPerformance.ppm}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptive Statistics */}
              <div className={styles.descriptiveStats}>
                <h3>Descriptive Statistics</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Mean:</span>
                    <span className={styles.statValue}>{capabilityData.results.descriptiveStats.mean}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Std Dev:</span>
                    <span className={styles.statValue}>{capabilityData.results.descriptiveStats.stdDev}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Minimum:</span>
                    <span className={styles.statValue}>{capabilityData.results.descriptiveStats.minimum}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Maximum:</span>
                    <span className={styles.statValue}>{capabilityData.results.descriptiveStats.maximum}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Range:</span>
                    <span className={styles.statValue}>{capabilityData.results.descriptiveStats.range}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Median:</span>
                    <span className={styles.statValue}>{capabilityData.results.descriptiveStats.median}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyResults}>
              <i className="fas fa-chart-bar"></i>
              <p>Add measurement data and click "Calculate Capability" to see analysis results.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.completionStatus}>
            <i className="fas fa-check-circle"></i>
            <span>Capability Study {completionPercentage}% Complete</span>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.secondaryBtn}>
              <i className="fas fa-eye"></i> Preview Report
            </button>
            <button 
              className={styles.primaryBtn}
              disabled={completionPercentage < 80}
            >
              <i className="fas fa-check"></i> Complete Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilityAnalysis;

