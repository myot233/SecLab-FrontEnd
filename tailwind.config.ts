import type { Config } from 'tailwindcss'
import daisyui from "daisyui";
import  plugin from "@tailwindcss/typography";



export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
      daisyui,
      plugin
     
      
  ],
  daisyui:{
    themes:['synthwave']
  }
} satisfies Config

