const createError = require('http-errors');
const Joi = require('joi');

const { passwordHash } = require('../helpers/password');

module.exports = {
    getAll: (req, res) => {
        const schema = Joi.object({
            q: Joi.string().max(255).optional()
        });

        const { error, value } = schema.validate(req.query);
        if (error) throw createError(400, error.message);

        let sql = 'SELECT * FROM users WHERE 1 = 1 ';
        const values = [];

        if (value.q) {
            sql += ' AND name LIKE ?';
            values.push('%' + value.q + '%');
        }

        req.db.query({
            sql,
            values
        })
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                throw error;
            });
    },
    create: async (req, res) => {
        const schema = Joi.object({
            name: Joi.string().min(3).max(255).required(),
            email: Joi.string().email().min(3).max(255).required(),
            password: Joi.string().min(8).max(10).required(),
        });

        const { error, value } = schema.validate(req.body);
        if (error) throw createError(400, error.message);

        try {

            value.password = await passwordHash(value.password);

            const result = await req.db.query({
                sql: 'INSERT INTO users SET ? ',
                values: [value]
            });

            if (!result.affectedRows) throw createError(400, "User does not created");

            const user = await req.db.query({
                sql: 'SELECT * FROM users WHERE id = ? ',
                values: [result.insertId]
            });

            res.json(user);
        } catch (error) {
            throw error;
        }

        // var xyz;
        // req.db.query({
        //     sql: 'INSERT INTO users SET ? ',
        //     values: [value]
        // })
        //     .then(data => {
        //         if (!data.affectedRows) throw createError(400, "User does not created");
                    // xyz = data;
        //         return req.db.query({
        //             sql: 'SELECT * FROM users WHERE id = ? ',
        //             values: [data.insertId]
        //         });
        //     })
        //     .then(data => {
                    // xyz
        //         res.json(data);
        //     })
        //     .catch(error => {
        //         throw error;
        //     });
    },
    update: (req, res) => {
        res.json({
            message: "User updated user id: " + req.params.id
        });
    },
    get: (req, res) => {
        const schema = Joi.object({
            id: Joi.number().integer().min(1).required(),
        });

        const { error, value } = schema.validate(req.params);
        if (error) throw createError(400, error.message);

        res.json({
            message: "User get user id: " + req.params.id
        });
    },
    delete: (req, res) => {
        res.json({
            message: "User deleted user id: " + req.params.id
        });
    },
};