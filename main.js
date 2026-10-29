/* ============================================
   CUSTOM CURSOR
============================================ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

function lerpRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(lerpRing);
}
lerpRing();

document.querySelectorAll('a, button, [data-chip], .skill-tag, .project-card, .ttt-cell, .ttt-seg-btn, .ttt-action-btn, .ttt-btn-play, .ttt-btn-reset, .traffic-dot, .preview-action-primary, .preview-action-secondary').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================================
   HERO CHIP STAGGER REVEAL
============================================ */
document.querySelectorAll('[data-chip]').forEach((chip, i) => {
  chip.style.opacity = '0';
  chip.style.transform = 'translateY(20px)';
  setTimeout(() => {
    chip.style.transition = 'opacity 0.5s ease, transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    chip.style.opacity = '1';
    chip.style.transform = 'translateY(0)';
  }, 220 + i * 110);
});

/* ============================================
   DRAGGABLE WORD CHIPS
============================================ */
document.querySelectorAll('[data-chip]').forEach(chip => {
  let dragging = false, sx = 0, sy = 0, cx = 0, cy = 0;

  chip.addEventListener('pointerdown', e => {
    dragging = true;
    chip.style.zIndex = '100';
    chip.style.transition = 'none';
    document.body.classList.add('cursor-hover');
    sx = e.clientX - cx;
    sy = e.clientY - cy;
    chip.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  chip.addEventListener('pointermove', e => {
    if (!dragging) return;
    cx = e.clientX - sx;
    cy = e.clientY - sy;
    chip.style.transform = `translate(${cx}px, ${cy}px) scale(1.07) rotate(-2deg)`;
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('cursor-hover');
    chip.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    chip.style.transform = 'translate(0,0) scale(1) rotate(0deg)';
    cx = 0; cy = 0;
    setTimeout(() => { chip.style.zIndex = ''; chip.style.transition = ''; }, 600);
  }
  chip.addEventListener('pointerup', release);
  chip.addEventListener('pointercancel', release);
});

/* ============================================
   SCROLL REVEAL
============================================ */
const revealEls = document.querySelectorAll('.reveal');

// Immediately reveal anything already visible in the viewport on load
function checkRevealOnLoad() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) {
      el.classList.add('visible');
    }
  });
}
checkRevealOnLoad();

// Also observe for scroll-triggered reveals
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0, rootMargin: '0px 0px 60px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ============================================
   MAGNETIC BUTTONS
============================================ */
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-hire, .contact-email-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ============================================
   COPY EMAIL
============================================ */
function copyEmail() {
  const email = 'oginnikayode05@gmail.com'; // Replace with your real email
  const copy = text => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(showToast).catch(() => fallback(text));
    } else { fallback(text); }
  };
  const fallback = text => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
  };
  copy(email);
}

function showToast() {
  const toast = document.getElementById('toast');
  const feedback = document.getElementById('copy-feedback');
  const btn = document.getElementById('email-btn-text');
  toast.classList.add('show');
  feedback.classList.add('show');
  if (btn) btn.textContent = 'Copied! \u2713';
  setTimeout(() => {
    toast.classList.remove('show');
    feedback.classList.remove('show');
    if (btn) btn.textContent = 'Copy my email';
  }, 3200);
}

