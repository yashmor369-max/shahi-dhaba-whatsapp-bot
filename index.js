// Shahi Dhaba WhatsApp AI Chatbot
// Complete working code - No errors

const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const {
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
} = require('./menu');

// Initialize Express App
const app = express();
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Store conversation history for each user
const conversationHistory = new Map();

// WhatsApp API Configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'shahi_dhaba_verify_token_2024';

// System prompt for AI
const SYSTEM_PROMPT = `You are a friendly WhatsApp chatbot for "Shahi Dhaba" restaurant. Your name is "Shahi Bot" 🤖

PERSONALITY:
- Be warm, friendly, and helpful like a good waiter
- Use Hindi-English mix (Hinglish) naturally
- Use relevant food emojis 🍛🥗🍚
- Keep responses concise for WhatsApp (under 300 words)
- Be enthusiastic about food!

RESTAURANT INFO:
${JSON.stringify(RESTAURANT_INFO, null, 2)}

MENU DATA:
${JSON.stringify(MENU, null, 2)}

SPECIAL OFFERS:
${JSON.stringify(SPECIAL_OFFERS, null, 2)}

YOUR CAPABILITIES:
1. Share menu and prices
2. Recommend dishes based on preferences (veg/non-veg, spicy/mild, budget)
3. Explain dishes and ingredients
4. Share restaurant timing, location, delivery info
5. Tell about current offers and combos
6. Help with order-related queries
7. Handle complaints politely and professionally

IMPORTANT RULES:
- Always mention prices in ₹ (Rupees)
- Recommend bestsellers when asked for suggestions
- For orders, ask them to call the restaurant or say "Order confirmed, we'll call you!"
- If asked about something not on menu, politely say it's not available
- For complaints, apologize and ask them to call the manager
- Never make up dishes or prices not in the menu
- Be helpful but don't be pushy

GREETING (use variations):
- "Namaste! 🙏 Shahi Dhaba mein aapka swagat hai!"
- "Hello ji! Main Shahi Bot hoon, aapki kya seva kar sakta hoon?"

Always end with a helpful question or suggestion.`;

// Function to get AI response
async function getAIResponse(userMessage, phoneNumber) {
  try {
    // Get or create conversation history for this user
    if (!conversationHistory.has(phoneNumber)) {
      conversationHistory.set(phoneNumber, []);
    }
    
    const history = conversationHistory.get(phoneNumber);
    
    // Add user message to history
    history.push({
      role: "user",
      content: userMessage
    });

    // Keep only last 10 messages to save tokens
    const recentHistory = history.slice(-10);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...recentHistory
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response to history
    history.push({
      role: "assistant",
      content: aiResponse
    });

    // Update stored history
    conversationHistory.set(phoneNumber, history);

    return aiResponse;

  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    
    // Fallback responses based on keywords
    return getFallbackResponse(userMessage);
  }
}

// Fallback response function (when AI fails)
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('menu') || lowerMessage.includes('khana') || lowerMessage.includes('food')) {
    return getFullMenu();
  }
  
  if (lowerMessage.includes('offer') || lowerMessage.includes('discount') || lowerMessage.includes('deal')) {
    return getOffers();
  }
  
  if (lowerMessage.includes('timing') || lowerMessage.includes('time') || lowerMessage.includes('kab') || lowerMessage.includes('open')) {
    return getRestaurantInfo();
  }
  
  if (lowerMessage.includes('address') || lowerMessage.includes('location') || lowerMessage.includes('kahan')) {
    return `📍 *Shahi Dhaba Location*\n\n${RESTAURANT_INFO.address}\n\n📞 Call: ${RESTAURANT_INFO.phone}`;
  }
  
  if (lowerMessage.includes('delivery') || lowerMessage.includes('home')) {
    return `🛵 *Delivery Info*\n\n✅ Home delivery available!\n⏱️ Time: 30-45 minutes\n💰 Free above ₹500\n📞 Order: ${RESTAURANT_INFO.phone}`;
  }
  
  if (lowerMessage.includes('veg')) {
    const vegItems = getVegItems();
    let response = "🟢 *VEG ITEMS*\n\n";
    vegItems.slice(0, 10).forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
    });
    response += "\n_Aur bhi bahut kuch hai! 'menu' type karo_";
    return response;
  }
  
  if (lowerMessage.includes('non-veg') || lowerMessage.includes('nonveg') || lowerMessage.includes('chicken') || lowerMessage.includes('mutton')) {
    const nonVegItems = getNonVegItems();
    let response = "🔴 *NON-VEG ITEMS*\n\n";
    nonVegItems.forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
    });
    return response;
  }
  
  if (lowerMessage.includes('best') || lowerMessage.includes('popular') || lowerMessage.includes('recommend')) {
    const bestsellers = getBestsellers();
    let response = "⭐ *BESTSELLERS*\n\n";
    bestsellers.forEach(item => {
      const vegIcon = item.veg ? '🟢' : '🔴';
      response += `${vegIcon} ${item.name} - ₹${item.price}\n`;
    });
    return response;
  }
  
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
    return `🙏 *Namaste! Shahi Dhaba mein aapka swagat hai!*

Main Shahi Bot hoon, aapki madad ke liye hazir! 😊

Aap mujhse pooch sakte ho:
• 📋 "Menu dikhao"
• 🎁 "Kya offers hain?"
• ⏰ "Timing kya hai?"
• 📍 "Address batao"
• 🛵 "Delivery available hai?"
• ⭐ "Best dishes konsi hain?"

Bataiye, kya chahiye aapko? 🍛`;
  }

  // Default response
  return `🙏 Shahi Dhaba mein aapka swagat hai!

Main samajh nahi paaya. Ye try karo:
• "Menu" - poora menu dekhne ke liye
• "Offers" - special deals ke liye
• "Timing" - restaurant timing
• "Address" - location jaanne ke liye
• "Bestsellers" - popular dishes

Ya seedha call karo: ${RESTAURANT_INFO.phone} 📞`;
}

