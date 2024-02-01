import { Post } from "../models/post.js"
import { cloudinary } from "../cloudinary/index.js"
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime);
import dotenv from 'dotenv'
dotenv.config()

const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapboxToken})

export const index = async (req, res) => {
  const posts = await Post.find({})
  res.render('posts/index', { posts , mode: 'filter' })
}

export const search = async (req, res) => {
  const { city, district, amenities, price_min, price_max } = req.body.search;
  const query = {};

  if (city !== 'all') {
    query.city = city;
  }

  if (district !== 'all') {
    query.address = { $regex: new RegExp(district, 'i') }; 
  }

  if (amenities && amenities.length > 0) {
    query.amenities = { $all: amenities }; 
  }

  if (price_min && price_max) {
    query.price = { $gte: price_min, $lte: price_max }; 
  }
  const results = await Post.find(query);
  res.render('posts/index', { posts: results, mode: 'filter' })

}

export const renderNewForm = (req, res) => {
  res.render('posts/new')
}

export const createPost = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
      query: req.body.post.address,
      limit: 1
  }).send()
  const addedPost = new Post(req.body.post)
  if (geoData.body.features.length < 1) {
      req.flash('error', 'The Location You Entered Cannot Be Found!!')
      res.redirect('/posts/new', )
  }
  addedPost.geometry = geoData.body.features[0].geometry;
  addedPost.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  addedPost.author = req.user._id

  await addedPost.save()

  req.flash('success', 'successfully made a new Post!!')
  res.redirect('/posts', )
  res.send(req.body)
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  const foundPosts = await Post.findById(id)
  
  for (let deleted of foundPosts.images) {
      await cloudinary.uploader.destroy(deleted.filename);
  }
  
  await foundPosts.deleteOne()
  req.flash('success', 'successfully deleted your post')
  res.redirect('/posts')
}

export const showPost = async (req, res) => {
  const { id } = req.params
  
  const foundPosts = await Post.findById(id).populate('author')

  const createdDate = dayjs(foundPosts.createdAt).fromNow()
  const editedDate = dayjs(foundPosts.updatedAt).fromNow()
  if (!foundPosts) {
      req.flash('error', 'the post cannot be found')
      return res.redirect('/posts')
  }
  
  res.render('posts/show', {post: foundPosts,createdDate, editedDate })   
   
}

export const editFormPost = async (req, res) => {
  const { id } = req.params
  const foundPosts = await Post.findById(id)
  if (!foundPosts) {
      req.flash('error', 'this camp cannnot be found')
      return res.redirect('/posts')
  }
  res.render('posts/edit',{post: foundPosts})
}


export const editPost = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
      query: req.body.post.address,
      limit: 1
  }).send()
  const { id } = req.params
  const { post } = req.body
  const foundPost = await Post.findByIdAndUpdate(id, { ...post })

  if (!req.files.length && req.body.deleteImages && req.body.deleteImages.length >= foundPost.images.length) {
      req.flash('error', 'there must be at least one image')
      return res.redirect(`/posts/${id}/edit`)
    }
  
  if (req.files && req.files.length) {
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    foundPost.images.push(...imgs);
  }
    
  if (req.body.deleteImages) {
    for (let deleted of foundPost.images) {
      if (req.body.deleteImages.includes(deleted.filename)) {
        await cloudinary.uploader.destroy(deleted.filename);
      }
    }
    foundPost.images = foundPost.images.filter((img) => !req.body.deleteImages.includes(img.filename));
  }

  foundPost.geometry = geoData.body.features[0].geometry
  
  await foundPost.save()
  if (!foundPost) {
      req.flash('error', 'post cannot find post')
      return res.redirect('/posts')
  }
  req.flash('success', 'succussfully updated post!')
  res.redirect(`/posts/${foundPost._id.toString()}`)
}

