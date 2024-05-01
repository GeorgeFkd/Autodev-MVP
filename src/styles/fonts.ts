import { Manrope, Ysabeau } from "next/font/google"
//for titles
const manropeBold = Manrope({ weight: '700', subsets: ["latin", "greek"] });
const manropeSemiBold = Manrope({ weight: '600', subsets: ["latin", "greek"] });
//for general text
const ysabeau400 = Ysabeau({ weight: '400', subsets: ["latin", "greek"] });
const ysabeau500 = Ysabeau({ weight: '500', subsets: ["latin", "greek"] });
const ysabeau600 = Ysabeau({ weight: '600', subsets: ["latin", "greek"] });
const ysabeau700 = Ysabeau({ weight: '700', subsets: ["latin", "greek"] });

export { manropeBold, manropeSemiBold, ysabeau400, ysabeau500, ysabeau600, ysabeau700 }
