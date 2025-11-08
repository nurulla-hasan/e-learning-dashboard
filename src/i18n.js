import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../messages/en.json";
import pl from "../messages/pl.json";
import uk from "../messages/uk.json";

const resources = {
  en,
  pl,
  uk,
};

const namespaces = Object.keys(en);

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  ns: namespaces,
  defaultNS: "common",
  fallbackNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
