import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Clock01Icon,
  MultiplicationSignIcon,
  Delete02Icon,
} from '@hugeicons/core-free-icons'

const STORAGE_KEY = 'chef-jed:history:v1'

// Springs — tuned for a calm, premium feel
const sheetSpring = { type: 'spring', stiffness: 320, damping: 36, mass: 0.9 }
const morphSpring = { type: 'spring', stiffness: 340, damping: 36, mass: 0.9 }
const itemSpring  = { type: 'spring', stiffness: 420, damping: 32 }

/* ---------- Persistence hook ---------- */
export function useHistory() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch { /* quota */ }
  }, [items])

  const add = useCallback((entry) => {
    setItems(prev => [
      { id: crypto.randomUUID(), savedAt: Date.now(), ...entry },
      ...prev.filter(p => p.recipe !== entry.recipe),
    ].slice(0, 50))
  }, [])

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(e => e.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return { items, add, remove, clear }
}

/* ---------- Title extraction ---------- */
function extractTitle(recipe) {
  if (!recipe) return 'Untitled recipe'
  const heading = recipe.match(/^#{1,3}\s+(.+)$/m)
  if (heading) return heading[1].replace(/[*_`]/g, '').trim()
  const first = recipe.split('\n').find(l => l.trim().length > 0) || ''
  return first.replace(/^[#*\-•\s]+/, '').replace(/[*_`]/g, '').slice(0, 70) || 'Untitled recipe'
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  const days = Math.floor(diff / 86400)
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/* ---------- Trigger button ---------- */
export function HistoryButton({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -4, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={itemSpring}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full
                 bg-white/80 backdrop-blur-md
                 ring-1 ring-inset ring-neutral-200/80
                 text-[12px] font-medium text-neutral-700
                 hover:bg-white cursor-pointer"
      aria-label="open history"
    >
      <HugeiconsIcon icon={Clock01Icon} size={13} strokeWidth={2} />
      History
    </motion.button>
  )
}

/* ---------- Sheet ---------- */
export function HistorySheet({ open, items, onClose, onRemove, onClear, onOpenEntry }) {
  // ESC handling
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim — clean dim, no blur */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-neutral-950/30"
          />

          {/* Panel — solid, soft-shadowed, Apple-clean */}
          <motion.aside
            key="sheet"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={sheetSpring}
            className="fixed top-0 right-0 bottom-0 z-[90]
                       w-full sm:w-[440px] md:w-[480px]
                       bg-white
                       shadow-[-20px_0_60px_-24px_rgba(0,0,0,0.18)]
                       flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between h-14 px-4 sm:px-5 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={2} className="text-neutral-700" />
                <h2 className="text-[15px] font-semibold tracking-tight text-neutral-900">History</h2>
                <span className="text-[12px] text-neutral-400 tabular-nums">{items.length}</span>
              </div>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={onClear}
                    className="text-[12px] text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-50 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="close history"
                  className="grid place-items-center w-8 h-8 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                >
                  <HugeiconsIcon icon={MultiplicationSignIcon} size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="relative flex-1 overflow-y-auto overscroll-contain px-2 py-2">
              {items.length === 0 ? (
                <EmptyHistory />
              ) : (
                <motion.ul layout className="flex flex-col">
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map(entry => (
                      <HistoryCard
                        key={entry.id}
                        entry={entry}
                        onOpen={() => { onOpenEntry?.(entry); onClose() }}
                        onRemove={() => onRemove(entry.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ---------- Row (ChatGPT-style: title + time) ---------- */
function HistoryCard({ entry, onOpen, onRemove }) {
  const title = extractTitle(entry.recipe)

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={itemSpring}
      className="group relative"
    >
      <button
        onClick={onOpen}
        className="w-full flex items-center gap-2 text-left
                   px-3 py-2.5 rounded-xl
                   hover:bg-neutral-100 active:bg-neutral-150
                   transition-colors cursor-pointer"
      >
        <span className="flex-1 min-w-0 text-[14px] font-medium text-neutral-900 truncate">
          {title}
        </span>
        <span className="shrink-0 text-[11px] text-neutral-400 tabular-nums group-hover:opacity-0 transition-opacity">
          {timeAgo(entry.savedAt)}
        </span>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        aria-label="remove from history"
        className="absolute top-1/2 -translate-y-1/2 right-2
                   grid place-items-center w-7 h-7 rounded-full
                   text-neutral-400 hover:text-red-500 hover:bg-red-50
                   opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                   transition-opacity cursor-pointer"
      >
        <HugeiconsIcon icon={Delete02Icon} size={13} strokeWidth={2} />
      </button>
    </motion.li>
  )
}

function EmptyHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={itemSpring}
      className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center px-8"
    >
      <div className="grid place-items-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 mb-4">
        <HugeiconsIcon icon={Clock01Icon} size={20} strokeWidth={1.8} />
      </div>
      <p className="text-[14px] font-medium text-neutral-700">No recipes saved yet</p>
      <p className="mt-1 text-[13px] text-neutral-400 max-w-[260px]">
        Finished recipes will appear here automatically so you can revisit them anytime.
      </p>
    </motion.div>
  )
}
