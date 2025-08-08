import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(0);
  const [ticketCount, setTicketCount] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [paid, setPaid] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Welcome to National Museum. What's your name?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const totalAmount = ticketCount * 200;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (from, text) => {
    if (from === "bot") {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { from, text }]);
        setIsTyping(false);
      }, 800);
    } else {
      setMessages((prev) => [...prev, { from, text }]);
    }
  };

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      setLoggedIn(true);
      setStep(1);
      addMessage("bot", `Hi ${username}, how many tickets would you like to book?`);
    } else {
      alert("Please enter both username and password.");
    }
  };

  const handleDownload = () => {
    const content = `National Museum Ticket\n\nName: ${username}\nTickets: ${ticketCount}\nDate: ${preferredDate}\nTime: ${preferredTime}\nTotal Paid: ₹${totalAmount}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MuseumTicket.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    if (step === 1 && ticketCount > 0) {
      setStep(2);
      addMessage("bot", `Each ticket costs ₹200. Total: ₹${totalAmount}. Please select a visit date.`);
    } else if (step === 2 && preferredDate) {
      setStep(3);
      addMessage("bot", `Nice! Now choose your preferred time.`);
    } else if (step === 3 && preferredTime) {
      setStep(4);
      addMessage("bot", `Booking summary: ${ticketCount} ticket(s) on ${preferredDate} at ${preferredTime}. Total: ₹${totalAmount}. Ready to pay?`);
    } else if (step === 4) {
      setPaid(true);
      setStep(5);
      addMessage("bot", `Payment successful! Your ticket is ready to download.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col items-center font-sans text-yellow-900">
      <header className="bg-yellow-300 shadow-md w-full py-5 text-center rounded-b-3xl mb-6">
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-md">National Museum</h1>
        <p className="text-lg mt-1 font-medium">Explore history with us</p>
      </header>

      <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl p-8 flex flex-col">
        {!loggedIn ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-yellow-800 mb-4">Login to MuseumBot</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full px-5 py-3 rounded-xl border border-yellow-300 focus:ring-4 focus:ring-yellow-400 focus:outline-none transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-yellow-300 focus:ring-4 focus:ring-yellow-400 focus:outline-none transition"
            />
            <button
              onClick={handleLogin}
              disabled={!username.trim() || !password.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                username.trim() && password.trim() ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-300 cursor-not-allowed"
              }`}
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-yellow-900 mb-6 text-center select-none">🎫 Museum Chatbot</h2>

            <div className="flex-1 bg-yellow-50 rounded-2xl p-6 shadow-inner overflow-y-auto max-h-[420px] mb-6 space-y-3 flex flex-col">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.from === "user"
                      ? "bg-yellow-400 text-yellow-900 self-end rounded-br-none shadow-md"
                      : "bg-white text-yellow-900 self-start rounded-bl-none shadow-md"
                  }`}
                  style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start" }}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white text-yellow-700 px-4 py-2 rounded-2xl w-28 animate-pulse shadow-md self-start">MuseumBot is typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {step === 1 && (
              <div className="flex gap-4">
                <input
                  type="number"
                  min="1"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(e.target.value.replace(/\D/, ""))}
                  placeholder="Number of tickets"
                  autoFocus
                  className="flex-grow px-5 py-3 rounded-xl border border-yellow-300 focus:ring-4 focus:ring-yellow-400 focus:outline-none transition"
                />
                <button
                  disabled={!ticketCount || Number(ticketCount) < 1}
                  onClick={() => {
                    addMessage("user", `${ticketCount} ticket(s)`);
                    handleNext();
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
                    ticketCount && Number(ticketCount) >= 1
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-yellow-300 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex gap-4">
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="flex-grow px-5 py-3 rounded-xl border border-yellow-300 focus:ring-4 focus:ring-yellow-400 focus:outline-none transition"
                  autoFocus
                />
                <button
                  disabled={!preferredDate}
                  onClick={() => {
                    addMessage("user", `Date: ${preferredDate}`);
                    handleNext();
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
                    preferredDate ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-300 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="flex gap-4">
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="flex-grow px-5 py-3 rounded-xl border border-yellow-300 focus:ring-4 focus:ring-yellow-400 focus:outline-none transition"
                  autoFocus
                >
                  <option value="" disabled>
                    Select Time
                  </option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
                <button
                  disabled={!preferredTime}
                  onClick={() => {
                    addMessage("user", `Time: ${preferredTime}`);
                    handleNext();
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
                    preferredTime ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-300 cursor-not-allowed"
                  }`}
                >
                  Confirm
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    addMessage("user", `Pay ₹${totalAmount}`);
                    handleNext();
                  }}
                  className="px-10 py-3 rounded-3xl font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 shadow-lg transition"
                >
                  Pay ₹{totalAmount}
                </button>
              </div>
            )}

            {step === 5 && paid && (
              <div className="flex flex-col items-center space-y-6">
                <p className="text-lg font-semibold text-yellow-800">
                  🎉 Thank you, {username}! Your booking is confirmed.
                </p>
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 rounded-xl font-semibold text-white bg-yellow-600 hover:bg-yellow-700 shadow-md transition"
                >
                  Download Ticket
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="text-center text-yellow-700 text-sm mt-10 pb-6 select-none">
        &copy; 2025 National Museum. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
