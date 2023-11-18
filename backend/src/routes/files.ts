import { exec, db } from "@/utils/index";
import { Router } from "express";
import PYTHON from "@/environment";
import multer from "multer";
import * as path from "path"
import * as fs from "fs"
import type { Request, Response } from "express";

export const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./storage/${req.body.directory}`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null,`${uniqueSuffix}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

router.get('/:page', async (req: Request, res: Response) => {
  const page = Number(req.params.page ?? 1);
  const pageSize = 6;

  const totalPages = Math.ceil(await db.file.count() / pageSize);

  const files = await db.file.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  const response = [];
  for (const file of files) {
    const { stdout } = await exec(`${PYTHON} src/python/get_file_info.py "${file.path}"`);
    response.push({ ...file, info: JSON.parse(stdout) })
  }

  res.json({ response, totalPages });
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  const { templateId, userId } = req.body;

  const template = await db.template.findUnique({
    where: {
      id: Number(templateId)
    }
  });

  const { stdout } = await exec(`${PYTHON} src/python/validate_template.py "${req.file?.path}" "${JSON.stringify(template).replace(/"/g, "\'")}"`);

  const stdoutObj: { success: boolean, msg: string } = JSON.parse(stdout)

  if (!stdoutObj.success) {
    fs.unlinkSync(req.file?.path!);
    return res.status(406).json({ error: stdoutObj.msg });
  }

  const file = await db.file.create({
    data: {
      path: req.file?.path!,
      templateId: Number(templateId),
      userId: Number(userId)
    }
  });
  return res.status(200).json(file);
});

router.get('/:id/download', async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await db.file.findUnique({
    where: { id: Number(id) }
  });

  const filePath = path.join(path.dirname(path.dirname(__dirname)), file?.path!);
  res.status(200).sendFile(filePath);
});
