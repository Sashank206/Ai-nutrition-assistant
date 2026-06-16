import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSend, FiMic, FiPaperclip, FiArrowRight } from "react-icons/fi";

function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 I am your AI Nutritionist. Ask me anything about custom diets, macronutrients, calorie tracking, or quick recipe preparations!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message to state
    setMessages((prev) => [...prev, { sender: "user", text }]);
    if (!textToSend) setInputValue("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chatbot",
        { message: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Add AI reply to state
      setMessages((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
    } catch (err) {
      console.error("Failed to query chatbot endpoint:", err);
      // Fallback response if offline/error
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am having trouble synchronizing with the server right now. Focus on hitting your target macronutrients and drink plenty of water!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionPills = [
    "Suggest a high protein snack",
    "How much water should I drink?",
    "Is peanut butter good for fat loss?",
    "Give me a quick high-protein recipe",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] justify-between">
      
      {/* Title Header */}
      <div className="border-b border-[#1F2433] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            AI Nutritionist
          </h1>
          <p className="text-xs text-gray-500 font-light mt-0.5">Real-time biochemical coaching and macro optimization advisor.</p>
        </div>
      </div>

      {/* Messages Scroll pane */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 px-2">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={idx}
              className={`flex flex-col max-w-[80%] ${
                isUser ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              {!isUser && (
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1 px-1">
                  AI Nutritionist
                </span>
              )}
              <div 
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser 
                    ? "bg-[#1F2433] text-white rounded-tr-none border border-[#2B3042]" 
                    : "bg-[#12141C] text-gray-200 rounded-tl-none border border-cyan-500/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex flex-col max-w-[80%] mr-auto items-start">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1 px-1 animate-pulse">
              AI Nutritionist is formulating response...
            </span>
            <div className="bg-[#12141C] p-4 rounded-2xl rounded-tl-none border border-cyan-500/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input container footer */}
      <div className="border-t border-[#1F2433] pt-4 space-y-4 bg-[#090A0F]">
        
        {/* Suggestion pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill)}
              className="flex-shrink-0 bg-[#12141C] hover:bg-[#1F2433] text-gray-400 hover:text-white border border-[#1F2433] hover:border-gray-700 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 bg-[#12141C] border border-[#1F2433] rounded-2xl p-2 focus-within:border-cyan-500/50 transition-colors">
          <button 
            onClick={() => alert("Simulated mic integration: voice input is active.")}
            className="p-2.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Voice message"
          >
            <FiMic />
          </button>
          <button 
            onClick={() => alert("Simulated image analysis upload.")}
            className="p-2.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Attach food photo"
          >
            <FiPaperclip />
          </button>
          
          <input
            type="text"
            placeholder="Ask AI Nutritionist about calories, macro goals, workouts..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2 py-1 placeholder-gray-500"
          />

          <button
            onClick={() => handleSendMessage()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center"
          >
            <FiSend />
          </button>
        </div>

      </div>

    </div>
  );
}

export default AIChatbot;
