const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const User = require('../models/User');
const Grant = require('../models/Grant');
const Report = require('../models/Report');

// GET /api/reports/evaluation - Evaluation reports summary
exports.getEvaluationReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// POST /api/reports/generate - Generate a new evaluation report
toISOStringWithLocal = (date) => {
  // Helper to format date as YYYY-MM-DD
  return date.toISOString().split('T')[0];
};

exports.generateReport = async (req, res, next) => {
  try {
    // Aggregate proposals
    const proposals = await Proposal.find();
    const totalProposals = proposals.length;
    const approved = proposals.filter(p => p.status === 'Approved').length;
    const rejected = proposals.filter(p => p.status === 'Rejected').length;
    const pending = proposals.filter(p => p.status === 'Pending' || p.status === 'Under Review' || p.status === 'Needs Revision').length;
    const totalFunding = proposals
      .filter(p => p.status === 'Approved')
      .reduce((sum, p) => sum + (p.funding || 0), 0);

    // Aggregate reviews for average score
    const reviews = await Review.find({ status: 'Completed', score: { $ne: null } });
    const averageScore = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length) : 0;

    // Period: current year
    const now = new Date();
    const year = now.getFullYear();
    const period = `${year} Annual`;
    const title = `Grant Evaluation Report - ${year}`;
    const generatedDate = toISOStringWithLocal(now);
    const status = 'Final';

    // Save report
    const report = new Report({
      title,
      period,
      totalProposals,
      approved,
      rejected,
      pending,
      totalFunding: `$${totalFunding.toLocaleString()}`,
      averageScore: Number(averageScore.toFixed(2)),
      generatedDate,
      status,
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/analytics - Monthly and category analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    // Get all proposals for the current year (use createdAt if dateSubmitted is not available)
    const now = new Date();
    const year = now.getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    
    // Get all proposals for the year (using createdAt as fallback)
    const allProposals = await Proposal.find({
      $or: [
        { dateSubmitted: { $gte: startDate, $lt: endDate } },
        { createdAt: { $gte: startDate, $lt: endDate } }
      ]
    });
    
    // If no proposals found for the year, get all proposals for total counts
    const totalAllProposals = await Proposal.find();
    console.log(`Found ${allProposals.length} proposals for ${year}, total: ${totalAllProposals.length}`);
    
    // Monthly data for the current year
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthlyData = await Promise.all(months.map(async (month, idx) => {
      const monthStart = new Date(year, idx, 1);
      const monthEnd = new Date(year, idx + 1, 1);
      
      // Get proposals for this month
      const proposals = await Proposal.find({
        $or: [
          { dateSubmitted: { $gte: monthStart, $lt: monthEnd } },
          { createdAt: { $gte: monthStart, $lt: monthEnd } }
        ]
      });
      
      const approved = proposals.filter(p => p.status === 'Approved').length;
      const rejected = proposals.filter(p => p.status === 'Rejected').length;
      const funding = proposals.filter(p => p.status === 'Approved').reduce((sum, p) => sum + (p.funding || 0), 0);
      
      return {
        month,
        applications: proposals.length,
        approved,
        rejected,
        funding
      };
    }));

    // If no monthly data, create a summary from all proposals
    if (monthlyData.every(m => m.applications === 0)) {
      console.log("No monthly data found, using total proposals for summary");
      const totalApproved = totalAllProposals.filter(p => p.status === 'Approved').length;
      const totalRejected = totalAllProposals.filter(p => p.status === 'Rejected').length;
      const totalFunding = totalAllProposals.filter(p => p.status === 'Approved').reduce((sum, p) => sum + (p.funding || 0), 0);
      
      // Create a summary entry for the current month
      const currentMonth = months[now.getMonth()];
      monthlyData[now.getMonth()] = {
        month: currentMonth,
        applications: totalAllProposals.length,
        approved: totalApproved,
        rejected: totalRejected,
        funding: totalFunding
      };
    }

    // Funding by category (all time)
    const allProposalsForCategory = await Proposal.find();
    const categoryMap = {};
    allProposalsForCategory.forEach(p => {
      if (!categoryMap[p.category]) {
        categoryMap[p.category] = { name: p.category, value: 0, funding: 0 };
      }
      categoryMap[p.category].value += 1;
      if (p.status === 'Approved') {
        categoryMap[p.category].funding += p.funding || 0;
      }
    });
    // Assign colors for up to 10 categories
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6", "#F472B6", "#FBBF24", "#34D399", "#60A5FA"];
    const categoryData = Object.values(categoryMap).map((cat, i) => ({ ...cat, color: colors[i % colors.length] }));

    res.json({ monthlyData, categoryData });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/reviewer-performance - Reviewer performance
exports.getReviewerPerformance = async (req, res, next) => {
  try {
    // Find all reviewers
    const reviewers = await User.find({ role: 'reviewer' });
    console.log(`Found ${reviewers.length} reviewers`);
    
    // For each reviewer, aggregate their reviews
    const data = await Promise.all(reviewers.map(async (reviewer) => {
      const reviews = await Review.find({ reviewer: reviewer._id, status: 'Completed' });
      const allReviews = await Review.find({ reviewer: reviewer._id });
      const reviewsCompleted = reviews.length;
      const totalAssigned = allReviews.length;
      const averageScore = reviewsCompleted > 0 ? (reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviewsCompleted) : 0;
      
      // Calculate average review time in days
      let totalReviewTime = 0;
      let validReviews = 0;
      for (const review of reviews) {
        const proposal = await Proposal.findById(review.proposal);
        if (proposal && review.reviewDate) {
          // Use createdAt as fallback if dateSubmitted is not available
          const proposalDate = proposal.dateSubmitted || proposal.createdAt;
          if (proposalDate) {
            const reviewTime = Math.ceil((new Date(review.reviewDate) - new Date(proposalDate)) / (1000 * 60 * 60 * 24));
            if (reviewTime >= 0) {
              totalReviewTime += reviewTime;
              validReviews++;
            }
          }
        }
      }
      const avgTime = validReviews > 0 ? Math.round(totalReviewTime / validReviews) : 0;
      
      // On-time rate: reviews with reviewDate <= proposal deadline
      let onTime = 0;
      for (const review of reviews) {
        const proposal = await Proposal.findById(review.proposal);
        if (proposal && review.reviewDate && proposal.deadline && review.reviewDate <= proposal.deadline) {
          onTime++;
        }
      }
      const onTimeRate = reviewsCompleted > 0 ? Math.round((onTime / reviewsCompleted) * 100) : 0;
      
      return {
        id: reviewer._id,
        name: reviewer.firstName + ' ' + reviewer.lastName,
        reviews: reviewsCompleted,
        totalAssigned,
        avgTime,
        averageScore: Number(averageScore.toFixed(2)),
        onTimeRate,
      };
    }));
    
    console.log(`Reviewer performance data:`, data);
    res.json(data);
  } catch (err) {
    next(err);
  }
}; 

// GET /api/reports/export - Export comprehensive report as CSV
exports.exportReport = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    // Get all proposals for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const proposals = await Proposal.find({
      dateSubmitted: { $gte: startDate, $lt: endDate }
    }).populate('researcher', 'firstName lastName email institution');
    
    // Get all reviews for the year
    const reviews = await Review.find({
      reviewDate: { $gte: startDate, $lt: endDate }
    }).populate('reviewer', 'firstName lastName').populate('proposal');
    
    // Get all grants
    const grants = await Grant.find();
    
    // Calculate summary statistics
    const totalProposals = proposals.length;
    const approvedProposals = proposals.filter(p => p.status === 'Approved').length;
    const rejectedProposals = proposals.filter(p => p.status === 'Rejected').length;
    const pendingProposals = proposals.filter(p => ['Pending', 'Under Review', 'Needs Revision'].includes(p.status)).length;
    const totalFunding = proposals
      .filter(p => p.status === 'Approved')
      .reduce((sum, p) => sum + (p.funding || 0), 0);
    
    // Generate CSV content
    let csvContent = `Grant Management System Report - ${year}\n`;
    csvContent += `Generated on: ${new Date().toISOString().split('T')[0]}\n\n`;
    
    // Summary section
    csvContent += `SUMMARY STATISTICS\n`;
    csvContent += `Total Proposals,${totalProposals}\n`;
    csvContent += `Approved Proposals,${approvedProposals}\n`;
    csvContent += `Rejected Proposals,${rejectedProposals}\n`;
    csvContent += `Pending Proposals,${pendingProposals}\n`;
    csvContent += `Total Funding Awarded,$${totalFunding.toLocaleString()}\n`;
    csvContent += `Approval Rate,${totalProposals > 0 ? Math.round((approvedProposals / totalProposals) * 100) : 0}%\n\n`;
    
    // Proposals detail section
    csvContent += `PROPOSALS DETAIL\n`;
    csvContent += `ID,Title,Researcher,Institution,Category,Status,Funding Requested,Date Submitted,Review Score\n`;
    proposals.forEach(proposal => {
      const researcher = proposal.researcher ? `${proposal.researcher.firstName} ${proposal.researcher.lastName}` : 'N/A';
      const institution = proposal.researcher?.institution || 'N/A';
      const review = reviews.find(r => r.proposal && r.proposal._id.toString() === proposal._id.toString());
      const score = review ? review.score : 'N/A';
      csvContent += `${proposal._id},"${proposal.title}",${researcher},${institution},${proposal.category},${proposal.status},$${proposal.funding || 0},${proposal.dateSubmitted?.toISOString().split('T')[0] || 'N/A'},${score}\n`;
    });
    
    csvContent += `\nREVIEWS DETAIL\n`;
    csvContent += `Proposal ID,Reviewer,Score,Comments,Review Date,On Time\n`;
    reviews.forEach(review => {
      const reviewer = review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : 'N/A';
      const proposal = review.proposal;
      const onTime = proposal && proposal.deadline && review.reviewDate ? 
        (review.reviewDate <= proposal.deadline ? 'Yes' : 'No') : 'N/A';
      csvContent += `${review.proposal?._id || 'N/A'},${reviewer},${review.score || 'N/A'},"${review.comments || ''}",${review.reviewDate?.toISOString().split('T')[0] || 'N/A'},${onTime}\n`;
    });
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="grant-report-${year}.csv"`);
    res.send(csvContent);
  } catch (err) {
    next(err);
  }
}; 