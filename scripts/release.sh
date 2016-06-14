#!/bin/bash

set -e

# Publish to NPM.
echo "Publishing release to NPM..."

if [[ -n "$NPM_AUTH" ]]; then
  echo "//registry.npmjs.org/:_authToken=$NPM_AUTH" >> ~/.npmrc
  npm publish
  echo "Done"
else
  echo "Operation failed because NPM_AUTH was not set"
fi

exit 0
