import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full
                  px-4 py-2 text-[14px] font-medium tracking-tight
                  cursor-pointer select-none transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
