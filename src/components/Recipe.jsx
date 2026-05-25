import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChefHatIcon } from '@hugeicons/core-free-icons'

const spring = { type: 'spring', stiffness: 240, damping: 26 }

export default function Recipe({ recipe, recipeStatus }) {
  const isLoading = recipeStatus === 'loading'
  const isStreaming = isLoading && recipe.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={spring}
      className="flex gap-3"
    >
      <div className="shrink-0 grid place-items-center w-7 h-7 rounded-full bg-neutral-900 text-white mt-0.5">
        <HugeiconsIcon icon={ChefHatIcon} size={14} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-[12px] font-medium text-neutral-500 mb-1.5">
          {isLoading && !isStreaming ? (
            <span className="animate-shimmer">Thinking…</span>
          ) : (
            'Chef JED'
          )}
        </div>

        <div className="recipe-markdown" aria-live="polite">
          <ReactMarkdown>{recipe}</ReactMarkdown>
          {isStreaming && <span className="stream-caret" aria-hidden="true" />}
        </div>

        {isLoading && !isStreaming && <SkeletonLines />}

        {recipeStatus === 'stopped' && (
          <div className="mt-2 text-[12px] text-neutral-400 italic">Stopped.</div>
        )}
      </div>
    </motion.div>
  )
}

function SkeletonLines() {
  return (
    <div className="space-y-2.5 mt-1">
      {[90, 75, 85, 60].map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
          className="h-3 rounded-full bg-neutral-100"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  )
}
