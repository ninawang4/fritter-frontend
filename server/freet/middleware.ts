import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
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
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return; 
  }

  next();
};

/**
 * Checks if scheduled date is in future
 */
 const isFutureTime = async (req: Request, res: Response, next: NextFunction) => {
  const date = new Date();
  var scheduled;

  // console.log(req.body.scheduledTime);
  if (req.body.scheduledTime === ''){
    scheduled = new Date(req.body.scheduledDate);
  } else {
    const timeString = '1970-01-01T17:'.concat(req.body.scheduledTime.concat('.000Z'));
    console.log(timeString);
    const scheduledDate = new Date(req.body.scheduledDate).getTime();
    const dateAndTime = scheduledDate + Date.parse(timeString);

    scheduled = new Date(dateAndTime);
  }

  if (scheduled < date) {
    res.status(403).json({
      error: 'Cannot schedule for a past date/time'
    });
    return; 
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isFutureTime
};
