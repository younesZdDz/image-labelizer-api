const express = require('express')
const router = express.Router();
var Annotation = require('./models/Annotation');

router.get('/reset/', async (req, res) => {


    try {
        const response = await Annotation.updateMany({
        }, {
            $set: { status: 'pending' }
        })
        console.log(response)
        res.status(200).send(response)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'internal errors' })
    }

});
router.get('/annotation/pending', async (req, res) => {

    try {
        const response = await Annotation.find({ status: 'pending' })
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send({ message: 'internal errors' })
    }
})
router.get('/annotation/completed', async (req, res) => {

    try {
        const response = await Annotation.find({ status: 'completed' })
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send({ message: 'internal errors' })
    }
})
router.get('/annotation/:annotation_id', async (req, res) => {
    try {

        const response = await Annotation.findOne({
            _id: req.params.annotation_id
        })
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send({ message: 'internal errors' })
    }

});


router.put('/annotation/:annotation_id', async (req, res) => {
    const { labels, comment } = req.body;
    console.log(req.body)

    try {
        const response = await Annotation.updateOne({
            _id: req.params.annotation_id
        }, {
            $set: {
                'response.annotations': labels, 'response.comment': comment, completed_at: new Date(), status: 'completed'
            }
        })
        console.log(response)
        res.status(200).send(response)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'internal errors' })
    }

});

router.post('/annotation', async (req, res) => {
    const {
        instruction,
        attachment_type,
        attachment,
        objects_to_annotate
    } = req.body
    const annotation = new Annotation({ instruction, params: { attachment_type, attachment, objects_to_annotate } })
    try {
        const response = await annotation.save()
        res.status(200).send(response)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'internal errors' })
    }

});


module.exports = router