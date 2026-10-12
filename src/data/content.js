export const navigation = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Brands", "/brands"],
  ["Accessories", "/accessories"],
  ["Deals", "/deals"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];
export const categories = [
  {
    name: "Smartphones",
    icon: "Smartphone",
    subtitle: "Latest smartphones from top brands",
    slug: "smartphones",
  },
  {
    name: "Earbuds",
    icon: "Headphones",
    subtitle: "Premium sound. Unmatched style.",
    slug: "earbuds",
  },
  {
    name: "Smartwatches",
    icon: "Watch",
    subtitle: "Stay connected. Every moment.",
    slug: "smartwatches",
  },
  {
    name: "Accessories",
    icon: "Cable",
    subtitle: "Essential accessories for your devices",
    slug: "accessories",
  },
  {
    name: "Tablets",
    icon: "Tablet",
    subtitle: "Powerful. Portable. Productive.",
    slug: "tablets",
  },
];
export const trust = [
  { icon: "BadgeCheck", title: "Explore Products", detail: "Find your next device" },
  {
    icon: "ShieldCheck",
    title: "Secure Ordering",
    detail: "Order directly on WhatsApp",
  },
  {
    icon: "Truck",
    title: "Delivery Enquiries",
    detail: "Confirm fees with the store",
  },
  {
    icon: "RotateCcw",
    title: "Returns Information",
    detail: "Confirm terms before ordering",
  },
  { icon: "Headset", title: "Product Support", detail: "Prepare a support enquiry" },
];
export const topTrust = [
  { icon: "Truck", title: "Delivery Enquiries" },
  { icon: "BadgeCheck", title: "Explore Phones & Accessories" },
  { icon: "ShieldCheck", title: "Warranty Information" },
  { icon: "Headset", title: "Customer Enquiries" },
];
export const footerGroups = [
  {
    title: "Shop",
    links: [
      ["All Smartphones", "/shop"],
      ["Accessories", "/accessories"],
      ["Smartwatches", "/shop?category=smartwatches"],
      ["Tablets", "/shop?category=tablets"],
      ["Deals", "/deals"],
    ],
  },
  {
    title: "Brands",
    links: ["Apple", "Samsung", "Tecno", "Infinix", "Xiaomi"].map((x) => [
      x,
      `/shop?brand=${x}`,
    ]),
  },
  {
    title: "Customer Service",
    links: [
      ["Contact Us", "/contact"],
      ["Delivery & Returns", "/delivery"],
      ["Warranty", "/warranty"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Trade-In", "/trade-in"],
      ["Compare Phones", "/compare"],
      ["Wishlist", "/wishlist"],
    ],
  },
];
export const copy = {
  hero: {
    eyebrow: "Latest Tech. Best Prices.",
    title: "Upgrade Your World",
    description:
      "Discover the latest smartphones and accessories from top brands at unbeatable prices.",
    primary: "Shop now",
    secondary: "Explore deals",
    note: "A little upgrade. A world of possibilities.",
    badge: "Your next upgrade",
    cardTitle: "Beautifully connected.",
    cardDescription: "Find the phone that feels like you.",
    cardAction: "Find your phone",
  },
  benefits: [
    { icon: "Truck", title: "Delivery Enquiries", detail: "Confirm coverage & fees" },
    { icon: "RotateCcw", title: "Returns Information", detail: "Ask about store terms" },
    {
      icon: "ShieldCheck",
      title: "Secure Ordering",
      detail: "Personal support on WhatsApp",
    },
  ],
  categoryTitle: "Shop by category",
  categoryAction: "Shop now",
  footerDescription:
    "We bring you the latest mobile technology from top brands at the best prices.",
  newsletterTitle: "Newsletter",
  newsletterDescription:
    "Save your interest on this device. Email updates are not connected yet.",
  newsletterSuccess: "You’re on the list on this device.",
  chat: "Hi, I need help choosing a phone.",
  chatTitle: "Let’s find your next phone",
  chatMissing: "Our WhatsApp contact is being set up. Please check back soon.",
  cartTitle: "Your cart",
  cartEmpty: "Your next upgrade starts here.",
  cartDetail: "Explore the collection and save your favourites to your cart.",
  wishlistTitle: "Your wishlist",
  wishlistEmpty: "Keep your favourites close.",
  wishlistDetail: "The phones you save will appear here.",
  accountTitle: "A more personal way to shop",
  accountDescription:
    "No account needed. Get product advice and place your order directly with our team on WhatsApp.",
  searchTitle: "Find your next upgrade",
  searchLabel: "Search phones, brands and accessories",
  searchEmpty: "The product catalogue will be available in the next phase.",
  notFound: {
    eyebrow: "404 · CONNECTION LOST",
    title: "This page is out of range.",
    description: "Let’s get you back to something worth exploring.",
    action: "Back to home",
  },
  collectionTitle: "Something great is on the way.",
  collectionDescription:
    "We’re preparing our collection of smartphones and everyday essentials. In the meantime, explore the categories or talk to our team.",
};

export const promotions = [
 {title:"Big Savings on Top Brands",description:"Explore featured phones and find your next upgrade.",action:"Explore offers",to:"/deals",tone:"promo-purple",image:"/images/products/iphone-15-pro-max.jpg"},
 {title:"Everyday Accessories",description:"Chargers, cases, earbuds and more for your setup.",action:"Shop accessories",to:"/accessories",tone:"promo-blue",image:"/images/products/phone-accessories.jpg"},
 {title:"Trade-In & Save More",description:"Ask about exchanging your old device for your next favourite.",action:"Learn more",to:"/trade-in",tone:"promo-green",image:"/images/products/pixel-8-pro.jpg"}
];
