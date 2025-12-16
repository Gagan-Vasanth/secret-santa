/**
 * Mock API for testing the Secret Santa app without a real backend
 * This simulates the Google Apps Script responses
 */

// Mock users with Walmart email addresses for testing
// In production, any Walmart email will be accepted without validation
const mockUsers = [
  {
    name: "APAR SHARMA",
    email: "apar.sharma@walmart.com",
    userId: "apar.sharma@walmart.com",
    hasPicked: false,
  },
  {
    name: "Dilip Kumar",
    email: "dilip.kumar2@walmart.com",
    userId: "dilip.kumar2@walmart.com",
    hasPicked: false,
  },
  {
    name: "Gagan Vasanth",
    email: "gagan.vasanth@walmart.com",
    userId: "gagan.vasanth@walmart.com",
    hasPicked: false,
  },
  {
    name: "Madhanraj G",
    email: "m.gunasekaran@walmart.com",
    userId: "m.gunasekaran@walmart.com",
    hasPicked: false,
  },
  {
    name: "S Manikandan",
    email: "m.sivasubramanian@walmart.com",
    userId: "m.sivasubramanian@walmart.com",
    hasPicked: false,
  },
  {
    name: "Neha Mohanty",
    email: "neha.mohanty@walmart.com",
    userId: "neha.mohanty@walmart.com",
    hasPicked: false,
  },
  {
    name: "Nitin Mohan",
    email: "nitin.mohan@walmart.com",
    userId: "nitin.mohan@walmart.com",
    hasPicked: false,
  },
  {
    name: "Poojitha B N",
    email: "poojitha.b.n@walmart.com",
    userId: "poojitha.b.n@walmart.com",
    hasPicked: false,
  },
  {
    name: "Ritwij Bhattacharya",
    email: "ritwij.bhattacharya@walmart.com",
    userId: "ritwij.bhattacharya@walmart.com",
    hasPicked: false,
  },
  {
    name: "Shruti Gupta",
    email: "shruti.gupta@walmart.com",
    userId: "shruti.gupta@walmart.com",
    hasPicked: false,
  },
  {
    name: "Siva Prathap Reddy Chinta",
    email: "sivaprathapreddy.chi@walmart.com",
    userId: "sivaprathapreddy.chi@walmart.com",
    hasPicked: false,
  },
  {
    name: "Swapnil Kumar",
    email: "swapnil.kumar@walmart.com",
    userId: "swapnil.kumar@walmart.com",
    hasPicked: false,
  },
  {
    name: "Twinkle Benedict",
    email: "twinkle.benedict@walmart.com",
    userId: "twinkle.benedict@walmart.com",
    hasPicked: false,
  },
  {
    name: "Vijayendra Mp",
    email: "vijayendra.mp@walmart.com",
    userId: "vijayendra.mp@walmart.com",
    hasPicked: false,
  },
  {
    name: "Vinay Pareek",
    email: "vinay.pareek@walmart.com",
    userId: "vinay.pareek@walmart.com",
    hasPicked: false,
  },
  {
    name: "Yuvan Shankar Karthick Shanmugavelu",
    email: "yuvan.shankar.karthick.shanmugavelu@walmart.com",
    userId: "yuvan.shankar.karthick.shanmugavelu@walmart.com",
    hasPicked: false,
  },
  {
    name: "Aiswarya Anand S",
    email: "aiswarya.anands@walmart.com",
    userId: "aiswarya.anands@walmart.com",
    hasPicked: false,
  },
  {
    name: "Arunkumar Ravichandran",
    email: "arunkumar.ravichandran1@walmart.com",
    userId: "arunkumar.ravichandran1@walmart.com",
    hasPicked: false,
  },
  {
    name: "Balram Mirani",
    email: "balram.mirani@walmart.com",
    userId: "balram.mirani@walmart.com",
    hasPicked: false,
  },
  {
    name: "Eshan Jain",
    email: "eshan.jain@walmart.com",
    userId: "eshan.jain@walmart.com",
    hasPicked: false,
  },
  {
    name: "Karthik Gopal",
    email: "karthik.gopal@walmart.com",
    userId: "karthik.gopal@walmart.com",
    hasPicked: false,
  },
  {
    name: "Mohamed Ashik",
    email: "mohamed.ashik@walmart.com",
    userId: "mohamed.ashik@walmart.com",
    hasPicked: false,
  },
  {
    name: "Neha Jain",
    email: "neha.jain@walmart.com",
    userId: "neha.jain@walmart.com",
    hasPicked: false,
  },
  {
    name: "Nishith Hebbur Mahesh",
    email: "nishith.hm@walmart.com",
    userId: "nishith.hm@walmart.com",
    hasPicked: false,
  },
  {
    name: "Parth Goyal",
    email: "parth.goyal@walmart.com",
    userId: "parth.goyal@walmart.com",
    hasPicked: false,
  },
  {
    name: "Pranav Sethi",
    email: "pranav.sethi@walmart.com",
    userId: "pranav.sethi@walmart.com",
    hasPicked: false,
  },
  {
    name: "Saman Khan",
    email: "saman.khan@walmart.com",
    userId: "saman.khan@walmart.com",
    hasPicked: false,
  },
  {
    name: "Shiva Sankaran Natarajan",
    email: "shiva.sankaran.natarajan@walmart.com",
    userId: "shiva.sankaran.natarajan@walmart.com",
    hasPicked: false,
  },
  {
    name: "Shubham Bansal",
    email: "shubham.bansal@walmart.com",
    userId: "shubham.bansal@walmart.com",
    hasPicked: false,
  },
  {
    name: "Sounak Pal",
    email: "sounak.pal@walmart.com",
    userId: "sounak.pal@walmart.com",
    hasPicked: false,
  },
  {
    name: "Swati Pandey",
    email: "swati.pandey@walmart.com",
    userId: "swati.pandey@walmart.com",
    hasPicked: false,
  },
  {
    name: "Sucharitha Chapparam",
    email: "sucharitha.chapparam@walmart.com",
    userId: "sucharitha.chapparam@walmart.com",
    hasPicked: false,
  },
  {
    name: "Naveen Mansur",
    email: "naveen.mansur@walmart.com",
    userId: "naveen.mansur@walmart.com",
    hasPicked: false,
  },
];

const assignments = [];

export const mockValidateUser = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (user) {
        resolve({
          success: true,
          alreadyPicked: user.hasPicked,
          userId: user.userId,
          name: user.name,
        });
      } else {
        // For Walmart email, always allow login (no validation)
        const userName = email.split("@")[0].replace(/[._]/g, " ");
        resolve({
          success: true,
          alreadyPicked: false,
          userId: email.toLowerCase(),
          name: userName,
        });
      }
    }, 500); // Reduced delay since no validation
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
