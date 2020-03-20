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

$(document).ready(function () {

    let annotator;
    const render = (id_annotation) => {
        if (id_annotation !== curAnnotation._id || !id_annotation) {
            // ! get data from api
            if (id_annotation)
                annotations.push(curAnnotation)
            for (let i = 0; i < annotations.length; i++) {
                annotation = annotations[i]
                if (annotation._id === id_annotation) {
                    curAnnotation = annotation
                    annotations.splice(i, 1)

                }
            }
            $('#objects-list').html('')
            for (let i = 0; i < curAnnotation.params.objects_to_annotate.length; i++) {
                let object = curAnnotation.params.objects_to_annotate[i]
                $('#objects-list').append(`
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="objects" id="object-${object}" value="${object}"
                            ${i === 0 ? "checked" : ""}>
                        <label class="form-check-label" for="object-${object}">
                            ${object}
                        </label>
                    </div>
                `)
            }
            $('#bbox_annotator').html('')
            $('#curr-task-id').html(curAnnotation._id);
            $('#curr-task-date').html(curAnnotation.created_at);
            $('#curr-task-instruction').html(curAnnotation.instruction);
            $('#curr-task-original-image').attr("href", curAnnotation.params.attachment);
            $('#upcoming-annotations').html('')
            for (let i = 0; i < annotations.length; i++) {
                let annotation = annotations[i];
                $('#upcoming-annotations').append(`
                <div id="${annotation._id}" data-foo="${annotation._id}" class="upcoming-annotation ${i > 0 ? "mt-3" : ""}"><img
                data-id="${annotation._id}"    
                src="${annotation.params.attachment}"
                alt="Annotation" /></div>
            `)
            }
            $('.upcoming-annotation').click(function (event) {
                const id = event.target.dataset.id
                render(id)
            })

            annotator = new BBoxAnnotator({
                url: curAnnotation.params.attachment,
                input_method:  "fixed",
                labels: curAnnotation.params.labels,
                onchange: function (entries) {
                    console.log(entries)
                },
                radio:  $('input:radio:checked')
            });
            // Initialize the reset button.
            $("#reset_button").click(function (e) {
                annotator.clear_all();
            })





        }
    };


    render()



});