// Shahi Dhaba Restaurant Menu and Information

const RESTAURANT_INFO = {
  name: "Shahi Dhaba",
  tagline: "Asli Desi Swad",
  address: "123 Main Road, Near City Mall, Delhi - 110001",
  phone: "+91 98765 43210",
  timing: {
    weekdays: "11:00 AM - 11:00 PM",
    weekends: "10:00 AM - 12:00 AM"
  },
  delivery: {
    available: true,
    freeAbove: 500,
    deliveryCharge: 40,
    deliveryTime: "30-45 minutes",
    areas: ["2 km radius", "City Mall", "Green Park", "Sector 15", "Main Market"]
  }
};

const MENU = {
  starters: [
    { name: "Paneer Tikka", price: 220, veg: true, bestseller: true, description: "Soft paneer marinated in spices, grilled in tandoor" },
    { name: "Chicken Tikka", price: 280, veg: false, bestseller: true, description: "Juicy chicken pieces marinated and grilled" },
    { name: "Veg Manchurian", price: 180, veg: true, bestseller: false, description: "Crispy vegetable balls in tangy sauce" },
    { name: "Fish Amritsari", price: 320, veg: false, bestseller: false, description: "Crispy fried fish with special masala" },
    { name: "Hara Bhara Kabab", price: 160, veg: true, bestseller: false, description: "Healthy spinach and peas kabab" },
    { name: "Seekh Kabab", price: 260, veg: false, bestseller: true, description: "Minced mutton kabab from tandoor" }
  ],
  mainCourse: [
    { name: "Dal Makhani", price: 220, veg: true, bestseller: true, description: "Creamy black dal slow-cooked overnight" },
    { name: "Butter Chicken", price: 320, veg: false, bestseller: true, description: "Tender chicken in rich tomato-butter gravy" },
    { name: "Paneer Butter Masala", price: 260, veg: true, bestseller: true, description: "Soft paneer in creamy tomato gravy" },
    { name: "Kadhai Chicken", price: 300, veg: false, bestseller: false, description: "Spicy chicken with capsicum and onions" },
    { name: "Shahi Paneer", price: 240, veg: true, bestseller: false, description: "Paneer in rich cashew and cream gravy" },
    { name: "Mutton Rogan Josh", price: 380, veg: false, bestseller: true, description: "Kashmiri style aromatic mutton curry" },
    { name: "Chole Bhature", price: 160, veg: true, bestseller: true, description: "Spicy chickpeas with fried bread" },
    { name: "Mix Veg", price: 180, veg: true, bestseller: false, description: "Seasonal vegetables in mild gravy" }
  ],
  breads: [
    { name: "Butter Naan", price: 50, veg: true },
    { name: "Garlic Naan", price: 60, veg: true, bestseller: true },
    { name: "Laccha Paratha", price: 55, veg: true },
    { name: "Tandoori Roti", price: 30, veg: true },
    { name: "Missi Roti", price: 40, veg: true },
    { name: "Stuffed Kulcha", price: 70, veg: true }
  ],
  rice: [
    { name: "Jeera Rice", price: 140, veg: true },
    { name: "Veg Biryani", price: 200, veg: true, bestseller: true },
    { name: "Chicken Biryani", price: 280, veg: false, bestseller: true },
    { name: "Mutton Biryani", price: 340, veg: false },
    { name: "Plain Rice", price: 100, veg: true }
  ],
  beverages: [
    { name: "Lassi (Sweet/Salt)", price: 60, veg: true, bestseller: true },
    { name: "Masala Chaas", price: 40, veg: true },
    { name: "Fresh Lime Soda", price: 50, veg: true },
    { name: "Mango Shake", price: 90, veg: true },
    { name: "Cold Coffee", price: 80, veg: true }
  ],
  desserts: [
    { name: "Gulab Jamun (2 pcs)", price: 60, veg: true, bestseller: true },
    { name: "Rasmalai (2 pcs)", price: 80, veg: true },
    { name: "Kulfi", price: 70, veg: true },
    { name: "Gajar Ka Halwa", price: 90, veg: true, bestseller: true }
  ],
  combos: [
    { name: "Thali Veg", price: 250, veg: true, description: "Dal, Sabzi, Rice, 2 Roti, Salad, Sweet", bestseller: true },
    { name: "Thali Non-Veg", price: 350, veg: false, description: "Chicken Curry, Rice, 2 Roti, Salad, Sweet", bestseller: true },
    { name: "Couple Combo", price: 599, veg: true, description: "2 Starters, 2 Main Course, 4 Naan, 2 Desserts" },
    { name: "Family Pack (4 persons)", price: 999, veg: true, description: "3 Starters, 3 Main Course, 8 Roti, Rice, Desserts" }
  ]
};

