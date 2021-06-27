import { Response, Router, Request } from "express";
import * as Joi from "joi";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const ReviewController = Router();
const db = admin.firestore().collection("restaurants");

const newReviewSchema = Joi.object({
  rating: Joi
    .number()
    .integer()
    .min(1)
    .max(5)
    .required(),
  comment: Joi
    .string()
    .required(),
  dateOfVisit: Joi
    .number()
    .integer()
    .min(1)
    .required(),
});

// Using CRUD

ReviewController.post("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  const user = req.user;
  const restaurantId = req.params.restaurantId;
  if (!user.user)
    return res.status(403).send({message: "Cannot perform action"});
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});

  const restaurantRef = db.doc(restaurantId);
  try {
    const review: Review = await newReviewSchema.validateAsync(req.body.review);
    const restaurant =  (await restaurantRef.get()).data();
    if (!restaurant) throw Error("Issue with restaruant");

    review.author = user.uid;
    review.owner = restaurant.owner;
    review.reply = "";

    const document = await restaurantRef.collection("reviews").add(review);
    
    restaurant.total += review.rating;
    restaurant.ratings++;
    restaurant.avg = restaurant.total / restaurant.ratings;
    restaurantRef.update(restaurant);

    return res.status(201).send(document.id);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

ReviewController.get("/pending", authEndpoint, async (req: Request, res: Response) => {
  const user = req.user;

  if (!user.owner)
    return res.status(403).send({message: "Cannot perform action"});

  let query = admin.firestore().collectionGroup("reviews")
    .where("reply", "==", "")
    .where("owner", "==", user.uid);
  
  try {
    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map((doc) => ({id: doc.id, restaurantId: doc.ref.parent.parent?.id, ...doc.data()}));
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

ReviewController.get("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});

  const offset = req.query.offset;
  let query = db.doc(restaurantId).collection("reviews").orderBy("dateOfVisit", "desc").limit(5);
  if (offset && Number.isInteger(+offset))
    query = query.offset(+offset);
  
  try {
    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map((doc) => ({id: doc.id, restaurantId: doc.ref.parent.parent?.id, ...doc.data()}));
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

ReviewController.get("/:restaurantId/preview", authEndpoint, async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});

  const topQuery = db.doc(restaurantId).collection("reviews").orderBy("rating", "desc").limit(1);
  const bottomQuery = db.doc(restaurantId).collection("reviews").orderBy("rating", "asc").limit(1);
  
  try {
    const topResults = await topQuery.get();
    const bottomResults = await bottomQuery.get();
    if (topResults.empty || bottomResults.empty) throw new Error("No reviews");
    const top = topResults.docs[0];
    const bottom = bottomResults.docs[0];

    const data = {
      top: top.data(),
      bottom: bottom.data()
    };
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

ReviewController.put("/:restaurantId/:reviewId", authEndpoint, async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;
  const reviewId = req.params.reviewId;
  const user = req.user;
  const reply = req.body.reply;
  if (!user.owner)
    return res.status(403).send({message: "Cannot perform action"});
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});
  if (!reviewId) return res.status(400).send({message: "Need a review ID"});
  if (!reply) return res.status(400).send({message: "Need a reply"});

  const restaurantRef = db.doc(restaurantId);
  
  
  try {
    const restaurant =  (await restaurantRef.get()).data();
    if (!restaurant || restaurant.owner !== user.uid) throw Error("Issue with restaruant");

    const reviewRef = restaurantRef.collection("reviews").doc(reviewId);
    reviewRef.update({reply: reply});

    return res.status(201).send(reply);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

});

ReviewController.delete("/:restaurantId/:reviewId", authEndpoint, async (req: Request, res: Response) => {
  return res.status(501);
});

export default ReviewController;