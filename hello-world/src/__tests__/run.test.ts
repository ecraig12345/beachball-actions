import { run } from '../run';

test('run successfully', async () => {
  await expect(run({ name: 'foo' })).resolves.toBeUndefined();
});
