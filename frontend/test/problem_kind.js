const assert = require('assert');

describe('Kind of problem Page', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/selecttype.html');
  });

  after(async function () {
    await page.close();
  });

  it('should contain kind of problem select description', async function () {
    let description = await page.$eval('.row h2', el => el.textContent);
    assert.ok(description.includes('Select the kind of problem'));
  });
});
