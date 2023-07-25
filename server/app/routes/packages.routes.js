const express = require("express");
const { authJwt } = require("../middlewares");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const router = express.Router();

router.get("/lab/packages", [authJwt.verifyToken], async (req, res) => {
    try {
        const labPackages = await db.query(
            `
            select 
                lp.id package_id
                , lp.name package_name
                , lp.status
                , to_char(lp.created::date, 'Mon dd, yyyy') created
                , concat(u.firstname, ' ', u.lastname) created_username
                , to_char(lp.updated::date, 'Mon dd, yyyy') updated
                , concat(u2.firstname, ' ', u2.lastname) updated_username
                , lc.id lab_company_id
                , lc.name lab_company_name
                , lct.id lab_company_test_id
                , lct.name lab_company_test_name
                , lct.price lab_company_test_price
            from lab_package lp
            left join lab_package_test lpt on lpt.lab_package_id = lp.id
            left join lab_company_test lct on lct.id = lpt.lab_company_test_id
            left join lab_company lc on lc.id = lct.lab_company_id
            left join users u on u.id = lp.created_user_id
            left join users u2 on u2.id = lp.updated_user_id
            where lp.client_id = $1
            order by lp.name
            limit 100
        `,
            [req.client_id]
        );

        if (!labPackages.rowCount) {
            errorMessage.message = "No lab package fount";
            return res.status(status.inValid).send(errorMessage);
        }
        const result = {};
        labPackages.rows.forEach((item) => {
            const package_id = item.package_id;

            if (!result[package_id]) {
                result[package_id] = {
                    package_id: package_id,
                    package_name: item.package_name,
                    status: item.status,
                    created: item.created,
                    created_username: item.created_username,
                    updated: item.updated,
                    updated_username: item.updated_username,
                    package_details: [],
                };
            }

            const package_detail = {
                lab_company_id: item.lab_company_id,
                lab_company_name: item.lab_company_name,
                lab_company_test_id: item.lab_company_test_id,
                lab_company_test_name: item.lab_company_test_name,
                lab_company_test_price: item.lab_company_test_price,
            };

            result[package_id].package_details.push(package_detail);
        });

        const results = Object.keys(result).map((key) => result[key]);
        successMessage.data = results;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Error when getting lab packages";
        return res.status(status.error).send(errorMessage);
    }
});

module.exports = router;
