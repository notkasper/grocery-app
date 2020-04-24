/* eslint-disable no-await-in-loop */
const wait = async (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

const autoScroll = async (page) => {
  // Get the height of the rendered page
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(100);
    viewportIncr += viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Some extra delay to let images load
  await wait(100);
};

module.exports = { autoScroll, wait };
