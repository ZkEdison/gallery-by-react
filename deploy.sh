#!/usr/bin/env sh

set -e

npm run dist

cd docs

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:ZkEdison/gallery-by-react.git master:gh-pages

cd -
