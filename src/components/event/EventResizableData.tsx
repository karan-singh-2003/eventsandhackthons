'use client'
import React, { useEffect, useState } from 'react'
import EventcardHeader from './EventcardHeader'
import EventNavigation from './EventNavigation'
import { useParams, useRouter } from 'next/navigation'

function EventResizableData({eventTitle}:any) {
 const [resizableTitle, setResizableTitle] = useState(eventTitle);

    const params = useParams()
    useEffect(() => {
    setResizableTitle(eventTitle);
  }, [eventTitle]);

    const { workspaceSlug, eventSlug } = params
    return (
    <>
    <EventcardHeader title={resizableTitle || "Event Title"} status="DRAFT" />
    <EventNavigation workspaceSlug={workspaceSlug} eventSlug={eventSlug}/>
    </>
  )
}

export default EventResizableData