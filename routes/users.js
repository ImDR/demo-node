const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

/* GET users listing. */
router.route('/')
    .get(usersController.getAll)
    .post(usersController.create);

// router.get('/', usersController.getAll);
// router.post('/', usersController.create);

router.route('/:id')
    .put(usersController.update)
    .get(usersController.get)
    .delete(usersController.delete);

// router.put('/:id', usersController.update);
// router.get('/:id', usersController.get);
// router.delete('/:id', usersController.delete);

module.exports = router;
