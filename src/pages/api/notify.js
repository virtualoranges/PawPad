// ... (previous setup code)

const message = `🚨 PAWPAD ALERT: ${tag.profiles.pet_name} was scanned!`;

const keyboard = {
  inline_keyboard: [
    [
      { text: "📍 View Map", url: `https://www.google.com/maps?q=${lat},${lng}` },
      { text: "📞 Call Finder", url: `tel:${finder_phone}` } // If finder provides phone
    ]
  ]
};




await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    chat_id: tag.profiles.telegram_chat_id, 
    text: message,
    reply_markup: keyboard 
  }),
});
