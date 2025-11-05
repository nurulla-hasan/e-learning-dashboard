import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../messages/en.json";
import pl from "../messages/pl.json";
import uk from "../messages/uk.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en,
  pl,
  uk,
};

const namespaces = Object.keys(en);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: namespaces,
    defaultNS: "common",
    fallbackNS: "common",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;