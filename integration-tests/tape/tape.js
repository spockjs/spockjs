import test from 'tape-catch';

test('successful test', t => {
  expect: 1 === 1;
  t.end();
});

test('failing test', t => {
  let x;
  const double = n => n * 2;

  when: x = 3;
  then: x === double(2);
  t.end();
});
