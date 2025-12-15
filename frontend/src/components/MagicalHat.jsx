import { useEffect, useRef, useState } from "react";
import { mockPickRecipient, useMockApi } from "../utils/mockApi";
import magicianHat from "../assets/magician-hat.png";
import "./MagicalHat.css";

const MagicalHat = ({ user, onPickComplete }) => {
  const [isPicking, setIsPicking] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState("");
  const [showEntrance, setShowEntrance] = useState(false);
  const [showCardReveal, setShowCardReveal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hatRef = useRef(null);
  const cardRef = useRef(null);
  const sparklesRef = useRef(null);
  const containerRef = useRef(null);
  const confettiTimeoutRef = useRef(null);
  const shouldUseMockApi = useMockApi();

  const createConfetti = () => {
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    containerRef.current.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + "s";
      confettiContainer.appendChild(confetti);
    }

    confettiTimeoutRef.current = setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  };

  const revealCard = () => {
    setShowCardReveal(true);
    setShowConfetti(true);

    // Remove confetti after 5 seconds
    confettiTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const pickRecipient = async () => {
    if (isPicking || recipient) return;

    setIsPicking(true);
    setError("");

    try {
      let data;

      // Use mock API if in development mode
      if (shouldUseMockApi) {
        data = await mockPickRecipient(user.userId, user.name);
      } else {
        // Call backend to pick recipient
        const response = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "pickRecipient",
            userId: user.userId,
            name: user.name,
            dob: user.dob,
          }),
        });

        data = await response.json();
      }

      if (data.success) {
        setRecipient(data.recipient);

        // Animate card reveal
        setTimeout(() => {
          revealCard();
        }, 1000);
      } else {
        setError(data.message || "Failed to pick recipient. Please try again.");
        setIsPicking(false);
      }
    } catch (err) {
      console.error("Pick error:", err);
      setError("Unable to connect to server. Please try again.");
      setIsPicking(false);
    }
  };

  useEffect(() => {
    // Trigger entrance animations
    setShowEntrance(true);

    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const handleHatClick = () => {
    if (!isPicking && !recipient) {
      pickRecipient();
    }
  };

  const handleComplete = () => {
    if (onPickComplete) {
      onPickComplete(recipient);
    }
  };

  return (
    <div className="magical-hat-container" ref={containerRef}>
      <div className="scene-header">
        <h2>✨ Magic Hat ✨</h2>
        <p>Hello, {user.name}!</p>
        {!recipient && (
          <p className="instruction">
            Click the hat to pick your Secret Santa!
          </p>
        )}
      </div>

      <div className="scene">
        <div
          className={`sparkles ${showEntrance ? "animate-entrance" : ""}`}
          ref={sparklesRef}
        >
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">✨</span>
        </div>

        <div
          className={`hat ${showEntrance ? "animate-entrance" : ""} ${
            isPicking ? "picking" : ""
          }`}
          ref={hatRef}
          onClick={handleHatClick}
          style={{ cursor: isPicking || recipient ? "default" : "pointer" }}
        >
          <img src={magicianHat} alt="Magic Hat" className="hat-image" />
        </div>

        {recipient && (
          <div
            className={`card ${showCardReveal ? "animate-reveal" : ""}`}
            ref={cardRef}
          >
            <div className="card-inner">
              <h3>Your Secret Santa is:</h3>
              <div className="recipient-name">{recipient}</div>
              <p className="card-message">🎁 Get them something special! 🎁</p>
              <button className="done-button" onClick={handleComplete}>
                Done
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-overlay">
            <div className="error-box">
              <p>{error}</p>
              <button onClick={() => setError("")}>Close</button>
            </div>
          </div>
        )}

        {showConfetti && (
          <div className="confetti-container">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: [
                    "#ff0000",
                    "#00ff00",
                    "#0000ff",
                    "#ffff00",
                    "#ff00ff",
                    "#00ffff",
                  ][Math.floor(Math.random() * 6)],
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {isPicking && !recipient && (
        <div className="picking-overlay">
          <div className="picking-message">
            <div className="spinner"></div>
            <p>Picking your Secret Santa...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicalHat;
