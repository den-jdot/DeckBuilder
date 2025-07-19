import { useState } from 'react'
import './App.css'

import HeaderArea from './components/HeaderArea/HeaderArea.jsx'
import CardArea from './components/CardArea/CardArea.jsx'
import DeckArea from './components/DeckArea/DeckArea.jsx'
import TrunkArea from './components/TrunkArea/TrunkArea.jsx'

function App() {

  return (
    <>
      <main>
        <HeaderArea />

          <div className="main-app">

            <CardArea />
            <DeckArea />
            <TrunkArea />

          </div>
      </main>
    </>
  )
}

export default App
