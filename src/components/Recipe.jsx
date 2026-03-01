import React from 'react'
import ReactMarkdown from 'https://esm.sh/react-markdown@7'

export default function Recipe(props) {
  return (
    <section className='px-6 sm:px-8  max-w-[800px] mx-auto mb-40 mb-'>
      <h2 className='relative text-[14px] font-medium mb-4 sm:text-[16px] inline-block'>
        <span className='text-neutral-900'>Chef Jed Recommends:</span>
        <span className={`absolute inset-0 animate-shimmer pointer-events-none transition-opacity duration-1000 ease-out ${props.recipeStatus === 'loading' ? 'opacity-100' : 'opacity-0'}`}>
          Chef Jed Recommends:
        </span>
      </h2>
      <ReactMarkdown className='recipe-markdown' aria-live='polite'>
        {props.recipe}
      </ReactMarkdown>
    </section>

  )
}