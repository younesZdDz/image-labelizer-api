const express = require('express')
const router = express.Router();
var Annotation = require('./models/Annotation');

router.get('/annotation/:annotation_id', async function (req, res) {
    try {
        const response = await Annotation.findOne({
            _id: req.params.annotation_id
        })
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send({ message: 'internal errors' })
    }

});
router.post('/annotation', async function (req, res) {
    const {
        instruction,
        attachment_type,
        attachment,
        objects_to_annotate
    } = req.body
    const annotation = new Annotation({instruction, params:{attachment_type, attachment, objects_to_annotate}})
    try{
        const response = await annotation.save()
        res.status(200).send(response)
    }catch(err){
        console.log(err)
        res.status(500).send({message: 'internal errors'})
    }

});


module.exports = router