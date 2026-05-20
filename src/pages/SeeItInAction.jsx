import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Interactive Demo Player — pause on click. Previously embedded in Homepage.
function DemoPlayer() {
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  const togglePause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="relative">
      {/* Terminal Window Frame */}
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-slate-400 text-sm font-mono">traigent optimize</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3" /> Play
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Content — clickable container; can't be a real <button> because
            it wraps a <video>, so we add the ARIA button affordances by hand. */}
        <div
          className="relative cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D8EF8]"
          role="button"
          tabIndex={0}
          onClick={togglePause}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              togglePause();
            }
          }}
          aria-label={isPaused ? "Play demo video" : "Pause demo video"}
          title={isPaused ? "Click to play" : "Click to pause"}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
            style={{ minHeight: '400px' }}
          >
            <source src="/demos/see_it_in_action.webm" type="video/webm" />
            <source src="/demos/see_it_in_action.mp4" type="video/mp4" />
          </video>

          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-slate-900/90 rounded-full p-4">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeeItInAction() {
  return (
    <>
      <Helmet>
        <title>See It In Action · Traigent</title>
        <meta
          name="description"
          content="Watch Traigent sweep configurations and converge to the optimum — live demo of the optimization engine."
        />
      </Helmet>

      <section className="py-20 bg-slate-950 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              See It In Action
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-400 text-lg md:text-xl leading-relaxed"
            >
              Watch Traigent sweep configurations and converge to the optimum. Click the video to pause anytime.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <DemoPlayer />
          </motion.div>
        </div>
      </section>
    </>
  );
}
