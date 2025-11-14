export default function ActiveEventDescription({
  description,
  externalLink,
}: {
  description: string;
  externalLink?: any;
}) {
  return (
    <div className="space-y-4 lg:space-y-2 pr-6">
      <h2 className="text-xl lg:text-[24px] font-medium text-[#1a1a1a]">
        About The Event
      </h2>

      <p className="text-[#404040] leading-relaxed text-[15px] font-medium">
        {description}
      </p>

      {externalLink?.linkUrl && (
        <div className="my-1 lg:my-5">
          <p className="text-[#1a1a1a] lg:text-[18px] mb-1 text-xl font-medium  uppercase">
            {
              externalLink.linkTitle || "External Link:"
            }
          </p>
          <a
            href={externalLink.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d1410c] font-medium hover:underline"
          >
            {externalLink.linkUrl}
          </a>
        </div>
      )}
    </div>
  );
}
