import { db } from "@/utils/index";
import { Router } from "express";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: { email }
  });

  if (user === null) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  return res.status(200).json(user);
});

router.get('/:pswd', async (req: Request, res: Response) => {
  return res.json(await bcrypt.hash(req.params.pswd, await bcrypt.genSalt(10)))
});