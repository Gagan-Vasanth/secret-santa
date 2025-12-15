/**
 * Mock API for testing the Secret Santa app without a real backend
 * This simulates the Google Apps Script responses
 */

// TODO: Replace with your actual users from Google Sheets for testing
// Copy the data from your "Users" sheet here
const mockUsers = [
  {
    name: "Gagan",
    dob: "2025-12-14",
    userId: "r0v05mk",
    hasPicked: false,
  },
  {
    name: "Jane Smith",
    dob: "1992-05-20",
    userId: "janesmith_002",
    hasPicked: false,
  },
  {
    name: "Bob Johnson",
    dob: "1988-11-30",
    userId: "bobjohnson_003",
    hasPicked: false,
  },
  {
    name: "Alice Williams",
    dob: "1995-07-12",
    userId: "alicewilliams_004",
    hasPicked: false,
  },
  {
    name: "Charlie Brown",
    dob: "1991-03-25",
    userId: "charliebrown_005",
    hasPicked: false,
  },
];

const assignments = [];

export const mockValidateUser = (name, dob) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.name.toLowerCase() === name.toLowerCase() && u.dob === dob
      );

      if (user) {
        resolve({
          success: true,
          alreadyPicked: user.hasPicked,
          userId: user.userId,
        });
      } else {
        resolve({
          success: false,
          message:
            "Invalid credentials. Please check your name and date of birth.",
        });
      }
    }, 1000); // Simulate network delay
  });
};

export const mockPickRecipient = (userId, name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.userId === userId);

      if (!user) {
        resolve({ success: false, message: "User not found" });
        return;
      }

      if (user.hasPicked) {
        resolve({
          success: false,
          message: "You have already picked your Secret Santa!",
        });
        return;
      }

      // Get available recipients (not already assigned and not self)
      const assignedIds = assignments.map((a) => a.recipientId);
      const available = mockUsers.filter(
        (u) => u.userId !== userId && !assignedIds.includes(u.userId)
      );

      if (available.length === 0) {
        resolve({
          success: false,
          message:
            "No recipients available. All Secret Santas have been assigned!",
        });
        return;
      }

      // Pick random recipient
      const recipient = available[Math.floor(Math.random() * available.length)];

      // Record assignment
      assignments.push({
        giverId: userId,
        giverName: name,
        recipientId: recipient.userId,
        recipientName: recipient.name,
      });

      user.hasPicked = true;

      resolve({
        success: true,
        recipient: recipient.name,
      });
    }, 2000); // Simulate network delay for picking
  });
};

export const useMockApi = () => {
  const isDev = import.meta.env.DEV;
  const apiUrl = import.meta.env.VITE_APPS_SCRIPT_URL;

  // IMPORTANT: Use mock API during development to avoid CORS issues
  // Google Apps Script doesn't support CORS for local development
  // For production, deploy to a static host (Netlify, Vercel, etc.) where CORS won't be an issue
  return isDev;
};
