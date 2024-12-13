// Import necessary modules
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// modules structure template
const modulesStructure = {
  pages: 'pages',
};

// Function to create folders
function createFolder(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
}

// Generate basic files
function createFile(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
}

// CLI prompt
async function promptUser() {
  const { pathName } = await inquirer.prompt({
    type: 'input',
    name: 'pathName',
    message: 'Enter your path name:',
  });

  const { modulesName } = await inquirer.prompt({
    type: 'input',
    name: 'modulesName',
    message: 'Enter your modules name:',
  });

  // Generate modules folder structure at path name
  const rootDir = path.join(process.cwd(), pathName, modulesName);

  createFolder(rootDir);

  for (const [key] of Object.entries(modulesStructure)) {
    const folderPath = path.join(rootDir);
    createFolder(folderPath);

    // Sample files for each folder
    if (key === 'pages') {
      createFile(
        path.join(folderPath, `page.tsx`),
        `export default function page(){
  return (
    <div>${modulesName}</div>
  );
}
`,
      );
    }
  }

  console.log(`module  setup complete!`);
}

promptUser().catch((error) => console.error('Error:', error));
