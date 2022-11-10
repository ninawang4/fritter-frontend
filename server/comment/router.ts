import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from './middleware';
import CommentModel from './model';
// import * as util from '../freet/util';

const router = express.Router();

/**
 * Comment on a Freet
 *
 * @name PUT /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {Types.ObjectId} parentFreetId - The parent freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.put(
    '/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isValidFreetContent,
      commentValidator.isFreetParentExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      console.log('hello what is up', userId, req.body.content, req.params.freetId);
      const comment = await CommentCollection.addComment(userId, req.body.content, req.params.freetId);
    
      res.status(200).json({
        message: 'Your comment was created successfully.',
        comment: comment,
      });
    }
  );

  /**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.didUserComment,
  ],
  async (req: Request, res: Response) => {
    // await CommentCollection.deleteComment(req.params.commentId)
    await CommentModel.findByIdAndDelete(req.params.commentId);
    const comment = await CommentModel.findById(req.params.commentId);
    console.log(comment);
    
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);


export {router as commentRouter};
  