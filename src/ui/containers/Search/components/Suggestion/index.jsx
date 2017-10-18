import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

// component
import Dropdown from "~/ui/components/Dropdown";
import Slider from "~/ui/components/Slider";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";

import options from "./options";
import "./index.css";

@translate('translations')
export default class extends Component {
  render() {
    
    const {t} = this.props;    

    return (
      <div className="container container-xs suggestion border-bottom">
        <h5 className="color-black text-uppercase font-weight-bold">{t("LABEL.OUR_SUGGESTIONS")}</h5>
        <p className="color-gray">
        {t("LABEL.PLAY_OUR_GAME")}
        
        </p>

        <Slider className="mt-2" num={6} move={1}>
            {options.products.map((item, index) => (
              <ProductItemPhoto
                key={index}       
                price={0}                
                image="/images/donut-square.png"
              />
            ))}         
        </Slider>

      </div>
    );
  }
}