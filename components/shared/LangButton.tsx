"use client"

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react';
import useLang from '../hooks/useLang';

function LangButton() {
  const {lang, setLang} = useLang()
  /* const [lang, setLang] = useRecoilState(localeState); */
  

  return (
    <div className="mx-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className='bg-blue-300 text-black dark:text-white dark:bg-dark-800 dark:hover:bg-blue-100/10'>
            <Image src={`/icons/${lang}.png`} alt={lang} width={24} height={24} />
            <p className='mx-2'>{
              (lang === 'en') ? 'English' : (lang === 'es') ? "Español" : "Français"
            }</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLang("es")}>
            Español
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang("en")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang("fr")}>
            Français
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
export default LangButton;