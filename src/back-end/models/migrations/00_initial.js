const Sequelize = require('sequelize');

const categories = [
  {
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
    label: 'Aardappel, groente, fruit',
  },
  {
    id: '11f3a62f-4df7-4fd7-b985-03366a9d3ecd',
    label: 'Salades, pizza, maaltijden',
  },
  {
    id: '85698cd6-d8eb-4883-8dd2-ba1c1733ec13',
    label: 'Vlees, kip, vis, vega',
  },
  {
    id: '4d19851c-c0c9-48d6-85b2-ae007237f3a9',
    label: 'Kaas, vleeswaren, tapas',
  },
  {
    id: '444e3a99-8c88-4b09-b70a-0d5108e09906',
    label: 'Boter, eieren, zuivel',
  },
  {
    id: '3cee0cd0-0a1c-46ce-90fe-e93b824df04d',
    label: 'Brood en gebak',
  },
  {
    id: '143ca1c5-2d7e-491a-8e59-0a5c25e4f9e3',
    label: 'Ontbijtgranen, beleg, tussendoor',
  },
  {
    id: '6dc98c4d-8e40-46b3-bc15-4121dad2a954',
    label: 'Frisdrank, koffie, thee, sappen',
  },
  {
    id: '2e67fcdc-37b0-4782-96c2-f1ed9edf2623',
    label: 'Wijn',
  },
  {
    id: 'd64fb66e-ba1a-460a-8235-1359ec619d3e',
    label: 'Bier en sterke drank',
  },
  {
    id: '7c5ad839-a50d-4d6b-b100-852d1a9d6308',
    label: 'Pasta, rijst, wereldkeuken',
  },
  {
    id: '9eb0ce98-ad14-43ff-b04d-e086c48252de',
    label: 'Soepen, sauzen, kruiden, olie',
  },
  {
    id: 'f0017007-b349-4b59-8cf9-3bf456e01c80',
    label: 'Chips, koek, snoep, chocolade',
  },
  {
    id: '2d07a92d-de8a-4948-809b-9d38b4cd9431',
    label: 'Diepvries',
  },
  {
    id: '67937d0d-f761-4dc9-acb5-91952b082f3a',
    label: 'Baby, drogisterij',
  },
  {
    id: 'd9f1b75f-5ace-4aa9-b79a-2a30a1a76f01',
    label: 'Bewuste voeding',
  },
  {
    id: '47cb0d4a-97e9-49c9-acd7-558b24b2ca43',
    label: 'Huishouden, huisdier',
  },
  {
    id: 'd2be8627-1593-4547-81d9-9aed82e2b30c',
    label: 'Koken, tafelen, vrije tijd',
  },
];

module.exports = {
  up: async (query) => {
    await query.createTable('Product', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      category: Sequelize.UUID,
      label: Sequelize.STRING,
      image: Sequelize.STRING,
      amount: Sequelize.STRING,
      discount_type: Sequelize.STRING,
      availability_from: Sequelize.DATE,
      availability_till: Sequelize.DATE,
      link: Sequelize.STRING(1000),
      new_price: Sequelize.DOUBLE,
      discounted: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await query.createTable('Category', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      label: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await query.sequelize.models.Category.bulkCreate(categories);
  },

  down: async (query) => {
    await query.dropTable('Product');
    await query.dropTable('Category');
  },
};
