import { db } from "@/utils/index";
import { Router } from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import * as path from "path"
import * as fs from "fs"
import type { Request, Response } from "express";

export const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}`
    const fileName = file.originalname.split(".")
    cb(null,`${uniqueSuffix}-${fileName[0]}.${fileName[1]}`)
  }
})

const upload = multer({ storage: storage })

router.get('/:page', async (req: Request, res: Response) => {
  const page = Number(req.params.page ?? 1);
  const pageSize = 6;

  const totalPages = Math.ceil(await db.user.count() / pageSize);

  const users = await db.user.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize
  });

  for (const user of users) {
    if (user.imgPath) {
      const filePath = path.join(path.dirname(path.dirname(__dirname)), user?.imgPath!);
      const file = fs.readFileSync(filePath)
      user!.imgPath = `data:image/png;base64,${file.toString("base64")}`;
    }
  }

  res.json({ users, totalPages });
});


router.get('/:id/profile', async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await db.user.findFirst({
    where: { id: Number(id) },
  });

  if (user?.imgPath) {
    const filePath = path.join(path.dirname(path.dirname(__dirname)), user?.imgPath!);
    const file = fs.readFileSync(filePath)
    user!.imgPath = `data:image/png;base64,${file.toString("base64")}`;
  }

  res.json(user);
});

router.post('/', async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  const hasedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))

  const user = await db.user.create({
    data: {
      password: hasedPassword,
      ...rest
    }
  });
  res.json(user);
});

router.patch('/:id', upload.single('imgPath'), async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.file) {
    const user = await db.user.update({
      where: { id: Number(id) },
      data: {
        imgPath: req.file.path
      }
    })

    return res.json(user);
  }

  const user = await db.user.update({
    where: { id: Number(id) },
    data: req.body
  })
  
  return res.json(user);
});