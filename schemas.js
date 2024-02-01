import Joi from "joi";

export const postSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // images: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required(),
        availability:Joi.date(),
        contact: Joi.object(),
        city: Joi.string(),
        number_of_bedrooms: Joi.number().min(1),
        number_of_bathrooms: Joi.number().min(1),
        area: Joi.number() ,
        floor: Joi.number(),
        amenities: Joi.array().min(1)

    }).required(),
    deleteImages: Joi.array(),
    amenities: Joi.array()
})

