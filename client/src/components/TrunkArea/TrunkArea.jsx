import { useState } from 'react'
import TrunkFilter from '../TrunkComponents/TrunkFilter'
import TrunkListing from '../TrunkComponents/TrunkListing'
import TrunkNav from '../TrunkComponents/TrunkNav'


export default function TrunkArea() {

  return (
    <>
        <div className="trunk-area">
          <TrunkFilter />
          <TrunkListing />
          <TrunkNav />
        </div>
    </>
  )
}