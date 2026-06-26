const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const regex = /<button[^>]*?onClick=\{onBack\}[^>]*?>[\s\S]*?<\/button>/g;

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx') && file !== 'TestPage.tsx') {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let initialLength = content.length;
    content = content.replace(regex, '');
    
    if (content.length !== initialLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
