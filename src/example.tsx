export class Example {

  state: any

  async fetch() {
    return new Response(JSON.stringify({ text: 'example' }));
  }
}
