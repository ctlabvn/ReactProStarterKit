import React, { Component } from "react";
import { Link } from "react-router-dom";

// component
import ButtonRound from "~/ui/components/Button/Round";
import CommentRating from "~/ui/components/Comment/Rating";
import LabelRating from "~/ui/components/LabelRating";
import Rating from "~/ui/components/Rating";
import HeadingDouble from "~/ui/components/Heading/Double";

import options from "./options"

export default class extends Component {
  render() {
    

    return (
      <div className="row block bg-white mb-4">

        <div className="col-md-6">
          <h3 className="font-largest color-black font-weight-bold">
            4.9 
            <Rating score={5} className="d-inline ml-2"/>            
          </h3>
          {options.votes.map((item, index)=>
            <LabelRating percent={item} key={index} className="mt-4"/>
          )}
        </div>

        <div className="col-md-6">
          <h3 className="font-largest color-black text-uppercase font-weight-bold">Latest</h3>
          <div className="flex-wrap d-flex flex-row">
            {options.comments.map((item, index)=>
              <CommentRating size={50} image="/images/round-avatar.png" key={index} title={item} className="w-50 pr-2 mt-4"/>
            )}
          </div>
        </div>
        
      </div>
    );
  }
}