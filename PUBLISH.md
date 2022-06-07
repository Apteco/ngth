# Publishing ngth to npm registry

1. Commit all changes you want to include to master
2. Bump the version numbers in ./package.json and ./projects/ngth/package.json and push to master
3. Tag master with the version number e.g. v1.*.* and push the tag to origin/master
4. A github action will run when you push the tag to build and publish to the npm registry - you can check it worked here: https://github.com/Apteco/ngth/actions
5. Check https://www.npmjs.com/package/@apteco/ngth to see that the new version shows on npm.


GitHub action defined here: https://github.com/Apteco/ngth/blob/master/.github/workflows/npm-publish.yml
