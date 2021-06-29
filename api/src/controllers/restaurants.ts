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
  if (!(user.user || user.admin || user.owner))
    return res.status(403).send({message: "Cannot perform action"});
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
  const restaurantId = req.params.restaurantId;
  const user = req.user;
  const name = req.body.name;
  const description = req.body.description;
  if (!(user.admin || user.owner))
    return res.status(403).send({message: "Cannot perform action"});
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});
  if (!name && !description) return res.status(400).send({message: "Need a something to update"});

  const restaurantRef = db.doc(restaurantId);

  try {
    const restaurant =  (await restaurantRef.get()).data();
    if (!restaurant || !(user.admin || restaurant.owner === user.uid)) throw Error("Issue with restaruant");
    if (name) await restaurantRef.update({name: name});
    if (description) await restaurantRef.update({description: description});
    return res.status(201).send({message: "Successful update"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

RestaurantController.delete("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  // Admin can delete any
  const restaurantId = req.params.restaurantId;
  const user = req.user;
  if (!(user.admin || user.owner))
    return res.status(403).send({message: "Cannot perform action"});
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});

  const restaurantRef = db.doc(restaurantId);

  try {
    const restaurant =  (await restaurantRef.get()).data();
    if (!restaurant || !(user.admin || restaurant.owner === user.uid)) throw Error("Issue with restaruant");
    (await restaurantRef.collection("reviews").get()).docs.forEach(doc => doc.ref.delete());
    await restaurantRef.delete();
    return res.status(201).send({message: "Successful delete"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

export default RestaurantController;