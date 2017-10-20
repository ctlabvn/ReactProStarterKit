import React from "react";
import classNames from "classnames";

export default ({ className, ...props }) => (
  <div
    className={classNames("d-flex flex-row justify-content-center", className)}
    {...props}
  >
    <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
  </div>
);