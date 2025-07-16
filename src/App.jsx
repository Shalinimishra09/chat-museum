import React, { useState } from "react";

const MuseumChatbot = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [preferredTime, setPreferredTime] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [paid, setPaid] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Welcome to  National Museum. What's your name?" },
  ]);

  const totalAmount = ticketCount * 200;

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
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
    const content = ` National Museum Ticket\n\nName: ${username}\nTickets: ${ticketCount}\nDate: ${preferredDate}\nTime: ${preferredTime}\nTotal Paid: ₹${totalAmount}`;
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
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-yellow-100 p-4 text-center shadow-md">
        <h1 className="text-3xl font-bold text-yellow-800"> National Museum</h1>
        <p className="text-sm text-yellow-700">Explore history</p>
      </header>

      <div className="flex items-center justify-center p-4">
        {!loggedIn ? (
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm mt-8">
            <h2 className="text-xl font-semibold text-center text-yellow-700 mb-4">Login to MuseumBot</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl mt-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4 text-center">🎫 Museum Chatbot</h2>
            <div className="bg-white p-4 rounded-lg shadow h-96 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-md text-sm max-w-xs whitespace-pre-wrap ${
                      msg.from === "user"
                        ? "bg-yellow-200 text-yellow-900"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="mt-4">
                <input
                  type="number"
                  min="1"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-md mb-2"
                  placeholder="Enter number of tickets"
                />
                <button
                  onClick={() => {
                    addMessage("user", `${ticketCount} tickets`);
                    handleNext();
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="mt-4">
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md mb-2"
                />
                <button
                  onClick={() => {
                    addMessage("user", `Date: ${preferredDate}`);
                    handleNext();
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
                >
                  Next
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="mt-4">
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md mb-2"
                >
                  <option value="">Select Time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
                <button
                  onClick={() => {
                    addMessage("user", `Time: ${preferredTime}`);
                    handleNext();
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    addMessage("user", `Pay ₹${totalAmount}`);
                    handleNext();
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                >
                  Pay ₹{totalAmount}
                </button>
              </div>
            )}

            {step === 5 && paid && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleDownload}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md"
                >
                  Download Ticket
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="text-center text-yellow-700 text-sm mt-10 pb-4">
        &copy; 2025  National Museum. All rights reserved.
      </footer>
    </div>
  );
};

export default MuseumChatbot;


