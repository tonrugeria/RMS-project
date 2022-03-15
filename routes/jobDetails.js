const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// job-details get route
router.get('/job-details/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const job = await knex('jobs.job_opening').where('job_id', jobId);
        const jobDetail = await knex('jobs.job_details').where('job_id', jobId);
        const jobResponsibility = await knex('jobs.responsibility').where('job_id', jobId);
        const jobQualification = await knex('jobs.qualification').where('job_id', jobId);
        const jobCategory = await knex('jobs.category').where('job_id', jobId);
        const jobCategoryItem = await knex('jobs.item').innerJoin(
                'jobs.category',
                'jobs.item.category_id',
                'jobs.category.category_id'
        );
        res.render('jobDetails', {
                job,
                jobDetail,
                jobId,
                jobResponsibility,
                jobQualification,
                jobCategory,
                jobCategoryItem,
        });
});

// add role
router.post('/add-role/:job_id', (req, res) => {
        const { role } = req.body;
        const { job_id } = req.params;
        knex('jobs.job_details')
                .insert({ job_id, role })
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// edit role
router.post('/edit-role/:job_id', (req, res) => {
        const { role } = req.body;
        const { job_id } = req.params;
        knex('jobs.job_details')
                .update({ job_id, role })
                .where('job_id', job_id)
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// add responsibility item
router.post('/addResponsibility/:job_id', (req, res) => {
        const { responsibility_detail } = req.body;
        const { job_id } = req.params;
        knex('jobs.responsibility')
                .insert({ job_id, responsibility_detail })
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// edit responsibility item
router.post('/update/:job_id/responsibility/:responsibility_id', (req, res) => {
        const responsibility_item = req.body;
        const { job_id, responsibility_id } = req.params;
        console.log(typeof responsibility_item);
        knex('jobs.responsibility')
                .update({ responsibility_detail: responsibility_item })
                .where('job_id', job_id)
                .andWhere('responsibility_id', responsibility_id)
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// delete responsibility item
router.post('/deleteResponsibility/:job_id/:responsibility_id', (req, res) => {
        const { responsibility_id, job_id } = req.params;
        knex('jobs.responsibility')
                .where('job_id', job_id)
                .andWhere('responsibility_id', responsibility_id)
                .del()
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// add qualification item
router.post('/addQualification/:job_id', (req, res) => {
        const { qualification_detail } = req.body;
        const { job_id } = req.params;
        knex('jobs.qualification')
                .insert({ job_id, qualification_detail })
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// edit qualification item

// delete qualification item
router.post('/deleteQualification/:job_id/:qualification_id', (req, res) => {
        const { qualification_id, job_id } = req.params;
        knex('jobs.qualification')
                .where('job_id', job_id)
                .andWhere('qualification_id', qualification_id)
                .del()
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// add category
router.post('/add-category/:job_id', (req, res) => {
        const { categoryDetail } = req.body;
        const { job_id } = req.params;
        knex('jobs.category')
                .insert({ job_id, category_detail: categoryDetail })
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});

// add category item
router.post('/add/:job_id/:category_id', (req, res) => {
        const { item } = req.body;
        const jobId = req.params.job_id;
        const categoryId = req.params.category_id;
        knex('jobs.item')
                .insert({ category_id: categoryId, item_detail: item, job_id: jobId })
                .then(() => {
                        res.redirect(`/job-details/${jobId}`);
                });
});

// delete category item
router.post('/delete/:job_id/:category_id/:item_id', (req, res) => {
        const { category_id, item_id, job_id } = req.params;
        knex('jobs.item')
                .where('category_id', category_id)
                .andWhere('item_id', item_id)
                .del()
                .then(() => {
                        res.redirect(`/job-details/${job_id}`);
                });
});
module.exports = router;
