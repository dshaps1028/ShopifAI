const fs = require('fs');
const path = require('path');

describe('Order creation function-calling smoke test', () => {
  test('renderer includes draft_order_intent function and OpenAI call', () => {
    const rendererPath = path.join(__dirname, '..', 'renderer.js');
    const contents = fs.readFileSync(rendererPath, 'utf8');

    // Ensure the draft order intent schema and OpenAI function-calling helper are present.
    expect(contents).toMatch(/draft_order_intent/);
    expect(contents).toMatch(/openaiChatWithFunctions/);
    expect(contents).toMatch(/openaiDraftFunctions/);
  });
});
