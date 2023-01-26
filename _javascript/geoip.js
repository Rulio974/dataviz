
am5.ready(async function() {
	
	
	var root = am5.Root.new("chartdiv");
	
	
	root.setThemes([
		am5themes_Animated.new(root)
	]);
	
	
	var chart = root.container.children.push(
		am5map.MapChart.new(root, {
			// color
			
			
			panX: "rotateX",
			panY: "rotateY",
			projection: am5map.geoOrthographic(),    
		})
	);
		
	var cont = chart.children.push(
		am5.Container.new(root, {
			layout: root.horizontalLayout,
			x: 20,
			y: 40
		})
	);
			
			
	// cont.children.push(
	//   am5.Label.new(root, {
	//     centerY: am5.p50,
	//     text: "Map"
	//   })
	// );
	
	// var switchButton = cont.children.push(
	//   am5.Button.new(root, {
	//     themeTags: ["switch"],
	//     centerY: am5.p50,
	//     icon: am5.Circle.new(root, {
	//       themeTags: ["icon"]
	//     })
	//   })
	// );
	
	// switchButton.on("active", function () {
	//   if (!switchButton.get("active")) {
	//     chart.set("projection", am5map.geoMercator());
	//     chart.set("panY", "translateY");
	//     chart.set("rotationY", 0);
	
	//     backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
	//   } else {
	//     chart.set("projection", am5map.geoOrthographic());
	//     chart.set("panY", "rotateY");
	//     backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
	//   }
	// });
	
	// cont.children.push(
	//   am5.Label.new(root, {
	//     centerY: am5.p50,
	//     text: "Globe"
	//   })
	// );
			
			
	var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
	backgroundSeries.mapPolygons.template.setAll({
		// black background
				
		fill: root.interfaceColors.get("alternativeBackground"),
		fillOpacity: 0,
		strokeOpacity: 0
	});
				
	var polygonSeries = chart.series.push(
		am5map.MapPolygonSeries.new(root, {
			geoJSON: am5geodata_worldLow
		})
	);
		
		
	var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
	lineSeries.mapLines.template.setAll({
		stroke: root.interfaceColors.get("alternativeBackground"),
		strokeOpacity: 0.3
	});
		
		
	var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
		
	pointSeries.bullets.push(function () {
		var circle = am5.Circle.new(root, {
			radius: 4,
			tooltipY: 0,
			fill: am5.color(0xffba00),
			stroke: root.interfaceColors.get("background"),
			strokeWidth: 2,
			tooltipText: "{title}"
		});
				
		return am5.Bullet.new(root, {
			sprite: circle
		});
	});
		
	var cities = [];
	var GeoIP = []
	var IP = []
	
	await fetch("http://localhost:8888/nodeFile.json")
	.then(response => {
		return response.json();
	})
	.then(data => { 	
		for (var i = 0; i < data.length; i++) {
			if(data[i].IPv4 != undefined){
				
				for(var j = 0; j < data[i].IPv4.length; j++){
					let regex = new RegExp("^((192)|(10\.)|(172\.(2|1[6-9]|3[0-1])\.)).*$")
					if(!regex.test(data[i].IPv4[j])){
						IP.push(data[i].IPv4[j]);
					}
				}
			}
			
		}
	});
		
	for(var i = 0; i < IP.length; i++){
		
		await fetch("https://get.geojs.io/v1/ip/geo/"+IP[i]+".json")
		.then(response => {
			return response.json();
		})	
		.then(data => { 	
			var city = data;
			addCity(city.longitude, city.latitude, city.organization_name);
		})
	}
	chart.appear(1000, 100);
			
	function addCity(longitude, latitude, title) {
		pointSeries.data.push({
			geometry: { type: "Point", coordinates: [longitude, latitude] },
			title: title
		});
	}

});
				