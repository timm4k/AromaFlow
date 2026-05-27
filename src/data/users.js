export const USERS = [
  {
    id: "1",
    username: "tate",
    password: "tate05ori",
    displayName: "Tate",
    avatar: "🌸",
  },
  {
    id: "2",
    username: "oli",
    password: "07mooni",
    displayName: "Oli",
    avatar: "🌙",
  },
  {
    id: "3",
    username: "admin",
    password: "admin123",
    displayName: "Admin",
    avatar: "👑",
  },
  {
    id: "4",
    username: "aromqueen",
    password: "lavender22",
    displayName: "Aroma Queen",
    avatar: "👸",
  },
  {
    id: "5",
    username: "lavfox",
    password: "foxmoon99",
    displayName: "Lavender Fox",
    avatar: "🦊",
  },
];

export function findUser(username, password) {
  return USERS.find(
    (u) => u.username === username && u.password === password
  );
}
