/* eslint-disable max-len */
const assert = require('assert');

describe('Wrong Result Flow', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/search.html');

  });

  after(async function () {
    await page.close();
  });
  describe('Using search method option', function () {
    before(async function () {
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
        describe('Clicks on Wrong Result button and is redirected to wrongresultsearch page', function () {
          before(async function () {
            let welcomeBtns = await page.$$('.welcome-btn');
            await welcomeBtns[0].click();
            await page.waitForSelector('#searchresults');
          });

          it('should be on Wrong Result Search page', async function () {
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/wrongresultsearch.html'
            );
          });

          it('should get more than 1 results', async function () {
            let results_count = await page.$$eval(
              '#searchresults .result',
              (elements) => elements.length
            );
            assert.ok(results_count > 1);
          });
          it('select second result and navigate to bug description and then submit feedback report', async function () {
            let results = await page.$$('#searchresults .result');
            await results[1].click();
            await page.evaluate(() => document.querySelectorAll('.result button')[1].click());
            await page.waitForSelector('.row.mb-4.mt-4 h2');
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/bugdescription.html'
            );
            await page.type('.form-group textarea', 'Thanks');
            await page.evaluate(() => document.querySelector('button.btn').click());
            await page.waitForSelector('table');
            current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/review.html');
            await page.waitForSelector('td input');
            await page.evaluate(() => document.querySelector('.d-grid button').click());
            await page.waitForSelector('#thank-you');
            current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/thankyou.html');
          });

          after(async function () {
            await page.goto('http://localhost:9999/search.html');
          });
        });

        after(async function () {
          await page.goto('http://localhost:9999/search.html');
        });
      });

      after(async function () {
        await page.goto('http://localhost:9999/search.html');
      });
    });

    after(async function () {
      await page.goto('http://localhost:9999/search.html');
    });
  });

  describe('Using reverse method option', function () {
    before(async function () {
      await page.waitForSelector('li.nav-item a[href="reverse.html"]');
      await page.click('li.nav-item a[href="reverse.html"]');
      await page.waitForSelector('input[name=lat]');
      await page.type('input[name=lat]', '27.1750090510034');
      await page.type('input[name=lon]', '78.04209025');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');
    });

    it('should be on reverse page', async function () {
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/reverse.html');
    });

    it('should get 1 result', async function () {
      let results_count = await page.$$eval(
        '#searchresults .result',
        (elements) => elements.length
      );
      assert.ok(results_count === 1);
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
        it('should have 3 buttons to choose kind of problem', async function () {
          await page.waitForSelector('.welcome-btn');
          let welcomeBtns = await page.$$('.welcome-btn');
          assert.strictEqual(welcomeBtns.length, 3);
        });
        describe('Clicks on Wrong result button and is redirected to wronginforeverse page', function () {
          before(async function () {
            this.timeout(0);
            let welcomeBtns = await page.$$('.welcome-btn');
            await welcomeBtns[0].click();
            await page.waitForSelector('#searchresults', { timeout: 0 });
          });

          it('should be on Wrong result reverse page', async function () {
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/wrongresultreverse.html'
            );
          });

          it('should get more than 1 results', async function () {
            await page.$$('#searchresults .result');
            let results_count = await page.$$eval(
              '#searchresults .result',
              (elements) => elements.length
            );
            assert.ok(results_count > 1);
          });
          it('select second result and navigate to bug description and then submit feedback report', async function () {
            this.timeout(0);
            await page.waitForSelector('#searchresults', { timeout: 0 });

            let results = await page.$$('#searchresults .result');
            await results[0].click();
            await page.evaluate(() => document.querySelectorAll('.result button')[0].click());
            await page.waitForSelector('.row.mb-4.mt-4 h2', { timeout: 0 });
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/bugdescription.html'
            );
            await page.type('.form-group textarea', 'Thanks');
            await page.evaluate(() => document.querySelector('button.btn').click());
            await page.waitForSelector('table');
            current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/review.html');
            await page.waitForSelector('td input');
            await page.evaluate(() => document.querySelector('.d-grid button').click());
            await page.waitForSelector('#thank-you');
            current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/thankyou.html');
          });

          after(async function () {
            await page.goto('http://localhost:9999/search.html');
          });
        });

        after(async function () {
          await page.goto('http://localhost:9999/search.html');
        });
      });

      after(async function () {
        await page.goto('http://localhost:9999/search.html');
      });
    });

    after(async function () {
      await page.goto('http://localhost:9999/search.html');
    });
  });
});