const SPECIAL_OFFERS = [
  { name: "Lunch Special", discount: "20% off", timing: "12 PM - 3 PM", days: "Monday to Friday" },
  { name: "Happy Hours", discount: "Buy 1 Get 1 on Lassi", timing: "4 PM - 6 PM", days: "All days" },
  { name: "Weekend Family Feast", discount: "15% off on orders above ₹1000", timing: "All day", days: "Saturday & Sunday" }
];

function getFullMenu() {
  let menuText = "🍽️ *SHAHI DHABA - FULL MENU* 🍽️\n\n";
  
  const categories = [
    { key: 'starters', emoji: '🥗', name: 'STARTERS' },
    { key: 'mainCourse', emoji: '🍛', name: 'MAIN COURSE' },
    { key: 'breads', emoji: '🫓', name: 'BREADS' },
    { key: 'rice', emoji: '🍚', name: 'RICE' },
    { key: 'beverages', emoji: '🥤', name: 'BEVERAGES' },
    { key: 'desserts', emoji: '🍮', name: 'DESSERTS' },
    { key: 'combos', emoji: '🎁', name: 'SPECIAL COMBOS' }
  ];

  categories.forEach(cat => {
    menuText += `${cat.emoji} *${cat.name}*\n`;
    MENU[cat.key].forEach(item => {
      const vegIcon = item.veg ? '🟢' : '🔴';
      const star = item.bestseller ? '⭐' : '';
      menuText += `${vegIcon} ${item.name} - ₹${item.price} ${star}\n`;
    });
    menuText += '\n';
  });

  menuText += "🟢 = Veg | 🔴 = Non-Veg | ⭐ = Bestseller";
  return menuText;
}

function getRestaurantInfo() {
  const info = RESTAURANT_INFO;
  return `🏪 *${info.name}*
_${info.tagline}_

📍 *Address:* ${info.address}
📞 *Phone:* ${info.phone}

⏰ *Timing:*
• Weekdays: ${info.timing.weekdays}
• Weekends: ${info.timing.weekends}

🛵 *Delivery:*
• Free delivery on orders above ₹${info.delivery.freeAbove}
• Delivery charge: ₹${info.delivery.deliveryCharge}
• Time: ${info.delivery.deliveryTime}
• Areas: ${info.delivery.areas.join(', ')}`;
}

function getOffers() {
  let offerText = "🎉 *SPECIAL OFFERS* 🎉\n\n";
  SPECIAL_OFFERS.forEach((offer, index) => {
    offerText += `${index + 1}. *${offer.name}*\n`;
    offerText += `   💰 ${offer.discount}\n`;
    offerText += `   ⏰ ${offer.timing}\n`;
    offerText += `   📅 ${offer.days}\n\n`;
  });
  return offerText;
}

function searchMenu(query) {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  Object.keys(MENU).forEach(category => {
    MENU[category].forEach(item => {
      if (item.name.toLowerCase().includes(searchTerm) || 
          (item.description && item.description.toLowerCase().includes(searchTerm))) {
        results.push({ ...item, category });
      }
    });
  });
  
  return results;
}

function getBestsellers() {
  const bestsellers = [];
  Object.keys(MENU).forEach(category => {
    MENU[category].forEach(item => {
      if (item.bestseller) {
        bestsellers.push({ ...item, category });
      }
    });
  });
  return bestsellers;
}

function getVegItems() {
  const vegItems = [];
  Object.keys(MENU).forEach(category => {
    MENU[category].forEach(item => {
      if (item.veg) {
        vegItems.push({ ...item, category });
      }
    });
  });
  return vegItems;
}

function getNonVegItems() {
  const nonVegItems = [];
  Object.keys(MENU).forEach(category => {
    MENU[category].forEach(item => {
      if (!item.veg) {
        nonVegItems.push({ ...item, category });
      }
    });
  });
  return nonVegItems;
}

module.exports = {
  RESTAURANT_INFO,
  MENU,
  SPECIAL_OFFERS,
  getFullMenu,
  getRestaurantInfo,
  getOffers,
  searchMenu,
  getBestsellers,
  getVegItems,
  getNonVegItems
};
