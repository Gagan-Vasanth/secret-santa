// Data manager for frontend-only Secret Santa with localStorage persistence
class DataManager {
  constructor() {
    this.STORAGE_KEY = "secret_santa_data";
    this.data = null;
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      // Always load from server API first for latest data
      await this.loadFromAPI();
      this.initialized = true;
    }
  }

  async loadFromAPI() {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';

    // In development, try localStorage first
    if (isDevelopment) {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        try {
          this.data = JSON.parse(savedData);
          console.log("Development: Loaded data from localStorage:", this.data);
          
          // Ensure assignments array exists
          if (!this.data.assignments) {
            this.data.assignments = [];
          }
          return;
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }
    }

    // Try API first (for production or first load in development)
    try {
      const response = await fetch("/api/data");
      if (response.ok) {
        this.data = await response.json();
        console.log("Loaded data from API:", this.data);
        
        // Ensure assignments array exists
        if (!this.data.assignments) {
          this.data.assignments = [];
        }
        
        // Save to localStorage as backup
        this.saveToStorage();
        return;
      } else {
        throw new Error(`API response not OK: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading from API, trying static file:", error);
      
      // Fallback to static JSON file
      try {
        const response = await fetch("/data/users.json");
        this.data = await response.json();
        if (!this.data.assignments) {
          this.data.assignments = [];
        }
        console.log("Loaded fallback data from JSON:", this.data);
        this.saveToStorage();
      } catch (fallbackError) {
        console.error("Error loading fallback data:", fallbackError);
        this.data = { users: [], assignments: [] };
      }
    }
  }

  async saveToAPI() {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';

    // In development, primarily use localStorage
    if (isDevelopment) {
      console.log("Development: Saving data to localStorage");
      this.saveToStorage();
      
      // Still try to save to API if available, but don't fail if it's not
      try {
        const response = await fetch("/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.data),
        });

        if (response.ok) {
          console.log("Development: Also saved to API");
        }
      } catch (error) {
        console.log("Development: API not available, using localStorage only");
      }
      return true;
    }

    // In production, try API first
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.data),
      });

      if (response.ok) {
        console.log("Production: Data saved to server successfully");
        this.saveToStorage(); // Also save to localStorage
        return true;
      } else {
        throw new Error(`Failed to save: ${response.status}`);
      }
    } catch (error) {
      console.error("Production: Error saving to API:", error);
      // Still save to localStorage as backup
      this.saveToStorage();
      return false;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
      console.log("Data saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // Reset data (for testing or admin)
  async resetData() {
    localStorage.removeItem(this.STORAGE_KEY);
    await this.loadFromAPI();
    console.log("Data reset to original from server");
  }

  // Get all users
  getUsers() {
    return this.data.users || [];
  }

  // Get assignments
  getAssignments() {
    return this.data.assignments || [];
  }

  // Find user by email
  findUser(email) {
    return this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Validate user login
  async validateUser(email) {
    await this.init();
    const emailLower = email.toLowerCase().trim();

    // Check if it's admin email - should not be processed as regular user
    if (emailLower === "admin@walmart.com") {
      return {
        success: false,
        message: "Admin access should use separate authentication.",
      };
    }

    // Find user in existing data
    let user = this.findUser(emailLower);

    if (user) {
      return {
        success: true,
        alreadyPicked: user.hasPicked,
        userId: user.email,
        name: user.name,
        pickedRecipient: user.pickedRecipient,
        message: user.hasPicked
          ? "You have already picked your Secret Santa!"
          : undefined,
      };
    }

    // If not found and it's a Walmart email (but not admin), add new user
    if (
      email.toLowerCase().includes("@walmart.com") &&
      emailLower !== "admin@walmart.com"
    ) {
      const extractedName = email.split("@")[0].replace(/[._]/g, " ");
      const capitalizedName = extractedName.replace(/\b\w/g, (l) =>
        l.toUpperCase()
      );

      const newUser = {
        email: email.toLowerCase(),
        name: capitalizedName,
        hasPicked: false,
        pickedRecipient: "",
      };

      this.data.users.push(newUser);
      await this.saveToAPI();

      return {
        success: true,
        alreadyPicked: false,
        userId: email.toLowerCase(),
        name: capitalizedName,
        message: "Welcome! You've been added to the Secret Santa list.",
      };
    }

    return {
      success: false,
      message: "Please use your Walmart email address to participate.",
    };
  }

  // Pick recipient for user
  async pickRecipient(email, name) {
    await this.init();
    const emailLower = email.toLowerCase().trim();

    // Find the user
    const userIndex = this.data.users.findIndex(
      (u) => u.email.toLowerCase() === emailLower
    );
    if (userIndex === -1) {
      return { success: false, message: "User not found" };
    }

    const user = this.data.users[userIndex];

    // Check if user already picked
    if (user.hasPicked) {
      return {
        success: false,
        message: "You have already picked your Secret Santa!",
      };
    }

    // Get already assigned emails
    const assignments = this.getAssignments();
    const alreadyAssignedEmails = new Set(
      assignments.map((a) => a.recipientEmail.toLowerCase())
    );

    // Find available recipients (not self, not already assigned)
    const availableRecipients = this.data.users.filter(
      (u) =>
        u.email.toLowerCase() !== emailLower &&
        !alreadyAssignedEmails.has(u.email.toLowerCase())
    );

    if (availableRecipients.length === 0) {
      return {
        success: false,
        message:
          "No recipients available. All Secret Santas have been assigned!",
      };
    }

    // Pick random recipient
    const randomIndex = Math.floor(Math.random() * availableRecipients.length);
    const recipient = availableRecipients[randomIndex];

    // Create assignment
    const assignment = {
      giverEmail: emailLower,
      giverName: name,
      recipientEmail: recipient.email,
      recipientName: recipient.name,
      timestamp: new Date().toISOString(),
    };

    // Update data
    if (!this.data.assignments) {
      this.data.assignments = [];
    }
    this.data.assignments.push(assignment);
    this.data.users[userIndex].hasPicked = true;
    this.data.users[userIndex].pickedRecipient = recipient.name;

    // Save updated data to server
    await this.saveToAPI();

    console.log("Assignment created:", assignment);
    console.log("Updated user data:", this.data.users[userIndex]);

    return {
      success: true,
      recipient: recipient.name,
    };
  }

  // Get current data state (for debugging)
  getData() {
    return this.data;
  }

  // Get all assignments for admin view
  getAllAssignments() {
    return this.getAssignments().map((a) => ({
      giver: a.giverName,
      giverEmail: a.giverEmail,
      recipient: a.recipientName,
      recipientEmail: a.recipientEmail,
      timestamp: new Date(a.timestamp).toLocaleString(),
    }));
  }

  // Reset a specific user's assignment
  async resetUserAssignment(email) {
    await this.init();
    const emailLower = email.toLowerCase().trim();

    // Find and reset the user
    const userIndex = this.data.users.findIndex(
      (u) => u.email.toLowerCase() === emailLower
    );
    if (userIndex !== -1) {
      this.data.users[userIndex].hasPicked = false;
      this.data.users[userIndex].pickedRecipient = "";
    }

    // Remove assignments where this user was the giver
    this.data.assignments = this.data.assignments.filter(
      (a) => a.giverEmail.toLowerCase() !== emailLower
    );

    // Save updated data
    await this.saveToAPI();

    console.log(`Reset assignment for user: ${email}`);
    return true;
  }

  // Reset all assignments but keep users
  async resetAllAssignments() {
    await this.init();
    
    // Reset all users' pick status
    this.data.users.forEach(user => {
      user.hasPicked = false;
      user.pickedRecipient = "";
    });
    
    // Clear all assignments
    this.data.assignments = [];
    
    // Save to server
    await this.saveToAPI();
    
    console.log("All assignments reset");
    return true;
  }

  // Export data for backup
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  // Get statistics
  getStats() {
    const totalUsers = this.data.users.length;
    const usersWhoPickedCount = this.data.users.filter(
      (u) => u.hasPicked
    ).length;
    const totalAssignments = this.data.assignments.length;

    return {
      totalUsers,
      usersWhoPickedCount,
      usersRemaining: totalUsers - usersWhoPickedCount,
      totalAssignments,
      completionPercentage:
        totalUsers > 0
          ? Math.round((usersWhoPickedCount / totalUsers) * 100)
          : 0,
    };
  }
}

// Export singleton instance
export default new DataManager();

// Also export a function to access the manager globally (for debugging)
window.secretSantaData = new DataManager();
