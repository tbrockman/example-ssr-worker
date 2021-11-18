export class Example {
  async fetch() {
    return new Response(JSON.stringify({ text: 'example' }));
  }
}
