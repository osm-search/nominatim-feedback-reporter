const assert = require('assert');

describe('Wrong Result Flow', function () {
  let page;

  before(async function () {
    page = await browser.newPage();

    await page.goto('http://localhost:9999/welcome.html');
    let welcomeBtns = await page.$$('.welcome-btn');
    await welcomeBtns[0].click();
    await page.waitForSelector('.search-section');

  });

  after(async function () {
    await page.close();
  });

  describe('Select Search option and Search City of London', function () {
    before(async function () {
      let welcomeBtns = await page.$$('.welcome-btn');
      await welcomeBtns[0].click();
      await page.waitForSelector('input[name=q]');

      await page.type('input[name=q]', 'City of London');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');

    });

    after(async function () {
      await page.goto('http://localhost:9999/welcome.html');
      let welcomeBtns = await page.$$('.welcome-btn');
      await welcomeBtns[0].click();
      page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    it('should be on Wrong Result Search page', async function () {
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/wrongresultsearch.html');
    });

    it('should get more than 1 results', async function () {
      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);
      assert.ok(results_count > 1);
    });

    // eslint-disable-next-line max-len
    it('select second result and navigate to bug description', async function () {
      let results = await page.$$('#searchresults .result');
      await results[1].click();
      // await page.click('div.d-flex .btn.btn-primary');
      await page.evaluate(()=>document.querySelector('div.d-flex .btn.btn-primary').click());
      await page.waitForSelector('.row.mb-4.mt-4 h2');
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/bugdescription.html');
    });
  });

  describe('Select reverse option', function () {
    before(async function () {
      this.timeout(0);
      let welcomeBtns = await page.$$('.welcome-btn');
      await welcomeBtns[1].click();

      await page.waitForSelector('input[name=lat]');
      await page.type('input[name=lat]', '27.1750090510034');
      await page.type('input[name=lon]', '78.04209025');
      await page.waitForTimeout(10000);
      await page.click('button[type=submit]');
    });

    after(async function () {
      this.timeout(0);
      await page.goto('http://localhost:9999/welcome.html');
      let welcomeBtns = await page.$$('.welcome-btn');
      await welcomeBtns[0].click();
      page.waitForNavigation({ waitUntil: 'networkidle2' });
      await page.waitForTimeout(5000);
    });


    it('should be on Wrong Result Reverse page', async function () {
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/wrongresultreverse.html');
    });

    it('should get more than 1 results', async function () {
      this.timeout(0);
      await page.waitForSelector('#searchresults .result');

      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);
      assert.ok(results_count > 1);
    });

    // eslint-disable-next-line max-len
    it('select second result and navigate to verify and edit and then to bug description', async function () {
      this.timeout(0);
      await page.waitForSelector('#searchresults .result');
      let results = await page.$$('#searchresults .result');
      await results[1].click();
      // await page.click('div.d-flex .btn.btn-primary');
      await page.evaluate(()=>document.querySelector('div.d-flex .btn.btn-primary').click());
      await page.waitForSelector('.row.mb-4.mt-4 h2', { timeout: 0 });
      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/bugdescription.html');
      //   let localStorage = await page.evaluate(() => localStorage.getItem('bug_data'));
      //   console.log(localStorage);
    });
  });
});
