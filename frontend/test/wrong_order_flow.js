/* eslint-disable max-len */
const assert = require('assert');

describe('Wrong Order Flow', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/search.html');
    await page.waitForSelector('input[name=q]');
    await page.type('input[name=q]', 'City of London');
    await page.click('button[type=submit]');
    await page.waitForSelector('#searchresults');
  });

  it('should be on Search page', async function () {
    let current_url = new URL(await page.url());
    assert.deepStrictEqual(current_url.pathname, '/search.html');
  });

  it('should get more than 1 results', async function () {
    let results_count = await page.$$eval(
      '#searchresults .result',
      (elements) => elements.length
    );
    assert.ok(results_count > 1);
  });

  describe('Clicks on Want to report a feedback for the result? and get to kind of problem page', function () {
    before(async function () {
      await page.evaluate(() => document.querySelector('.d-flex button.btn').click());
      await page.waitForSelector('.welcome-btn');
    });

    it('should be on Kind of problem page', async function () {
      let description = await page.$eval('.row h2', (el) => el.textContent);
      assert.ok(description.includes('Select the kind of problem'));
    });

    describe('On kind of problem page', function () {
      it('should have 4 buttons to choose kind of problem', async function () {
        await page.waitForSelector('.welcome-btn');
        let welcomeBtns = await page.$$('.welcome-btn');
        assert.strictEqual(welcomeBtns.length, 4);
      });

      describe('Clicks on Wrong order button and is redirected to wrongordersearch page', function () {
        before(async function () {
          let welcomeBtns = await page.$$('.welcome-btn');
          await welcomeBtns[1].click();
          await page.waitForSelector('#searchresults');
        });

        it('should be on Wrong Order page', async function () {
          let current_url = new URL(await page.url());
          assert.deepStrictEqual(
            current_url.pathname,
            '/wrongordersearch.html'
          );
        });

        it('should get more than 1 results', async function () {
          let results_count = await page.$$eval(
            '#searchresults .result',
            (elements) => elements.length
          );
          assert.ok(results_count > 1);
        });

        it('select second result and navigate to bug description page', async function () {
          let results = await page.$$('#searchresults .result');
          await results[1].click();
          // await page.click('div.d-flex .btn.btn-primary');
          await page.evaluate(() => document.querySelector('div.d-flex .btn.btn-primary').click());
          await page.waitForSelector('.row.mb-4.mt-4 h2');
          let current_url = new URL(await page.url());
          assert.deepStrictEqual(current_url.pathname, '/bugdescription.html');
          await page.type('.form-group textarea', 'Thanks');
          await page.evaluate(() => document.querySelector('button.btn').click());
          await page.waitForSelector('#thank-you');
          current_url = new URL(await page.url());
          assert.deepStrictEqual(current_url.pathname, '/thankyou.html');
        });
      });
    });
  });

  after(async function () {
    await page.close();
  });
});
