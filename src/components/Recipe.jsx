import React from 'react'
import ReactMarkdown from 'https://esm.sh/react-markdown@7'

export default function Recipe(props) {
  return (
    <section className='px-6 sm:px-8  max-w-[800px] mx-auto mb-40 mb-'>
      <h2 className='text-[14px] font-medium mb-4 sm:text-[18px]'>Chef Jed Recommends:</h2>
      <ReactMarkdown className='recipe-markdown' aria-live='polite'>
        {props.recipe}
      </ReactMarkdown>
    </section>

  )
}