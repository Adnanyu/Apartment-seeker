import mongoose from "mongoose";
import { Post } from "../models/post.js";
import { districts } from "./districts.js";

mongoose.connect('mongodb://127.0.0.1:27017/Apartment-seeker')
    .then(() => {
        console.log('mongoo connection is open!!')
    })
    .catch((err) => {
        console.log('there is errooo!!!')
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

// const seedDB = async () => {
//     await Post.deleteMany({});
//     for (let i = 0; i < 400; i++){
//         const random1000 = Math.floor(Math.random() * 1000)
//         const price = Math.floor(Math.random() * 2000) + 10
//         const camp = new Post({
//             author: '64bc11cbca469598fc7bede9',
//             location: `${cities[random1000].city}, ${cities[random1000].state} `,
//             geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
//             title: `${sample(descriptors)} ${sample(places)}`,
//             images: [
//                 {
//                   url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=60&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlfGVufDB8fDB8fHww',
//                   filename: 'Apartment-seeker/ycwuey0xwks7i79rwe82',
//                 }
//               ],
//             description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores ullam sed ea nesciunt nobis doloremque natus quidem ipsa debitis, unde corporis consequuntur ad distinctio facilis aperiam laudantium dolore numquam incidunt?',
//             price: price
//         })
//         await camp.save()
//     }
// }
const amenitiesEnum = ['ac', 'gym', 'pool', 'parking', 'elevator'];

const fetchRandomImage = async () => {
    const accessKey = 'YOUR_ACCESS_KEY';
    const apiUrl = 'https://source.unsplash.com/random?apartment'

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.urls.regular; // Returns the URL of the regular-sized image
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};


const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 100; i++){
        const author = ['656c9d314d574b0eaaa1863b', '653d41409063faf7c89abda2']
        const random1000 = Math.floor(Math.random() * 27)
        const price = Math.floor(Math.random() * 2000) + 10
        const randomFloor = Math.floor(Math.random() * 10) + 1; // Random floor between 1 and 10
        const randomBedrooms = Math.floor(Math.random() * 5) + 1; // Random number of bedrooms between 1 and 5
        const randomBathrooms = Math.floor(Math.random() * 3) + 1; // Random number of bathrooms between 1 and 4
        const randomDate = new Date(Date.now() + Math.floor(Math.random() * 1000 * 3600 * 24 * 30)); // Random date within 30 days from now
        let randomAmenities = [];

        // const amenitiesCount = Math.floor(Math.random() * 3) + 1; // Random number of amenities between 1 and 3
        // for (let j = 0; j < amenitiesCount; j++) {
        //     let randomAmenity;
        //     do {
        //         randomAmenity = sample(amenitiesEnum); // Get a random amenity from the enum
        //     } while (randomAmenities.includes(randomAmenity)); // Repeat until the amenity is unique
        //     randomAmenities.push(randomAmenity); // Add the unique amenity to the array
        // }
        const amenities = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => amenitiesEnum[Math.floor(Math.random() * amenitiesEnum.length)]);
        // const image = await fetch('https://source.unsplash.com/random?apartment').then(res => res.url);
        const post = new Post({
            author: author[Math.floor(Math.random() * 2)],
            city: 'Istanbul',
            geometry: { type: 'Point', coordinates: [ districts[random1000].lng, districts[random1000].lat ] },
            title: `${districts[random1000].name} apartment`,
            images: [
                {
                  url: await fetch('https://source.unsplash.com/random?apartment',{ timeout: 10000}).then(res => res.url),
                  filename: 'Apartment-seeker/ycwuey0xwks7i79rwe82',
                },
                {
                  url: await fetch('https://source.unsplash.com/random?apartment',{ timeout: 10000}).then(res => res.url),
                  filename: 'Apartment-seeker/ycwuey0xwks7i79rwe82',
                },
                {
                  url: await fetch('https://source.unsplash.com/random?apartment',{ timeout: 10000}).then(res => res.url),
                  filename: 'Apartment-seeker/ycwuey0xwks7i79rwe82',
                }
                // {
                //   url: await fetch('https://source.unsplash.com/random?apartment').then(res => res.url),
                //   filename: 'Apartment-seeker/ycwuey0xwks7i79rwe82',
                // }
              ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores ullam sed ea nesciunt nobis doloremque natus quidem ipsa debitis, unde corporis consequuntur ad distinctio facilis aperiam laudantium dolore numquam incidunt?',
            price: price,
            address: districts[random1000].name,
            number_of_bedrooms: randomBedrooms,
            number_of_bathrooms: randomBathrooms,
            area: 200, // Example value
            floor: randomFloor,
            amenities: amenities,
            availability: randomDate,
            contact: {
                phone: 1234567890, // Example value
                email: 'example@example.com' // Example value
            }
        })
        await post.save()
    }
}


seedDB().then(() => {
    mongoose.connection.close()
})

