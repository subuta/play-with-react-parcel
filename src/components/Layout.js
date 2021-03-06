import React from 'react'

import Link from './Link'
import { css } from 'astroturf'

// language=PostCSS
const styles = css`
  :global {
    body {
      @apply p-4;
    }
  }
  
  .links {
    @apply mb-4;
    
    & a {
      @apply inline-block p-4;
    }
  }
`

export default ({ children }) => {
  return (
    <div>
      <header className={styles.links}>
        <Link to='/' prefetch>/</Link>
        <Link to='/jokes/1' prefetch>/jokes/1</Link>
        <Link to='/jokes/2' prefetch>/jokes/2</Link>
        <Link to='/jokes/3' prefetch>/jokes/3</Link>
      </header>

      {children}
    </div>
  )
}
