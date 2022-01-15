import Joi from "joi";

export const auctionSchema = Joi.object({
  userId: Joi.string().max(20).required(),
  productId: Joi.string().max(20).required(),
  price: Joi.number().integer().max(99999999).required(),
});
