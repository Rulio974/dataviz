"use strict";

am5.ready(async function () {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("graphdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    var graph = {
        name: "Root",
        value: 0,

        children: [] };

    await fetch("http://localhost:8003/nodeFile.json").then(function (response) {
        return response.json();
    }).then(function (data) {

        for (var i = 0; i < data.length; i++) {
            var protocols = [];

            // graph.children.push({
            //     name : i,
            //     value : 1,
            //     // linkWith: data[i].protocols[j].destinations[k].MAC,

            // });


            if (data[i].protocols.length != 0) {
                for (var j = 0; j < data[i].protocols.length; j++) {

                    // console.log(data[i].protocols[j].destinations);
                    for (var k = 0; k < data[i].protocols[j].destinations.length; k++) {
                        // protocols.push({
                        //     name : data[i].protocols[j].destinations[k],
                        //     value : 1});
                        //  data.children.push(protocols);
                        protocols.push(data[i].protocols[j].destinations[k].MAC);
                    }

                    // data.children.push(protocols);

                }
            }
            graph.children.push({
                name: data[i].MAC,
                value: 1,
                linkWith: protocols

            });
        }
    });

    // var data = {
    //   name: "Root",
    //   value: 0,

    //   children: [
    //     {
    //       name: "1",
    //       linkWith: ["2"],
    //       children: [
    //         {
    //           name: "A",
    //           children: [
    //             { name: "00:0c:29:a3:4b:04", value: 50 },
    //             { name: "A2", value: 1 },
    //             { name: "A3", value: 1 },
    //             { name: "A4", value: 1 },
    //             { name: "A5", value: 1 }
    //           ]
    //         },
    //         {
    //           name: "B",
    //           children: [
    //             { name: "B1", value: 1 },
    //             { name: "B2", value: 1 },
    //             { name: "B3", value: 1 },
    //             { name: "B4", value: 1 },
    //             { name: "B5", value: 1 }
    //           ]
    //         },
    //         {
    //           name: "C",
    //           children: [
    //             { name: "C1", value: 1 },
    //             { name: "C2", value: 1 },
    //             { name: "C3", value: 1 },
    //             { name: "C4", value: 1 },
    //             { name: "C5", value: 1 }
    //           ]
    //         }
    //       ]
    //     },

    //     {
    //       name: "2",
    //       linkWith: ["3"],
    //       children: [
    //         {
    //           name: "D", value:1
    //         },
    //         {
    //           name: "E", value:1
    //         }
    //       ]
    //     },
    //     {
    //       name: "3",
    //       children: [
    //         {
    //           name: "F",
    //           children: [
    //             { name: "F1", value: 1 },
    //             { name: "F2", value: 1 },
    //             { name: "F3", value: 1 },
    //             { name: "F4", value: 1 },
    //             { name: "F5", value: 1 }
    //           ]
    //         },
    //         {
    //           name: "H",
    //           children: [
    //             { name: "H1", value: 1 },
    //             { name: "H2", value: 1 },
    //             { name: "H3", value: 1 },
    //             { name: "H4", value: 1 },
    //             { name: "H5", value: 1 }
    //           ]
    //         },
    //         {
    //           name: "G",
    //           children: [
    //             { name: "G1", value: 1 },
    //             { name: "G2", value: 1 },
    //             { name: "G3", value: 1 },
    //             { name: "G4", value: 1 },
    //             { name: "G5", value: 1 }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // };

    // Create wrapper container
    var container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout

    }));

    // Create series
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    var series = container.children.push(am5hierarchy.ForceDirected.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        topDepth: 1,
        maxRadius: 25,
        minRadius: 12,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        idField: "name",
        linkWithStrength: 0.3,
        linkWithField: "linkWith",
        manyBodyStrength: -10,
        centerStrength: 0.5,
        zoomable: true
    }));

    series.get("colors").set("step", 2);

    series.data.setAll([graph]);
    series.set("selectedDataItem", series.dataItems[0]);

    // Make stuff animate on load
    series.appear(1000, 100);
});