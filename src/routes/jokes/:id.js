import React from 'react'
import { withRouter } from 'react-router'
import _ from 'lodash'

export default withRouter((props) => {
  const id = _.get(props, 'match.params.id')
  return (
    <h1>jokes: {id}!</h1>
  )
})
