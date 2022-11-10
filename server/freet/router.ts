import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as upvoteValidator from '../upvote/middleware';
;import * as util from './util';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
 router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {Date} scheduledDate - the time the tweet is scheduled to be posted (if any)
 * @param {Time} scheduledTime - the time the tweet is scheduled to be posted (if any)

 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    freetValidator.isFutureTime,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    var scheduled;

    console.log(req.body.scheduledTime);
    if (req.body.scheduledTime === ''){
      scheduled = new Date(req.body.scheduledDate);
    } else {
      const timeString = '1970-01-01T17:'.concat(req.body.scheduledTime.concat('.000Z'));
      console.log(timeString);
      const scheduledDate = new Date(req.body.scheduledDate).getTime();
      const dateAndTime = scheduledDate + Date.parse(timeString);

      scheduled = new Date(dateAndTime);
    }


    const freet = await FreetCollection.addOne(userId, req.body.content, scheduled);
    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
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
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Upvote a freet
 *
 * @name PUT /api/upvotes/:id
 *
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.put(
  '/:freetId?',
  [
  //   userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    upvoteValidator.hasNotUpvoted,
  ],

  async (req: Request, res: Response) => {
      console.log("congrats");
    const userId = (req.session.userId as string) ?? '';
    const freet = await FreetCollection.upvoteOne(req.params.freetId, userId);
    console.log(freet);
    res.status(200).json({ 
      message: 'The freet was upvoted successfully.',
    });
  }
);

// /**
//  * Get all the freets for a given page
//  *
//  * @name GET /api/freets
//  *
//  * @param {string} page - The page user wants to view
//  * @return {FreetResponse[]} - A list of all the freets sorted in descending
//  *                      order by date modified
//  */
//  router.get(
//   '/:page?',
//   async (req: Request, res: Response) => {
//     let pageView;
  
//     if (req.params.page == 'home') {
//       const user = UserCollection.findOneByUserId(req.session.userId);
//       const following = (await user).following;
//       pageView = await FreetCollection.findHomeFreets(following);
//     } else if (req.params.page == 'trending'){
//       pageView = await FreetCollection.findTrendingFreets();
//     } else if (req.params.page == 'drafts') {
//       pageView = await FreetCollection.findDrafts(req.session.userId);
//     }
//   //   const user = UserCollection.findOneByUserId(req.session.userId);
//   //   const following = (await user).following;
//   //   const homepage = await FreetCollection.findHomeFreets(following)
//     const response = pageView.map(util.constructFreetResponse);
//     res.status(200).json(response);
//   },
// );

export {router as freetRouter};