/* ============================================
   ACTIVE NAV LINK HIGHLIGHT
============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--cyan-500)'
      : '';
    link.style.background = link.getAttribute('href') === '#' + current
      ? 'var(--cyan-glow)'
      : '';
  });
}, { passive: true });

/* ============================================
   PROJECT PREVIEW MODAL (work.html)
============================================ */
function initProjectModal() {
  const modal = document.getElementById('project-preview-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  const closeDot = document.getElementById('modal-close-dot');
  const urlDisplay = document.getElementById('modal-url-display');
  const projectImg = document.getElementById('modal-project-img');
  const projectTag = document.getElementById('modal-project-tag');
  const projectTitle = document.getElementById('modal-project-title');
  const projectDesc = document.getElementById('modal-project-desc');
  const projectStack = document.getElementById('modal-project-stack');
  const projectFeatures = document.getElementById('modal-project-features');
  const copyLinkBtn = document.getElementById('modal-copy-link-btn');

  function openProject(card) {
    const title = card.dataset.title || 'Project Showcase';
    const tag = card.dataset.tag || '// UI/UX & Dev';
    const desc = card.dataset.desc || '';
    const url = card.dataset.url || 'https://bluey.design/demo';
    const img = card.dataset.img || '';
    const stack = (card.dataset.stack || '').split(',').filter(Boolean);
    const features = (card.dataset.features || '').split(',').filter(Boolean);

    if (urlDisplay) urlDisplay.textContent = url;
    if (projectImg) {
      projectImg.src = img;
      projectImg.alt = title + ' interface preview';
    }
    if (projectTag) projectTag.textContent = '// ' + tag;
    if (projectTitle) projectTitle.textContent = title;
    if (projectDesc) projectDesc.textContent = desc;

    if (projectStack) {
      projectStack.innerHTML = '';
      stack.forEach(tech => {
        const chip = document.createElement('span');
        chip.className = 'preview-chip';
        chip.textContent = tech.trim();
        projectStack.appendChild(chip);
      });
    }

    if (projectFeatures) {
      projectFeatures.innerHTML = '';
      features.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat.trim();
        projectFeatures.appendChild(li);
      });
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a') && !e.target.closest('.card-cta-link')) return;
      openProject(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeDot) closeDot.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const currentUrl = urlDisplay ? urlDisplay.textContent : window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(currentUrl).then(() => {
          copyLinkBtn.textContent = 'Link Copied! ✓';
          setTimeout(() => { copyLinkBtn.textContent = 'Copy Case Study Link'; }, 2200);
        });
      }
    });
  }
}
initProjectModal();

