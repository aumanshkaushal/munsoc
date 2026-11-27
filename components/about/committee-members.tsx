import MemberCard from "./member-card";

const committeeMembers = [
  { name: "Harneet", role: "" },
  { name: "Naman", role: "" },
  { name: "Mohit", role: "" },
  { name: "Bhavya", role: "" },
  { name: "Ramneet", role: "" },
  { name: "Prabhleen", role: "" },
  { name: "Karthik", role: "" },
  { name: "Aumansh", role: "" },
  { name: "Rahul", role: "" },
  { name: "Satyam", role: "" },
];

export default function CommitteeMembers() {
  return (
    <section aria-labelledby="committee-members" className="border-t border-border py-8">
      <h2 id="committee-members" className="editorial-title mb-6 text-4xl">Committee members</h2>
      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {committeeMembers.map((member) => (
          <li key={member.name}>
            <MemberCard {...member} imagePath={`/assets/committee/${member.name.toLowerCase()}.jpg`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
