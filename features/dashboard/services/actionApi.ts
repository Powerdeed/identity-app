export const handleProvisioning = async (userId: string) => {
  return { userId: userId, status: "success" };
};

// Action types
// - Pending Provisioning
// - Temporary Access Expiring
// - Overdue Access Reviews
// - Recently suspended users
// -
