#!/usr/bin/env sh

# The package.json files have `main` set to `src/index.ts`
# so Jest (and ts-node subprocesses in integration tests)
# pick up changes live during development.
# For publishing, we have to set `main` to `dist/index.js`.
echo "\n\nrewriting package.json files\n\n"
yarn lerna -- exec -- sed -i "'s/src\/index\.ts/dist\/index.js/'" package.json

git diff
read -p "\n\nare those package.json changes ok? " -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "publishing (with --skip-git)\n\n"
	yarn lerna -- publish \
	--allowBranch config-package --skip-git \
	--npmClient npm --conventional-commits && \
	echo "\n\ndo not forget to manually commit, tag and push"
fi

echo "undoing package.json changes\n\n"
yarn lerna -- exec -- sed -i "'s/dist\/index\.js/src\/index.ts/'" package.json
