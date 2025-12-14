import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { mockPickRecipient, useMockApi } from '../utils/mockApi';
import './MagicalHat.css';

gsap.registerPlugin(Draggable);

const MagicalHat = ({ user, onPickComplete }) => {
  const [isPicking, setIsPicking] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState('');
  const hatRef = useRef(null);
  const handRef = useRef(null);
  const cardRef = useRef(null);
  const sparklesRef = useRef(null);
  const containerRef = useRef(null);
  const confettiTimeoutRef = useRef(null);
  const shouldUseMockApi = useMockApi();

  const createConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    containerRef.current.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confettiContainer.appendChild(confetti);
    }

    confettiTimeoutRef.current = setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  };

  const revealCard = () => {
    const tl = gsap.timeline();

    // Pull card from hat
    tl.from(cardRef.current, {
      y: hatRef.current.offsetTop,
      scale: 0,
      duration: 1,
      ease: 'back.out(1.7)',
    })
    .to(cardRef.current, {
      rotationY: 360,
      duration: 1,
      ease: 'power2.inOut',
    })
    .to(sparklesRef.current, {
      scale: 2,
      opacity: 1,
      duration: 0.5,
    }, '-=0.5')
    .to(hatRef.current, {
      scale: 1.2,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
    }, '-=0.5');

    // Confetti effect
    createConfetti();
  };

  const pickRecipient = async () => {
    if (isPicking || recipient) return;

    setIsPicking(true);
    setError('');

    // Animate hand going into hat
    const tl = gsap.timeline();
    
    tl.to(handRef.current, {
      y: hatRef.current.offsetTop + 50,
      x: hatRef.current.offsetLeft - 20,
      duration: 1,
      ease: 'power2.inOut',
    })
    .to(hatRef.current, {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
    }, '-=0.5');

    try {
      let data;
      
      // Use mock API if in development mode
      if (shouldUseMockApi) {
        data = await mockPickRecipient(user.userId, user.name);
      } else {
        // Call backend to pick recipient
        const response = await fetch(
          import.meta.env.VITE_APPS_SCRIPT_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'pickRecipient',
              userId: user.userId,
              name: user.name,
              dob: user.dob,
            }),
          }
        );

        data = await response.json();
      }

      if (data.success) {
        setRecipient(data.recipient);
        
        // Animate card reveal
        setTimeout(() => {
          revealCard();
        }, 1000);
      } else {
        setError(data.message || 'Failed to pick recipient. Please try again.');
        setIsPicking(false);
      }
    } catch (err) {
      console.error('Pick error:', err);
      setError('Unable to connect to server. Please try again.');
      setIsPicking(false);
    }
  };

  const checkHandPosition = () => {
    const handRect = handRef.current?.getBoundingClientRect();
    const hatRect = hatRef.current?.getBoundingClientRect();

    if (!handRect || !hatRect) return;

    // Check if hand is over the hat
    if (
      handRect.left < hatRect.right &&
      handRect.right > hatRect.left &&
      handRect.top < hatRect.bottom &&
      handRect.bottom > hatRect.top
    ) {
      pickRecipient();
    }
  };

  useEffect(() => {
    // Initial animations when component mounts
    const tl = gsap.timeline();
    
    // Animate hat entrance
    tl.from(hatRef.current, {
      scale: 0,
      rotation: 360,
      duration: 1,
      ease: 'back.out(1.7)',
    })
    .from(sparklesRef.current, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
    }, '-=0.5')
    .from(handRef.current, {
      x: -200,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Make hand draggable
    const draggableInstance = Draggable.create(handRef.current, {
      type: 'x,y',
      bounds: containerRef.current,
      onDragEnd: function() {
        checkHandPosition();
      },
      cursor: 'grab',
    });

    // Animate hand floating
    gsap.to(handRef.current, {
      y: '+=10',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Sparkles animation
    gsap.to(sparklesRef.current.children, {
      scale: 1.5,
      opacity: 0.3,
      duration: 1,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      if (draggableInstance[0]) {
        draggableInstance[0].kill();
      }
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {!recipient && <p className="instruction">Click the hat or drag the hand into it to pick your Secret Santa!</p>}
      </div>

      <div className="scene">
        <div className="sparkles" ref={sparklesRef}>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">✨</span>
        </div>

        <div 
          className="hat" 
          ref={hatRef}
          onClick={handleHatClick}
          style={{ cursor: isPicking || recipient ? 'default' : 'pointer' }}
        >
          <div className="hat-top">🎩</div>
        </div>

        {!recipient && (
          <div className="hand" ref={handRef}>
            <span className="hand-icon">👋</span>
            <div className="hand-hint">Drag me!</div>
          </div>
        )}

        {recipient && (
          <div className="card" ref={cardRef}>
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
              <button onClick={() => setError('')}>Close</button>
            </div>
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
