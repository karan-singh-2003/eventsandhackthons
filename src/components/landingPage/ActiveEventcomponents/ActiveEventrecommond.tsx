import Image from "next/image"

interface EventCardProps {
  id: string
  title: string
  organizer: string
  image: string
}

export default function ActiveEventrecommond({ id, title, organizer, image }: EventCardProps) {
  return (
    <div className="group cursor-pointer mb-4">
      <div className="relative w-[38vh] overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
        <div className="relative w-[38vh] h-[50vh] aspect-square">
          <Image
            src="/cybersecurity-hacking-workshop-poster-dark-theme.jpg"
            alt={title}
            fill
            className="object-fit group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className=" mt-3 lg:mt-2 space-y-1">
        <div className="font-medium text-[#1a1a1a] line-clamp-2 group-hover:text-primary transition-colors text-[14px]">
          {title}
        </div>
        <p className="text-[11px] text-muted-foreground">{organizer}</p>
      </div>
    </div>
  )
}
