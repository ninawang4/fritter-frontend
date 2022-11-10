import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from '../freet/util';

const router = express.Router();

/**
 * Get all the freets for a given page
 *
 * @name GET /api/page
 *
 * @param {string} page - The page user wants to view
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
 router.get(
    '/:page?',
    async (req: Request, res: Response) => {
      let pageView;
      if (req.query.page == 'home') {
        const user = UserCollection.findOneByUserId(req.session.userId);
        const following = (await user).following;

        pageView = await FreetCollection.findHomeFreets(following);
      } else if (req.query.page == 'trending'){
        pageView = await FreetCollection.findTrendingFreets();
      } else if (req.query.page == 'drafts') {
        pageView = await FreetCollection.findDrafts(req.session.userId);
      };
    //   const user = UserCollection.findOneByUserId(req.session.userId);
    //   const following = (await user).following;
    //   const homepage = await FreetCollection.findHomeFreets(following)
      console.log(pageView);
      const response = pageView.map(util.constructFreetResponse);
      res.status(200).json(response);
    },
  );

  export {router as pageRouter};