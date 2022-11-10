import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CommentCollection from './collection';
import CommentModel from './model';


/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetParentExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};


/**
 * Checks if a freet with freetId is req.params exists
 */
 const didUserComment = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.commentId);
  const comment = validFormat ? await CommentModel.findOne({_id: req.params.commentId}) : '';
  if (!comment) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }
  if (comment.commenterId._id.toString() !== req.session.userId) {
    console.log(comment.commenterId, req.session.userId);
    res.status(404).json({
      error: {
        commentNotYours: `Cannot delete other people's comments`
      }
    });
    return;
  }

  next();
};

export {isFreetParentExists, didUserComment};