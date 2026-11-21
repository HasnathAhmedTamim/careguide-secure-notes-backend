import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import { User } from '../modules/users/user.model';
import { Note } from '../modules/notes/note.model';
import { Post } from '../modules/posts/post.model';

async function seed() {
  await connectDatabase();

  await Promise.all([User.deleteMany({}), Note.deleteMany({}), Post.deleteMany({})]);

  const admin = await User.create({
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
    role: 'admin',
    interests: ['security', 'reading'],
  });

  const alice = await User.create({
    name: 'Alice',
    email: 'alice@careguide.test',
    password: 'user1234',
    role: 'user',
    interests: ['chess', 'reading'],
  });

  const bob = await User.create({
    name: 'Bob',
    email: 'bob@careguide.test',
    password: 'user1234',
    role: 'user',
    interests: ['chess', 'music'],
  });

  await Note.insertMany([
    { title: 'Alice note', content: 'Private to Alice', userId: alice._id },
    { title: 'Bob note', content: 'Private to Bob', userId: bob._id },
    { title: 'Admin note', content: 'Admin own note', userId: admin._id },
  ]);

  await Post.insertMany([
    { title: 'Alice public', content: 'Hello from Alice', userId: alice._id },
    { title: 'Alice second', content: 'Another post', userId: alice._id },
    { title: 'Bob public', content: 'Hello from Bob', userId: bob._id },
  ]);

  console.log('Seed complete');
  console.log(`Admin: ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
  console.log('User:  alice@careguide.test / user1234');
  console.log('User:  bob@careguide.test / user1234');

  await disconnectDatabase();
}

seed().catch(async (err) => {
  console.error(err);
  await disconnectDatabase();
  process.exit(1);
});
