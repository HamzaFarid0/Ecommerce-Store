import cron from 'node-cron';
import UserModel from '../models/user.model.js';

cron.schedule('*/15 * * * *', async () => {
  const expiryTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago

  try {
    const result = await UserModel.deleteMany({
      isVerified: false,
      createdAt: { $lt: expiryTime },
    });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} unverified users`);
    }
  } catch (err) {
    console.error('Error cleaning up unverified users:', err);
  }
});
