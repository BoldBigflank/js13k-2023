npm run build
cd dist
zip dist ./*
mv dist.zip ../
cd ..
ls -l | grep dist.zip
