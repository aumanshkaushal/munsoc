import Image from "next/image";

interface MemberCardProps {
  name: string;
  role: string;
  imagePath: string;
}

export default function MemberCard({ name, role, imagePath }: MemberCardProps) {
  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
        <Image src={imagePath} alt="" fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) 29vw, 265px" className="object-cover object-[center_29%]" />
      </div>
      <figcaption className="flex flex-col gap-0.5 pt-2.5 text-sm">
        <span className="font-semibold">{name}</span>
        {role && <span className="text-muted-foreground">{role}</span>}
      </figcaption>
    </figure>
  );
}
