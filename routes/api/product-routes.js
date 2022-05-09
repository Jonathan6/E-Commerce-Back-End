const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  const data = await Product.findAll({
    include: [{ model: Category}, { model: Tag, through: ProductTag }]
  });
  res.status(200).json(data);
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const data = await Product.findByPk(req.params.id, {
    include: [{ model: Category}, { model: Tag, through: ProductTag }],
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(data);
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const data = await Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
  });

  

  if (req.body.tagIds.length > 0) {
    const tagArray = req.body.tagIds.map((tag_id) => {
      return {
        product_id: data.id,
        tag_id: tag_id
      };
    });
    const tags = await ProductTag.bulkCreate(tagArray);
  }

  res.status(200).json(data);
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  const data = await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

  const del = await ProductTag.destroy({
    where: {product_id: req.params.id}
  });

  if (req.body.tagIds.length > 0) {
    const tagArray = req.body.tagIds.map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id: tag_id
      };
    });
    const tags = await ProductTag.bulkCreate(tagArray);
  }

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  const data = await Product.destroy({
    where: {id: req.params.id}}
  );
  res.status(200).json(data);
});

module.exports = router;
