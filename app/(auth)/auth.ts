providers: [
  Credentials({
    credentials: {},
    async authorize({ email, password }: any) {
      const users = await getUser(email);
      if (users.length === 0) {
        await compare(password, DUMMY_PASSWORD);
        return null;
      }
      const [user] = users;
      if (!user.password) {
        await compare(password, DUMMY_PASSWORD);
        return null;
      }
      const passwordsMatch = await compare(password, user.password);
      if (!passwordsMatch) {
        return null;
      }
      return { ...user, type: "regular" };
    },
  }),
  Credentials({
    id: "guest",
    name: "Guest",
    credentials: {},
    async authorize() {
      // Version sans DB, en mémoire uniquement
      const guestId = `guest-${Date.now()}`;
      return {
        id: guestId,
        name: "Invité Anonyme",
        email: null,
        image: null,
        type: "guest" as const,
      };
    },
  })
],
