// GitHub GraphQL APIから取得した情報を加工して表示
// APIルート定義

import { Router } from 'express';
import { getSkillContext } from '../components/application/use-case/skillsUseCases';

const router = Router();