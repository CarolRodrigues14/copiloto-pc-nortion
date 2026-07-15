import { Router, Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabaseClient'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }
    res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
})

export { router as healthRouter }
