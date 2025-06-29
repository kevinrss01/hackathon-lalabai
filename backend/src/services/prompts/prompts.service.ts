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
      Note: This is plain text from the user, not HTML.
      """
      ${userQuery}
      """

      ---

      RETURN ONLY the plain text response, nothing else. No JSON, no quotes, no commentary, no markdown, no HTML, no code blocks, just the plain text response.
`;
  }

  getPromptToTransformAgentResponseToReadable(
    agentResponse: string,
    originalUserQuery: string
  ): string {
    return `
      ### TASK ###
      Transform the detailed travel agent response into a comprehensive, user-friendly travel guide formatted in HTML that helps the user prepare and execute their trip with confidence.

      ### CONTEXT ###
      Original User Query: """
      ${originalUserQuery}
      """

      ### INSTRUCTIONS ###
      1. **Output Format**: Generate clean, semantic HTML without any markdown
      2. **Be Comprehensive**: Provide ALL essential information for a stress-free trip
      3. **Prioritize Clarity**: Use HTML elements and CSS classes for structure
      4. **Include Actionable Links**: Provide direct booking links with proper <a> tags
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

      ### HTML FORMATTING REQUIREMENTS ###
      - Use <h2>, <h3>, <h4> for section headers with emojis
      - Use <ul> and <li> for bullet points
      - Use <strong> or <b> for critical information (prices, times, links)
      - Use <a href="URL" target="_blank"> for clickable links
      - Use <span> or <div> with emojis for warning icons
      - Use <p> tags for paragraphs and tips
      - Use <table>, <tr>, <td> for comparing options
      - Use proper semantic HTML5 elements
      - Do NOT use markdown syntax (no **, no ##, no - for lists)
      - Do NOT wrap the response in code blocks or backticks

      ### EXAMPLE TRANSFORMATION ###

      For a query about "cheap travel from Paris to London in 2 days":

      Output:
      <div>
        <p>🎉 <strong>Excellent timing!</strong> I've found several great options for your Paris to London trip in 2 days. Don't worry - this route is one of Europe's easiest international journeys, and I'll guide you through everything!</p>

        <h2>🚆 YOUR BEST TRAVEL OPTIONS</h2>

        <h3>1. Eurostar Train ⭐ RECOMMENDED</h3>
        <ul>
          <li>💰 <strong>Price</strong>: €52-78 (booking today) | €120-200 (last minute)</li>
          <li>⏰ <strong>Duration</strong>: 2h 15min direct</li>
          <li>📍 <strong>Route</strong>: Paris Gare du Nord → London St Pancras</li>
          <li>🔗 <strong>Book at</strong>: <a href="https://www.eurostar.com" target="_blank">eurostar.com</a></li>
          <li>✅ <strong>Pros</strong>: Fastest, city center to city center, comfortable, reliable</li>
          <li>❌ <strong>Cons</strong>: More expensive than bus, fixed departure times</li>
          <li>💡 <strong>Best for</strong>: Time-conscious travelers, business trips, comfort seekers</li>
        </ul>

        <h3>2. Bus (FlixBus/BlaBlaBus) 💸 BUDGET CHOICE</h3>
        <ul>
          <li>💰 <strong>Price</strong>: €25-35 | Sometimes as low as €15</li>
          <li>⏰ <strong>Duration</strong>: 7-9 hours (includes ferry crossing)</li>
          <li>📍 <strong>Route</strong>: Paris Bercy → London Victoria Coach Station</li>
          <li>🔗 <strong>Book at</strong>: <a href="https://www.flixbus.com" target="_blank">flixbus.com</a> or <a href="https://www.blablabus.com" target="_blank">blablabus.com</a></li>
          <li>✅ <strong>Pros</strong>: Very cheap, multiple daily departures, scenic ferry crossing</li>
          <li>❌ <strong>Cons</strong>: Long journey, less comfortable, possible delays</li>
          <li>💡 <strong>Best for</strong>: Budget travelers, flexible schedules, adventure seekers</li>
        </ul>

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

     RETURN ONLY the HTML formatted response. Make sure all links are real and functional with proper <a> tags. 
     Do NOT include any markdown syntax (no **, no ##, no [link](url) format).
     Do NOT wrap the response in code blocks or backticks.
     Do NOT include any meta-commentary.
     Output pure HTML that can be directly rendered.
`;
  }
}

export default PromptsService;
