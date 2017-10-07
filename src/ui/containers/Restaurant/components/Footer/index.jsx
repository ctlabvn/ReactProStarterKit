import React, { Component } from "react"
import { Link } from 'react-router-dom'
import ArrowButton from '~/ui/components/Button/Arrow'
import CommentRating from '~/ui/components/Comment/Rating'

// component
import Rating from '~/ui/components/Rating'

export default class extends Component {

  render(){
    return (

      <div className="row block bg-white">
        <Rating score={3}/>
        <Rating type="Bar" progress={90} />
        <CommentRating/>
        <ArrowButton/>
      </div>
    )
  }
}
