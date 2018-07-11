import { resolve } from 'path';

import jasmine from '../jasmine';

// mark implicit dependencies for jest
() => require('./workdir/jasmine.js') && require('./workdir/package.json');

const cwd = resolve(__dirname, 'workdir');

const helper = jasmine(cwd);

beforeAll(helper.writeConfig);
afterAll(helper.deleteConfig);

test('produces correct output', () => {
  const { status, stdout } = helper.run();

  expect: status === 1;
  expect(stdout.toString().replace(/Stack:.*/s, '')).toMatchSnapshot();
});
