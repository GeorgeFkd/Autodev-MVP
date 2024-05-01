"use client"
import { Inter, Manrope, Ysabeau } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useReducer } from "react";
import appReducer from "@/logic/reducer";
import { EMPTY_APP_CONTEXT } from "@/logic/reducer";
import { AppContext, AppDispatchContext } from "@/contexts/AppContext"
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [state, dispatch] = useReducer(appReducer, EMPTY_APP_CONTEXT);
  return (

    <html lang="en">

      <body className={inter.className}>
        <AppContext.Provider value={state}>
          {/* sth is going on with the typing here */}
          <AppDispatchContext.Provider value={dispatch}>
            <ChakraProvider>
              {children}
            </ChakraProvider>
          </AppDispatchContext.Provider>
        </AppContext.Provider>
      </body>

    </html>

  );
}
