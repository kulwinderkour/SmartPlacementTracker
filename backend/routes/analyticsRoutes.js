import express from 'express';
import Reminder from '../models/Reminder.js';
import Opportunity from '../models/Opportunity.js';

const router = express.Router();

/**
 * @route   GET /api/analytics/summary
 * @desc    Get overall analytics summary
 * @access  Public
 */
router.get('/summary', async (req, res) => {
  try {
    // Get total opportunities
    const totalOpportunities = await Opportunity.countDocuments();
    
    // Count by status
    const statusCounts = await Opportunity.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total reminders
    const totalReminders = await Reminder.countDocuments();
    const pendingReminders = await Reminder.countDocuments({ status: 'pending' });
    const completedReminders = await Reminder.countDocuments({ status: 'completed' });

    // Get upcoming reminders (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingReminders = await Reminder.countDocuments({
      dueDate: { $gte: now, $lte: nextWeek },
      status: 'pending'
    });

    // Count opportunities by company
    const topCompanies = await Opportunity.aggregate([
      {
        $group: {
          _id: '$companyName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Convert status counts to object
    const statusBreakdown = {
      saved: 0,
      applied: 0,
      'online-assessment': 0,
      'interview-scheduled': 0,
      'offer-received': 0,
      rejected: 0
    };

    statusCounts.forEach(item => {
      if (item._id in statusBreakdown) {
        statusBreakdown[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      totals: {
        opportunities: totalOpportunities,
        applications: statusBreakdown.applied,
        interviews: statusBreakdown['interview-scheduled'] + statusBreakdown['online-assessment'],
        offers: statusBreakdown['offer-received'],
        rejections: statusBreakdown.rejected,
        saved: statusBreakdown.saved,
        reminders: totalReminders,
        pendingReminders,
        completedReminders,
        upcomingReminders
      },
      statusBreakdown,
      topCompanies: topCompanies.map(item => ({
        company: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ message: 'Error fetching analytics summary' });
  }
});

/**
 * @route   GET /api/analytics/charts
 * @desc    Get data for charts
 * @access  Public
 */
router.get('/charts', async (req, res) => {
  try {
    const { startDate, endDate, company } = req.query;

    // Build query filter
    const matchFilter = {};
    
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
      if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
    }
    
    if (company) {
      matchFilter.companyName = company;
    }

    // Timeline data - applications over time
    const timelineData = await Opportunity.aggregate([
      ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 } // Last 30 data points
    ]);

    // Status distribution
    const statusDistribution = await Opportunity.aggregate([
      ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Applications by company
    const companyDistribution = await Opportunity.aggregate([
      ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
      {
        $group: {
          _id: '$companyName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Priority distribution from reminders
    const priorityDistribution = await Reminder.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Category distribution from reminders
    const categoryDistribution = await Reminder.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      timeline: timelineData.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        count: item.count
      })),
      statusDistribution: statusDistribution.map(item => ({
        status: item._id,
        count: item.count
      })),
      companyDistribution: companyDistribution.map(item => ({
        company: item._id,
        count: item.count
      })),
      priorityDistribution: priorityDistribution.map(item => ({
        priority: item._id,
        count: item.count
      })),
      categoryDistribution: categoryDistribution.map(item => ({
        category: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Analytics charts error:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
});

/**
 * @route   GET /api/analytics/companies
 * @desc    Get list of all companies for filter dropdown
 * @access  Public
 */
router.get('/companies', async (req, res) => {
  try {
    const companies = await Opportunity.distinct('companyName');
    res.json({
      success: true,
      companies: companies.sort()
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

/**
 * @route   GET /api/analytics/trends
 * @desc    Get trending insights and patterns
 * @access  Public
 */
router.get('/trends', async (req, res) => {
  try {
    // Calculate success rate (offers / applications)
    const totalApplications = await Opportunity.countDocuments({
      status: { $ne: 'saved' }
    });
    
    const totalOffers = await Opportunity.countDocuments({
      status: 'offer-received'
    });

    const successRate = totalApplications > 0 
      ? ((totalOffers / totalApplications) * 100).toFixed(1)
      : 0;

    // Calculate average time to offer
    const offersWithDates = await Opportunity.find({
      status: 'offer-received',
      createdAt: { $exists: true }
    }).select('createdAt updatedAt');

    let avgDaysToOffer = 0;
    if (offersWithDates.length > 0) {
      const totalDays = offersWithDates.reduce((sum, opp) => {
        const days = Math.floor(
          (new Date(opp.updatedAt).getTime() - new Date(opp.createdAt).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0);
      avgDaysToOffer = Math.round(totalDays / offersWithDates.length);
    }

    // Most active month
    const monthlyActivity = await Opportunity.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Interview conversion rate
    const totalInterviews = await Opportunity.countDocuments({
      status: { $in: ['interview-scheduled', 'online-assessment'] }
    });

    const interviewConversionRate = totalInterviews > 0
      ? ((totalOffers / totalInterviews) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      trends: {
        successRate: parseFloat(successRate),
        avgDaysToOffer,
        interviewConversionRate: parseFloat(interviewConversionRate),
        totalApplications,
        totalOffers,
        totalInterviews,
        mostActiveMonth: monthlyActivity.length > 0 ? {
          year: monthlyActivity[0]._id.year,
          month: monthlyActivity[0]._id.month,
          count: monthlyActivity[0].count
        } : null
      }
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({ message: 'Error fetching trends' });
  }
});

export default router;
