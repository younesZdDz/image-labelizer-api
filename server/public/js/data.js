let curAnnotation = {
    "response": {
        "annotations": []
    },
    "params": {
        "attachment_type": "jpg",
        "objects_to_annotate": [
            "panda"
        ],
        "attachment": "https://www.conservationmagazine.org/wp-content/uploads/2015/09/shutterstock_133652270-copy.jpg"
    },
    "status": "pending",
    "_id": "5e737c7c9cd56d09d71fb638",
    "instruction": "find the animal",
    "created_at": "2020-03-19T14:06:52.757Z",
    "__v": 0
}

let annotations = [
    {
        "response": {
            "annotations": []
        },
        "params": {
            "attachment_type": "jpg",
            "objects_to_annotate": [
                "Cat", "Dog"
            ],
            "attachment": "https://imgs.classicfm.com/images/33669?crop=16_9&width=660&relax=1&signature=_QehZfwdjLTgjqUs4nlMS4wCV6E="
        },
        "status": "pending",
        "_id": "5e737c7c9cd56d09d71f3438",
        "instruction": "find the animals",
        "created_at": "2020-02-19T14:06:52.757Z",
        "__v": 0
    },
    {
        "response": {
            "annotations": []
        },
        "params": {
            "attachment_type": "png",
            "objects_to_annotate": [
                "Car"
            ],
            "attachment": "https://miro.medium.com/max/1508/1*1v9U-qzGnSwfbCVLbp262g.png"
        },
        "status": "pending",
        "_id": "5e737c779cd56d09d71f3438",
        "instruction": "find the objects",
        "created_at": "2020-01-19T14:06:52.757Z",
        "__v": 0
    }
]

for (let i=0; i<curAnnotation.params.objects_to_annotate.length; i++) {
    let object = curAnnotation.params.objects_to_annotate[i]
    $('#objects-list').append(`
        <div class="form-check">
            <input class="form-check-input" type="radio" name="objects" id="object-${object}" value="${object}"
            ${i===0 ? "checked" : ""}>
            <label class="form-check-label" for="object-${object}">
                ${object}
            </label>
        </div>
    `)
}

for (let i = 0; i < annotations.length; i++) {
    let annotation = annotations[i];
    $('#upcoming-annotations').append(`
        <div id=upcoming-annotation-"${annotation._id}" class="upcoming-annotation ${i > 0 ? "mt-3" : ""}"><img
            src="${annotation.params.attachment}"
        alt="Annotation" /></div>
    `)
}

$('#curr-annotation-container').append(`
    <img src="${curAnnotation.params.attachment}"
        curr-annotation-containeralt="Current annotation image" />
`)

$('#curr-task-id').html(curAnnotation._id);
$('#curr-task-date').html(curAnnotation.created_at);
$('#curr-task-instruction').html(curAnnotation.instruction);
$('#curr-task-original-image').attr("href", curAnnotation.params.attachment); 