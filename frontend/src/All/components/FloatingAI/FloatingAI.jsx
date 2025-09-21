import React, { useState, useEffect, useRef } from 'react';
import styles from './FloatingAI.module.css';

const FloatingAI = ({ 
  isGuidedMode = false, 
  currentPage = 'unknown',
  currentTool = 'unknown',
  onDataUpdate = null,
  formData = {},
  setFormData = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [extractedData, setExtractedData] = useState({});
  const messagesEndRef = useRef(null);

  // Data extraction patterns for different tools
  const dataPatterns = {
    a3: {
      projectTitle: /(?:project title|title|project name)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      problemOwner: /(?:problem owner|owner|responsible)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      teamMembers: /(?:team members?|team|members?)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      background: /(?:background|context|situation)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      problemStatement: /(?:problem statement|problem|issue)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      businessImpact: /(?:business impact|impact|effect)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      currentStateDescription: /(?:current state|current situation|as-is)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      goalStatement: /(?:goal|target|objective)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      targetStateDescription: /(?:target state|future state|to-be)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      results: /(?:results?|outcomes?|achievements?)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      lessonsLearned: /(?:lessons? learned|learnings?|takeaways?)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      nextSteps: /(?:next steps?|future actions?|follow.?up)(?:\s*:?\s*)(.*?)(?:\.|$)/i
    },
    finy: {
      projectTitle: /(?:project title|title|project name)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      baseline: /(?:baseline|current performance|starting point)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      target: /(?:target|goal|improvement target)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      timeframe: /(?:timeframe|timeline|duration)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      cost: /(?:cost|investment|budget)(?:\s*:?\s*)(.*?)(?:\.|$)/i,
      savings: /(?:savings|benefit|roi)(?:\s*:?\s*)(.*?)(?:\.|$)/i
    }
  };

  // Get context-aware welcome message
  const getWelcomeMessage = (page, tool) => {
    const welcomeMessages = {
      'a3': "Hi! I'm Kii, your A3 Problem Solving assistant. I can help you fill out your A3 form by asking you questions and automatically populating the fields. Let's start with your project title - what problem are you working on?",
      'finy': "Hello! I'm Kii, your FinY assistant. I can help you calculate financial benefits and fill out your analysis. What project are you analyzing for financial impact?",
      'sipoc': "Hi! I'm Kii, here to help you create your SIPOC diagram. I can guide you through each section and fill in the details. What process are you mapping?",
      'default': `Hi! I'm Kii, your ${tool} assistant. I can help you fill out the form and guide you through the process. What would you like to work on?`
    };
    return welcomeMessages[tool.toLowerCase()] || welcomeMessages['default'];
  };

  // Initialize with context-aware welcome message
  useEffect(() => {
    if (isGuidedMode && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(currentPage, currentTool);
      setMessages([{
        id: Date.now(),
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [currentPage, currentTool, messages.length, isGuidedMode]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isGuidedMode) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGuidedMode]);

  // Extract data from user messages
  const extractDataFromMessage = (message, tool) => {
    const patterns = dataPatterns[tool.toLowerCase()] || {};
    const extracted = {};

    Object.entries(patterns).forEach(([field, pattern]) => {
      const match = message.match(pattern);
      if (match && match[1]) {
        extracted[field] = match[1].trim();
      }
    });

    return extracted;
  };

  // Update form data based on extracted information
  const updateFormData = (extractedData) => {
    if (setFormData && Object.keys(extractedData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));

      // Trigger callback if provided
      if (onDataUpdate) {
        onDataUpdate(extractedData);
      }

      setExtractedData(prev => ({ ...prev, ...extractedData }));
    }
  };

  // Generate intelligent follow-up questions
  const generateFollowUpQuestion = (tool, extractedData, allFormData) => {
    const questions = {
      a3: [
        { field: 'projectTitle', question: "Great! Now, who is the problem owner or person responsible for this issue?" },
        { field: 'problemOwner', question: "Perfect! Who are the team members involved in solving this problem?" },
        { field: 'teamMembers', question: "Excellent! Can you provide some background context about why this problem is important to solve now?" },
        { field: 'background', question: "Thanks! Now, can you clearly state the problem without including any solutions?" },
        { field: 'problemStatement', question: "Good! What's the business impact of this problem?" },
        { field: 'businessImpact', question: "Now let's analyze the current state. Can you describe the current situation with facts and data?" },
        { field: 'currentStateDescription', question: "What's your goal or target state for this problem?" },
        { field: 'goalStatement', question: "Can you describe what the target state will look like in detail?" },
        { field: 'targetStateDescription', question: "What results have you achieved so far?" },
        { field: 'results', question: "What lessons have you learned during this process?" },
        { field: 'lessonsLearned', question: "Finally, what are the next steps or future actions?" }
      ],
      finy: [
        { field: 'projectTitle', question: "Great! What's your current baseline performance or starting point?" },
        { field: 'baseline', question: "Perfect! What's your target improvement or goal?" },
        { field: 'target', question: "Excellent! What's the timeframe for this improvement?" },
        { field: 'timeframe', question: "What's the estimated cost or investment required?" },
        { field: 'cost', question: "What savings or benefits do you expect to achieve?" }
      ]
    };

    const toolQuestions = questions[tool.toLowerCase()] || [];
    
    // Find the next unanswered field
    for (const { field, question } of toolQuestions) {
      if (!allFormData[field] || allFormData[field].trim() === '') {
        return question;
      }
    }

    return "Great! You've provided comprehensive information. Is there anything else you'd like to add or modify?";
  };

  // Generate AI response with data extraction and form updates
  const generateAIResponse = (userInput, tool) => {
    const input = userInput.toLowerCase();
    
    // Extract data from user message
    const extracted = extractDataFromMessage(userInput, tool);
    
    // Update form if data was extracted
    if (Object.keys(extracted).length > 0) {
      updateFormData(extracted);
      
      // Generate confirmation message
      const confirmations = Object.entries(extracted).map(([field, value]) => {
        const fieldNames = {
          projectTitle: 'project title',
          problemOwner: 'problem owner',
          teamMembers: 'team members',
          background: 'background',
          problemStatement: 'problem statement',
          businessImpact: 'business impact',
          currentStateDescription: 'current state',
          goalStatement: 'goal',
          targetStateDescription: 'target state',
          results: 'results',
          lessonsLearned: 'lessons learned',
          nextSteps: 'next steps'
        };
        
        return `✓ ${fieldNames[field] || field}: "${value}"`;
      }).join('\n');

      // Generate follow-up question
      const followUp = generateFollowUpQuestion(tool, extracted, { ...formData, ...extracted });
      
      return `Perfect! I've updated your ${tool.toUpperCase()} form with:\n\n${confirmations}\n\n${followUp}`;
    }

    // Handle specific questions
    if (input.includes('help') || input.includes('how')) {
      return getHelpResponse(tool);
    }
    if (input.includes('start') || input.includes('begin')) {
      return getStartResponse(tool);
    }
    if (input.includes('example') || input.includes('sample')) {
      return getExampleResponse(tool);
    }
    if (input.includes('what') && input.includes('next')) {
      return generateFollowUpQuestion(tool, extractedData, formData);
    }

    // Default response encouraging data input
    return `I'm here to help you fill out your ${tool.toUpperCase()} form. You can tell me about your project, problem, goals, or any other details, and I'll automatically update the form fields. What would you like to share?`;
  };

  // Get help response for any tool
  const getHelpResponse = (tool) => {
    const helpResponses = {
      'a3': "I can help you fill out your A3 form step by step. Just tell me about your project title, problem owner, team members, background, problem statement, business impact, current state, goals, target state, results, lessons learned, and next steps. I'll automatically populate the form fields as we talk!",
      'finy': "I can help you complete your FinY analysis by gathering information about your project title, baseline performance, targets, timeframe, costs, and expected savings. Just describe your project and I'll fill in the details!",
      'default': `I can help you complete your ${tool} form by extracting information from our conversation and automatically filling in the fields. Just tell me about your project and I'll guide you through each step!`
    };
    
    return helpResponses[tool.toLowerCase()] || helpResponses['default'];
  };

  // Get start response for any tool
  const getStartResponse = (tool) => {
    return `Let's start your ${tool.toUpperCase()} analysis! First, what's the title or name of your project? I'll automatically fill in the form as you provide information.`;
  };

  // Get example response for any tool
  const getExampleResponse = (tool) => {
    const examples = {
      'a3': "Here's how you can provide information: 'My project title is Reduce Customer Wait Time. The problem owner is Sarah Johnson from Customer Service. Our team includes Mike from Operations and Lisa from Quality. The background is that customer complaints about wait times have increased 25% this quarter...' I'll extract and fill in all these details automatically!",
      'finy': "Here's an example: 'My project is Process Automation Implementation. Our baseline is 60 minutes per transaction. We want to target 45 minutes. The timeframe is 6 months. Investment cost is $50,000. Expected annual savings is $200,000.' I'll populate all the financial fields from this information!",
      'default': `You can provide information naturally, like: 'My project is about improving efficiency. The current state shows 30% waste. We want to achieve 15% waste reduction...' I'll extract the relevant details and fill in your ${tool} form automatically.`
    };
    
    return examples[tool.toLowerCase()] || examples['default'];
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content, currentTool);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Show notification if chat is minimized
      if (!isOpen) {
        setHasNewMessage(true);
      }
    }, 1000 + Math.random() * 2000);
  };

  // Handle quick action buttons
  const handleQuickAction = (action) => {
    const quickActions = {
      'help': `How do I use ${currentTool} effectively?`,
      'example': `Can you show me an example for ${currentTool}?`,
      'start': `Let's start filling out my ${currentTool} form`,
      'next': `What should I tell you next?`,
      'review': `Can you review what we've filled in so far?`
    };

    const message = quickActions[action] || action;
    setInputMessage(message);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render if not in guided mode
  if (!isGuidedMode) {
    return null;
  }

  return (
    <div className={styles.floatingAI}>
      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.aiAvatar}>
                <i className="fas fa-wand-magic-sparkles"></i>
              </div>
              <div className={styles.headerText}>
                <h4>Kii</h4>
                <span className={styles.status}>
                  {isTyping ? 'Typing...' : 'Ready to help'}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.minimizeBtn}
                onClick={toggleChat}
                aria-label="Minimize chat"
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${styles.message} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>
                  {message.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
                <div className={styles.messageTime}>
                  {message.timestamp}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.ai}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <button 
              className={styles.quickBtn}
              onClick={() => handleQuickAction('help')}
            >
              <i className="fas fa-question-circle"></i>
              Help
            </button>
            <button 
              className={styles.quickBtn}
              onClick={() => handleQuickAction('example')}
            >
              <i className="fas fa-lightbulb"></i>
              Example
            </button>
            <button 
              className={styles.quickBtn}
              onClick={() => handleQuickAction('start')}
            >
              <i className="fas fa-play"></i>
              Start
            </button>
            <button 
              className={styles.quickBtn}
              onClick={() => handleQuickAction('next')}
            >
              <i className="fas fa-arrow-right"></i>
              What's Next?
            </button>
            <button 
              className={styles.quickBtn}
              onClick={() => handleQuickAction('review')}
            >
              <i className="fas fa-eye"></i>
              Review
            </button>
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Tell Kii about your ${currentTool} project...`}
              className={styles.messageInput}
            />
            <button 
              className={styles.sendBtn}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        className={`${styles.floatingBtn} ${isOpen ? styles.open : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close Kii' : 'Open Kii'}
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-wand-magic-sparkles"></i>
            {hasNewMessage && <div className={styles.notification}></div>}
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingAI;
