import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp02Icon,
  MultiplicationSignIcon,
  SparklesIcon,
  StopIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import Recipe from './Recipe'
import { getRecipeFromMistral } from '../ai'

const spring = { type: 'spring', stiffness: 280, damping: 26 }
const layoutSpring = { type: 'spring', stiffness: 700, damping: 40, mass: 0.4 }

const FILLER = /^(i\s+have|i've\s+got|i\s+got|there's|theres|we\s+have|some|a\s+few|and|also|with|plus|the)$/i

function parseIngredients(raw) {
  if (!raw) return []
  return raw
    .split(/[,;\n]|\s+(?:and|&)\s+/i)
    .map(s => s.trim())
    .map(s => s.replace(/^[-•*]\s*/, '').replace(/\.$/, '').trim())
    .filter(s => s.length > 0 && !FILLER.test(s))
}

export default function Main() {
  // Draft set: ingredients staged but not yet sent
  const [ingredients, setIngredients] = useState([])
  // Conversation thread: alternating user/assistant turns
  const [turns, setTurns] = useState([])
  const [draft, setDraft] = useState('')

  const scrollRef = useRef(null)
  const bottomRef = useRef(null)
  const abortRef = useRef(null)

  const activeTurn = turns[turns.length - 1]
  const isStreaming = activeTurn?.status === 'loading'

  async function generate() {
    if (ingredients.length < 4 || isStreaming) return

    const snapshot = ingredients
    const id = crypto.randomUUID()
    setTurns(prev => [
      ...prev,
      { id, ingredients: snapshot, recipe: '', status: 'loading' },
    ])
    setIngredients([])
    setDraft('')

    const controller = new AbortController()
    abortRef.current = controller
    let started = false

    try {
      const stream = await getRecipeFromMistral(snapshot, controller.signal)
      for await (const chunk of stream) {
        if (controller.signal.aborted) break
        if (chunk.choices && chunk.choices[0].delta.content) {
          started = true
          const piece = chunk.choices[0].delta.content
          setTurns(prev =>
            prev.map(t => (t.id === id ? { ...t, recipe: t.recipe + piece } : t))
          )
        }
      }
      setTurns(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, status: controller.signal.aborted ? 'stopped' : 'done' }
            : t
        )
      )
    } catch (err) {
      if (err.name === 'AbortError') {
        setTurns(prev =>
          prev.map(t => (t.id === id ? { ...t, status: 'stopped' } : t))
        )
      } else {
        console.error(err)
        setTurns(prev =>
          prev.map(t =>
            t.id === id
              ? {
                  ...t,
                  recipe: started
                    ? t.recipe
                    : 'Sorry, Chef Jed is currently cooking. Please try again later.',
                  status: 'error',
                }
              : t
          )
        )
      }
    } finally {
      abortRef.current = null
    }
  }

  function stop() {
    abortRef.current?.abort()
  }

  function newChat() {
    abortRef.current?.abort()
    setTurns([])
    setIngredients([])
    setDraft('')
  }

  function addIngredient(e) {
    e.preventDefault()
    const parsed = parseIngredients(draft)
    if (parsed.length === 0) return
    setIngredients(prev => {
      const existing = new Set(prev.map(i => i.toLowerCase()))
      const additions = []
      for (const item of parsed) {
        const key = item.toLowerCase()
        if (existing.has(key)) continue
        existing.add(key)
        additions.push(item)
      }
      return [...prev, ...additions]
    })
    setDraft('')
  }

  function removeIngredient(name) {
    setIngredients(prev => prev.filter(i => i !== name))
  }

  // Auto-scroll: only when sticky to bottom
  const stickToBottom = useRef(true)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      stickToBottom.current = distance < 80
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!stickToBottom.current) return
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [turns, ingredients.length])

  const canSubmit = draft.trim().length > 0
  const isEmpty = turns.length === 0 && ingredients.length === 0
  const canCook = ingredients.length >= 4

  return (
    <div className="flex-1 flex flex-col w-full pt-14">
      {/* Floating new-chat button (only when there's something to clear) */}
      <AnimatePresence>
        {(turns.length > 0 || ingredients.length > 0) && (
          <motion.button
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
            onClick={newChat}
            className="fixed top-3 right-4 sm:right-6 z-50 inline-flex items-center gap-1
                       h-8 pl-2.5 pr-3 rounded-full
                       bg-white border border-neutral-200
                       shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                       text-[12px] font-medium text-neutral-700
                       hover:bg-neutral-50 cursor-pointer"
            aria-label="new chat"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={13} strokeWidth={2.2} />
            New
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable conversation area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="w-full max-w-[680px] mx-auto px-5 sm:px-8 py-8">
          {isEmpty ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {turns.map(turn => (
                <div key={turn.id} className="space-y-5">
                  <IngredientBubble ingredients={turn.ingredients} readOnly />
                  <Recipe recipe={turn.recipe} recipeStatus={turn.status} />
                </div>
              ))}

              {/* Draft (current, unsent) ingredients */}
              {ingredients.length > 0 && (
                <IngredientBubble
                  ingredients={ingredients}
                  onRemove={removeIngredient}
                />
              )}
            </div>
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Pinned composer */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/0 pb-5 pt-6">
        <div className="w-full max-w-[680px] mx-auto px-5 sm:px-8">
          <motion.form
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
            onSubmit={addIngredient}
            className="flex items-center gap-2 rounded-2xl
                       bg-white border border-neutral-200
                       shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]
                       pl-4 pr-2 py-2
                       focus-within:border-neutral-400
                       transition-colors duration-200"
          >
            <input
              type="text"
              name="ingredient"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              aria-label="add ingredient"
              disabled={isStreaming}
              placeholder={
                isStreaming
                  ? 'Chef JED is cooking…'
                  : ingredients.length === 0
                  ? 'tomatoes, eggs, rice…'
                  : canCook
                  ? 'Add more, or tap to cook'
                  : `Add ${4 - ingredients.length} more to cook`
              }
              className="flex-1 text-[15px] py-2 placeholder:text-neutral-400 text-neutral-900 disabled:text-neutral-400"
            />

            {/* Stop button while streaming */}
            {isStreaming && (
              <motion.button
                key="stop"
                type="button"
                onClick={stop}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.9 }}
                transition={spring}
                aria-label="stop"
                className="grid place-items-center w-8 h-8 rounded-full
                           bg-neutral-900 text-white cursor-pointer"
              >
                <HugeiconsIcon icon={StopIcon} size={14} strokeWidth={2.4} />
              </motion.button>
            )}

            {/* Cook button when ready */}
            {!isStreaming && canCook && (
              <motion.button
                type="button"
                onClick={generate}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.92 }}
                transition={spring}
                aria-label="generate recipe"
                className="grid place-items-center w-8 h-8 rounded-full
                           bg-neutral-100 text-neutral-700 hover:bg-neutral-200
                           transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={2} />
              </motion.button>
            )}

            {/* Add button */}
            {!isStreaming && (
              <motion.button
                type="submit"
                whileTap={canSubmit ? { scale: 0.9 } : {}}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                disabled={!canSubmit}
                aria-label="add"
                className="grid place-items-center w-8 h-8 rounded-full
                           bg-neutral-900 text-white
                           disabled:bg-neutral-200 disabled:text-neutral-400
                           transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <HugeiconsIcon icon={ArrowUp02Icon} size={16} strokeWidth={2.4} />
              </motion.button>
            )}
          </motion.form>

          <p className="text-center text-[11px] text-neutral-400 mt-2.5">
            Chef JED can make mistakes. Check important details.
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="flex flex-col items-center justify-center text-center pt-20 sm:pt-28"
    >
      <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-neutral-900 leading-[1.1]">
        What's in your kitchen?
      </h1>
      <p className="mt-3 text-[15px] text-neutral-500 max-w-[420px]">
        Add a few ingredients you have on hand and Chef JED will suggest a recipe.
      </p>
    </motion.div>
  )
}

