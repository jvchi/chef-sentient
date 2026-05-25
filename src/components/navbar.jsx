import { motion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChefHatIcon } from '@hugeicons/core-free-icons'

const spring = { type: 'spring', stiffness: 280, damping: 24 }

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-14
                 bg-white/85 backdrop-blur-xl border-b border-neutral-200/70 select-none"
    >
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={ChefHatIcon} size={20} strokeWidth={1.8} className="text-neutral-900" />
        <span className="text-[15px] font-semibold tracking-tight text-neutral-900">Chef JED</span>
      </div>
    </motion.nav>
  )
}
