const assert = require('assert');

describe('Wrong Order Flow', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/welcome.html');
    let welcomeBtns = await page.$$('.welcome-btn');
    await welcomeBtns[1].click();
    await page.waitForSelector('.search-section');

  });

  after(async function () {
    await page.close();
  });

  describe('Search City of London', function () {
    before(async function () {
      await page.type('input[name=q]', 'City of London');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');

    });

    it('should be on Wrong Order page', async function () {
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/wrongordersearch.html');
    });

    it('should get more than 1 results', async function () {
      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);
      assert.ok(results_count > 1);
    });

    it('select second result and navigate to bug description page', async function () {
      let results = await page.$$('#searchresults .result');
      await results[1].click();
      // await page.click('div.d-flex .btn.btn-primary');
      await page.evaluate(()=>document.querySelector('div.d-flex .btn.btn-primary').click());
      await page.waitForSelector('.row.mb-4.mt-4 h2');
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/bugdescription.html');
    });
  });

});
