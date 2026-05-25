import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  MultiplicationSignIcon,
  ArrowRight02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'

const spring = { type: 'spring', stiffness: 360, damping: 28 }

const IngredientsList = forwardRef(function IngredientsList(
  { ingredients, removeIngredient, showRecipe, recipeStatus },
  ref
) {
  const canCook = ingredients.length >= 4

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="max-w-[580px] mx-auto mt-10"
    >
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-[13px] font-medium text-neutral-500 tracking-tight">
          Ingredients
        </h2>
        <span className="text-[12px] text-neutral-400 tabular-nums">
          {ingredients.length}
        </span>
      </div>

      <ul className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {ingredients.map(item => (
            <motion.li
              key={item}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={spring}
              className="group inline-flex items-center gap-1 pl-3 pr-1 py-1
                         rounded-full bg-neutral-100
                         text-[14px] font-medium text-neutral-900"
            >
              <span className="capitalize">{item}</span>
              <button
                onClick={() => removeIngredient(item)}
                aria-label={`remove ${item}`}
                className="grid place-items-center w-6 h-6 rounded-full
                           text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200
                           cursor-pointer transition-colors"
              >
                <HugeiconsIcon icon={MultiplicationSignIcon} size={14} strokeWidth={2.2} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {canCook && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={spring}
            className="flex items-center justify-between gap-4 mt-8
                       rounded-2xl border border-neutral-200 bg-white
                       shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                       px-5 py-4"
          >
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
                Ready for a recipe?
              </h3>
              <p className="text-[13px] text-neutral-500 mt-0.5 truncate">
                Generate one from your {ingredients.length} ingredients.
              </p>
            </div>
            <CookButton onClick={showRecipe} status={recipeStatus} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
})

export default IngredientsList

function CookButton({ onClick, status }) {
  const disabled = status === 'loading'
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className="relative shrink-0 inline-flex items-center justify-center gap-1.5
                 h-9 px-4 rounded-full
                 bg-neutral-900 text-white text-[13px] font-medium tracking-tight
                 disabled:opacity-80 cursor-pointer min-w-[110px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5"
          >
            Generate
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={2.4} />
          </motion.span>
        )}
        {status === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <span className="block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Cooking
          </motion.span>
        )}
        {status === 'done' && (
          <motion.span
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.6} />
            Done
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
