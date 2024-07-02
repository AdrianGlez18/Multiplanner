"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

type Lang = "en" | "es" | "fr" | 'de';
type LangState = {
  lang: Lang;
  setLang(lang: Lang): void;
};

const LangContext = createContext<LangState | null>(null);

export const LangProvider = (props: PropsWithChildren) => {
    const [lang, setLang] = useState<Lang>("en");
    return (
      <LangContext.Provider value={{ lang, setLang }}>
        {props.children}
      </LangContext.Provider>
    );
  };

const useLang = (): LangState => {
    const context = useContext(LangContext);
    if(!context) {
        throw new Error("Please use LangProvider in parent component");
    }
    return context;
};

export default useLang;