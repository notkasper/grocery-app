const request = require('superagent');

const stores = ["jumbo, 'albert_heijn"];

exports.scrapeStore = async (req, res) => {
  try {
    const { store } = req.params;
    if (!stores.indexOf(store)) {
      res.status(400).send({ error: `Invalid store: ${store}` });
      return;
    }
    const useProxy = req.params.useProxy === 'true';
    const useHeadless = req.params.useHeadless === 'true';
    const response = await request.post(
      `scraper:6000/start/${store}/${useProxy}/${useHeadless}`
    );
    res.status(200).send({ data: response.body.data });
  } catch (error) {
    res.status(500).send({ data: error });
    console.error(error);
  }
};

exports.stopScrapeStore = async (req, res) => {
  try {
    const { store } = req.params;
    if (!stores.indexOf(store)) {
      res.status(400).send({ error: `Invalid store: ${store}` });
      return;
    }
    const response = await request.post(`scraper:6000/stop/${store}`);
    res.status(200).send(response.body);
  } catch (error) {
    res.status(500).send({ data: error });
    console.error(error);
  }
};
