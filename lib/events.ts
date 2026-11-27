const photoRoot = "/assets/events/ypm-2026";

export type EventPhoto = {
  src: string;
  caption: string;
  alt: string;
  portrait?: boolean;
};

const photos: EventPhoto[] = [
  {
    src: `${photoRoot}/conclusion-group-photo.jpg`,
    caption: "The closing group photo",
    alt: "Delegates and organizers gathered at the front of the chamber",
  },
  {
    src: `${photoRoot}/person-speaking.jpg`,
    caption: "At the microphone",
    alt: "A delegate stands to speak while other delegates listen beside her",
    portrait: true,
  },
  {
    src: `${photoRoot}/first-position-award-giving.jpg`,
    caption: "First place",
    alt: "The first-place award being presented in front of the chamber",
  },
  {
    src: `${photoRoot}/diplomat-vs-diplomat.jpg`,
    caption: "Diplomat vs. Diplomat",
    alt: "Two delegates face each other across the chamber during a debate",
  },
  {
    src: `${photoRoot}/diplomat-vs-diplomat-wide-shot.jpg`,
    caption: "A view of the chamber",
    alt: "Delegates sit around a horseshoe of desks during the debate",
  },
  {
    src: `${photoRoot}/honourable-mention.jpg`,
    caption: "Honourable mention",
    alt: "The honourable mention recipient and organizers pose for a photo",
  },
  {
    src: `${photoRoot}/organizing-committee.jpg`,
    caption: "The organizing committee",
    alt: "The organizing committee poses together after the event",
  },
];

export const youthParliament2026 = {
  href: "/events/ypm-2026",
  title: "Youth Parliament",
  date: "2026-10-18",
  dateLabel: "18 October 2026",
  year: "2026",
  venue: "NIT Jalandhar",
  committee: "All India Political Parties Meet (AIPPM)",
  registrationOpen: false,
  photos,
  cover: photos[0],
};

export const eventArchive = [youthParliament2026];

export const societyLinks = {
  instagram: "https://instagram.com/nitjmunsociety",
  whatsapp: "https://chat.whatsapp.com/IFbG2gOm3gvHSB5Vi4sIr5",
  linkedin: "https://www.linkedin.com/company/munsoc-nitj",
  email: "nitjmunsoc@gmail.com",
  university: "https://nitj.ac.in",
};
