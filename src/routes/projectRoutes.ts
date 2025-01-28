import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/validation';
import { ProjectController } from '../controllers/ProjectControllers';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middlewares/project';
import { taskBelongsToProject, taskExists } from '../middlewares/task';

const router: Router = Router();

//? ROUTES FOR PROJECT
//* Create
router.post(
  '/',
  body('projectName')
    .notEmpty()
    .withMessage('El nombre del proyecto es requerido.'),
  body('clientName')
    .notEmpty()
    .withMessage('El nombre del cliente es requerido.'),
  body('description').notEmpty().withMessage('La descripción es requerida.'),
  handleInputErrors,
  ProjectController.createProject
);

//* Read
router.get('/', ProjectController.getAllProjects);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('ID no valido.'),
  handleInputErrors,
  ProjectController.getProjectById
);

//* Update
router.put(
  '/:id',
  param('id').isMongoId().withMessage('ID no valido.'),
  body('projectName')
    .notEmpty()
    .withMessage('El nombre del proyecto es requerido.'),
  body('clientName')
    .notEmpty()
    .withMessage('El nombre del cliente es requerido.'),
  body('description').notEmpty().withMessage('La descripción es requerida.'),
  handleInputErrors,
  ProjectController.updateProjectById
);

//! Delete
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('ID no valido.'),
  handleInputErrors,
  ProjectController.deleteProjectById
);

//? ROUTES FOR TASKS
router.param('projectId', projectExists); // ejecuta la validación en cada ruta que tenga este param.

//* Create
router.post(
  '/:projectId/tasks',
  body('name').notEmpty().withMessage('El nombre de la tarea es requerido.'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es requerida.'),
  handleInputErrors,
  TaskController.createTask
);

//* Get project tasks
router.get('/:projectId/tasks', TaskController.getProjectTasks);

//? Validation middleware
router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

//* Get task by project id
router.get(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no valido.'),
  handleInputErrors,
  TaskController.getTaskById
);

//* Update task by project id
router.put(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no valido.'),
  body('name').notEmpty().withMessage('El nombre de la tarea es requerido.'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es requerida.'),
  handleInputErrors,
  TaskController.updateTask
);

//! Delete task by id
router.delete(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no valido.'),
  handleInputErrors,
  TaskController.deleteTask
);

//* Update task status
router.put(
  '/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('ID no valido.'),
  body('status').notEmpty().withMessage('El estado es requerido'),
  handleInputErrors,
  TaskController.updateStatus
);

export default router;
