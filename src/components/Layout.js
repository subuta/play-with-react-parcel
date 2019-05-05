import React from 'react'

import { Link } from 'react-router-dom'
import { css } from 'astroturf'

// language=PostCSS
const styles = css`
  .links {
    & a {
      @apply mx-4;
    }
  }
`

export default ({ children }) => {
  return (
    <div>
      <header className={styles.links}>
        <Link to='/'>/</Link>
        <Link to='/jokes/1'>/jokes/1</Link>
        <Link to='/jokes/2'>/jokes/2</Link>
        <Link to='/jokes/3'>/jokes/3</Link>
      </header>

      {children}
    </div>
  )
}
