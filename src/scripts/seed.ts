import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import { User } from '../modules/users/user.model';
import { Note } from '../modules/notes/note.model';
import { Post } from '../modules/posts/post.model';

async function seed() {
  await connectDatabase();

  await Promise.all([User.deleteMany({}), Note.deleteMany({}), Post.deleteMany({})]);

  const admin = await User.create({
    name: env.SEED_ADMIN_NAME || 'Sara Rahman',
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
    role: 'admin',
    interests: ['security', 'reading', 'operations'],
  });

  const nabila = await User.create({
    name: 'Nabila Hasan',
    email: 'nabila@careguide.test',
    password: 'user1234',
    role: 'user',
    interests: ['chess', 'reading', 'wellness'],
  });

  const rafi = await User.create({
    name: 'Rafi Chowdhury',
    email: 'rafi@careguide.test',
    password: 'user1234',
    role: 'user',
    interests: ['chess', 'music', 'cooking'],
  });

  await Note.insertMany([
    {
      title: 'Weekly medication reminders',
      content:
        'Morning: vitamin D after breakfast. Evening: review blood-pressure log before 9 PM. Share summary with clinic on Friday.',
      userId: nabila._id,
    },
    {
      title: 'Follow-up questions for Dr. Karim',
      content:
        'Ask about sleep schedule changes, whether evening walks are okay after dinner, and if I should continue the current dosage for two more weeks.',
      userId: nabila._id,
    },
    {
      title: 'Grocery list for recovery week',
      content:
        'Oats, bananas, yogurt, leafy greens, chicken, herbal tea. Avoid late-night caffeine this week.',
      userId: rafi._id,
    },
    {
      title: 'Platform ops checklist',
      content:
        'Review failed login alerts, rotate staging secrets monthly, and confirm Atlas IP access for the support team.',
      userId: admin._id,
    },
  ]);

  await Post.insertMany([
    {
      title: 'Small habits that helped my focus',
      content:
        'I started blocking 25-minute deep-work sessions in the morning and keeping my phone in another room. The first week felt hard, but my notes are clearer now.',
      userId: nabila._id,
    },
    {
      title: 'Book recommendation: Atomic routines',
      content:
        'If you are rebuilding daily structure after a busy month, start with one habit only. Consistency beats intensity.',
      userId: nabila._id,
    },
    {
      title: 'Evening stretch routine',
      content:
        'Ten minutes of light stretching after dinner helps me sleep better. Happy to share the short sequence I use.',
      userId: rafi._id,
    },
    {
      title: 'Welcome to CareGuide Notes',
      content:
        'This space is for private health notes and shared community posts. Keep personal medical details in your private notes — posts are public to members.',
      userId: admin._id,
    },
  ]);

  console.log('Seed complete');
  console.log(`Admin: ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
  console.log('User:  nabila@careguide.test / user1234');
  console.log('User:  rafi@careguide.test / user1234');

  await disconnectDatabase();
}

seed().catch(async (err) => {
  console.error(err);
  await disconnectDatabase();
  process.exit(1);
});