function IngredientBubble({ ingredients, onRemove, readOnly = false }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="flex justify-end"
    >
      <motion.div
        layout
        transition={layoutSpring}
        className="max-w-[85%] rounded-2xl rounded-tr-md
                   bg-neutral-100 px-4 py-3"
      >
        <motion.div layout="position" transition={layoutSpring} className="text-[12px] font-medium text-neutral-500 mb-2">
          Ingredients · {ingredients.length}
        </motion.div>
        <motion.ul layout transition={layoutSpring} className="flex flex-wrap gap-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {ingredients.map(item => (
              <motion.li
                key={item}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{
                  layout: layoutSpring,
                  opacity: { duration: 0.12 },
                  scale: { duration: 0.14 },
                  default: spring,
                }}
                className={`group inline-flex items-center gap-0.5
                           rounded-full bg-white text-[13px] font-medium text-neutral-900
                           border border-neutral-200/80
                           ${readOnly ? 'px-2.5 py-1' : 'pl-2.5 pr-0.5 py-0.5'}`}
              >
                <span className="capitalize">{item}</span>
                {!readOnly && (
                  <button
                    onClick={() => onRemove(item)}
                    aria-label={`remove ${item}`}
                    className="grid place-items-center w-5 h-5 rounded-full
                               text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100
                               cursor-pointer transition-colors"
                  >
                    <HugeiconsIcon icon={MultiplicationSignIcon} size={12} strokeWidth={2.2} />
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}

/* Trim trailing pr-0.5 when readOnly to remove the extra space chip-end */
