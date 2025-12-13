import React, { createContext, useState, useContext } from 'react'
import mock from '../data/mockMission'

const MissionContext = createContext()

export function MissionProvider({ children }) {
    const [missions, setMissions] = useState(mock)
    const [selected, setSelected] = useState(missions[0] || null)

    return (
        <MissionContext.Provider value={{ missions, setMissions, selected, setSelected }}>
            {children}
        </MissionContext.Provider>
    )
}

export function useMissions() { return useContext(MissionContext) }