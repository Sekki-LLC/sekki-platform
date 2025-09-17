import React, { useState, useCallback, useEffect } from 'react';
import styles from './SIPOC.module.css';

const SIPOC = () => {
  // SIPOC data structure
  const [sipocData, setSipocData] = useState({
    processName: '',
    processOwner: '',
    processDescription: '',
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    suppliers: [{ id: 1, name: '', type: 'Internal', description: '' }],
    inputs: [{ id: 1, name: '', type: 'Material', description: '' }],
    process: [{ id: 1, step: '', description: '', owner: '', duration: '' }],
    outputs: [{ id: 1, name: '', type: 'Product', description: '' }],
    customers: [{ id: 1, name: '', type: 'Internal', description: '' }]
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // AI Chat state - matching RCA structure
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to SIPOC! I'll help you map your process by identifying Suppliers, Inputs, Process steps, Outputs, and Customers. Let's start by defining your process name and scope.",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Chat responses
  const generateAIResponse = (userMessage) => {
    const responses = {
      'suppliers': "Suppliers provide inputs to your process. They can be internal (other departments) or external (vendors, customers). Think about who provides materials, information, or services that your process needs to function.",
      'inputs': "Inputs are what your process receives from suppliers. These can be materials, information, services, or resources. Consider both physical items and data/information flows into your process.",
      'process': "The process is the series of steps that transform inputs into outputs. Focus on the high-level steps (5-7 steps max) rather than detailed procedures. Each step should add value toward creating the output.",
      'outputs': "Outputs are what your process produces for customers. These can be products, services, information, or decisions. Think about both primary outputs and any secondary outputs or by-products.",
      'customers': "Customers receive the outputs from your process. They can be internal (other departments) or external (end customers). Consider both direct customers and anyone who uses or benefits from your process outputs.",
      'mapping': "SIPOC mapping helps you understand process boundaries and stakeholders. Start with the process steps in the middle, then identify what inputs are needed and what outputs are produced. Finally, determine who supplies the inputs and who receives the outputs.",
      'default': "I can help you with any aspect of SIPOC analysis. Ask about suppliers, inputs, process steps, outputs, customers, or general SIPOC mapping guidance."
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  // Handle sending chat messages - matching RCA structure
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

      // Process info (3 fields)
      totalFields += 3;
      if (sipocData.processName) completedFields++;
      if (sipocData.processOwner) completedFields++;
      if (sipocData.processDescription) completedFields++;

      // SIPOC items - count essential fields
      const sections = ['suppliers', 'inputs', 'process', 'outputs', 'customers'];
      sections.forEach(section => {
        sipocData[section].forEach(item => {
          totalFields += 2; // name/step and description
          if (section === 'process') {
            if (item.step && item.step.trim() !== '') completedFields++;
          } else {
            if (item.name && item.name.trim() !== '') completedFields++;
          }
          if (item.description && item.description.trim() !== '') completedFields++;
        });
      });

      const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [sipocData]);

  // Handle process info changes
  const handleProcessInfoChange = useCallback((field, value) => {
    setSipocData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, []);

  // Handle SIPOC item changes
  const handleSipocItemChange = useCallback((section, id, field, value) => {
    setSipocData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  }, []);

  // Add new SIPOC item
  const addSipocItem = useCallback((section) => {
    setSipocData(prev => {
      const newId = Math.max(...prev[section].map(item => item.id)) + 1;
      const newItem = { id: newId, name: '', description: '' };
      
      // Add section-specific fields
      if (section === 'suppliers' || section === 'customers') {
        newItem.type = section === 'suppliers' ? 'Internal' : 'Internal';
      } else if (section === 'inputs' || section === 'outputs') {
        newItem.type = section === 'inputs' ? 'Material' : 'Product';
      } else if (section === 'process') {
        newItem.step = '';
        newItem.owner = '';
        newItem.duration = '';
        delete newItem.name; // Process uses 'step' instead of 'name'
      }

      return {
        ...prev,
        [section]: [...prev[section], newItem],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    });
  }, []);

  // Remove SIPOC item
  const removeSipocItem = useCallback((section, id) => {
    setSipocData(prev => {
      if (prev[section].length > 1) {
        return {
          ...prev,
          [section]: prev[section].filter(item => item.id !== id),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return prev;
    });
  }, []);

  // Save draft
  const handleSave = () => {
    console.log('Saving SIPOC draft:', sipocData);
    // Implement save functionality
  };

  // Export PDF
  const handleExport = () => {
    console.log('Exporting SIPOC to PDF:', sipocData);
    // Implement export functionality
  };

  return (
    <div className={styles.rcaContainer}>
      {/* Header - Exact match to RCA/A3 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>SIPOC Analysis</h1>
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
        {/* Top Section: Process Information + AI Helper - Exact match to RCA/A3 */}
        <div className={styles.topSection}>
          <div className={styles.processInfoCard}>
            <h2>Process Information</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Process Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={sipocData.processName}
                onChange={(e) => handleProcessInfoChange('processName', e.target.value)}
                placeholder="Enter the process name for SIPOC analysis"
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
                  value={sipocData.processOwner}
                  onChange={(e) => handleProcessInfoChange('processOwner', e.target.value)}
                  placeholder="Who owns this process?"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Date Created
                </label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={sipocData.dateCreated}
                  onChange={(e) => handleProcessInfoChange('dateCreated', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Process Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textareaInput}
                value={sipocData.processDescription}
                onChange={(e) => handleProcessInfoChange('processDescription', e.target.value)}
                placeholder="Describe the purpose and scope of this process"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <h3>
                  <i className="fas fa-robot"></i>
                  SIPOC AI Guide
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
                  placeholder="Ask me about SIPOC analysis..."
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
                    onClick={() => handleQuickAction('How do I identify suppliers for my process?')}
                  >
                    Identify Suppliers
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('What types of inputs should I consider?')}
                  >
                    Process Inputs
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I define the right process steps?')}
                  >
                    Process Steps
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I identify all process outputs?')}
                  >
                    Process Outputs
                  </button>
                  <button 
                    className={styles.quickBtn}
                    onClick={() => handleQuickAction('How do I identify process customers?')}
                  >
                    Identify Customers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIPOC Grid Section - Full Width - Keep existing structure */}
        <div className={styles.analysisCard}>
          <h2>SIPOC Grid</h2>
          <div className={styles.sipocGrid}>
            <div className={styles.sipocTable}>
              {/* SIPOC Header */}
              <div className={styles.sipocHeader}>
                <div className={styles.sipocColumn}>
                  <h3>Suppliers</h3>
                  <p>Who provides inputs?</p>
                </div>
                <div className={styles.sipocColumn}>
                  <h3>Inputs</h3>
                  <p>What is needed?</p>
                </div>
                <div className={styles.sipocColumn}>
                  <h3>Process</h3>
                  <p>What steps transform inputs?</p>
                </div>
                <div className={styles.sipocColumn}>
                  <h3>Outputs</h3>
                  <p>What is produced?</p>
                </div>
                <div className={styles.sipocColumn}>
                  <h3>Customers</h3>
                  <p>Who receives outputs?</p>
                </div>
              </div>

              {/* SIPOC Body */}
              <div className={styles.sipocBody}>
                {/* Determine max rows */}
                {Array.from({ 
                  length: Math.max(
                    sipocData.suppliers.length,
                    sipocData.inputs.length,
                    sipocData.process.length,
                    sipocData.outputs.length,
                    sipocData.customers.length
                  )
                }).map((_, rowIndex) => (
                  <div key={rowIndex} className={styles.sipocRow}>
                    {/* Suppliers Column */}
                    <div className={styles.sipocCell}>
                      {sipocData.suppliers[rowIndex] && (
                        <div className={styles.sipocItem}>
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.suppliers[rowIndex].name}
                            onChange={(e) => handleSipocItemChange('suppliers', sipocData.suppliers[rowIndex].id, 'name', e.target.value)}
                            placeholder="Supplier name"
                          />
                          <select
                            className={styles.sipocSelect}
                            value={sipocData.suppliers[rowIndex].type}
                            onChange={(e) => handleSipocItemChange('suppliers', sipocData.suppliers[rowIndex].id, 'type', e.target.value)}
                          >
                            <option value="Internal">Internal</option>
                            <option value="External">External</option>
                          </select>
                          <textarea
                            className={styles.sipocTextarea}
                            value={sipocData.suppliers[rowIndex].description}
                            onChange={(e) => handleSipocItemChange('suppliers', sipocData.suppliers[rowIndex].id, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                          />
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeSipocItem('suppliers', sipocData.suppliers[rowIndex].id)}
                            disabled={sipocData.suppliers.length <= 1}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inputs Column */}
                    <div className={styles.sipocCell}>
                      {sipocData.inputs[rowIndex] && (
                        <div className={styles.sipocItem}>
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.inputs[rowIndex].name}
                            onChange={(e) => handleSipocItemChange('inputs', sipocData.inputs[rowIndex].id, 'name', e.target.value)}
                            placeholder="Input name"
                          />
                          <select
                            className={styles.sipocSelect}
                            value={sipocData.inputs[rowIndex].type}
                            onChange={(e) => handleSipocItemChange('inputs', sipocData.inputs[rowIndex].id, 'type', e.target.value)}
                          >
                            <option value="Material">Material</option>
                            <option value="Information">Information</option>
                            <option value="Service">Service</option>
                            <option value="Resource">Resource</option>
                          </select>
                          <textarea
                            className={styles.sipocTextarea}
                            value={sipocData.inputs[rowIndex].description}
                            onChange={(e) => handleSipocItemChange('inputs', sipocData.inputs[rowIndex].id, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                          />
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeSipocItem('inputs', sipocData.inputs[rowIndex].id)}
                            disabled={sipocData.inputs.length <= 1}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Process Column */}
                    <div className={styles.sipocCell}>
                      {sipocData.process[rowIndex] && (
                        <div className={styles.sipocItem}>
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.process[rowIndex].step}
                            onChange={(e) => handleSipocItemChange('process', sipocData.process[rowIndex].id, 'step', e.target.value)}
                            placeholder="Process step"
                          />
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.process[rowIndex].owner}
                            onChange={(e) => handleSipocItemChange('process', sipocData.process[rowIndex].id, 'owner', e.target.value)}
                            placeholder="Step owner"
                          />
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.process[rowIndex].duration}
                            onChange={(e) => handleSipocItemChange('process', sipocData.process[rowIndex].id, 'duration', e.target.value)}
                            placeholder="Duration"
                          />
                          <textarea
                            className={styles.sipocTextarea}
                            value={sipocData.process[rowIndex].description}
                            onChange={(e) => handleSipocItemChange('process', sipocData.process[rowIndex].id, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                          />
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeSipocItem('process', sipocData.process[rowIndex].id)}
                            disabled={sipocData.process.length <= 1}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Outputs Column */}
                    <div className={styles.sipocCell}>
                      {sipocData.outputs[rowIndex] && (
                        <div className={styles.sipocItem}>
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.outputs[rowIndex].name}
                            onChange={(e) => handleSipocItemChange('outputs', sipocData.outputs[rowIndex].id, 'name', e.target.value)}
                            placeholder="Output name"
                          />
                          <select
                            className={styles.sipocSelect}
                            value={sipocData.outputs[rowIndex].type}
                            onChange={(e) => handleSipocItemChange('outputs', sipocData.outputs[rowIndex].id, 'type', e.target.value)}
                          >
                            <option value="Product">Product</option>
                            <option value="Service">Service</option>
                            <option value="Information">Information</option>
                            <option value="Decision">Decision</option>
                          </select>
                          <textarea
                            className={styles.sipocTextarea}
                            value={sipocData.outputs[rowIndex].description}
                            onChange={(e) => handleSipocItemChange('outputs', sipocData.outputs[rowIndex].id, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                          />
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeSipocItem('outputs', sipocData.outputs[rowIndex].id)}
                            disabled={sipocData.outputs.length <= 1}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Customers Column */}
                    <div className={styles.sipocCell}>
                      {sipocData.customers[rowIndex] && (
                        <div className={styles.sipocItem}>
                          <input
                            type="text"
                            className={styles.sipocInput}
                            value={sipocData.customers[rowIndex].name}
                            onChange={(e) => handleSipocItemChange('customers', sipocData.customers[rowIndex].id, 'name', e.target.value)}
                            placeholder="Customer name"
                          />
                          <select
                            className={styles.sipocSelect}
                            value={sipocData.customers[rowIndex].type}
                            onChange={(e) => handleSipocItemChange('customers', sipocData.customers[rowIndex].id, 'type', e.target.value)}
                          >
                            <option value="Internal">Internal</option>
                            <option value="External">External</option>
                          </select>
                          <textarea
                            className={styles.sipocTextarea}
                            value={sipocData.customers[rowIndex].description}
                            onChange={(e) => handleSipocItemChange('customers', sipocData.customers[rowIndex].id, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                          />
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeSipocItem('customers', sipocData.customers[rowIndex].id)}
                            disabled={sipocData.customers.length <= 1}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add buttons for each column */}
              <div className={styles.sipocActions}>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addSipocItem('suppliers')}
                >
                  <i className="fas fa-plus"></i> Add Supplier
                </button>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addSipocItem('inputs')}
                >
                  <i className="fas fa-plus"></i> Add Input
                </button>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addSipocItem('process')}
                >
                  <i className="fas fa-plus"></i> Add Step
                </button>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addSipocItem('outputs')}
                >
                  <i className="fas fa-plus"></i> Add Output
                </button>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addSipocItem('customers')}
                >
                  <i className="fas fa-plus"></i> Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow Visualization - Keep existing structure */}
        <div className={styles.analysisCard}>
          <h2>Process Flow</h2>
          <p className={styles.processFlowDescription}>
            Visual representation of your process steps in sequence
          </p>
          <div className={styles.processFlow}>
            {sipocData.process.length > 0 ? (
              sipocData.process.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepContent}>
                      <h4>{step.step || 'Untitled Step'}</h4>
                      <p>{step.description || 'No description provided'}</p>
                      <div className={styles.stepDetails}>
                        <span>Owner: {step.owner || 'Not assigned'}</span>
                        <span>Duration: {step.duration || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  {index < sipocData.process.length - 1 && (
                    <div className={styles.stepArrow}>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className={styles.emptyState}>
                Add process steps above to see the flow visualization
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIPOC;

