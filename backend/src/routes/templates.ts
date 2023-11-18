import { db, exec } from "@/utils/index";
import { Router } from "express";
import PYTHON from "@/environment";
import * as path from "path"
import * as fs from "fs"
import type { Request, Response } from "express";

export const router = Router();

router.get('/graphics', async (req: Request, res: Response) => {
  const perExtension = await db.template.groupBy({
    by: ['extension'],
    _count: true
  });

  const perStatus = await db.template.groupBy({
    by: ['status'],
    _count: true
  });


  const filesPerTemplate = await db.file.groupBy({
    by: ['templateId'],
    _count: true
  });

  for (const item of filesPerTemplate) {
    const query = await db.template.findFirst({
      where: {id: item.templateId}
    })
    // @ts-ignore 
    item['templateName'] = `${query?.name}.${query?.extension}`
  }

  res.json({ perExtension, perStatus, filesPerTemplate });
});

router.get('/:page', async (req: Request, res: Response) => {
  const page = Number(req.params.page ?? 1);
  const pageSize = 6;

  const totalPages = Math.ceil(await db.template.count() / pageSize);

  const templates = await db.template.findMany({
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
  res.json({ templates, totalPages });
});

router.get('/:id/download', async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = await db.template.findUnique({
    where: { id: Number(id) }
  })

  const { stdout } = await exec(`${PYTHON} src/python/generate_excel_from_template.py "${JSON.stringify(template).replace(/"/g, "\'")}"`);
  const filePath = path.join(path.dirname(path.dirname(__dirname)), stdout);
  res.status(200).sendFile(filePath)
  res.on("finish", () => fs.unlinkSync(filePath));
});

router.post('/', async (req: Request, res: Response) => {
  const { fieldQtd, userId, ...body } = req.body
  const template = await db.template.create({
    data: {
      date: new Date(),
      fieldQtd: Number(fieldQtd),
      userId: Number(userId),
      ...body
    }
  });
  res.json(template);
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = await db.template.update({
    where: { id: Number(id) },
    data: req.body
  })
  
  res.json(template)
});