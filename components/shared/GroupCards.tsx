"use client"

import React, { useState } from 'react';
import GroupCard from "./GroupCard"

const GroupCards = ({groups, email}: any) => {

  return (
    <div className="w-full px-8 py-2 my-2 overflow-x-hidden">
        {
            groups.map((group: any) => (
                <GroupCard group={group}/>
            ))
        }
    </div>
  )
}

export default GroupCards