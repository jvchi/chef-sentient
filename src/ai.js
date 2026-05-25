const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '' // Empty string for relative path on Vercel

export async function getRecipeFromMistral(ingredientsArr, signal) {
  const response = await fetch(`${BACKEND_URL}/api/recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredientsArr }),
    signal
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipe from Chef Jed server.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // Return an async iterable to maintain compatibility with existing frontend logic
  return {
    async *[Symbol.asyncIterator]() {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep the last partial line

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const data = JSON.parse(line.trim().slice(6));
                yield data;
              } catch (e) {
                console.warn('Skipping malformed chunk:', line);
              }
            }
          }
        }

        // Final flush of any remains in the buffer
        if (buffer.trim().startsWith('data: ')) {
          try {
            const data = JSON.parse(buffer.trim().slice(6));
            yield data;
          } catch (e) {
            // Ignore final partial/malformed data
          }
        }
      } catch (error) {
        console.error('Stream read error:', error);
        throw error; // Let the caller (bodyMain.jsx) handle it
      } finally {
        reader.releaseLock();
      }
    }
  };
}