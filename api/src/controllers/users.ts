import { Response, Router, Request } from "express";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const UserController = Router();

// Using CRUD

UserController.post("/", authEndpoint, async (req: Request, res: Response) => {
  // Upon account creation only
  const userClaims = req.user;
  const user: User = req.body.user;

  if (userClaims.admin) { 
    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: 'Temp1234', // Don't want to send password over 
        displayName: user.userName,
      });
      const claims: any = {};
      claims[user.accountType] = true;
      await admin.auth().setCustomUserClaims(userRecord.uid, claims);
      return res.status(201).send({message: "Success setting up account"});
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  } 

  if (user.email.toLowerCase() !== userClaims.email)
    return res.status(403).send({message: "Incorrect user"});
  try {
    const claims: any = {};
    claims[user.accountType] = true;
    await admin.auth().setCustomUserClaims(userClaims.uid, claims);
    await admin.auth().updateUser(userClaims.uid, {displayName: user.userName});
    return res.status(201).send({message: "Success setting up account"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

UserController.get("/", authEndpoint, async (req: Request, res: Response) => {
  // Upon account creation only
  const userClaims = req.user;

  if (!userClaims.admin)
    return res.status(403).send({message: "Not admin"});
  
  try {
    const listUsers = await admin.auth().listUsers();
    return res.status(201).send(listUsers.users);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

UserController.put("/:userId", authEndpoint, async (req: Request, res: Response) => {
  // Admin seems to be only one who can update accounts
  if (!req.user.admin)
    return res.status(403).send({message: "Cannot perform action"});
  
  const user = req.body.user;
  const uid = req.params.userId;
  if (!uid) return res.status(400).send({message: "No uid specified"});
  if (!user) return res.status(400).send({message: "No user in body"});

  try {
    const firebaseUser = await admin.auth().getUser(uid);
    if (user.email && user.email.toLowerCase() !== firebaseUser.email)
      await admin.auth().updateUser(uid, {email: user.email.toLowerCase()});
    if (user.userName && user.userName !== firebaseUser.displayName)
      await admin.auth().updateUser(uid, {displayName: user.userName});
    return res.status(200).send({message: "Successful update"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
  
});

UserController.delete("/:userId", authEndpoint, async (req: Request, res: Response) => {
  // Admin can delete any accounts
  if (!req.user.admin)
    return res.status(403).send({message: "Cannot perform action"});
  if (!req.params.userId)
    return res.status(400).send();
  try {
    const restaurantsRef = admin.firestore().collection("restaurants").where("owner", "==", req.params.userId);
    (await restaurantsRef.get()).docs.forEach(async (restaurant) => {
      const restaurantRef = restaurant.ref;
      (await restaurantRef.collection("reviews").get()).docs.forEach(doc => doc.ref.delete());
      await restaurantRef.delete();
    })
    await admin.auth().deleteUser(req.params.userId);
    return res.status(200).send({message: "Successful delete"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

});

export default UserController;