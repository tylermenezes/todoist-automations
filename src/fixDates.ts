import { todoist } from './services';
import schedule from 'node-schedule';
import { DueDate } from 'todoist/dist/v8-types';

export async function fixDates() {
  console.log(`Syncing...`);
  await todoist.sync();
  console.log('Done!');
  const withoutTime = todoist.items.get().filter(e => !e.checked && e.due?.date && !e.due.date.includes('T'));

  console.log(`Updating ${withoutTime.length} tasks without a due time.`);
  for (const item of withoutTime) {
    console.log(`- Adding default due time to ${item.content}`);
    const dueDate = item.due.string
      ? { string: `${item.due.string} at 5pm`, date: `${item.due.date}T17:00:00` }
      : { date: `${item.due.date}T17:00:00` };
    await todoist.items.update({
      id: item.id,
      due: dueDate as unknown as DueDate, // API supports this but Todoist Node module doesn't.
    });
  }
  console.log(`Done!`);
}

export function scheduleFixDates() {
  const job = schedule.scheduleJob('*/5 * * * *', fixDates);
  job.invoke();
}
