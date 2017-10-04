import React from 'react'
import PropTypes from 'prop-types'
import TweetEmbed from './TweetEmbed'


const Twitter = ({ twitter_id }) => (
  <div >
    <TweetEmbed id={twitter_id} />
  </div>
)

export default Twitter

