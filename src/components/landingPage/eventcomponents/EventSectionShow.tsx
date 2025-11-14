'use client'
import React from 'react'
import { EventsSection } from './EventSection'
import MemoryPic from '../MemoryPic/MemoryPic'
import { useRouter } from 'next/navigation'
import { usegeteventaccordingworkspaces } from '@/hooks/usegeteventaccordingworkspaces'

function EventSectionShow() {



  const upcomingevents = [
 {
      eventName: "Tech Summit 2024",
      eventImage: "/modern-tech-conference-poster-with-futuristic-desi.jpg",
      eventDate: "Mon, 21 Oct 2024",
      society: "computer science society",
      isEnrolled: true,
      upcoming: 'yes'
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      upcoming: 'yes'
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      upcoming: 'yes'
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      upcoming: 'yes'
    },  {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
      upcoming: 'yes'
    },
    
]



 const router = useRouter();
  const { workspaces, isPending, isFetching, error } = usegeteventaccordingworkspaces();
if (isPending || isFetching) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error.message}</p>;

  return (
   <div>
    
    
            
               <EventsSection
                title="Upcoming Events"
                aboutTitle='Big moments, bigger memories — coming soon!'
                events={upcomingevents}
                 onSeeAll={() => router.push(`/events/${workspaces[0]?.slug}`)}
                
              />
              
               {workspaces.map((workspace: any) => (
        <EventsSection
          key={workspace.id}
          title={workspace.name} // ✅ Workspace name as title
          events={workspace.events.map((event: any) => ({
            eventId: event.id,
            eventName: event.name,
            eventSlug: event.slug,
            eventImage:
              event.bannerUrl ||
              "https://cdn.pixabay.com/photo/2024/01/22/tech-conference.jpg",
            eventDate: new Date(event.startDate).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            society: workspace.name,
            isEnrolled: true, // You can make this dynamic later
          }))}
          onSeeAll={() => router.push(`/events/${workspace.slug}`)} // ✅ redirect to that workspace’s event list
        />
      ))}
    
        <MemoryPic/>
   </div>
  )
}

export default EventSectionShow