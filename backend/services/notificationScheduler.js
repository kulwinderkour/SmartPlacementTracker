import cron from 'node-cron';
import Reminder from '../models/Reminder.js';

/**
 * Notification Scheduler Service
 * Checks for upcoming reminders and triggers notifications
 */

let notificationCallbacks = [];

/**
 * Register a callback function to be called when a notification should be sent
 * @param {Function} callback - Function to call with reminder data
 */
export function registerNotificationCallback(callback) {
  notificationCallbacks.push(callback);
}

/**
 * Send notification to all registered callbacks
 */
function sendNotification(reminder) {
  console.log(`📢 Notification: ${reminder.title} - Due: ${reminder.dueDate}`);
  
  notificationCallbacks.forEach(callback => {
    try {
      callback(reminder);
    } catch (error) {
      console.error('Notification callback error:', error);
    }
  });
}

/**
 * Check for upcoming reminders
 * Called every hour by cron job
 */
async function checkUpcomingReminders() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find reminders due within the next 24 hours that haven't been notified
    const upcomingReminders = await Reminder.find({
      dueDate: { $gte: now, $lte: tomorrow },
      status: 'pending',
      notified: false,
    });

    console.log(`⏰ Checking reminders... Found ${upcomingReminders.length} upcoming`);

    // Send notifications for each reminder
    for (const reminder of upcomingReminders) {
      sendNotification(reminder);
      
      // Mark as notified
      reminder.notified = true;
      await reminder.save();
    }

    // Check for overdue reminders
    const overdueReminders = await Reminder.find({
      dueDate: { $lt: now },
      status: 'pending',
      notified: false,
    });

    if (overdueReminders.length > 0) {
      console.log(`⚠️ Found ${overdueReminders.length} overdue reminders`);
      for (const reminder of overdueReminders) {
        sendNotification({
          ...reminder.toObject(),
          isOverdue: true,
        });
        reminder.notified = true;
        await reminder.save();
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

/**
 * Initialize the notification scheduler
 * Runs every hour at minute 0
 */
export function initializeScheduler() {
  console.log('🚀 Initializing notification scheduler...');
  
  // Run every hour
  cron.schedule('0 * * * *', () => {
    console.log('⏰ Running hourly reminder check...');
    checkUpcomingReminders();
  });

  // Also run immediately on startup
  checkUpcomingReminders();

  console.log('✅ Notification scheduler initialized');
}

/**
 * Get statistics about reminders
 */
export async function getReminderStats() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, pending, overdue, upcoming] = await Promise.all([
      Reminder.countDocuments(),
      Reminder.countDocuments({ status: 'pending' }),
      Reminder.countDocuments({ dueDate: { $lt: now }, status: 'pending' }),
      Reminder.countDocuments({ 
        dueDate: { $gte: now, $lte: tomorrow }, 
        status: 'pending' 
      }),
    ]);

    return {
      total,
      pending,
      overdue,
      upcoming,
    };
  } catch (error) {
    console.error('Error getting reminder stats:', error);
    return null;
  }
}

export default {
  initializeScheduler,
  registerNotificationCallback,
  getReminderStats,
};
