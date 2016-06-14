// (c) Andrew Wei

'use strict';

const path = require('path');
const helpers = require('yeoman-test');

describe('test framework', () => {
  it('runs', (done) => {
    helpers.run(path.join(__dirname, '../app'))
      .on('end', done);
  });
});

// Add more tests...later :)
