/* eslint-disable react/prop-types --
 * This marketing animation component accepts shaped replay artifacts validated
 * by scripts/validate_replay.mjs; the repo does not use PropTypes elsewhere.
 */
import { useState, useEffect, useRef } from 'react';
import './OptimizationTable.css';

// Key rows for highlighting (kept at original positions for zoom view)
const keyRows = [
  { id: 8, model: 'gpt-4o', prompt: 'role_based', temperature: 0.8, instructions: 'direct', maxTokens: 200, accuracy: 65.0, cost: 0.00009, latency: 0.699, highlight: 'latency', label: 'Fastest' },
  { id: 9, model: 'gpt-3.5-turbo', prompt: 'role_based', temperature: 0.1, instructions: 'direct', maxTokens: 200, accuracy: 70.0, cost: 0.00002, latency: 0.861, highlight: 'cost', label: 'Cheapest' },
  { id: 15, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.2, instructions: 'direct', maxTokens: 100, accuracy: 90.0, cost: 0.00015, latency: 1.690, highlight: 'accuracy', label: 'Best Accuracy' },
  { id: 16, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.7, instructions: 'CoT', maxTokens: 50, accuracy: 45.0, cost: 0.00036, latency: 4.245, highlight: 'baseline', label: 'Baseline' },
];

