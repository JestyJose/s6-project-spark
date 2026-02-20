export type ProjectStatus = "Idea Submitted" | "Taken";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  teamMembers: string[];
  category?: string;
}

export const initialProjects: Project[] = [
  {
    id: "1",
    title: "Smart Campus Navigation App",
    description:
      "A mobile-friendly web app that helps students and visitors navigate the campus in real-time, with AR overlays and interactive maps showing facilities, classrooms, and events.",
    status: "Taken",
    teamMembers: ["Aya Benali", "Karim Djellouli", "Sara Mammeri"],
    category: "Mobile / UX",
  },
  {
    id: "2",
    title: "AI-Powered Study Planner",
    description:
      "A platform that uses machine learning to generate personalised study schedules based on course difficulty, personal goals, and performance history.",
    status: "Taken",
    teamMembers: ["Youcef Hadj", "Rania Oussama"],
    category: "AI / EdTech",
  },
  {
    id: "3",
    title: "Peer Code Review Platform",
    description:
      "A collaborative tool allowing students to submit their code, receive structured peer feedback, and track improvement metrics across different programming assignments.",
    status: "Idea Submitted",
    teamMembers: [],
    category: "Developer Tools",
  },
  {
    id: "4",
    title: "Waste Management Dashboard",
    description:
      "An IoT-integrated dashboard to monitor bin fill levels across the university campus, optimising collection routes and reducing environmental impact.",
    status: "Taken",
    teamMembers: ["Lina Bouchenafa", "Anis Ferhat", "Meriem Ziani", "Omar Chettih"],
    category: "IoT / Sustainability",
  },
  {
    id: "5",
    title: "Alumni Mentorship Network",
    description:
      "A networking portal that connects current students with alumni mentors in their field of interest, enabling structured mentorship sessions and career guidance.",
    status: "Idea Submitted",
    teamMembers: [],
    category: "Networking",
  },
  {
    id: "6",
    title: "Lab Equipment Booking System",
    description:
      "A reservation system for shared lab equipment and resources, preventing double-bookings and providing usage analytics for department administrators.",
    status: "Taken",
    teamMembers: ["Amira Kouider", "Sofiane Brahimi"],
    category: "Admin Tools",
  },
  {
    id: "7",
    title: "Student Mental Health Tracker",
    description:
      "An anonymous mood-tracking and wellbeing app for students, with aggregated analytics for university counsellors and links to relevant support resources.",
    status: "Idea Submitted",
    teamMembers: [],
    category: "Health / Wellness",
  },
  {
    id: "8",
    title: "Collaborative Research Repository",
    description:
      "A platform for students to publish, discover, and collaborate on research papers and projects with version control, citation tracking, and DOI assignment.",
    status: "Taken",
    teamMembers: ["Hamza Lazreg", "Nadia Tebbal", "Bilal Sahraoui"],
    category: "Research",
  },
];