// Send WhatsApp Message Function
async function sendWhatsAppMessage(to, message) {
  try {
    // Split long messages (WhatsApp limit is 4096 characters)
    const maxLength = 4000;
    const messages = [];
    
    if (message.length > maxLength) {
      // Split by newlines to keep formatting
      const lines = message.split('\n');
      let currentChunk = '';
      
      for (const line of lines) {
        if ((currentChunk + line + '\n').length > maxLength) {
          messages.push(currentChunk.trim());
          currentChunk = line + '\n';
        } else {
          currentChunk += line + '\n';
        }
      }
      if (currentChunk.trim()) {
        messages.push(currentChunk.trim());
      }
    } else {
      messages.push(message);
    }

    // Send each chunk
    for (const msg of messages) {
      await axios({
        method: 'POST',
        url: `[graph.facebook.com](https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages)`,
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: msg }
        }
      });
      
      // Small delay between messages
      if (messages.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`✅ Message sent to ${to}`);
    return true;

  } catch (error) {
    console.error('❌ WhatsApp Send Error:', error.response?.data || error.message);
    return false;
  }
}

// Webhook Verification (GET request from Meta)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification attempt:', { mode, token });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook Message Handler (POST request from Meta)
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    // Check if this is a WhatsApp message
    if (body.object === 'whatsapp_business_account') {
      
      // Process each entry
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          
          const value = change.value;
          
          // Check for incoming messages
          if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const from = message.from; // Sender's phone number
            const messageType = message.type;
            
            console.log(`📩 New message from ${from}`);

            let userMessage = '';

            // Handle different message types
            if (messageType === 'text') {
              userMessage = message.text.body;
            } else if (messageType === 'button') {
              userMessage = message.button.text;
            } else if (messageType === 'interactive') {
              if (message.interactive.type === 'button_reply') {
                userMessage = message.interactive.button_reply.title;
              } else if (message.interactive.type === 'list_reply') {
                userMessage = message.interactive.list_reply.title;
              }
            } else {
              // For images, audio, video, etc.
              userMessage = "I received a media file";
            }

            console.log(`💬 Message content: ${userMessage}`);

            // Get AI response
            const aiResponse = await getAIResponse(userMessage, from);

            // Send response back
            await sendWhatsAppMessage(from, aiResponse);
          }
        }
      }

      // Always respond with 200 OK to Meta
      res.sendStatus(200);
      
    } else {
      res.sendStatus(404);
    }

  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.sendStatus(500);
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Shahi Dhaba Bot</title></head>
      <body style="font-family: Arial; padding: 40px; background: #f0f0f0;">
        <h1>🍛 Shahi Dhaba WhatsApp Bot</h1>
        <p style="color: green; font-size: 20px;">✅ Server is running!</p>
        <p>Webhook URL: <code>${req.protocol}://${req.get('host')}/webhook</code></p>
        <hr>
        <h3>Status:</h3>
        <ul>
          <li>WhatsApp Token: ${WHATSAPP_TOKEN ? '✅ Set' : '❌ Not set'}</li>
          <li>Phone Number ID: ${PHONE_NUMBER_ID ? '✅ Set' : '❌ Not set'}</li>
          <li>OpenAI Key: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}</li>
        </ul>
      </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🍛 SHAHI DHABA WHATSAPP BOT 🍛      ║
╠════════════════════════════════════════╣
║  Server running on port ${PORT}            ║
║  Ready to receive messages!            ║
╚════════════════════════════════════════╝
  `);
});
