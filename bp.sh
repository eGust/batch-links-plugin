#!/bin/bash
npm run build
rm -f build/asset-manifest.json build/static/css/*.map build/static/js/*.map build/*.ico
zip -r pack.zip build
