providers: [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },

    async authorize(credentials: any) {

      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const { email, password } = credentials;

      const users = await getUser(email);

      if (users.length === 0) {
        await compare(password, DUMMY_PASSWORD);
        return null;
      }

      const user = users[0];

      if (!user.password) {
        await compare(password, DUMMY_PASSWORD);
        return null;
      }

      const passwordsMatch = await compare(password, user.password);

      if (!passwordsMatch) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        type: "regular"
      };
    },
  }),

  Credentials({
    id: "guest",
    name: "Guest",
    credentials: {},

    async authorize() {

      const guestId = `guest-${Date.now()}`;

      return {
        id: guestId,
        name: "Invité Anonyme",
        email: null,
        image: null,
        type: "guest"
      };
    },
  })
]
