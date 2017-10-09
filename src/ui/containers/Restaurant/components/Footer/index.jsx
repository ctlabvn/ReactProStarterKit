import React, { Component } from "react"
import { Link } from 'react-router-dom'

// component
import ButtonRound from '~/ui/components/Button/Round'
import CommentRating from '~/ui/components/Comment/Rating'
import LabelRating from '~/ui/components/LabelRating'
import Rating from '~/ui/components/Rating'
import ProductItem from '~/ui/components/Product/Item'
import HeadingDouble from '~/ui/components/Heading/Double'

export default class extends Component {

  render(){
    return (

      <div className="row block bg-white">
        <Rating score={3}/>
        <Rating type="Bar" progress={90} />
        <CommentRating/>
        <LabelRating progress={76}/>
        <ButtonRound icon="angle-right"/>
        <ButtonRound icon="plus"/>

        <ProductItem title="DONUTS PACK x8" price={19} 
          image="/images/donut.png"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "/>
      </div>
    )
  }
}
