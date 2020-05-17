const request = require('superagent');

exports.scrapeAlbertHeijn = async (req, res) => {
  try {
    const useProxy = req.params.useProxy === 'true';
    const useHeadless = req.params.useHeadless === 'true';
    const response = await request.post(
      `scraper:6000/ah/${useProxy}/${useHeadless}`
    );
    res.status(200).send({ data: response.body.data });
  } catch (error) {
    res.status(500).send({ data: error });
    console.error(error);
  }
};

exports.stopAlbertHeijnScraper = async (req, res) => {
  try {
    const response = await request.post(`scraper:6000/ah/stop`);
    res.status(200).send(response.body);
  } catch (error) {
    res.status(500).send({ data: error });
    console.error(error);
  }
};
