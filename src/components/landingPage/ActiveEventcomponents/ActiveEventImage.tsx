export default function ActiveEventImage({eventimg}:any) {
  return (
    <div className="w-full rounded-lg overflow-hidden bg-muted">
      <img src={eventimg} alt="Ethical Hacking Workshop" className="w-full h-full  lg:h-[75vh] object-fit" />
    </div>
  )
}
