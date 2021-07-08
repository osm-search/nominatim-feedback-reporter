const assert = require('assert');

describe('Simple Feedback Flow', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/welcome.html');
  });

  after(async function () {
    await page.close();
  });

  // eslint-disable-next-line max-len
  it('should contain 4 options to navigate and redirect to bugdescription page on selecting Any other Feedback option', async function () {
    let welcomeBtns = await page.$$('.welcome-btn');
    assert.strictEqual(welcomeBtns.length, 4);
    await welcomeBtns[3].click();

    await page.waitForSelector('.row.mb-4.mt-4 h2');
    let current_url = new URL(await page.url());
    assert.deepStrictEqual(current_url.pathname, '/bugdescription.html');
  });
});
