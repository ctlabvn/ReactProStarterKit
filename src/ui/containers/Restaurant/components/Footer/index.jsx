import React, { Component } from "react";
import { Link } from "react-router-dom";

// component
import ButtonRound from "~/ui/components/Button/Round";
import CommentRating from "~/ui/components/Comment/Rating";
import LabelRating from "~/ui/components/LabelRating";
import Rating from "~/ui/components/Rating";
import ProductItem from "~/ui/components/Product/Item";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import HeadingDouble from "~/ui/components/Heading/Double";

import options from "./options"

export default class extends Component {
  render() {
    

    return (
      <div className="row block bg-white">

        <div className="col-md-6">
          <h3 className="font-largest color-black font-weight-bold">
            4.9 
            <Rating score={5} className="d-inline ml-2"/>            
          </h3>
          {options.votes.map(item=>
            <LabelRating percent={item} width={350}/>
          )}
        </div>

        <div className="col-md-6">
          <h3 className="font-largest color-black text-uppercase font-weight-bold">Latest</h3>
          {options.comments.map(item=>
            <ProductItemPhoto title={item}/>
          )}
        </div>
        
      </div>
    );
  }
}