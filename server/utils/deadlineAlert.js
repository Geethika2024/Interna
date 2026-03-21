const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Internship = require('../models/Internship');
const Wishlist = require('../models/Wishlist');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Runs every day at 9:00 AM
const startDeadlineAlerts = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running deadline alert cron job...');

    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find internships with deadline in next 3 days
      const urgentInternships = await Internship.find({
        deadline: { $gte: tomorrow, $lte: threeDaysFromNow },
        isActive: true
      }).populate('professorId', 'name');

      for (const internship of urgentInternships) {
        // Find students who wishlisted this
        const wishlistItems = await Wishlist.find({
          internshipId: internship._id
        }).populate('userId', 'name email');

        for (const item of wishlistItems) {
          const student = item.userId;
          if (!student || !student.email) continue;

          const daysLeft = Math.ceil(
            (new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24)
          );

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: student.email,
            subject: `⏰ Deadline Alert: ${internship.title} closes in ${daysLeft} day(s)!`,
            html: `
              <h2>Hi ${student.name},</h2>
              <p>The internship you wishlisted is closing soon!</p>
              <h3>${internship.title}</h3>
              <p><strong>Professor:</strong> ${internship.professorId.name}</p>
              <p><strong>IIT:</strong> ${internship.iitName}</p>
              <p><strong>Deadline:</strong> ${new Date(internship.deadline).toDateString()}</p>
              <p><strong>Days Left:</strong> ${daysLeft}</p>
              <br/>
              <p>Login to Interna to apply before it's too late!</p>
            `
          });

          console.log(`Alert sent to ${student.email} for ${internship.title}`);
        }
      }
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  });

  console.log('Deadline alert cron job scheduled ✓');
};

module.exports = startDeadlineAlerts;