import React, { Component } from "react";
import { translate } from "react-i18next";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";

import "./index.css";
// import options from "./options";

@translate('translations')
export default class extends Component {
  render() {
    const { t, item } = this.props;
    const gallery = JSON.parse(item.gallery);

    if(gallery && gallery.length) {
	    return (
        <div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5 w-100">
          <Slider className="mt-2" num={5} move={1}>
				    {gallery.map((item, index) => (
              <ProductItemPhoto
                key={index}
                image={item}
              />
				    ))}
          </Slider>
        </div>
	    );
    }
    return (
      <div className="row flex-nowrap d-flex flex-row justify-content-between block bg-white mb-4 mt-5 w-100">
          {t('LABEL.NO_IMAGE')}
      </div>
    );
  }
}