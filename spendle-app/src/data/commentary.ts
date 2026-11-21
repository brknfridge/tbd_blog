/** One line is picked from the highest-priority group that matches the game. */
export const COMMENTARY = {
  over: [
    "You shop like everything comes with airport pricing.",
    "Inflation called. Even it's impressed.",
    "Your wallet is safer than your imagination.",
    "You've priced everything like it's being sold at a five-star hotel.",
    "You think every shop is in South Bombay.",
  ],
  under: [
    "Your brain is still shopping in 2016.",
    "Someone needs to tell you about inflation.",
    "You have champagne taste and 2012 price expectations.",
    "Please don't volunteer to handle the household budget.",
    "Your price expectations need a software update.",
  ],
  excellent: [
    "You know your MRPs better than your own passwords.",
    "Blinkit should hire you.",
    "The price tag fears you.",
    "Your shopping instincts are suspiciously good.",
    "You're one receipt away from becoming a pricing analyst.",
  ],
  poor: [
    "Have you ever bought anything yourself?",
    "Your understanding of money is purely theoretical.",
    "You and reality have different price lists.",
    "Maybe start checking receipts.",
    "Your calculator deserves better.",
  ],
  groceryNotLuxury: [
    "You know your Maggi, not your Margiela.",
    "Kirana store expertise. Luxury showroom confusion.",
    "Your pantry knowledge is premium. Your luxury knowledge isn't.",
    "You could run a supermarket. Maybe not a boutique.",
    "Your grocery instincts are elite. Your luxury instincts need financing.",
  ],
  luxuryNotGrocery: [
    "You know Rolex prices but not the price of butter.",
    "Your priorities are showing. So is your bank balance.",
    "Luxury fluent. Grocery illiterate.",
    "You know the price of a Birkin, but not breakfast.",
  ],
  oneOffNotGrocery: [
    "Can price a Porsche. Can't price a packet of chips.",
    "You know the cost of a car but not a chocolate bar.",
    "Big purchases? Sorted. Daily necessities? Not so much.",
  ],
  balanced: [
    "A little overpriced, a little underpriced. Perfectly confused.",
    "You live somewhere between a supermarket and a showroom.",
    "You know some prices. The others know you don't.",
    "Your shopping instincts are a mixed bag.",
  ],
} as const;

export type CommentaryGroup = keyof typeof COMMENTARY;
