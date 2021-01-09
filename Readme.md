# Image annotation API
Api to out-source image labeling work <br/>
For a example of similar api: [Scale AI](https://scale.com/)
## Using the api
The api has an end-point '/api/annotation' in which it takes post requests of this form : <br/>
```javascript
{
    attachment_type: "image",
    objects_to_annotate: [
        "Cat",
        "Dog"
    ],
    attachment: "https://imgs.classicfm.com/images/33669?crop=16_9&width=660&relax=1&signature=_QehZfwdjLTgjqUs4nlMS4wCV6E=",
    instruction: "find the animals",
    callback: 'localhost:8080/callback'
}
```
The callback parameter is the response we give you containing labeled image. Example of reponse: <br>
```javascript
{
    
    annotations:[
        {
            _id: "5e7518158b5ce62d7bea7303",
            left: 399,
            top: 48,
            width: 152,
            height: 138,
            label: "Cat"
        },{
            _id: "5e7518158b5ce62d7bea7304",
            left: 101,
            top: 3,
            width: 220,
            height: 169,
            label: "Dog"
        }],
        comment: "Image is blury"
}
```
## Dashboard
[Check out the dashboard that consumes the API.](https://github.com/younesZdDz/image-labelizer)
