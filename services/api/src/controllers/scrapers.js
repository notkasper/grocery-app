const request = require('superagent');

exports.scrapeAlbertHeijn = async (req, res) => {
  try {
    const response = await request.post('scraper:6000/ah');
    res.status(200).send({ data: response.body.data });
  } catch (error) {
    res.status(500).send({ data: error });
    console.error(error);
  }
};