// Generate 54 rows for overview to show scale (deterministic seed)
const models = ['gpt-5.1', 'gpt-5.2', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-5-nano', 'claude-3', 'claude-3.5', 'llama-3', 'mistral-7b'];
const prompts = ['minimal', 'role_based', 'structured', 'few_shot'];
const instructions = ['direct', 'CoT', 'ReAct', 'step_by_step'];
const tokenOptions = [50, 100, 150, 200, 256, 512];

// Simple seeded random for consistent data
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateOverviewData = () => {
  const data = [];
  for (let i = 1; i <= 54; i++) {
    const keyRow = keyRows.find(k => k.id === i);
    if (keyRow) {
      data.push(keyRow);
    } else {
      const seed = i * 137;
      data.push({
        id: i,
        model: models[Math.floor(seededRandom(seed) * models.length)],
        prompt: prompts[Math.floor(seededRandom(seed + 1) * prompts.length)],
        temperature: Math.round(seededRandom(seed + 2) * 10) / 10,
        instructions: instructions[Math.floor(seededRandom(seed + 3) * instructions.length)],
        maxTokens: tokenOptions[Math.floor(seededRandom(seed + 4) * tokenOptions.length)],
        accuracy: Math.round(seededRandom(seed + 5) * 85 + 5),
        cost: Math.round(seededRandom(seed + 6) * 100) / 100000,
        latency: Math.round(seededRandom(seed + 7) * 5000 + 500) / 1000,
      });
    }
  }
  return data;
};

const overviewData = generateOverviewData();

// Smaller dataset for zoom frames with context around key rows
const zoomContextData = {
  16: [ // Baseline
    { id: 15, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.2, instructions: 'direct', maxTokens: 100, accuracy: 90.0, cost: 0.00015, latency: 1.690 },
    { id: 16, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.7, instructions: 'CoT', maxTokens: 50, accuracy: 45.0, cost: 0.00036, latency: 4.245, highlight: 'baseline', label: 'Baseline' },
    { id: 17, model: 'gpt-3.5-turbo', prompt: 'role_based', temperature: 0.4, instructions: 'CoT', maxTokens: 50, accuracy: 70.0, cost: 0.00004, latency: 1.052 },
  ],
  15: [ // Best Accuracy
    { id: 14, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.6, instructions: 'CoT', maxTokens: 200, accuracy: 65.0, cost: 0.00069, latency: 2.241 },
    { id: 15, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.2, instructions: 'direct', maxTokens: 100, accuracy: 90.0, cost: 0.00015, latency: 1.690, highlight: 'accuracy', label: 'Best Accuracy' },
    { id: 16, model: 'gpt-5.1', prompt: 'minimal', temperature: 0.7, instructions: 'CoT', maxTokens: 50, accuracy: 45.0, cost: 0.00036, latency: 4.245 },
  ],
  8: [ // Fastest
    { id: 7, model: 'gpt-4o', prompt: 'minimal', temperature: 0.1, instructions: 'CoT', maxTokens: 100, accuracy: 60.0, cost: 0.00100, latency: 2.441 },
    { id: 8, model: 'gpt-4o', prompt: 'role_based', temperature: 0.8, instructions: 'direct', maxTokens: 200, accuracy: 65.0, cost: 0.00009, latency: 0.699, highlight: 'latency', label: 'Fastest' },
    { id: 9, model: 'gpt-3.5-turbo', prompt: 'role_based', temperature: 0.1, instructions: 'direct', maxTokens: 200, accuracy: 70.0, cost: 0.00002, latency: 0.861 },
  ],
  9: [ // Cheapest
    { id: 8, model: 'gpt-4o', prompt: 'role_based', temperature: 0.8, instructions: 'direct', maxTokens: 200, accuracy: 65.0, cost: 0.00009, latency: 0.699 },
    { id: 9, model: 'gpt-3.5-turbo', prompt: 'role_based', temperature: 0.1, instructions: 'direct', maxTokens: 200, accuracy: 70.0, cost: 0.00002, latency: 0.861, highlight: 'cost', label: 'Cheapest' },
    { id: 10, model: 'gpt-5-nano', prompt: 'role_based', temperature: 0.6, instructions: 'CoT', maxTokens: 50, accuracy: 0.0, cost: 0.00002, latency: 2.537 },
  ],
};

// Frame sequence matching video
const FRAMES = {
  INTRO: 0,        // "Most people guess..."
  STRUGGLE: 1,     // "Then struggle with low business KPIs results"
  TABLE_OVERVIEW: 2, // Zoomed out full table
  HIGHLIGHT_16: 3, // Baseline row 16 highlighted (zoomed in)
  HIGHLIGHT_15: 4, // Row 15 - best accuracy (zoomed in)
  HIGHLIGHT_8: 5,  // Row 8 - fastest (zoomed in)
  HIGHLIGHT_9: 6,  // Row 9 - cheapest (zoomed in)
  SUMMARY: 7,      // Final summary cards
};

const summaryRowIds = [16, 15, 8, 9];
const baselineRow = keyRows.find(r => r.id === 16);

function LegacyOptimizationTable({ autoPlay = true, embedded = false }) {
  const [frame, setFrame] = useState(autoPlay ? FRAMES.INTRO : FRAMES.HIGHLIGHT_16);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showPauseIndicator, setShowPauseIndicator] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.() ||
        containerRef.current.webkitRequestFullscreen?.() ||
        containerRef.current.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    }
  };

  const containerClass = embedded && !isFullscreen
    ? "opt-container opt-embedded clickable"
    : "opt-container clickable";

  useEffect(() => {
    if (!isPlaying) return;

    const durations = {
      [FRAMES.INTRO]: 3000,
      [FRAMES.STRUGGLE]: 3000,
      [FRAMES.TABLE_OVERVIEW]: 2500,
      [FRAMES.HIGHLIGHT_16]: 2500,
      [FRAMES.HIGHLIGHT_15]: 2500,
      [FRAMES.HIGHLIGHT_8]: 2500,
      [FRAMES.HIGHLIGHT_9]: 2500,
    };

    if (frame < FRAMES.SUMMARY) {
      const timer = setTimeout(() => {
        setFrame(prev => prev + 1);
      }, durations[frame] || 2000);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [frame, isPlaying]);

  const restart = () => {
    setFrame(FRAMES.INTRO);
    setIsPlaying(true);
  };

  const togglePause = () => {
    if (frame === FRAMES.SUMMARY) return; // Don't toggle on summary frame
    setIsPlaying(prev => !prev);
    setShowPauseIndicator(true);
    setTimeout(() => setShowPauseIndicator(false), 600);
  };

  // Pause/Play indicator overlay
  const PauseIndicator = () => (
    showPauseIndicator && (
      <div className="pause-indicator">
        {isPlaying ? '▶' : '⏸'}
      </div>
    )
  );

  // Fullscreen button (only shown in embedded mode)
  const FullscreenButton = () => (
    embedded && (
      <button
        className="fullscreen-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? '⤫' : '⤢'}
      </button>
    )
  );

  // Always-visible transport button (embedded mode only). Sits to the left
  // of the Fullscreen button and morphs based on state:
  //   - at SUMMARY frame  -> ↻ Replay  (restarts animation)
  //   - while playing     -> ⏸ Pause   (calls togglePause)
  //   - while paused      -> ▶ Play    (calls togglePause)
  const TransportButton = () => {
    if (!embedded) return null;
    const atSummary = frame === FRAMES.SUMMARY;
    const icon = atSummary ? '↻' : isPlaying ? '⏸' : '▶';
    const title = atSummary ? 'Replay' : isPlaying ? 'Pause' : 'Play';
    return (
      <button
        className="play-pause-btn"
        onClick={(e) => {
          e.stopPropagation();
          if (atSummary) restart();
          else togglePause();
        }}
        title={title}
        aria-label={title}
      >
        {icon}
      </button>
    );
  };

  // Frame 0: Intro - "Most people guess..."
  if (frame === FRAMES.INTRO) {
    return (
      <div ref={containerRef} className={containerClass} onClick={togglePause}>
        <FullscreenButton /><TransportButton />
        <PauseIndicator />
        <div className="opt-headline">
          <span className="headline-main">Most people guess their</span>
          <span className="headline-main">AI Agent LLM parameters</span>
        </div>

        <div className="intro-table-wrapper">
          <table className="opt-table intro-table">
            <thead>
              <tr>
                <th>model</th>
                <th>prompt</th>
                <th>temperature</th>
                <th>instructions</th>
                <th>max_tokens</th>
              </tr>
            </thead>
            <tbody>
              <tr className="fade-in">
                <td><span className="model-tag">{baselineRow.model}</span></td>
                <td>{baselineRow.prompt}</td>
                <td>{baselineRow.temperature.toFixed(1)}</td>
                <td>{baselineRow.instructions}</td>
                <td>{baselineRow.maxTokens}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Frame 1: Struggle - "Then struggle with low business KPIs results"
  if (frame === FRAMES.STRUGGLE) {
    return (
      <div ref={containerRef} className={containerClass} onClick={togglePause}>
        <FullscreenButton /><TransportButton />
        <PauseIndicator />
        <div className="opt-headline">
          <span className="headline-main">Then struggle with</span>
          <span className="headline-main">low business KPIs results</span>
        </div>

        <div className="intro-table-wrapper">
          <table className="opt-table intro-table">
            <thead>
              <tr>
                <th>model</th>
                <th>prompt</th>
                <th>temperature</th>
                <th>instructions</th>
                <th>max_tokens</th>
                <th>accuracy</th>
                <th>cost</th>
                <th>latency</th>
              </tr>
            </thead>
            <tbody>
              <tr className="fade-in baseline-results">
                <td><span className="model-tag">{baselineRow.model}</span></td>
                <td>{baselineRow.prompt}</td>
                <td>{baselineRow.temperature.toFixed(1)}</td>
                <td>{baselineRow.instructions}</td>
                <td>{baselineRow.maxTokens}</td>
                <td className="poor-result">{baselineRow.accuracy.toFixed(1)}%</td>
                <td className="poor-result">${baselineRow.cost.toFixed(5)}</td>
                <td className="poor-result">{baselineRow.latency.toFixed(3)}s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Frame 2: Table Overview - zoomed out full table
  if (frame === FRAMES.TABLE_OVERVIEW) {
    return (
      <div ref={containerRef} className={containerClass} onClick={togglePause}>
        <FullscreenButton /><TransportButton />
        <PauseIndicator />
        <div className="opt-headline">
          <span className="headline-main">There are too many configurations</span>
        </div>

        <div className="overview-table-wrapper">
          <table className="opt-table overview-table">
            <thead>
              <tr>
                <th>#</th>
                <th>model</th>
                <th>prompt</th>
                <th>temp</th>
                <th>instructions</th>
                <th>tokens</th>
                <th>accuracy</th>
                <th>cost</th>
                <th>latency</th>
              </tr>
            </thead>
            <tbody>
              {overviewData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td><span className="model-tag-small">{row.model}</span></td>
                  <td>{row.prompt}</td>
                  <td>{row.temperature.toFixed(1)}</td>
                  <td>{row.instructions}</td>
                  <td>{row.maxTokens}</td>
                  <td>{row.accuracy.toFixed(1)}%</td>
                  <td>${row.cost.toFixed(5)}</td>
                  <td>{row.latency.toFixed(3)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Frame 7: Summary view - table with 4 key rows using same style as highlight frames
  if (frame === FRAMES.SUMMARY) {
    const summaryData = summaryRowIds.map(id => keyRows.find(r => r.id === id));
    const summaryContainerClass = embedded && !isFullscreen ? "opt-container opt-embedded" : "opt-container";

    return (
      <div ref={containerRef} className={summaryContainerClass}>
        <FullscreenButton /><TransportButton />
        <div className="opt-headline">
          <span className="headline-main">Improves AI agent's accuracy, response time, cost,</span>
          <span className="headline-main">or any important business KPI.</span>
        </div>

        <div className="zoomed-table-wrapper">
          <table className="opt-table zoomed-table summary-table">
            <thead>
              <tr>
                <th>model</th>
                <th>prompt</th>
                <th>temperature</th>
                <th>instructions</th>
                <th>max_tokens</th>
                <th>accuracy</th>
                <th>cost</th>
                <th>latency</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row) => {
                const highlightAccuracy = row.highlight === 'accuracy';
                const highlightLatency = row.highlight === 'latency';
                const highlightCost = row.highlight === 'cost';

                return (
                  <tr key={row.id} className="zoom-target">
                    <td><span className="model-tag">{row.model}</span></td>
                    <td>{row.prompt}</td>
                    <td>{row.temperature.toFixed(1)}</td>
                    <td>{row.instructions}</td>
                    <td>{row.maxTokens}</td>
                    <td className={highlightAccuracy ? 'highlight-green' : ''}>{row.accuracy.toFixed(1)}%</td>
                    <td className={highlightCost ? 'highlight-green' : ''}>${row.cost.toFixed(5)}</td>
                    <td className={highlightLatency ? 'highlight-green' : ''}>{row.latency.toFixed(3)}s</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="controls">
          <button onClick={restart} className="opt-btn primary">↻ Replay</button>
        </div>
      </div>
    );
  }

  // Frames 3-6: Zoomed in view focusing on specific rows

  // Get the current target row and message
  const getFrameData = () => {
    if (frame === FRAMES.HIGHLIGHT_16) return { targetId: 16, text: 'Starting configuration', type: 'baseline' };
    if (frame === FRAMES.HIGHLIGHT_15) return { targetId: 15, text: 'Optimized for', metric: 'accuracy', type: 'accuracy', fromValue: '45.0%', toValue: '90.0%' };
    if (frame === FRAMES.HIGHLIGHT_8) return { targetId: 8, text: 'Optimized for', metric: 'speed', type: 'latency', fromValue: '4.245s', toValue: '0.699s' };
    if (frame === FRAMES.HIGHLIGHT_9) return { targetId: 9, text: 'Optimized for', metric: 'cost', type: 'cost', fromValue: '$0.00036', toValue: '$0.00002' };
    return null;
  };

  const frameData = getFrameData();

  // Get exactly 3 rows for context (1 before, target, 1 after)
  const contextRows = zoomContextData[frameData?.targetId] || [];

  return (
    <div ref={containerRef} className={containerClass} onClick={togglePause}>
      <FullscreenButton /><TransportButton />
      <PauseIndicator />
      {/* Animation status message */}
      {frameData && (
        <div className={`animation-message message-${frameData.type}`}>
          <span className="message-icon">→</span>
          <span className="message-text">
            {frameData.text}
            {frameData.metric && <span className={`message-highlight highlight-${frameData.type}`}> {frameData.metric}</span>}
          </span>
          {frameData.fromValue && (
            <span className="message-metric">
              <span className="metric-from">{frameData.fromValue}</span>
              <span className="metric-arrow">→</span>
              <span className="metric-to">{frameData.toValue}</span>
            </span>
          )}
        </div>
      )}

      <div className="zoomed-table-wrapper">
        <table className="opt-table zoomed-table">
          <thead>
            <tr>
              <th>#</th>
              <th>model</th>
              <th>prompt</th>
              <th>temperature</th>
              <th>instructions</th>
              <th>max_tokens</th>
              <th>accuracy</th>
              <th>cost</th>
              <th>latency</th>
            </tr>
          </thead>
          <tbody>
            {contextRows.map((row) => {
              const isTarget = row.id === frameData?.targetId;

              // Highlight the optimized metric for current target
              const highlightAccuracy = isTarget && frame === FRAMES.HIGHLIGHT_15;
              const highlightLatency = isTarget && frame === FRAMES.HIGHLIGHT_8;
              const highlightCost = isTarget && frame === FRAMES.HIGHLIGHT_9;

              return (
                <tr key={row.id} className={isTarget ? 'zoom-target' : 'zoom-context'}>
                  <td className="row-id">{row.id}</td>
                  <td><span className="model-tag">{row.model}</span></td>
                  <td>{row.prompt}</td>
                  <td>{row.temperature.toFixed(1)}</td>
                  <td>{row.instructions}</td>
                  <td>{row.maxTokens}</td>
                  <td className={highlightAccuracy ? 'highlight-green' : ''}>{row.accuracy.toFixed(1)}%</td>
                  <td className={highlightCost ? 'highlight-green' : ''}>${row.cost.toFixed(5)}</td>
                  <td className={highlightLatency ? 'highlight-green' : ''}>{row.latency.toFixed(3)}s</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Progress indicator */}
      <div className="animation-progress">
        <div className={`progress-dot ${frame >= FRAMES.HIGHLIGHT_16 ? 'active' : ''} dot-baseline`} />
        <div className={`progress-dot ${frame >= FRAMES.HIGHLIGHT_15 ? 'active' : ''} dot-accuracy`} />
        <div className={`progress-dot ${frame >= FRAMES.HIGHLIGHT_8 ? 'active' : ''} dot-latency`} />
        <div className={`progress-dot ${frame >= FRAMES.HIGHLIGHT_9 ? 'active' : ''} dot-cost`} />
      </div>

      {!isPlaying && (
        <div className="controls">
          <button onClick={(e) => { e.stopPropagation(); restart(); }} className="opt-btn primary">↻ Replay</button>
        </div>
      )}
    </div>
  );
}

const REAL_FRAMES = {
  OPTIMIZATION: 0,
  HELDOUT: 1,
  ISOLATION: 2,
};

const realFrameMeta = [
  { id: REAL_FRAMES.OPTIMIZATION, label: 'Search' },
  { id: REAL_FRAMES.HELDOUT, label: 'Held-out' },
  { id: REAL_FRAMES.ISOLATION, label: 'Isolation' },
];

export const deriveReplayColumns = (dataset) => dataset?.knobs?.map((knob) => knob.key) ?? [];

const demoLabels = {
  'bird-sql-optimizer': 'BIRD mini-dev',
  'text2sql-sota-optimizer': 'Spider',
  'hotpotqa-rag-optimizer': 'HotpotQA',
};

const formatPercent = (value, maximumFractionDigits = 1) => {
  const percentage = Number(value) * 100;
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(percentage)}%`;
};

const formatPp = (value) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
}).format(Number(value));

const formatCost = (value) => `$${Number(value).toLocaleString('en-US', {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
})}`;

const formatValue = (value) => String(value);

const formatLimitation = (limitation) => limitation.replaceAll('_', ' ');

function OptimizationReplay({ dataset, columns, autoPlay = true, embedded = false, demoLabel }) {
  const [frame, setFrame] = useState(REAL_FRAMES.OPTIMIZATION);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showPauseIndicator, setShowPauseIndicator] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const replayColumns = columns?.length ? columns : deriveReplayColumns(dataset);
  const optimization = dataset.frames.optimization;
  const heldout = dataset.frames.heldout;
  const isolation = dataset.frames.isolation;
  const label = demoLabel || demoLabels[dataset.run.demo] || dataset.run.demo;
  const banner = `${label} · fixed slice · real Bedrock Haiku · not a SOTA claim`;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setFrame((currentFrame) => {
        if (currentFrame >= REAL_FRAMES.ISOLATION) {
          setIsPlaying(false);
          return currentFrame;
        }
        return currentFrame + 1;
      });
    }, frame === REAL_FRAMES.OPTIMIZATION ? 3600 : 3200);

    return () => clearTimeout(timer);
  }, [frame, isPlaying]);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.() ||
        containerRef.current.webkitRequestFullscreen?.() ||
        containerRef.current.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    }
  };

  const restart = (e) => {
    e?.stopPropagation();
    setFrame(REAL_FRAMES.OPTIMIZATION);
    setIsPlaying(true);
  };

  const showFrame = (nextFrame, e) => {
    e.stopPropagation();
    setFrame(nextFrame);
    setIsPlaying(false);
  };

  const togglePause = () => {
    setIsPlaying((playing) => !playing);
    setShowPauseIndicator(true);
    setTimeout(() => setShowPauseIndicator(false), 600);
  };

  const FullscreenButton = () => (
    embedded && (
      <button
        className="fullscreen-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? '⤫' : '⤢'}
      </button>
    )
  );

  const PauseIndicator = () => (
    showPauseIndicator && (
      <div className="pause-indicator">
        {isPlaying ? '▶' : '⏸'}
      </div>
    )
  );

  const containerClass = embedded && !isFullscreen
    ? 'opt-container opt-real opt-embedded clickable'
    : 'opt-container opt-real clickable';

  const renderOptimizationFrame = () => (
    <section className="real-frame-panel">
      <div className="real-frame-heading">
        <p className="real-frame-kicker">Optimization search · {optimization.trial_count} trials · n={optimization.n} · selection only</p>
        <h3>Configuration search history</h3>
      </div>
      <div className="real-table-wrapper">
        <table className="opt-table real-replay-table">
          <thead>
            <tr>
              <th>#</th>
              {replayColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>accuracy</th>
              <th>selected</th>
            </tr>
          </thead>
          <tbody>
            {optimization.rows.map((row) => (
              <tr key={row.trial_index} className={row.is_best ? 'overview-highlight' : ''}>
                <td className="row-id">{row.trial_index}</td>
                {replayColumns.map((column) => (
                  <td key={column}>{formatValue(row.config[column])}</td>
                ))}
                <td className={row.is_best ? 'highlight-green' : ''}>{formatPercent(row.accuracy)}</td>
                <td>{row.is_best ? 'best' : 'candidate'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderHeldoutFrame = () => (
    <section className="real-frame-panel">
      <div className="real-frame-heading">
        <p className="real-frame-kicker">Held-out check · n={heldout.n} · real Bedrock Haiku</p>
        <h3>Baseline versus optimized on held-out examples</h3>
      </div>
      <div className="heldout-grid">
        {[
          ['Baseline', heldout.baseline],
          ['Optimized', heldout.optimized],
        ].map(([name, result]) => (
          <div key={name} className={`heldout-card ${name === 'Optimized' ? 'heldout-card-best' : ''}`}>
            <span className="heldout-label">{name}</span>
            <strong>{result.correct}/{result.total} = {formatPercent(result.accuracy)}</strong>
            <span>held-out cost {formatCost(result.cost_usd)}</span>
          </div>
        ))}
        <div className="heldout-card heldout-delta">
          <span className="heldout-label">Delta</span>
          <strong>Δ{formatPp(heldout.delta.accuracy_pp)}pp</strong>
          <span>{heldout.delta.correct} more correct</span>
        </div>
      </div>
    </section>
  );

  const renderIsolationFrame = () => (
    <section className="real-frame-panel">
      <div className="real-frame-heading">
        <p className="real-frame-kicker">Isolation levers · n={isolation.n} · not joint causality</p>
        <h3>Single-lever isolation checks</h3>
      </div>
      <div className="isolation-grid">
        {isolation.cards.map((card) => (
          <div key={card.knob} className="isolation-card">
            <span className="isolation-knob">{card.knob}</span>
            <strong>{formatValue(card.baseline_value)} → {formatValue(card.best_value)}</strong>
            <span>{formatPercent(card.baseline_accuracy)} → {formatPercent(card.best_accuracy)}</span>
            <em>Δ{formatPp(card.delta_pp)}pp</em>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div ref={containerRef} className={containerClass} onClick={togglePause}>
      <FullscreenButton />
      <PauseIndicator />

      <div className="real-replay-header">
        <div>
          <p className="real-honest-banner">{banner}</p>
          <h2>
            {heldout.baseline.correct}/{heldout.baseline.total} = {formatPercent(heldout.baseline.accuracy)}
            <span> → </span>
            {heldout.optimized.correct}/{heldout.optimized.total} = {formatPercent(heldout.optimized.accuracy)}
          </h2>
        </div>
        <div className="real-delta-pill">+{formatPp(heldout.delta.accuracy_pp)}pp</div>
      </div>

      <div className="real-frame-tabs" role="tablist" aria-label="Replay frames">
        {realFrameMeta.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={frame === item.id}
            className={frame === item.id ? 'active' : ''}
            onClick={(e) => showFrame(item.id, e)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {frame === REAL_FRAMES.OPTIMIZATION && renderOptimizationFrame()}
      {frame === REAL_FRAMES.HELDOUT && renderHeldoutFrame()}
      {frame === REAL_FRAMES.ISOLATION && renderIsolationFrame()}

      <div className="real-replay-footer">
        <ul className="real-limitations">
          {dataset.limitations.map((limitation) => (
            <li key={limitation}>{formatLimitation(limitation)}</li>
          ))}
        </ul>
        <div className="controls">
          <button type="button" onClick={restart} className="opt-btn primary">
            ↻ Replay
          </button>
        </div>
      </div>
    </div>
  );
}

export { OptimizationReplay };

export default function OptimizationTable({ autoPlay = true, embedded = false, dataset, columns, demoLabel }) {
  if (dataset) {
    return (
      <OptimizationReplay
        dataset={dataset}
        columns={columns}
        autoPlay={autoPlay}
        embedded={embedded}
        demoLabel={demoLabel}
      />
    );
  }

  return <LegacyOptimizationTable autoPlay={autoPlay} embedded={embedded} />;
}
