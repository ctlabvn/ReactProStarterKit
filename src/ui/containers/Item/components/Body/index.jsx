import React, { Component } from "react";
import { translate } from "react-i18next";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";

import "./index.css";
import options from "./options";

@translate('translations')
export default class extends Component {
  render() {
    const { t, item, outlet } = this.props;
    const gallery = (JSON.parse(item.gallery)).join('').split('');
    console.log(gallery);

    if(gallery.length) {
	    return (
        <div className="row block bg-white mb-4">
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
      <div className="row block bg-white mb-4">
          {t('LABEL.NO_IMAGE')}
      </div>
    );
  }
}