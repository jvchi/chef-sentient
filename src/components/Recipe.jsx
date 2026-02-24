import React from 'react'
import ReactMarkdown from 'https://esm.sh/react-markdown@7'

export default function Recipe(props) {
  return (
    <ReactMarkdown className='recipe-markdown max-w-[800px] mx-auto' aria-live='polite'>
      {/* <h2 className='text-[14px] font-medium my-4 sm:text-[18px] px-4 sm:px-2'>Chef Jed Recommends:</h2> */}
      {props.recipe}
    </ReactMarkdown>
  )
}