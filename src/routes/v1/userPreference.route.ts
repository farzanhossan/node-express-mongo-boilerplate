import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { userPreferenceController, userPreferenceValidation } from '../../modules/userPreference';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth('manageUserPreferences'),
    validate(userPreferenceValidation.createUserPreference),
    userPreferenceController.createUserPreference
  )
  .get(
    auth('getUserPreferences'),
    validate(userPreferenceValidation.getUserPreferences),
    userPreferenceController.getUserPreferences
  );

router
  .route('/:userPreferenceId')
  .get(
    auth('getUserPreferences'),
    validate(userPreferenceValidation.getUserPreference),
    userPreferenceController.getUserPreference
  )
  .patch(
    auth('manageUserPreferences'),
    validate(userPreferenceValidation.updateUserPreference),
    userPreferenceController.updateUserPreference
  )
  .delete(
    auth('manageUserPreferences'),
    validate(userPreferenceValidation.deleteUserPreference),
    userPreferenceController.deleteUserPreference
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: UserPreferences
 *   description: UserPreference management and retrieval
 */

/**
 * @swagger
 * /userPreferences:
 *   post:
 *     summary: Create a userPreference
 *     description: Only admins can create other userPreferences.
 *     tags: [UserPreferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayStartTime:
 *                 type: string
 *                 description: '09:00'
 *               dayEndTime:
 *                 type: string
 *                 description: '23:00'
 *               tasks:
 *                 type: array
 *                 description: [{ name: 'Task_1', priority: 1, duration: 1, day: 0 }]
 *               classes:
 *                 type: array
 *                 description: [{ day: 0, name: 'Math', startTime: '10:00', endTime: '11:00' }]
 *               partTimeJobHours:
 *                 type: array
 *                 description: [{ day: 0, duration: 4 }]
 *               user:
 *                 type: string
 *                 description: 'User Id'

 *             example:
 *               dayStartTime: '09:00'
 *               dayEndTime: '23:00'
 *               tasks: [{ name: 'Task_1', priority: 1, duration: 1, day: 0 }]
 *               classes: [{ day: 0, name: 'Math', startTime: '10:00', endTime: '11:00' }]
 *               partTimeJobHours: [{ day: 0, duration: 4 }]
 *               user: 'user id'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserPreference'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all userPreferences
 *     description: Only admins can retrieve all userPreferences.
 *     tags: [UserPreferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of userPreferences
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserPreference'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /userPreferences/{id}:
 *   get:
 *     summary: Get a userPreference
 *     description: Logged in userPreferences can fetch only their own userPreference information. Only admins can fetch other userPreferences.
 *     tags: [UserPreferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserPreference id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserPreference'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a userPreference
 *     description: Logged in userPreferences can only update their own information. Only admins can update other userPreferences.
 *     tags: [UserPreferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserPreference id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserPreference'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a userPreference
 *     description: Logged in userPreferences can delete only themselves. Only admins can delete other userPreferences.
 *     tags: [UserPreferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserPreference id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
