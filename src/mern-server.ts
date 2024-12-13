// Import necessary modules
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// modules structure template
const modulesStructure = {
  models: 'models',
  controllers: 'controllers',
  route: 'route',
  services: 'services',
  interface: 'interface',
  validation: 'validation',
  // pages: 'pages',
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
  // const { pathName } = await inquirer.
  // prompt({
  // type: 'input',
  // name: 'pathName',
  // message: 'Enter your path name:',
  // });

  const { modulesName } = await inquirer.prompt({
    type: 'input',
    name: 'modulesName',
    message: 'Enter your modules name:',
  });

  // Generate modules folder structure at "src/app/modules/"
  const rootDir = path.join(process.cwd(), 'src/app/modules', modulesName);

  createFolder(rootDir);

  for (const [key] of Object.entries(modulesStructure)) {
    const folderPath = path.join(rootDir);
    createFolder(folderPath);
    const id = '';

    // Sample files for each folder
    if (key === 'models') {
      createFile(
        path.join(folderPath, `${modulesName}.model.ts`),
        `
        import mongoose from 'mongoose';

        const ${modulesName}Schema = new mongoose.Schema({
          name: { type: String, required: true },
          description: { type: String, required: true },
        }, { timestamps: true, versionKey: false });

        export default mongoose.model('${modulesName}', ${modulesName}Schema);
        `,
      );
    }

    if (key === 'controllers') {
      createFile(
        path.join(folderPath, `${modulesName}.controller.ts`),
        `import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from '../../utils/http-status';
import { ${modulesName}Services } from './${modulesName}.services';

const getAll${modulesName} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${modulesName}Services.getAll${modulesName}();

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'All ${modulesName} Retrive Successfully',
    data: result,
  });
});

const getById${modulesName} = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ${modulesName}Services.getById${modulesName}(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: '${modulesName} Retrive by id Successfully',
    data: result,
  });
});

const delete${modulesName} = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ${modulesName}Services.delete${modulesName}(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Delete ${modulesName} id=${id}  Successfully',
    data: result,
  });
});

const update${modulesName} = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ${modulesName}Services.update${modulesName}(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Update ${modulesName} id=${id}  Successfully",
    data: result,
  });
});

export const ${modulesName}Controller = {
  getAll${modulesName},
  getById${modulesName},
  delete${modulesName},
  update${modulesName},
};

`,
      );
    }

    if (key === 'services') {
      createFile(
        path.join(folderPath, `${modulesName}.services.ts`),
        `import AppError from '../../errors/AppError';
import { HttpStatus } from '../../utils/http-status';
import ${modulesName}Model from './${modulesName}.model';

const getAll${modulesName} = async () => {
  const result = await ${modulesName}Model.find();
  if (!result) {
    throw new AppError(HttpStatus.NotFound, 'No ${modulesName}s Found!');
  }
  return result;
};

const getById${modulesName} = async (id: string) => {
  const result = await ${modulesName}Model.findById(id);
  if (!result) {
    throw new AppError(HttpStatus.NotFound, 'No ${modulesName} Found!');
  }
  return result;
};

const delete${modulesName} = async (id: string) => {
  const result = await ${modulesName}Model.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(HttpStatus.NotFound, 'No ${modulesName} Found!');
  }
  return result;
};

const update${modulesName} = async (id: string) => {
  const result = await ${modulesName}Model.findByIdAndUpdate(id);
  if (!result) {
    throw new AppError(HttpStatus.NotFound, 'No ${modulesName} Found!');
  }
  return result;
};

export const ${modulesName}Services = {
  getAll${modulesName},
  getById${modulesName},
  delete${modulesName},
  update${modulesName},
};

`,
      );
    }

    if (key === 'route') {
      createFile(
        path.join(folderPath, `${modulesName}.route.ts`),
        `import express from 'express';
import auth from '../../middlewares/auth';
import { parseBody } from '../../middlewares/bodyParser';
import validateRequest from '../../middlewares/validateRequest';
import { ${modulesName}Validation } from './${modulesName}.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.USER),
  validateRequest(${modulesName}Validation.${modulesName}ValidationSchema),
  parseBody
);

router.get('/all', auth(USER_ROLE.USER));

router.get('/:id', auth(USER_ROLE.USER));

router.patch(
  '/:id',
  auth(USER_ROLE.USER),
  validateRequest(${modulesName}Validation.${modulesName}ValidationSchema),
  parseBody
);

export const ${modulesName}Routes = router;

`,
      );
    }

    if (key === 'validation') {
      createFile(
        path.join(folderPath, `${modulesName}.validation.ts`),
        `import { z } from 'zod';

const ${modulesName}ValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const ${modulesName}Validation = {
  ${modulesName}ValidationSchema,
};
`,
      );
    }
    if (key === 'interface') {
      createFile(
        path.join(folderPath, `${modulesName}.interface.ts`),
        `export type T${modulesName} = {
  name: string;
};

`,
      );
    }
  }

  console.log(`module  setup complete!`);
}

promptUser().catch((error) => console.error('Error:', error));
