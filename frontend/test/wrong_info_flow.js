/* eslint-disable max-len */
const assert = require('assert');

describe('Wrong Information Flow', function () {
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
        describe('Clicks on Wrong info button and is redirected to wronginfosearch page', function () {
          before(async function () {
            let welcomeBtns = await page.$$('.welcome-btn');
            await welcomeBtns[2].click();
            await page.waitForSelector('#searchresults');
          });

          it('should be on Wrong Information Search page', async function () {
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/wronginfosearch.html'
            );
          });

          it('should get more than 1 results', async function () {
            let results_count = await page.$$eval(
              '#searchresults .result',
              (elements) => elements.length
            );
            assert.ok(results_count > 1);
          });
          it('select second result and navigate to verify and edit and then to bug description', async function () {
            let results = await page.$$('#searchresults .result');
            await results[1].click();
            // await page.click('div.d-flex .btn.btn-primary');
            await page.evaluate(() => document.querySelectorAll('.result button')[1].click());
            await page.waitForSelector('table');
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/verifyedit.html');
            await page.waitForSelector('td input');
            await page.type('td input', 'London');
            // await page.click('.float-end button');
            await page.evaluate(() => document.querySelector('.d-grid button').click());
            await page.waitForSelector('.row.mb-4.mt-4 h2');
            current_url = new URL(await page.url());
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
        describe('Clicks on Wrong info button and is redirected to wronginforeverse page', function () {
          before(async function () {
            this.timeout(0);
            let welcomeBtns = await page.$$('.welcome-btn');
            await welcomeBtns[1].click();
            await page.waitForSelector('#searchresults', { timeout: 0 });
          });

          it('should be on Wrong Information reverse page', async function () {
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/wronginforeverse.html'
            );
          });

          it('should get more than 1 results', async function () {
            let results_count = await page.$$eval(
              '#searchresults .result',
              (elements) => elements.length
            );
            assert.ok(results_count > 1);
          });
          it('select second result and navigate to verify and edit and then to bug description', async function () {
            this.timeout(0);
            await page.waitForSelector('#searchresults', { timeout: 0 });

            let results = await page.$$('#searchresults .result');
            await results[1].click();
            await page.evaluate(() => document.querySelectorAll('.result button')[1].click());
            await page.waitForSelector('table');
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/verifyedit.html');

            await page.waitForSelector('td input');
            await page.type('td input', 'Taj');
            await page.evaluate(() => document.querySelector('.d-grid button').click());
            await page.waitForSelector('.row.mb-4.mt-4 h2', { timeout: 0 });
            current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/bugdescription.html'
            );
            //   let localStorage = await page.evaluate(() => localStorage.getItem('bug_data'));
            //   console.log(localStorage);
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

  describe('Using SearchById method option', function () {
    before(async function () {
      await page.waitForSelector('li.nav-item a[href="details.html"]');
      await page.click('li.nav-item a[href="details.html"]');
      await page.waitForSelector('input[type=edit]');
      await page.type('input[type=edit]', 'R1155956');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');
    });

    it('should be on details page', async function () {
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/details.html');
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
        it('should have 2 buttons to choose kind of problem', async function () {
          await page.waitForSelector('.welcome-btn');
          let welcomeBtns = await page.$$('.welcome-btn');
          assert.strictEqual(welcomeBtns.length, 2);
        });
        describe('Clicks on Wrong info button and is redirected to verifyedit page', function () {
          before(async function () {
            this.timeout(0);
            let welcomeBtns = await page.$$('.welcome-btn');
            await welcomeBtns[0].click();
            await page.waitForSelector('table');
          });

          it('should be on verify edit page', async function () {
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/verifyedit.html'
            );
          });

          it('navigate from verify and edit and then to bug description and then submit bug', async function () {
            this.timeout(0);
            let current_url = new URL(await page.url());
            assert.deepStrictEqual(current_url.pathname, '/verifyedit.html');

            await page.waitForSelector('td input');
            await page.type('td input', 'Taj');
            await page.evaluate(() => document.querySelector('.d-grid button').click());
            await page.waitForSelector('.row.mb-4.mt-4 h2', { timeout: 0 });
            current_url = new URL(await page.url());
            assert.deepStrictEqual(
              current_url.pathname,
              '/bugdescription.html'
            );
            //   let localStorage = await page.evaluate(() => localStorage.getItem('bug_data'));
            //   console.log(localStorage);
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
