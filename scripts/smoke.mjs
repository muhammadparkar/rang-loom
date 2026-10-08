import assert from 'node:assert/strict';

const origin = process.env.TEST_ORIGIN ?? 'http://localhost:3005';
const pages = [
  ['/', 'The art of'],
  ['/products/ira-textured-cushion', 'Ira Textured Cushion'],
  ['/products/noor-linen-bedding', 'Noor Linen Duvet Set'],
  ['/products/saanjh-woven-throw', 'Saanjh Woven Throw'],
  ['/products/aara-linen-curtains', 'Aara Linen Curtains'],
];
for (const [path, title] of pages) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes(title), `${path} contains its title`);
  assert.ok(html.includes('Shopping bag'), `${path} includes shopping controls`);
  assert.ok(!html.includes('Create Next App'), `${path} has no starter content`);
  if (path.startsWith('/products/')) {
    assert.ok(html.includes('Add to bag'), `${path} includes purchase control`);
    assert.ok(html.includes('Care guide'), `${path} includes care information`);
  }
}
for (const file of ['hero.jpg', 'living.jpg', 'bedroom.jpg', 'story.jpg']) {
  const response = await fetch(`${origin}/images/${file}`);
  assert.equal(response.status, 200, file);
  assert.ok(response.headers.get('content-type')?.startsWith('image/'), file);
  assert.ok((await response.arrayBuffer()).byteLength > 10000, `${file} is not empty`);
}
const missing = await fetch(`${origin}/products/not-a-product`);
// Streamed Next.js not-found responses can retain HTTP 200; the page must still render its 404 state.
assert.ok((await missing.text()).includes('This page could not be found'), 'Unknown product renders not found');
console.log('Passed: homepage, four product pages, shopping controls, images, and missing-product handling.');
