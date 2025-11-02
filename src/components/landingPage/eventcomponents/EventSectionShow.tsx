'use client'
import React from 'react'
import { EventsSection } from './EventSection'
import MemoryPic from '../MemoryPic/MemoryPic'
import { useRouter } from 'next/navigation'

function EventSectionShow() {

  const enrolledEvents = [
    {
      eventName: "QuizPhonic - Sync Your Mind to the Quiz Beat",
      eventImage: "/hackathon-coding-event-poster-with-laptop-and-code.jpg",
      eventDate: "Sat, 18 Oct onwards",
      society: "titan club",
      description: "Test your knowledge in this exciting quiz competition",
      isEnrolled: true,
    },
    {
      eventName: "Ek Chatur Naar - Cultural Festival",
      eventImage: "/hackathon-coding-event-poster-with-laptop-and-code.jpg",
      eventDate: "Sat, 18 Oct onwards",
      society: "cultural society",
      isEnrolled: true,
    },
    {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
    {
      eventName: "Tech Summit 2024",
      eventImage: "/modern-tech-conference-poster-with-futuristic-desi.jpg",
      eventDate: "Mon, 21 Oct 2024",
      society: "computer science society",
      isEnrolled: true,
    },
     {
      eventName: "Tech Summit 2024",
      eventImage: "/modern-tech-conference-poster-with-futuristic-desi.jpg",
      eventDate: "Mon, 21 Oct 2024",
      society: "computer science society",
      isEnrolled: true,
    },
  ]

  const latestEvents = [
    {
      eventName: "Tech Summit 2024",
      eventImage: "/modern-tech-conference-poster-with-futuristic-desi.jpg",
      eventDate: "Mon, 21 Oct 2024",
      society: "computer science society",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },  {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
  ]


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


  const CosumicClub = [
    {
      eventName: "Tech Summit 2024",
      eventImage: "/modern-tech-conference-poster-with-futuristic-desi.jpg",
      eventDate: "Mon, 21 Oct 2024",
      society: "computer science society",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },  {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
  ]

  const ItianClub = [
    {
      eventName: "Tech Summit 2024",
      eventImage: "/modern-tech-conference-poster-with-futuristic-desi.jpg",
      eventDate: "Mon, 21 Oct 2024",
      society: "computer science society",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
      {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/webdevarena.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },  {
      eventName: "Ethical Hacking Workshop",
      eventImage: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
      eventDate: "13th Oct 2023, 12:30 PM",
      society: "tech club",
      description: "Learn ethical hacking tools and techniques",
      isEnrolled: true,
    },
  ]
 const router = useRouter();
  return (
   <div>
     <EventsSection
                title="Enrolled Events"
                events={enrolledEvents}
                //socyietyid provide here 
                onSeeAll={() => router.push(`/events/upcoming`)}
              />
    
              <EventsSection
                title="Latest Events"
                events={latestEvents}
                 onSeeAll={() => router.push(`/events/itian`)}
              />
               <EventsSection
                title="Upcoming Events"
                aboutTitle='Big moments, bigger memories — coming soon!'
                events={upcomingevents}
                 onSeeAll={() => router.push(`/events/itian`)}
                
              />
                 <EventsSection
                title="Itian Club Events"
                events={ItianClub}
                 onSeeAll={() => router.push(`/events/itian`)}
              />
                 <EventsSection
                title="Tech Club Events"
                events={CosumicClub}
                 onSeeAll={() => router.push(`/events/itian`)}
              />
        <MemoryPic/>
   </div>
  )
}

export default EventSectionShow