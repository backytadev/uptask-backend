import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/validation';
import { ProjectController } from '../controllers/ProjectControllers';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middlewares/project';
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from '../middlewares/task';
import { authenticate } from '../middlewares/auth';
import { TeamMemberController } from '../controllers/TeamControllers';
import { NoteController } from '../controllers/NoteController';

const router: Router = Router();

//* Autenticare middleware
router.use(authenticate);

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
  hasAuthorization,
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
  hasAuthorization,
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
  hasAuthorization,
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

//? Router for teams
router.post(
  '/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('E-mail no es válido.'),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.get('/:projectId/team', TeamMemberController.getProjectTeam);

router.post(
  '/:projectId/team',
  body('id').isMongoId().withMessage('ID no válido.'),
  handleInputErrors,
  TeamMemberController.addMemberById
);

router.delete(
  '/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('ID no válido.'),
  handleInputErrors,
  TeamMemberController.removeMemberById
);

/** Routes for Notes  **/
router.post(
  '/:projectId/tasks/:taskId/notes',
  body('content')
    .notEmpty()
    .withMessage('El contenido de la nota es obligatorio.'),
  handleInputErrors,
  NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

router.delete(
  '/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('ID no válido.'),
  handleInputErrors,
  NoteController.deleteNote
);

export default router;
