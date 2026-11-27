import MemberCard from "./member-card";

const orgCommittee = [
  { name: "Ravneet Kaur", role: "President" },
  { name: "Harshit Dhingra", role: "Secretary General" },
  { name: "Manroop", role: "Under Secretary General" },
  { name: "Pratham", role: "USG of Academics" },
  { name: "Sukhman", role: "USG of Logistics" },
  { name: "Samaira", role: "USG of Finance" },
  { name: "Prabhleen", role: "USG of Marketing" },
  { name: "Ashmit", role: "USG of International Press" },
  { name: "Kamal", role: "USG of Public Relations" },
  { name: "Saniya", role: "Chief Mentor" },
];

export default function OrganizingCommittee() {
  return (
    <section aria-labelledby="organizing-committee" className="border-t border-border py-8">
      <h2 id="organizing-committee" className="editorial-title mb-6 text-4xl">Organizing committee</h2>
      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {orgCommittee.map((member) => (
          <li key={member.name}>
            <MemberCard {...member} imagePath={`/assets/team/${member.name.toLowerCase().replace(/\s+/g, "-")}.jpg`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
