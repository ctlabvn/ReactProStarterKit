import React from "react";
import numeral from "numeral";

export default ({ currency, price }) => (
  <span itemProp="offers" itemScope itemType="http://schema.org/Offer">
    {currency && (
      <span itemProp="priceCurrency" content={currency.code}>
        {currency.symbol}
      </span>
    )}
    <span itemProp="price" content={price}>
      {numeral(price).format("0,0.00")}
    </span>
  </span>
);
