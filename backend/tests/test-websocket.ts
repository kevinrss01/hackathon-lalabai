import { SocketIOService } from '../src/services/socketio.service';

// Simuler l'envoi de messages à une conversation
const testWebSocket = async () => {
  const conversationId = process.argv[2] || 'test-conversation-123';
  const socketService = SocketIOService.getInstance();

  console.log(`Testing WebSocket for conversation: ${conversationId}`);

  // Attendre un peu pour que les clients se connectent
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Envoyer des messages de progression
  const progressMessages = [
    'Processing your request...',
    'Analyzing your query...',
    'Researching travel information...',
    'Preparing your personalized response...',
  ];

  for (const message of progressMessages) {
    console.log(`Sending progress: ${message}`);
    socketService.sendProgress(conversationId, message);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  // Envoyer la réponse finale
  const finalResponse = `Based on your travel preferences, I recommend visiting Paris in March 2024. 

Here are the top recommendations:

1. **Hotels**: Le Meurice (luxury), Hotel des Grands Boulevards (boutique)
2. **Attractions**: Eiffel Tower, Louvre Museum, Sacré-Cœur
3. **Weather**: Mild spring weather, 10-15°C average
4. **Events**: Paris Fashion Week, Spring festivals

Would you like more specific information about any of these recommendations?`;

  console.log('Sending final response...');
  socketService.sendFinalResponse(conversationId, finalResponse);

  console.log('Test completed!');
};

// Note: This won't work standalone, needs to be integrated with the server
console.log('This test needs to be run when the server is running');
console.log('Add this to your server.ts after socketIOService.initialize(server);');
console.log(`
// Test WebSocket
setTimeout(() => {
  const testConversationId = 'test-conversation-123';
  socketIOService.sendProgress(testConversationId, 'Test progress message');
  setTimeout(() => {
    socketIOService.sendFinalResponse(testConversationId, 'Test final response');
  }, 2000);
}, 5000);
`);

// Export pour utilisation
export { testWebSocket };
