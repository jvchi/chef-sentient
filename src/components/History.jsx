import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Clock01Icon,
  MultiplicationSignIcon,
  Delete02Icon,
  ChefHatIcon,
  ArrowLeft02Icon,
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

/* ---------- Trigger button (used in the page) ---------- */
export function HistoryButton({ count, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -4, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={itemSpring}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full
                 bg-white border border-neutral-200
                 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                 text-[12px] font-medium text-neutral-700
                 hover:bg-neutral-50 cursor-pointer"
      aria-label="open history"
    >
      <HugeiconsIcon icon={Clock01Icon} size={13} strokeWidth={2} />
      History
      {count > 0 && (
        <span className="ml-0.5 grid place-items-center min-w-[16px] h-[16px] px-1 rounded-full
                         bg-neutral-900 text-white text-[10px] font-semibold tabular-nums">
          {count}
        </span>
      )}
    </motion.button>
  )
}

/* ---------- Sheet ---------- */
export function HistorySheet({ open, items, onClose, onRemove, onClear }) {
  const [selectedId, setSelectedId] = useState(null)
  const selected = items.find(i => i.id === selectedId)

  // Reset selection when sheet closes
  useEffect(() => {
    if (!open) setSelectedId(null)
  }, [open])

  // ESC handling
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (selectedId) setSelectedId(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, selectedId, onClose])

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
                {items.length > 0 && !selected && (
                  <button
                    onClick={onClear}
                    className="text-[12px] text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-50 cursor-pointer"
                  >
                    Clear all
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

            {/* Content */}
            <LayoutGroup id="history">
              <div className="relative flex-1 overflow-hidden">
                {/* Card grid */}
                <div
                  className="absolute inset-0 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4"
                  // Keep the list mounted so layoutId from cards can morph to detail
                  style={{ visibility: selected ? 'hidden' : 'visible' }}
                  aria-hidden={!!selected}
                >
                  {items.length === 0 ? (
                    <EmptyHistory />
                  ) : (
                    <motion.div layout className="flex flex-col gap-2.5">
                      <AnimatePresence initial={false} mode="popLayout">
                        {items.map(entry => (
                          <HistoryCard
                            key={entry.id}
                            entry={entry}
                            onOpen={() => setSelectedId(entry.id)}
                            onRemove={() => onRemove(entry.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>

                {/* Detail (morphs from the card) */}
                <AnimatePresence>
                  {selected && (
                    <HistoryDetail
                      key={selected.id}
                      entry={selected}
                      onBack={() => setSelectedId(null)}
                      onRemove={() => {
                        const id = selected.id
                        setSelectedId(null)
                        // Defer removal until the morph-back has visually started
                        setTimeout(() => onRemove(id), 220)
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ---------- Card (the morph source) ---------- */
function HistoryCard({ entry, onOpen, onRemove }) {
  const title = extractTitle(entry.recipe)
  const preview = (entry.recipe || '').replace(/[#*_`>\-]/g, '').replace(/\n+/g, ' ').trim().slice(0, 120)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={itemSpring}
      className="relative"
    >
      <motion.button
        layoutId={`card-${entry.id}`}
        onClick={onOpen}
        transition={morphSpring}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.985 }}
        className="w-full text-left group relative overflow-hidden
                   rounded-2xl bg-white border border-neutral-200/80
                   hover:border-neutral-300 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]
                   transition-[box-shadow,border-color] duration-200
                   p-3.5 cursor-pointer"
      >
        <motion.div layout="position" className="flex items-start gap-3">
          <motion.div
            layoutId={`avatar-${entry.id}`}
            transition={morphSpring}
            className="shrink-0 grid place-items-center w-8 h-8 rounded-full bg-neutral-900 text-white"
          >
            <HugeiconsIcon icon={ChefHatIcon} size={14} strokeWidth={2} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <motion.h3
              layoutId={`title-${entry.id}`}
              transition={morphSpring}
              className="text-[14px] font-semibold tracking-tight text-neutral-900 truncate"
            >
              {title}
            </motion.h3>

            <p className="mt-0.5 text-[12.5px] text-neutral-500 line-clamp-2 leading-[1.45]">
              {preview}
            </p>

            <motion.div
              layoutId={`meta-${entry.id}`}
              transition={morphSpring}
              className="mt-2 flex items-center gap-1.5 flex-wrap"
            >
              {entry.ingredients?.slice(0, 4).map(ing => (
                <span
                  key={ing}
                  className="inline-flex items-center px-2 py-0.5 rounded-full
                             bg-neutral-100 text-[11px] font-medium text-neutral-600 capitalize"
                >
                  {ing}
                </span>
              ))}
              {entry.ingredients?.length > 4 && (
                <span className="text-[11px] text-neutral-400 font-medium">
                  +{entry.ingredients.length - 4}
                </span>
              )}
              <span className="text-[11px] text-neutral-400 ml-auto tabular-nums">
                {timeAgo(entry.savedAt)}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      {/* Floating delete — outside layoutId so it doesn't morph */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        aria-label="remove from history"
        className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-full
                   text-neutral-300 hover:text-red-500 hover:bg-red-50
                   opacity-0 group-hover:opacity-100 focus:opacity-100
                   transition-opacity cursor-pointer"
        style={{ opacity: undefined }} // keep tappable on touch
      >
        <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} />
      </button>
    </motion.div>
  )
}

/* ---------- Detail (the morph target) ---------- */
function HistoryDetail({ entry, onBack, onRemove }) {
  const title = extractTitle(entry.recipe)

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.div
        layoutId={`card-${entry.id}`}
        transition={morphSpring}
        className="absolute inset-0 bg-white"
        style={{ borderRadius: 0 }}
      />

      {/* Foreground content — fades in over morph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="relative flex items-center justify-between h-12 px-3 sm:px-4 border-b border-neutral-100 shrink-0"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 h-8 pl-1.5 pr-2.5 rounded-full
                     text-[12px] font-medium text-neutral-700
                     hover:bg-neutral-100 cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} strokeWidth={2.2} />
          Back
        </button>
        <button
          onClick={onRemove}
          aria-label="delete recipe"
          className="grid place-items-center w-8 h-8 rounded-full
                     text-neutral-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
        >
          <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={2} />
        </button>
      </motion.div>

      <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 py-6">
        <div className="flex items-center gap-3">
          <motion.div
            layoutId={`avatar-${entry.id}`}
            transition={morphSpring}
            className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-neutral-900 text-white"
          >
            <HugeiconsIcon icon={ChefHatIcon} size={18} strokeWidth={2} />
          </motion.div>
          <div className="min-w-0">
            <motion.h1
              layoutId={`title-${entry.id}`}
              transition={morphSpring}
              className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-neutral-900 leading-[1.15]"
            >
              {title}
            </motion.h1>
            <div className="text-[12px] text-neutral-400 tabular-nums mt-0.5">
              Saved {timeAgo(entry.savedAt)}
            </div>
          </div>
        </div>

        <motion.div
          layoutId={`meta-${entry.id}`}
          transition={morphSpring}
          className="mt-4 flex items-center gap-1.5 flex-wrap"
        >
          {entry.ingredients?.map(ing => (
            <span
              key={ing}
              className="inline-flex items-center px-2.5 py-1 rounded-full
                         bg-neutral-100 text-[12px] font-medium text-neutral-700 capitalize"
            >
              {ing}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
          className="recipe-markdown mt-6 pb-10"
        >
          <ReactMarkdown>{entry.recipe}</ReactMarkdown>
        </motion.div>
      </div>
    </motion.div>
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
