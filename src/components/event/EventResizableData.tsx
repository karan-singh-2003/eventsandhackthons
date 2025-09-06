import React from 'react'
import EventcardHeader from './EventcardHeader'
import EventNavigation from './EventNavigation'
import { useParams, useRouter } from 'next/navigation'

function EventResizableData({event}:any) {
    const params = useParams()
    const { workspaceSlug, eventSlug } = params
    return (
    <>
    <EventcardHeader event={event}/>
    <EventNavigation workspaceSlug={workspaceSlug} eventSlug={eventSlug}/>
    </>
  )
}

export default EventResizableData