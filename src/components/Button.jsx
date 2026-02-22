import React from 'react'

export default function Button({children, variant='primary'}){
  const baseStyle = 'text-neutral-50 shadow-[inset_0px_0px_3px_rgba(0,0,0,0.5)] shadow-white w-fit min-w-[90px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[10px] rounded-2xl w-max px-4 py-2 max-h-[38px]';

  const variants = {
    primary: 'bg-neutral-900',
    secondary: 'bg-orange-900'
  }

  return (
    <button className={`${baseStyle} ${variants[variant]}`}>{children}</button>
  )
}