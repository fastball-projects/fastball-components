#!/bin/bash

version=$1

if [ ! -n "$version" ]; then
    echo "version is empty."
    exit 1;
fi

if [[ "$version" =~ .*-SNAPSHOT$ ]]; then
    frontend_version=${version%-SNAPSHOT*}-$(date +%s)
    # frontend_version=${version%-SNAPSHOT*}-999
else
    frontend_version=$version
fi

publish_frontend() {
    cd frontend
    echo "change fastball component frontend version to $frontend_version"
    # pnpm version $frontend_version
    npm version $frontend_version
    echo "installing dependency..."
    # pnpm i
    npx pnpm@7 install
    echo "build & publish fastball component frontend ..."
    if [[ "$version" =~ .*-SNAPSHOT$ ]]; then
        npm run prepublish && npm publish --registry https://registry.npmjs.org
    else
        # npm run prepublish && npm publish --registry http://82.157.239.41:7777/repository/npm-hosted/
        npm run prepublish && npm publish --registry https://registry.npmjs.org
        npm run prepublish && npm publish --registry https://bitbean-npm.pkg.coding.net/fastball/npm
    fi
    echo "fastball component frontend published."
    npm_version_line=$(grep -n 'npmVersion' ../backend/fastball-ui-compiler/src/main/resources/fastball-material.yml | cut -d ':' -f1)
    sed -i '' "${npm_version_line}s/.*/npmVersion: $frontend_version/" ../backend/fastball-ui-compiler/src/main/resources/fastball-material.yml
    echo "changed fastball component materail version to $frontend_version"
    cd ../
}

publish_backend() {
    cd backend
    echo "change fastball component backend version to $version"
    ./mvnw versions:set -DnewVersion=$version
    echo "deploy fastball component backend ..."
    if [[ "$version" =~ .*-SNAPSHOT$ ]]; then
        ./mvnw clean deploy -P dev -Dgpg.skip
    else
        ./mvnw clean deploy -P release
    fi
    echo "fastball component backend deployed."
    cd ../
}


echo "Fastball component version [$version] publishing"

publish_frontend

publish_backend

echo "Fastball component version [$version] published"