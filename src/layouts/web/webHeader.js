export function webHeader() {
  return {
    profileOpen: false,
    notificationsOpen: false,

    toggleProfileMenu() {
      this.profileOpen = !this.profileOpen;
    },

    toggleNotifications() {
      this.notificationsOpen = !this.notificationsOpen;
    },

    initials() {
      const name = this.$store.auth.user?.full_name ?? 'A';
      return name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    },
  };
}
