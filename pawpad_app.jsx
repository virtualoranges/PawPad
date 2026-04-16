// FULL REWRITTEN SIMPLIFIED APP.JSX (BEGINNER FRIENDLY)
// Includes:
// - Fixed Vaccinations
// - Add/Delete Vaccines
// - Simple PetTalk (ready for Supabase later)
// - Clean Health Tracker UI
// - AI mock (safe for now)

import React, { useState } from "react";

export default function App() {
  // ---------------- STATE ----------------
  const [tab, setTab] = useState("health");

  const [vaccinations, setVaccinations] = useState([
    { id: 1, name: "Rabies", date: "", nextDue: "", done: false },
    { id: 2, name: "DHPP", date: "", nextDue: "", done: false }
  ]);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ---------------- VACCINE LOGIC ----------------

  const toggleVaccination = (id) => {
    setVaccinations(vaccinations.map(v => {
      if (v.id !== id) return v;

      const today = new Date();
      let next = new Date();

      if (v.name.toLowerCase().includes("rabies")) {
        next.setFullYear(today.getFullYear() + 1);
      } else {
        next.setMonth(today.getMonth() + 3);
      }

      return {
        ...v,
        done: !v.done,
        date: today.toISOString().split("T")[0],
        nextDue: next.toISOString().split("T")[0]
      };
    }));
  };

  const addVaccination = () => {
    const name = prompt("Vaccine name:");
    if (!name) return;

    const today = new Date();
    const next = new Date();
    next.setMonth(today.getMonth() + 3);

    setVaccinations([
      ...vaccinations,
      {
        id: Date.now(),
        name,
        date: "",
        nextDue: next.toISOString().split("T")[0],
        done: false
      }
    ]);
  };

  const deleteVaccination = (id) => {
    setVaccinations(vaccinations.filter(v => v.id !== id));
  };

  const getStatus = (v) => {
    if (!v.nextDue) return "normal";

    const today = new Date();
    const next = new Date(v.nextDue);

    if (next < today) return "overdue";

    const diff = (next - today) / (1000 * 60 * 60 * 24);
    if (diff < 7) return "soon";

    return "normal";
  };

  // ---------------- CHAT ----------------

  const sendMessage = () => {
    if (!text) return;

    setMessages([
      {
        id: Date.now(),
        text
      },
      ...messages
    ]);

    setText("");
  };

  // ---------------- AI ----------------

  const askAI = () => {
    if (!text) return;

    setMessages([
      {
        id: Date.now(),
        text: `AI: For "${text}" → Keep your pet hydrated and active 🐾`
      },
      ...messages
    ]);

    setText("");
  };

  // ---------------- UI ----------------

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>

      <h1>PAWPAD 🐾</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("health")}>Health</button>
        <button onClick={() => setTab("chat")}>PetTalk</button>
      </div>

      {/* ---------------- HEALTH ---------------- */}

      {tab === "health" && (
        <div>
          <h2>Vaccinations</h2>

          <button onClick={addVaccination}>+ Add Vaccine</button>

          {vaccinations.map(v => {
            const status = getStatus(v);

            let bg = "#eee";
            if (status === "overdue") bg = "#ffcccc";
            if (status === "soon") bg = "#fff3cd";

            return (
              <div key={v.id} style={{
                background: bg,
                padding: 10,
                marginTop: 10,
                borderRadius: 10
              }}>

                <b>{v.name}</b>

                <div>
                  {v.done
                    ? `Last: ${v.date} | Next: ${v.nextDue}`
                    : `Next: ${v.nextDue}`}
                </div>

                <button onClick={() => toggleVaccination(v.id)}>
                  {v.done ? "Undo" : "Done"}
                </button>

                <button onClick={() => deleteVaccination(v.id)}>
                  Delete
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- CHAT ---------------- */}

      {tab === "chat" && (
        <div>
          <h2>PetTalk</h2>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write message..."
          />

          <div style={{ marginTop: 10 }}>
            <button onClick={sendMessage}>Send</button>
            <button onClick={askAI}>Ask AI</button>
          </div>

          <div style={{ marginTop: 20 }}>
            {messages.map(m => (
              <div key={m.id} style={{ marginBottom: 10 }}>
                {m.text}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
