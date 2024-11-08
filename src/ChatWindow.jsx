// src/ChatWindow.js
// import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import './ChatWindow.css';
import React, { useState, useRef, useEffect } from 'react';

const botProfile = "https://media.istockphoto.com/id/1448313693/vector/robot-in-circle-vector-icon.jpg?s=612x612&w=0&k=20&c=h3AOIz0RNIEVXEV5uoJIm8BFzleM8wEAvwscmeI5Aiw=";
const userProfile = "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";
const experianLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoNIvCiN9IFrU5F57MoJahPXaW2We5oC4WhQ&s";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [isRaisingIncident, setIsRaisingIncident] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentStatus, setIncidentStatus] = useState(false);
  const [isFeedback, setIsFeedback] = useState(false);
  const [isOfferingBoost, setIsOfferingBoost] = useState(false);
  const messagesEndRef = useRef(null);

  const proxyApiUrl = "http://localhost:5001/api/raiseIncident";


   // Sample responses for common queries
   const commonResponses = {
    "what is my current credit score": "Your current credit score is 650. To give your score a lift, consider using Experian Boost!",
    "how can i improve my credit score": "You can improve your credit score by paying your bills on time, reducing your outstanding debts, and avoiding opening multiple new credit accounts simultaneously.",
    "what factors are affecting my credit score": "Your credit score is affected by your payment history, credit utilization ratio, length of credit history, types of credit used, and recent credit inquiries.",
    "how do i dispute an error on my credit report": "To dispute an error, you can submit a dispute online through the credit bureau's website or send a written letter detailing the inaccuracies.",
    "what is the status of my loan application": "Your loan application is approved. You will receive the official confirmation via email shortly.",
    "can you recommend a credit card for me": "Based on your credit profile, the Premium Rewards Card would be a great fit, offering cash back and travel rewards.",
    "what is credit utilization": "Credit utilization is the percentage of your total available credit that you're currently using. Keeping it below 30% can positively impact your credit score.",
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);  

  // Handle button click options
  const handleOptionClick = (option) => {
    let botMessage = {};

    if (option === "Score") {
      botMessage = {
        text: "Your current credit score is 650. To give your score a lift, consider using Experian Boost!",
        sender: 'bot',
        profile: botProfile,
      };
      //setIsOfferingBoost(true);
    } else if (option === "Raise Incident") {
      botMessage = {
        text: "Please describe the issue you'd like to report.",
        sender: 'bot',
        profile: botProfile,
      };
      setIsRaisingIncident(true);
    } else if (option === "Know Incident Status") {
      botMessage = {
        text: "Please provide your incident ID to check the status.",
        sender: 'bot',
        profile: botProfile,
      };
      setIncidentStatus(true);
    }

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };


  // Handle user input
  const handleSendMessage = async (text) => {
    const userMessage = { text, sender: 'user', profile: userProfile };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const query = text.toLowerCase();
    let botMessage = {};

    if (isRaisingIncident) {
      setIncidentDescription(text);
      setIsRaisingIncident(false);

      botMessage = { text: "Raising your incident. Please wait...", sender: 'bot', profile: botProfile };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      try {
        const response = await fetch(proxyApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            short_description: text,
            urgency: "2",
            impact: "2",
            caller_id: "YOUR_CALLER_ID",
          }),
        });

        const data = await response.json();
        const incidentId = data.result.number;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Your incident has been raised successfully. Your incident ID is ${incidentId}. You will receive updates via email.`,
            sender: 'bot',
            profile: botProfile,
          },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "There was an error connecting to ServiceNow. Please try again later.",
            sender: 'bot',
            profile: botProfile,
          },
        ]);
      }
    } else if (incidentStatus && query.startsWith("inc")) {
      setIncidentStatus(false);
      botMessage = {
        text: `The status of your incident ${text} is 'In Progress'. Our support team is working on it.`,
        sender: 'bot',
        profile: botProfile,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else if (isOfferingBoost && ((query.includes("yes") || query.includes("no")))) {
        setIsOfferingBoost(false);
        if (query.includes("yes")) {
          botMessage = {
            text: "Great! To subscribe to Experian Boost, please follow the instructions on your screen.",
            sender: 'bot',
            profile: botProfile,
          };
        } else {
          botMessage = {
            text: "No problem! If you change your mind, feel free to let me know.",
            sender: 'bot',
            profile: botProfile,
          };
        }
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (
        query.includes("what's affecting my score") ||
        query.includes("what is affecting my score") ||
        query.includes("what factors are affecting my credit score")
      ) {
        botMessage = {
          text: "Factors affecting your score include payment history, credit utilization, length of credit history, types of credit used, and recent credit inquiries.",
          sender: 'bot',
          profile: botProfile,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (
        query.includes("what's experian boost") ||
        query.includes("what is experian boost")
      ) {
        botMessage = {
          text: "With Experian Boost, you can add positive payments to your score and potentially increase it! Would you like to give it a try?",
          sender: 'bot',
          profile: botProfile,
        };
        setIsOfferingBoost(true);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (
        query.includes("how can i improve my credit score") ||
        query.includes("how to improve my credit score") ||
        query.includes("how do i improve my credit score") ||
        query.includes("how to improve it")
      ) {
        botMessage = {
          text: "You can improve your credit score by paying your bills on time, reducing outstanding debts, and avoiding opening multiple new credit accounts simultaneously. Additionally, our Boost feature can help increase your score quickly. Would you like to subscribe to Experian Boost?",
          sender: 'bot',
          profile: botProfile,
        };
        setIsOfferingBoost(true);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (
        query.includes("I'm facing issue") ||
        query.includes("I am facing issue") ||
        query.includes("I want to raise incident")
      ) {
        botMessage = {
          text: "I'm sorry to hear that you're facing an issue. Please describe the issue you'd like to report.",
          sender: 'bot',
          profile: botProfile,
        };
        setIsRaisingIncident(true);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (
        query.includes("incident status")
      ) {
        botMessage = {
            text: "Please provide your incident ID to check the status.",
            sender: 'bot',
            profile: botProfile,
        };
        setIncidentStatus(true);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (commonResponses[query]) {
      botMessage = {
        text: commonResponses[query],
        sender: 'bot',
        profile: botProfile,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else if (isFeedback) {
      botMessage = {
        text: "Thank you for your feedback!",
        sender: 'bot',
        profile: botProfile,
      };
      setIsFeedback(false);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else {
      botMessage = {
        text: "I'm here to help! Could you please provide more details?",
        sender: 'bot',
        profile: botProfile,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  // Prompt for feedback
  const handleFeedback = () => {
    setIsFeedback(true);
    const feedbackMessage = {
      text: "Thank you for using Experian's support assistant! How would you rate your experience today?",
      sender: 'bot',
      profile: botProfile,
    };
    setMessages((prevMessages) => [...prevMessages, feedbackMessage]);
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <img src={experianLogo} alt="Experian Logo" className="header-icon" />
        <span className="header-title">Experian</span>
      </div>

      {/* Message Area */}
      <div className="messages">
        <div className="welcome-message">
          <div className="message-bubble bot">
            Hello! Welcome to Experian's support assistant. How can I assist you today?
          </div>
          <div className="options">
            <button onClick={() => handleOptionClick("Score")}>Score</button>
            <button onClick={() => handleOptionClick("Raise Incident")}>Raise Incident</button>
            <button onClick={() => handleOptionClick("Know Incident Status")}>Know Incident Status</button>
          </div>
        </div>

        {/* Message Bubbles */}
            {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
            ))}
        <div ref={messagesEndRef} />

      </div>

      {/* Input Box */}
      <InputBox onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
