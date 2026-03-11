const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'react-native-sqlite-storage', 'platforms', 'android', 'build.gradle');

if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    if (content.includes('jcenter()')) {
        content = content.replace(/jcenter\(\)/g, 'mavenCentral()');
        fs.writeFileSync(targetFile, content);
        console.log('Patched react-native-sqlite-storage android build.gradle');
    } else {
        console.log('react-native-sqlite-storage android build.gradle already patched or does not contain jcenter()');
    }
} else {
    console.log('Could not find react-native-sqlite-storage android build.gradle to patch');
}
