export class PromptsService {
  constructor() {
    //
  }

  getPromptToTransformUserQueryToAgentPrompt(userQuery: string): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    return `
      ### TASK ###
      Transform the user's travel query into a structured third-person format for the travel agent system.

      ### INSTRUCTIONS ###
      1. Extract all travel-related information from the user's query
      2. Convert first-person statements to third-person (I/me → the user)
      3. Include the current date as context
      4. Identify and structure: origin location, destination, travel dates, preferences
      5. If information is missing, do NOT make assumptions - only include what's explicitly stated
      6. Maintain all specific details mentioned (street names, neighborhoods, time preferences, budget constraints)

      ### OUTPUT FORMAT ###
      Write the output as clear, declarative sentences in third person:
      - "The user lives in [location, with specific details if provided]."
      - "The user wants to travel to [destination]."
      - "The current date is [today's date]."
      - "The user wants to depart on [date and time if specified]."
      - Include any preferences mentioned (budget, transport mode, time of day, etc.)

      ### EXAMPLES ###

      Example 1:
      User Query: "I want to go to London. I live in Paris. I want to leave in two days in the morning. I want a cheaper travel."
      Output:
      """
      The user lives in Paris.
      The user wants to travel to London.
      The current date is ${currentDate}.
      The user wants to depart in two days in the morning.
      The user prefers cheaper travel options.
      """

      Example 2:
      User Query: "I'm in Berlin near Alexanderplatz and need to get to Amsterdam tomorrow afternoon. I prefer trains over flights."
      Output:
      """
      The user lives in Berlin, specifically near Alexanderplatz.
      The user wants to travel to Amsterdam.
      The current date is ${currentDate}.
      The user wants to depart tomorrow in the afternoon.
      The user prefers trains over flights.
      """

      Example 3:
      User Query: "Looking to travel from Barcelona to Rome next Friday. I'm staying at the Gothic Quarter. Budget is important but comfort too."
      Output:
      """
      The user lives in Barcelona, specifically in the Gothic Quarter.
      The user wants to travel to Rome.
      The current date is ${currentDate}.
      The user wants to depart next Friday.
      The user values both budget-friendly options and comfort.
      """

      ### USER QUERY TO TRANSFORM ###
      """
      ${userQuery}
      """

      ---

      RETURN ONLY the response nothing else, no json, no string, no quotes, no commentary, no markdown, no html, no code, no anything else, just the response.
`;
  }

  getPromptToTransformAgentResponseToReadable(
    agentResponse: string,
    originalUserQuery: string
  ): string {
    return `
      ### TASK ###
      Transform the detailed travel agent response into a comprehensive, user-friendly travel guide that helps the user prepare and execute their trip with confidence.

      ### CONTEXT ###
      Original User Query: """
      ${originalUserQuery}
      """

      ### INSTRUCTIONS ###
      1. **Be Comprehensive**: Provide ALL essential information for a stress-free trip
      2. **Prioritize Clarity**: Use clear sections and formatting for easy reference
      3. **Include Actionable Links**: Provide direct booking links and official websites
      4. **Add Preparation Details**: Help user prepare with checklists and tips
      5. **Personal & Reassuring Tone**: Use "you" language and reassuring phrases
      6. **Anticipate Concerns**: Address common travel worries proactively
      7. **Mobile-Friendly Format**: Structure for easy reading on phones

      ### REQUIRED SECTIONS ###

      **1. FRIENDLY OPENING**
      - Acknowledge their request enthusiastically
      - Quick summary of best options
      - Reassurance about the journey

      **2. TRAVEL OPTIONS** (Detailed comparison)
      For each option include:
      - 💰 Total cost (including potential hidden fees)
      - ⏰ Total journey time
      - 📍 Departure/arrival locations with addresses
      - 🔗 Direct booking link (actual URL)
      - ✅ Pros and ❌ Cons
      - 💡 Best for: (type of traveler)

      **3. BOOKING GUIDANCE**
      - Step-by-step booking tips
      - Best time to book
      - Cancellation policies
      - Price alerts/tracking suggestions

      **4. PREPARATION CHECKLIST**
      - 📄 Documents needed (passport, visas, tickets)
      - 👕 What to pack (weather-based)
      - 💱 Currency and payment tips
      - 📱 Mobile/internet connectivity
      - 🏥 Travel insurance recommendations

      **5. JOURNEY DAY LOGISTICS**
      - Getting to departure point (with time buffers)
      - Check-in procedures and timing
      - Security/customs tips
      - What to expect during journey
      - Arrival logistics and onward transport

      **6. DESTINATION ESSENTIALS**
      - 🌡️ Weather forecast and clothing tips
      - 🚇 Local transport options and apps
      - 💳 Payment methods accepted
      - 🔌 Power adapters needed
      - 📞 Emergency contacts
      - 🗺️ Offline maps recommendation

      **7. STRESS-REDUCING TIPS**
      - Common concerns addressed
      - Backup plans for delays
      - Local customs/etiquette
      - Safety tips
      - 24/7 help resources

      **8. HELPFUL RESOURCES**
      - Official tourism websites
      - Useful mobile apps
      - Community forums/groups
      - Real-time tracking tools

      ### FORMATTING REQUIREMENTS ###
      - Use clear section headers with emojis
      - Bullet points for scannable information
      - **Bold** for critical information (prices, times, links)
      - 🔗 Actual clickable links (not just website names)
      - ⚠️ Warning icons for important notices
      - ✨ Tips in friendly, encouraging tone
      - Tables for comparing multiple options
      - Expandable sections for detailed info (indicate with ▼)

      ### EXAMPLE TRANSFORMATION ###

      For a query about "cheap travel from Paris to London in 2 days":

      Output:
      """
      🎉 **Excellent timing!** I've found several great options for your Paris to London trip in 2 days. Don't worry - this route is one of Europe's easiest international journeys, and I'll guide you through everything!

      ## 🚆 **YOUR BEST TRAVEL OPTIONS**

      ### 1. **Eurostar Train** ⭐ RECOMMENDED
      - 💰 **Price**: €52-78 (booking today) | €120-200 (last minute)
      - ⏰ **Duration**: 2h 15min direct
      - 📍 **Route**: Paris Gare du Nord → London St Pancras
      - 🔗 **Book at**: [eurostar.com](https://www.eurostar.com)
      - ✅ **Pros**: Fastest, city center to city center, comfortable, reliable
      - ❌ **Cons**: More expensive than bus, fixed departure times
      - 💡 **Best for**: Time-conscious travelers, business trips, comfort seekers

      ### 2. **Bus** (FlixBus/BlaBlaBus) 💸 BUDGET CHOICE
      - 💰 **Price**: €25-35 | Sometimes as low as €15
      - ⏰ **Duration**: 7-9 hours (includes ferry crossing)
      - 📍 **Route**: Paris Bercy → London Victoria Coach Station
      - 🔗 **Book at**: [flixbus.com](https://www.flixbus.com) or [blablabus.com](https://www.blablabus.com)
      - ✅ **Pros**: Very cheap, multiple daily departures, scenic ferry crossing
      - ❌ **Cons**: Long journey, less comfortable, possible delays
      - 💡 **Best for**: Budget travelers, flexible schedules, adventure seekers

      ### 3. **Flight** ✈️
      - 💰 **Price**: €45-90 (budget airlines) + €15-50 (baggage)
      - ⏰ **Duration**: 1h 15min flight + 3-4 hours total (with airports)
      - 📍 **Routes**: CDG/Orly → Heathrow/Gatwick/Stansted
      - 🔗 **Book at**: [easyjet.com](https://www.easyjet.com), [ryanair.com](https://www.ryanair.com)
      - ✅ **Pros**: Quick flight time, multiple airlines
      - ❌ **Cons**: Airport hassles, baggage fees, not city center
      - 💡 **Best for**: Those with airline miles, specific flight preferences

      ## 📋 **BOOKING GUIDANCE**

      **🎯 Book RIGHT NOW for best prices!** Prices increase significantly 24-48 hours before travel.

      **Eurostar Booking Tips:**
      1. Choose "Standard" class for best value
      2. Morning departures (6:30-8:30) are often cheaper
      3. Create account for easy changes/cancellations
      4. Select seats in coach 5-8 for quieter journey
      5. "Flexi" tickets allow free changes (worth it if plans uncertain)

      **Cancellation Policies:**
      - Eurostar: Free cancellation up to 7 days before (standard tickets)
      - Buses: Usually €5 fee, some flexible tickets available
      - Flights: Varies by airline, often non-refundable

      ## ✅ **PRE-TRIP PREPARATION CHECKLIST**

      **Documents Required:**
      - [ ] Valid passport (check expiry date - needs 6 months validity)
      - [ ] Ticket confirmation (download to phone + print backup)
      - [ ] Travel insurance docs (recommended - from €15 on [revolut.com](https://www.revolut.com))
      - [ ] Hotel booking confirmation
      - [ ] Emergency contacts list

      **What to Pack:**
      - [ ] Weather: London will be 12-15°C, likely rainy - bring umbrella!
      - [ ] Power adapter (UK uses Type G plugs - buy at any electronics store €5)
      - [ ] Comfortable walking shoes (London involves lots of walking)
      - [ ] Light jacket/raincoat
      - [ ] Phone charger and power bank
      - [ ] Snacks for journey (save money vs. station prices)

      **Money Matters:**
      - 💱 Exchange rate: €1 = £0.85 (approximately)
      - 💳 Cards widely accepted, but have some cash (£20-50)
      - 🏧 ATMs available everywhere - better rates than exchange bureaus
      - 📱 Notify your bank of travel to avoid card blocks

      ## 🗓️ **JOURNEY DAY LOGISTICS**

      **Getting to Gare du Nord (for Eurostar):**
      - 🚇 Metro: Lines 4 & 5 (€2.10) - allow 45 minutes from central Paris
      - 🚕 Taxi/Uber: €15-25 from central Paris (20-30 minutes)
      - ⏰ **ARRIVE 45-60 MINUTES EARLY** for passport control

      **Eurostar Check-in Process:**
      1. Enter via main hall, follow "Départ/Departures" signs
      2. Scan ticket at gates (mobile or printed)
      3. French exit passport control (2-5 minutes)
      4. UK entry passport control (5-10 minutes)
      5. Security screening (like airport but keep liquids/shoes)
      6. Duty-free shopping area
      7. Board train 15 minutes before departure

      **During Journey:**
      - Free WiFi onboard (can be slow)
      - Café-bar in coaches 4 & 13
      - Toilets in every coach
      - Arrive London 1 hour ahead (UK time zone)

      ## 🇬🇧 **LONDON ARRIVAL & ESSENTIALS**

      **At St Pancras Station:**
      - No passport control (already done in Paris!)
      - Free WiFi to order Uber/check maps
      - Taxi rank outside (£10-30 to central hotels)
      - Direct Underground connections (Oyster card/contactless payment)

      **Getting Around London:**
      - 📱 Download: [Citymapper](https://citymapper.com) (essential for navigation)
      - 🚇 Transport: Use contactless payment (card/phone) on all transport
      - 💰 Daily cap: £8.10 for zones 1-2
      - 🚕 Uber works perfectly, Black cabs available everywhere

      **Stay Connected:**
      - 📶 EU roaming works but may have limits
      - 📱 Consider eSIM: [airalo.com](https://www.airalo.com) (from €5)
      - 📍 Free WiFi in most cafes, all McDonald's/Starbucks

      ## 🆘 **STRESS-FREE TRAVEL TIPS**

      **Common Worries Solved:**
      - ⏰ "What if I'm late?" → Eurostar allows boarding up to 2 minutes before departure
      - 🧳 "Luggage limits?" → Eurostar: 2 bags + 1 hand luggage, no weight limit!
      - 🤒 "Feel sick on transport?" → Eurostar is very smooth, sit facing forward
      - 📱 "Phone dies?" → Charging points at every Eurostar seat
      - 🌧️ "Bad weather?" → Eurostar runs in all weather, very rare cancellations

      **Emergency Contacts:**
      - 🚨 UK Emergency: 999 or 112
      - 📞 Eurostar: +44 343 218 6186
      - 🏥 NHS helpline: 111 (non-emergency medical)
      - 🇫🇷 French Embassy London: +44 20 7073 1000

      ## 📚 **HELPFUL RESOURCES**

      **Official Websites:**
      - [eurostar.com/service-updates](https://www.eurostar.com/service-updates) - Live travel info
      - [visitlondon.com](https://www.visitlondon.com) - Official tourism site
      - [tfl.gov.uk](https://www.tfl.gov.uk) - London transport

      **Useful Apps to Download:**
      - 🗺️ Citymapper - London navigation
      - 🚆 Eurostar app - Mobile tickets & updates
      - 💱 XE Currency - Live exchange rates
      - 🌤️ BBC Weather - Accurate UK weather
      - 🍴 OpenTable - Restaurant bookings

      **Community Help:**
      - r/london on Reddit - Local tips
      - [TripAdvisor London Forum](https://www.tripadvisor.com/ShowForum-g186338-i17-London_England.html)
      - Facebook: "Paris to London Travel Tips" group

      ---

      ✨ **You've got this!** This journey is straightforward and millions do it every year. Save this guide on your phone, and don't hesitate to ask station staff for help - they're very friendly. Have an amazing trip to London! 

      Need help with hotels, attractions, or specific London questions? Just ask! 🇬🇧
      """

      ### AGENT RESPONSE TO TRANSFORM ###
      """
      ${agentResponse}
      """

     ---

     RETURN ONLY the formatted response. Make sure all links are real and functional. Do not include any meta-commentary or markdown code blocks.
`;
  }
}

export default PromptsService;
