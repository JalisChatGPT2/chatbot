Credentials({
  id: "guest",
  name: "Guest",
  credentials: {},
  async authorize() {
    // Pas d'appel DB ! On crée un utilisateur invité fictif en mémoire
    const guestId = `guest-${Date.now()}`; // ID unique pour la session
    return {
      id: guestId,
      name: "Invité Anonyme",
      email: null,        // ou "guest@anonymous.com" si besoin
      image: null,
      type: "guest" as const,
    };
  },
}),
