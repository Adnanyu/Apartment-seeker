import mongoose from "mongoose";

const schema = mongoose.Schema;

const opts = {toJSON: { virtuals: true }, timestamps: true };

const ImageSchema = new schema({
    url: String,
    filename: String
});
    
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const PostSchema = new schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
    address: String,
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    availability: {
        type: Date,
        required: true
    },
    contact: {
        phone: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    city: {
        type: String,
        required: true
    },
    number_of_bedrooms: {
        type: Number,
        required: true
    },
    number_of_bathrooms: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    amenities: [
        {
            type: String,
            enum: ['ac', 'gym', 'pool', 'parking', 'elevator']
        }
    ]

}, opts)



PostSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href='/posts/${this._id}'>${this.title}</a>
    <p>${this.description.substring(0, 20)}…</p>`
});

PostSchema.virtual('properties.popUpImage').get(function () {
    return `${this.images[0].url}`
});

export const Post = mongoose.model('Post', PostSchema)