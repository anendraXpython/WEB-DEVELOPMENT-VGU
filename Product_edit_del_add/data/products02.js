let products = [
  {
    id: 1,
    name: "Gaming Mouse",
    price: 24.99,
    desc: "Ergonomic gaming mouse with adjustable DPI and RGB lighting.",
    image: "https://placehold.co/300x150?text=Gaming+Mouse",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 59.99,
    desc: "Tactile mechanical keyboard with backlit keys.",
    image: "https://placehold.co/300x150?text=Keyboard",
  },
  {
    id: 3,
    name: "Webcam HD",
    price: 34.99,
    desc: "1080p HD webcam with built-in microphone.",
    image: "https://placehold.co/300x150?text=Webcam",
  },
];

module.exports = {


  getAll: () => products,

  add: (product) => {
    const newProduct = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      ...product,
    };

    products.push(newProduct);

    return newProduct;
  },

  remove: (id) => {
    products = products.filter((product) => product.id !== id);
  },

};