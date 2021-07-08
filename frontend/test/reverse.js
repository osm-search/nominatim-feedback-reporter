const assert = require('assert');

describe('Reverse Page', function () {
  let page;

  describe('With search', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/wronginforeverse.html');
      await page.waitForSelector('.search-section');
      await page.type('input[name=lat]', '27.1750090510034');
      await page.type('input[name=lon]', '78.04209025');
      await page.click('button[type=submit]');
    });

    after(async function () {
      await page.close();
    });

    it('should return more than one result', async function () {
      await page.waitForSelector('#searchresults');

      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);
      assert.ok(results_count > 1);
    });

    it('should display a map', async function () {
      await page.waitForSelector('#searchresults');

      await page.waitForSelector('#map');
      assert.equal((await page.$$('#map')).length, 1);
    });

  });
});
