#!/bin/bash

version=$1

if [ ! -n "$version" ]; then
    echo "version is empty."
    exit 1;
fi

publish_frontend() {
    cd frontend
    echo "change fastball component frontend version to $version"
    pnpm version $version
    echo "installing dependency..."
    pnpm i
    echo "build & publish fastball component frontend ..."
    npm run prepublish && npm publish
    echo "fastball component frontend published."
    npm_version_line = grep -n 'npmVersion' ../backend/fastball-ui-compiler/src/main/resources/fastball-material.yml | cut -d ':' -f1
    sed -i '' '$npm_version_lines/.*/npmVersion: 0.0.122/' ../backend/fastball-ui-compiler/src/main/resources/fastball-material.yml
    echo "changed fastball component materail version to $version"
    cd ../
}

publish_backend() {
    cd backend
    echo "change fastball component backend version to $version"
    ./mvnw versions:set -DnewVersion=$version
    echo "deploy fastball component backend ..."
    ./mvnw clean deploy
    echo "fastball component backend deployed."
    cd ../
}


echo "Fastball component version [$version] publishing"

publish_frontend

publish_backend

echo "Fastball component version [$version] published"