import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import moment from "moment";
import numeral from "numeral";

import {v4} from 'uuid';
// import { VERSION } from "./store/constants/api";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "en",

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    backend: {
      queryStringParams: {
        v: v4(),
      }
    },

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
      format(value, format, lng) {
        switch (format) {
          case "uppercase":
            return value.toUpperCase();
          default:
            if (typeof value === "number") return numeral(value).format(format);
            if (value instanceof Date) return moment(value).format(format);
            return value;
        }
      }
    },

    react: {
      wait: true
    }
  });

console.log(i18n)

export default i18n;