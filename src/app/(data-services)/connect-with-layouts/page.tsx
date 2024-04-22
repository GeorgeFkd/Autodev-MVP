"use client"
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import React from 'react'

function AssociateDataSourcesWithLayoutsPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();

    if (!appState?.selectedApiData) {
        return "something went wrong"
    }

    //Have an editable title up above with < > controls to circle between the pages
    //Then render clickable boxes that launch a pop-up and then 

    return (
        <div>AssociateDataSourcesWithLayoutsPage

        </div>
    )
}

export default AssociateDataSourcesWithLayoutsPage
