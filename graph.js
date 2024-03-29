const dims = { height: 300, width: 300, radius: 150};
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5)};

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150 )
    .attr('height', dims.height + 150);

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3.pie()
    .sort(null)
    .value(d => d.cost);

const angles = pie([
    { name: 'rent', cost: 500},
    { name: 'bills', cost: 300},
    { name: 'gaming', cost: 200}
]);

const arcPath =d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2);

const colour = d3.scaleOrdinal(d3['schemeSet3'])



    //update function
    const update = (data) => {

        //update colour scale domain
        colour.domain(data.map(d => d.name))

       // console.log(data)

       //join enhanced (pie) data to path elements
       const paths = graph.selectAll('path')
        .data(pie(data));
        
        paths.exit().remove();
        //console.log(pie(data))

        paths.attr('d', arcPath);

        paths.enter()
            .append('path')
            .attr('class', 'arc')
            .attr('d', arcPath)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('fill', d => colour(d.data.name));

       // console.log(paths.enter())
        };

    // data array and firestore
    var data = [];
//console.log(arcPath(angles[0]))

db.collection('Expenses').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = {...change.doc.data(), id: change.doc.id }
        
        switch(change.type){
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id ==doc.id);
                data[index]=doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !==doc.id);
                break;
            default:
                break;
        }

   });
   
   update(data);

})
