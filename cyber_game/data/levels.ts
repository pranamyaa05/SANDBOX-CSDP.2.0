export const levels = [
  { id: 1, title: "Password Security", unlocked: true },
  { id: 2, title: "Phishing Detection", unlocked: false },
  { id: 3, title: "Secure Login System", unlocked: false },
  { id: 4, title: "Network Intrusion", unlocked: false },
  { id: 5, title: "SQL Injection", unlocked: false },
  { id: 6, title: "Malware Infection", unlocked: false },
  { id: 7, title: "Ransomware Attack", unlocked: false },
  { id: 8, title: "Cloud Security", unlocked: false },
  { id: 9, title: "Social Engineering", unlocked: false },
  { id: 10, title: "Capture The Flag", unlocked: false },
];

// You can also add level details if needed
export const levelDetails = {
  1: {
    description: "Learn to create and manage strong passwords",
    points: 100,
    timeEstimate: "5 min",
    difficulty: "Beginner"
  },
  2: {
    description: "Identify and avoid phishing attempts",
    points: 150,
    timeEstimate: "10 min",
    difficulty: "Beginner"
  },
  // Add more as needed
};