/**
 * Practical index verification using explain("executionStats").
 * Run: npm run explain
 */
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../modules/users/user.model';
import { Note } from '../modules/notes/note.model';
import { Post } from '../modules/posts/post.model';

async function printExplain(label: string, explain: Record<string, unknown>) {
  const winning = (explain.QUERY_PLANNER as { winningPlan?: unknown })?.winningPlan
    ?? (explain as { queryPlanner?: { winningPlan?: unknown } }).queryPlanner?.winningPlan;
  const stats = (explain.EXECUTION_STATS as { totalDocsExamined?: number; nReturned?: number; executionTimeMillis?: number })
    ?? (explain as { executionStats?: { totalDocsExamined?: number; nReturned?: number; executionTimeMillis?: number } }).executionStats;

  console.log(`\n=== ${label} ===`);
  console.log('winningPlan:', JSON.stringify(winning, null, 2));
  if (stats) {
    console.log('nReturned:', stats.nReturned);
    console.log('totalDocsExamined:', stats.totalDocsExamined);
    console.log('executionTimeMillis:', stats.executionTimeMillis);
  }
}

async function main() {
  await connectDatabase();

  // Ensure indexes exist from schema.index()
  await Promise.all([User.init(), Note.init(), Post.init()]);

  const sampleUser = await User.findOne().select('_id');
  if (!sampleUser) {
    console.log('No users found. Run npm run seed first.');
    await disconnectDatabase();
    return;
  }

  const userListExplain = await User.find().sort({ createdAt: -1 }).limit(10).explain('executionStats');
  await printExplain('Admin user list (createdAt:-1)', userListExplain as unknown as Record<string, unknown>);

  const notesExplain = await Note.find({ userId: sampleUser._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .explain('executionStats');
  await printExplain('User notes list (userId + createdAt)', notesExplain as unknown as Record<string, unknown>);

  const adminNotesExplain = await Note.find().sort({ createdAt: -1 }).limit(10).explain('executionStats');
  await printExplain('Admin all notes (createdAt:-1)', adminNotesExplain as unknown as Record<string, unknown>);

  const postsExplain = await Post.find({ userId: sampleUser._id }).explain('executionStats');
  await printExplain('Posts by userId (supports $lookup)', postsExplain as unknown as Record<string, unknown>);

  await disconnectDatabase();
}

main().catch(async (err) => {
  console.error(err);
  await disconnectDatabase();
  process.exit(1);
});
