import React from 'react'
import ReactMarkdown from 'https://esm.sh/react-markdown@7'

export default function Recipe(props) {
  return (
    <ReactMarkdown className='max-w-[800px] mx-auto'>
      {props.recipe}
    </ReactMarkdown>
  )
}