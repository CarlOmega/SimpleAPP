import { Response, Router, Request } from "express";
import * as Joi from "joi";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const RestaurantController = Router();
const db = admin.firestore().collection("restaurants");

const newRestaurantSchema = Joi.object({
  name: Joi
    .string()
    .min(3)
    .max(30)
    .required(),
  description: Joi
    .string()
    .required(),
});

// Using CRUD

RestaurantController.post("/", authEndpoint, async (req: Request, res: Response) => {
  // Create new resturants if owner
  const user = req.user;
  if (!user.owner)
    return res.status(403).send({message: "Cannot perform action"});
  
  try {
    const restaurant: Restaurant = await newRestaurantSchema.validateAsync(req.body.restaurant);
    restaurant.owner = user.uid;
    restaurant.ratings = 0;
    restaurant.avg = 0;
    restaurant.total = 0;

    const document = await db.add(restaurant);
    return res.status(201).send(document.id);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

});

RestaurantController.get("/", authEndpoint, async (req: Request, res: Response) => {
  // Get all resturants if normal user or admin
  // Return only owned resturants if owner claim
  const user = req.user;
  const offset = req.query.offset;
  const rating = req.query.rating;
  let query = db.orderBy("avg", "desc").limit(5);
  if (user.owner)
    query = query.where("owner", "==", user.uid);
  if (offset && Number.isInteger(+offset))
    query = query.offset(+offset);
  if (rating && Number.isInteger(+rating))
    query = query.where("avg", ">=", +rating);
  try {
    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

RestaurantController.put("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  // Create edit owned resturants if owner
  // Admin can edit any
  return res.status(501);
});

RestaurantController.delete("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  // Admin can delete any
  return res.status(501);
});

export default RestaurantController;