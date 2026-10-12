// Add only store-approved policy copy here. Empty policies remain visibly pending.
export const policies = {
  delivery: { approved: false, sections: [] },
  warranty: { approved: false, sections: [] },
  terms: { approved: false, sections: [] },
  privacy: { approved: false, sections: [] },
};

export const faqs = [
  { category: "Shopping", question: "Are these the final products and prices?", answer: "This is a sample catalogue. Product models, prices, photographs and availability must be confirmed by the store before an order is agreed." },
  { category: "Shopping", question: "How do I compare products?", answer: "Choose Compare on a product card or detail page. You can select up to three products, review them side by side, and show only the rows that differ." },
  { category: "Ordering", question: "How do I place an order?", answer: "Choose a product's storage and colour, then use Order on WhatsApp for a single item. For multiple items, add them to the cart, enter your delivery location and choose Order All on WhatsApp. Review and send the message in WhatsApp. Adding to the cart does not place an order or take a payment." },
  { category: "Ordering", question: "Why is WhatsApp checkout unavailable?", answer: "The store's verified WhatsApp number has not been added yet. You can continue browsing and preparing your shortlist while contact details are being confirmed." },
  { category: "Delivery & support", question: "What are the delivery fees and times?", answer: "Delivery coverage, fees and estimates are awaiting store confirmation. Ask for the total cost and delivery estimate for your location before confirming an order." },
  { category: "Delivery & support", question: "What is the returns or warranty policy?", answer: "Approved returns and warranty terms have not yet been supplied. Confirm eligibility, time limits, exclusions and the support process with the store before purchasing." },
  { category: "Delivery & support", question: "Can I trade in my current phone?", answer: "You can prepare a trade-in enquiry describing your device. The store must confirm whether trade-ins are available and assess eligibility and value. The website does not provide a valuation or guarantee acceptance." },
  { category: "Your data", question: "Where are my cart and favourites saved?", answer: "Your cart, wishlist, comparison list and recently viewed products are saved in this browser when storage is available. They do not sync between devices. You can clear saved data from the Privacy page." },
  { category: "Your data", question: "Does the newsletter form send my email anywhere?", answer: "The current form stores the email and submission date on this device only. It is not connected to a mailing service and does not subscribe you to email updates." },
];

export const servicePages = {
  "/about": { title: "About MobiStore", eyebrow: "YOUR WORLD, CONNECTED", intro: "A simpler way to explore your next device.", sections: [
    ["Explore at your own pace", "Browse phones and everyday accessories, save a shortlist and compare your favourites in one place."],
    ["A conversation before a commitment", "Prepare a product enquiry, then confirm the exact model, availability, price and delivery arrangements with the store."],
    ["Built for your next upgrade", "This storefront is currently a preview using sample inventory. Verified store details and the live product collection will be added before launch."],
  ] },
  "/delivery": { title: "Delivery & returns", eyebrow: "PLAN YOUR ORDER", intro: "Know what to confirm before your order is agreed.", policy: "delivery", sections: [
    ["Delivery to your location", "Ask the store to confirm coverage for your town or city, the delivery fee and the estimated arrival window. No delivery date is promised by this preview."],
    ["Before accepting your order", "Confirm the exact product, condition, included accessories and the full payable amount with the store."],
    ["Returns and order issues", "The approved returns policy is awaiting confirmation. Ask about eligibility, deadlines, product-condition requirements and the contact process before purchasing."],
  ] },
  "/warranty": { title: "Warranty & product support", eyebrow: "SUPPORT FOR YOUR DEVICE", intro: "Get the coverage details for the product you choose.", policy: "warranty", sections: [
    ["Confirm the coverage", "Warranty duration, provider and eligibility have not been verified for these sample products. Request the terms for the exact model and condition you intend to buy."],
    ["Preparing a support enquiry", "Have the product name, purchase reference and a clear description of the issue ready. Do not include passwords, payment card details or device unlock codes."],
    ["Next steps", "The store must confirm its support contact and any inspection, repair or replacement process. This preview does not promise an outcome or turnaround time."],
  ] },
  "/terms": { title: "Terms & conditions", eyebrow: "STORE INFORMATION", intro: "Store terms are awaiting approval.", policy: "terms", sections: [
    ["Current storefront status", "This website currently displays sample products and prices. The cart and enquiry tools help you prepare a message; they do not record an accepted order or process a payment."],
    ["Terms before launch", "The store has not supplied its final purchase, payment, cancellation, delivery and returns terms. Those approved terms will be published here before live ordering is introduced."],
  ] },
};
