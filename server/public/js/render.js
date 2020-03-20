

$(document).ready(function () {
    let labels_annotated = []
    let curAnnotation = {

    }

    let annotations = [

    ]


    const render = (id_annotation) => {
        $('#objects-list').html('')
        $('#bbox_annotator').html('')
        $('#annotations-entries').html('')
        $('#upcoming-annotations').html('')


        if (Object.keys(curAnnotation).length === 0 && curAnnotation.constructor === Object)
            return;
        if (id_annotation !== curAnnotation._id || !id_annotation) {
            if (id_annotation) {
                annotations.push(curAnnotation)
                for (let i = 0; i < annotations.length; i++) {
                    annotation = annotations[i]
                    if (annotation._id === id_annotation) {
                        curAnnotation = annotation
                        annotations.splice(i, 1)

                    }
                }
            }

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
            $('#curr-task-id').html(curAnnotation._id);
            $('#curr-task-date').html(curAnnotation.created_at);
            $('#curr-task-instruction').html(curAnnotation.instruction);
            $('#curr-task-original-image').attr("href", curAnnotation.params.attachment);
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

            let annotator = new BBoxAnnotator({
                url: curAnnotation.params.attachment,
                input_method: "fixed",
                labels: curAnnotation.params.labels,
                onchange: function (entries) {
                    $('#annotations-entries').html('')

                    for (i = 0; i < entries.length; i++) {

                        $('#annotations-entries').append(`
                            <div class="card ${i > 0 ? "mt-2" : ""}">
                                <div class="card-body">
                                    <p><span class="font-weight-bold">Label: </span><span>${entries[i].label}</span></p>
                                    <p><span class="font-weight-bold">Corners: </span><span>${entries[i].left} x ${entries[i].top}</span></p>
                                    <p><span class="font-weight-bold">Size: </span><span>${entries[i].width} x ${entries[i].height}</span></p>
                                </div>
                            </div>
                        `);

                    }
                    labels_annotated = entries;
                },
                radio: $('input:radio:checked')
            });
            // Initialize the reset button.
            $("#reset_button").click(function (e) {
                annotator.clear_all();
            })





        }
    };
    const refresh = () => $.ajax({
        method: "GET",
        url: '/api/annotation/pending',
    })
        .done(function (data) {
            curAnnotation = {

            }
            annotations = [

            ]
            if (data.length > 0) {
                curAnnotation = data[0]
                data.splice(0, 1)
                annotations = data
            }
            render()

        });


    refresh()
    $('#submit').click(function () {
        $.ajax({
            type: 'PUT',
            url: `/api/annotation/${curAnnotation._id}`,
            contentType: 'application/json',
            data: JSON.stringify({
                labels: labels_annotated,
                comment: $.trim($("#comment").val())
            }),
        }).done(function (res) {
            refresh()
            $("#comment").val('')
        })

    })


});