/* ============================================
   CYBER TIC-TAC-TOE GAME (about.html)
============================================ */
function initTicTacToeGame() {
  const boardEl = document.getElementById('ttt-board');
  if (!boardEl) return;

  const cells = Array.from(document.querySelectorAll('.ttt-cell'));
  const statusPill = document.getElementById('ttt-status-pill');
  const statusText = document.getElementById('ttt-status-text');
  const scoreXEl = document.getElementById('score-x');
  const scoreOEl = document.getElementById('score-o');
  const scoreTiesEl = document.getElementById('score-ties');
  const p1Label = document.getElementById('score-p1-label');
  const p2Label = document.getElementById('score-p2-label');
  const resetRoundBtn = document.getElementById('ttt-reset-round-btn');
  const resetScoreBtn = document.getElementById('ttt-reset-score-btn');
  const modeAiBtn = document.getElementById('btn-mode-ai');
  const modePvpBtn = document.getElementById('btn-mode-pvp');
  const diffCtrl = document.getElementById('ttt-diff-ctrl');
  const diffBtns = diffCtrl ? Array.from(diffCtrl.querySelectorAll('.ttt-seg-btn')) : [];
  const audioToggle = document.getElementById('ttt-audio-toggle');
  const audioIcon = document.getElementById('ttt-audio-icon');
  const rageBanner = document.getElementById('ttt-rage-banner');

  // Game state
  let board = Array(9).fill(null);
  let currentPlayer = 'X'; // X starts
  let isGameOver = false;
  let isAiThinking = false;
  let gameMode = 'ai'; // 'ai' | 'pvp'
  let difficulty = 'medium'; // 'easy' | 'medium' | 'ragebait'

  // Scores
  let scores = { x: 0, o: 0, ties: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem('bluey_ttt_scores') || '{}');
    if (saved && typeof saved.x === 'number') scores = saved;
  } catch (e) {}

  function updateScoreDisplay() {
    if (scoreXEl) scoreXEl.textContent = scores.x;
    if (scoreOEl) scoreOEl.textContent = scores.o;
    if (scoreTiesEl) scoreTiesEl.textContent = scores.ties;
  }
  updateScoreDisplay();

  // Audio system (Web Audio API)
  let audioEnabled = localStorage.getItem('bluey_ttt_sfx') !== 'false';
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!audioEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'x') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'o') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.09);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.28);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'draw') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(190, now + 0.18);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.21);
      } else if (type === 'glitch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.1);
        osc.frequency.linearRampToValueAtTime(280, now + 0.18);
        osc.frequency.linearRampToValueAtTime(75, now + 0.28);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.31);
      } else if (type === 'rage-loss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(293.66, now); // D4
        osc.frequency.setValueAtTime(277.18, now + 0.16); // C#4
        osc.frequency.setValueAtTime(261.63, now + 0.32); // C4
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.7);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
        osc.start(now);
        osc.stop(now + 0.76);
      }
    } catch (e) {}
  }

  if (audioToggle) {
    if (audioIcon) audioIcon.textContent = audioEnabled ? '🔊' : '🔇';
    audioToggle.style.color = audioEnabled ? 'var(--cyan-400)' : 'var(--text-muted)';
    audioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      localStorage.setItem('bluey_ttt_sfx', audioEnabled);
      if (audioIcon) audioIcon.textContent = audioEnabled ? '🔊' : '🔇';
      audioToggle.style.color = audioEnabled ? 'var(--cyan-400)' : 'var(--text-muted)';
    });
  }

  // Winning Combos
  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  function checkWinner(b) {
    for (const combo of WINNING_COMBOS) {
      const [a, bIdx, c] = combo;
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return { winner: b[a], combo };
      }
    }
    if (b.every(cell => cell !== null)) {
      return { winner: 'tie', combo: [] };
    }
    return null;
  }

  function updateStatus(state, customMsg = '') {
    if (!statusPill || !statusText) return;
    statusPill.className = 'ttt-status-pill ' + state;

    if (customMsg) {
      statusText.textContent = customMsg;
      return;
    }

    if (state === 'turn-x') {
      statusText.textContent = gameMode === 'ai' ? 'Your turn (X)' : 'Player 1 turn (X)';
    } else if (state === 'turn-o') {
      statusText.textContent = gameMode === 'ai' ? 'BLUEY thinking...' : 'Player 2 turn (O)';
    } else if (state === 'win-x') {
      statusText.textContent = gameMode === 'ai' ? '🎉 You Won! Excellent move.' : '🎉 Player 1 (X) Wins!';
    } else if (state === 'win-o') {
      statusText.textContent = gameMode === 'ai' ? '🤖 BLUEY wins this round!' : '🎉 Player 2 (O) Wins!';
    } else if (state === 'draw') {
      statusText.textContent = '🤝 Stalemate! Good defense.';
    }
  }

  const gaslightBox = document.getElementById('ttt-gaslight-box');
  const gaslightText = document.getElementById('gaslight-text');
  const rageSubText = document.getElementById('rage-sub-text');

  // Gaslighting dialogue bank (tictactoe.gripe style)
  const GASLIGHT_QUOTES = {
    start: [
      "the AI always wins.",
      "go ahead. i dare you.",
      "nobody has ever beaten me. you won't either.",
      "i'm giving you X. it won't help.",
      "sure, try. everyone does.",
      "this is not a fair game. just so you know."
    ],
    move1: [
      "interesting. that's not going to work.",
      "bold choice. wrong, but bold.",
      "okay. sure. if you say so.",
      "i've seen that move before. spoiler: it doesn't end well.",
      "did you have a strategy? curious.",
      "noted. i'll pretend that was intentional."
    ],
    bait: [
      "oh wow, two in a row. very impressive. go on.",
      "your winning spot is wide open. take it. i'm not even blocking.",
      "i genuinely left that open. click it. i promise nothing bad will happen.",
      "look at that. one move from winning. just click the obvious spot.",
      "okay i'm scared now. please don't put your X there.",
      "you're about to win. i can feel it. go ahead and click.",
      "that's your move. the one that wins. right there. do it."
    ],
    trollLoss: [
      "you literally played O. did you forget which letter you were?",
      "that was your winning move and you gave it to me. genuinely impressive.",
      "count the board. you never had three in a row. ever.",
      "you've been playing O this whole game. did you not notice?",
      "i told you at the start. the AI always wins.",
      "you were so close. and then you weren't.",
      "that's tic tac toe. the game where i always win."
    ],
    aiThinking: [
      "hold on, i'm deciding how to make this look fair.",
      "calculating your defeat...",
      "give me a second. not because i need it.",
      "thinking... (not really)",
      "observing your mistake...",
      "preparing your loss..."
    ]
  };

  function setGaslight(msg) {
    if (!gaslightText) return;
    gaslightText.style.opacity = '0';
    setTimeout(() => {
      gaslightText.textContent = '"' + msg + '"';
      gaslightText.style.opacity = '1';
    }, 120);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.classList.add('taken');
    cell.innerHTML = '';

    const span = document.createElement('span');
    span.className = player === 'X' ? 'cell-symbol-x' : 'cell-symbol-o';
    span.textContent = player === 'X' ? '✕' : '◯';
    cell.appendChild(span);

    playSound(player === 'X' ? 'x' : 'o');
  }

  function eraseCell(index, callback) {
    const cell = cells[index];
    if (!cell) return;
    cell.classList.add('erasing');
    playSound('glitch');

    setTimeout(() => {
      board[index] = null;
      cell.innerHTML = '';
      cell.classList.remove('taken', 'erasing');
      if (callback) callback();
    }, 280);
  }

  function handleCellClick(index) {
    if (isGameOver || isAiThinking || board[index] !== null) return;
    initAudio();

    // RAGEBAIT MODE: The tictactoe.gripe psychological experience
    if (gameMode === 'ai' && difficulty === 'ragebait') {
      handleRagebaitPlayerClick(index);
      return;
    }

    // STANDARD MODES (Casual, Smart, 2-Player)
    makeMove(index, currentPlayer);

    const result = checkWinner(board);
    if (result) {
      finishGame(result);
      return;
    }

    if (gameMode === 'ai') {
      currentPlayer = 'O';
      isAiThinking = true;
      updateStatus('turn-o');

      setTimeout(() => {
        if (isGameOver) return;
        const aiIndex = getStandardAiMove();
        if (aiIndex !== null) {
          makeMove(aiIndex, 'O');
          const aiResult = checkWinner(board);
          if (aiResult) {
            finishGame(aiResult);
          } else {
            currentPlayer = 'X';
            updateStatus('turn-x');
          }
        }
        isAiThinking = false;
      }, 360);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus(currentPlayer === 'X' ? 'turn-x' : 'turn-o');
    }
  }

  // RAGEBAIT ENGINE: Makes user think they are winning, then rugpulls & gaslights!
  function handleRagebaitPlayerClick(index) {
    // 1. CHECK IF THIS CLICK WOULD BE THE USER'S WINNING MOVE (THE RUGPULL!)
    board[index] = 'X';
    const wouldWin = checkWinner(board);
    board[index] = null;

    if (wouldWin && wouldWin.winner === 'X') {
      // The user clicked the winning 3rd square!
      // In tictactoe.gripe fashion: that square registers as an O instead of X!
      isAiThinking = true;
      makeMove(index, 'O');

      // Now ensure AI has 3 in a row!
      let aiWin = checkWinner(board);
      let winningLine = aiWin?.winner === 'O' ? aiWin.combo : null;

      if (!winningLine) {
        // If not already a line through index, find any line connecting index and flip it to O!
        const lineWithIndex = WINNING_COMBOS.find(c => c.includes(index));
        winningLine = lineWithIndex || WINNING_COMBOS[0];
        winningLine.forEach(idx => {
          if (board[idx] !== 'O') {
            board[idx] = 'O';
            const cell = cells[idx];
            cell.classList.add('erasing', 'taken');
            cell.innerHTML = '<span class="cell-symbol-o">◯</span>';
          }
        });
      }

      // Finish with the gaslight quote and the iconic loss text!
      const quote = pickRandom(GASLIGHT_QUOTES.trollLoss);
      setTimeout(() => {
        finishRagebaitLoss(quote, winningLine);
        isAiThinking = false;
      }, 250);
      return;
    }

    // 2. USER DID NOT WIN: PLACE NORMAL X
    makeMove(index, 'X');
    const xCount = board.filter(v => v === 'X').length;

    // Check if by any freak chance the board has a winner
    const currentRes = checkWinner(board);
    if (currentRes) {
      if (currentRes.winner === 'O') {
        finishRagebaitLoss(pickRandom(GASLIGHT_QUOTES.trollLoss), currentRes.combo);
      } else {
        // AI denies player win by overriding
        forceRagebaitWin();
      }
      return;
    }

    // 3. AI'S TURN WITH DELAY & PSYCHOLOGICAL BAITING
    isAiThinking = true;
    updateStatus('turn-o', pickRandom(GASLIGHT_QUOTES.aiThinking));

    setTimeout(() => {
      if (isGameOver) return;

      // TURN 1: AI intentionally DOES NOT block and gives a snarky comment
      if (xCount === 1) {
        setGaslight(pickRandom(GASLIGHT_QUOTES.move1));

        // Place O in a spot that DOES NOT block the user's winning lines!
        const openSpots = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        // If user played corner (0,2,6,8), play bottom or edge far away
        let aiPick = null;
        if (index === 4) {
          aiPick = 0; // corner
        } else {
          // pick a spot not on index's direct row or col
          const nonBlocking = openSpots.filter(spot => {
            return !WINNING_COMBOS.some(c => c.includes(index) && c.includes(spot));
          });
          aiPick = nonBlocking.length > 0 ? nonBlocking[0] : openSpots[0];
        }

        makeMove(aiPick, 'O');
        isAiThinking = false;
        updateStatus('turn-x');
        return;
      }

      // TURN 2: THE HONEYPOT! User sets up 2 in a row. AI DELIBERATELY LEAVES THE WINNING SPOT OPEN!
      if (xCount === 2) {
        // Find if user has 2 in a row
        const userWinLine = WINNING_COMBOS.find(combo => {
          const xNum = combo.filter(i => board[i] === 'X').length;
          const emptyNum = combo.filter(i => board[i] === null).length;
          return xNum === 2 && emptyNum === 1;
        });

        if (userWinLine) {
          const userWinningSpot = userWinLine.find(i => board[i] === null);

          // AI intentionally picks a spot that is NOT userWinningSpot!
          const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null && v !== userWinningSpot);
          const aiPick = available.length > 0 ? available[0] : userWinningSpot;

          makeMove(aiPick, 'O');

          // Gaslight the user into clicking the trap!
          setGaslight(pickRandom(GASLIGHT_QUOTES.bait));
          updateStatus('turn-x', 'Your turn! (Winning spot wide open... 👀)');
          isAiThinking = false;
          return;
        }
      }

      // TURN 3+: If user didn't take the bait or played elsewhere, AI takes its own win!
      // Check if AI can win
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          if (checkWinner(board)?.winner === 'O') {
            board[i] = null;
            makeMove(i, 'O');
            const quote = pickRandom(GASLIGHT_QUOTES.trollLoss);
            finishRagebaitLoss(quote, checkWinner(board).combo);
            isAiThinking = false;
            return;
          }
          board[i] = null;
        }
      }

      // If board is getting full and user still hasn't won, force the win
      const emptyRemaining = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      if (emptyRemaining.length <= 2) {
        forceRagebaitWin();
        return;
      }

      // Otherwise make a normal move
      const normalPick = emptyRemaining[0];
      makeMove(normalPick, 'O');
      isAiThinking = false;
      updateStatus('turn-x');
    }, 380);
  }

  // Failsafe: Ensures AI 100% wins
  function forceRagebaitWin() {
    const targetLine = WINNING_COMBOS[0]; // [0, 1, 2]
    targetLine.forEach(idx => {
      board[idx] = 'O';
      const cell = cells[idx];
      cell.innerHTML = '<span class="cell-symbol-o">◯</span>';
      cell.classList.add('taken');
    });
    const quote = pickRandom(GASLIGHT_QUOTES.trollLoss);
    finishRagebaitLoss(quote, targetLine);
    isAiThinking = false;
  }

  function finishRagebaitLoss(quote, combo) {
    isGameOver = true;
    scores.o++;
    updateScoreDisplay();

    updateStatus('rage-loss', 'you lost. the AI always wins.');
    if (rageBanner) rageBanner.classList.add('active');
    if (rageSubText) rageSubText.textContent = '// "' + quote + '"';
    setGaslight(quote);

    highlightWinningCells(combo || [0, 1, 2]);
    playSound('rage-loss');

    try {
      localStorage.setItem('bluey_ttt_scores', JSON.stringify(scores));
    } catch (e) {}
  }

  function finishGame(result) {
    isGameOver = true;

    if (result.winner === 'X') {
      scores.x++;
      updateStatus('win-x');
      highlightWinningCells(result.combo);
      playSound('win');
    } else if (result.winner === 'O') {
      scores.o++;
      highlightWinningCells(result.combo);
      updateStatus('win-o');
      playSound(gameMode === 'ai' ? 'draw' : 'win');
    } else {
      scores.ties++;
      updateStatus('draw');
      playSound('draw');
    }

    updateScoreDisplay();
    try {
      localStorage.setItem('bluey_ttt_scores', JSON.stringify(scores));
    } catch (e) {}
  }

  function highlightWinningCells(combo) {
    if (!combo) return;
    combo.forEach(idx => {
      if (cells[idx]) cells[idx].classList.add('winner-cell');
    });
  }

  function resetRound() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    isGameOver = false;
    isAiThinking = false;

    if (rageBanner) rageBanner.classList.remove('active');

    cells.forEach(cell => {
      cell.innerHTML = '';
      cell.className = 'ttt-cell';
    });

    if (gameMode === 'ai' && difficulty === 'ragebait') {
      if (gaslightBox) gaslightBox.classList.add('active');
      setGaslight(pickRandom(GASLIGHT_QUOTES.start));
      updateStatus('turn-x', 'Your turn (X) — Good luck...');
    } else {
      if (gaslightBox) gaslightBox.classList.remove('active');
      updateStatus('turn-x');
    }
  }

  function resetScores() {
    scores = { x: 0, o: 0, ties: 0 };
    updateScoreDisplay();
    try {
      localStorage.removeItem('bluey_ttt_scores');
    } catch (e) {}
    resetRound();
  }

  // Standard AI (Easy & Medium)
  function getStandardAiMove() {
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
    if (emptyIndices.length === 0) return null;

    if (difficulty === 'easy') {
      if (Math.random() < 0.7) {
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    }

    // 1. Can AI win right now?
    for (const idx of emptyIndices) {
      board[idx] = 'O';
      if (checkWinner(board)?.winner === 'O') {
        board[idx] = null;
        return idx;
      }
      board[idx] = null;
    }

    // 2. Can player win next? Block them!
    for (const idx of emptyIndices) {
      board[idx] = 'X';
      if (checkWinner(board)?.winner === 'X') {
        board[idx] = null;
        return idx;
      }
      board[idx] = null;
    }

    if (difficulty === 'medium') {
      if (board[4] === null) return 4;
      const corners = [0, 2, 6, 8].filter(c => board[c] === null);
      if (corners.length > 0 && Math.random() < 0.75) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Bind cell clicks
  cells.forEach((cell, idx) => {
    cell.addEventListener('click', () => handleCellClick(idx));
  });

  if (resetRoundBtn) resetRoundBtn.addEventListener('click', resetRound);
  if (resetScoreBtn) resetScoreBtn.addEventListener('click', resetScores);

  // Complaint button — files a complaint, adds a point to BLUEY
  const complaintBtn = document.getElementById('ttt-complaint-btn');
  const complaintResponses = [
    "complaint received. +1 point to BLUEY.",
    "your feedback has been noted. BLUEY gets a point.",
    "complaint #" + Math.floor(Math.random() * 9999 + 1000) + " filed. BLUEY still wins.",
    "we have escalated your complaint directly to BLUEY. BLUEY says thanks.",
    "HR has reviewed your case. BLUEY gets the point.",
    "complaint denied. also BLUEY gets a point.",
    "thank you for your feedback. it has been ignored.",
    "we take all complaints seriously. BLUEY does not."
  ];
  if (complaintBtn) {
    complaintBtn.addEventListener('click', () => {
      scores.o++;
      updateScoreDisplay();
      try { localStorage.setItem('bluey_ttt_scores', JSON.stringify(scores)); } catch(e) {}

      const msg = complaintResponses[Math.floor(Math.random() * complaintResponses.length)];
      setGaslight(msg);
      updateStatus('turn-o', msg);
      playSound('o');

      // Shake the complaint button briefly
      complaintBtn.style.transition = 'transform 0.1s';
      complaintBtn.style.transform = 'scale(0.93)';
      setTimeout(() => { complaintBtn.style.transform = ''; }, 150);
    });
  }

  // Mode buttons
  if (modeAiBtn && modePvpBtn) {
    modeAiBtn.addEventListener('click', () => {
      gameMode = 'ai';
      modeAiBtn.classList.add('active');
      modePvpBtn.classList.remove('active');
      if (p1Label) p1Label.textContent = 'YOU (X)';
      if (p2Label) p2Label.textContent = 'BLUEY (O)';
      if (diffCtrl) diffCtrl.style.display = 'inline-flex';
      resetRound();
    });

    modePvpBtn.addEventListener('click', () => {
      gameMode = 'pvp';
      modePvpBtn.classList.add('active');
      modeAiBtn.classList.remove('active');
      if (p1Label) p1Label.textContent = 'PLAYER 1 (X)';
      if (p2Label) p2Label.textContent = 'PLAYER 2 (O)';
      if (diffCtrl) diffCtrl.style.display = 'none';
      if (gaslightBox) gaslightBox.classList.remove('active');
      resetRound();
    });
  }

  // Difficulty buttons
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      difficulty = btn.dataset.diff || 'medium';
      resetRound();
    });
  });

  // Initial status
  updateStatus('turn-x');
}
initTicTacToeGame();
