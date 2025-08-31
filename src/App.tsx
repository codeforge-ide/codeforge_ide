import React from "react";
import { ThemeProvider } from "./themes";
import { CommandProvider } from "./components/commands";
import { IDELayout } from "./components/layout/IDELayout.tsx";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <CommandProvider>
        <IDELayout />
      </CommandProvider>
    </ThemeProvider>
  );
}

export default App;
