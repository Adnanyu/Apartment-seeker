
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: post.geometry.coordinates, // starting position [lng, lat]
zoom: 12, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker1 = new mapboxgl.Marker()
.setLngLat(post.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${post.title}</h3> <p>${post.address}</p>`
        ))
    .addTo(map);

{/* <img source"${post.images[0]}" /> */}
  
