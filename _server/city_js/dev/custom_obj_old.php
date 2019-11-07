<?php
$data = [];
$data['6'] = [ //id of the location, for example 1 for the Yellow room
	[ //here starts the object's desctiption
        'id' => 1, // the id should be unique
		'obj' => 'car.obj', //obj file with the geometry of the object
		'texture' => 'car.jpg', //texture of the object
		'size' => 4.5, //the size of the longest side in meters
		'pos_x' =>-7, //х coordinate (click 5 times "/" on keyboard to see the coordinates on the screen)
		'pos_y'=>-847, //у coordinate
		'pos_z'=>-1, //z
		'rot_x'=>0, //x rotation in grads (to change the position of the object in space)
		'rot_y'=>0,//y rotation in grads
		'rot_z'=>0,//z rotation in grads
		'rotation_speed'=>0, /**the speed of the rotation. can be negative, then it will be CCW. can be 0, means no rotation**/
		'cursor_rotation'=>true, //put "true" if you want to be able to rotate the object with the cursor
		'image_url'=>'http://sitesman.com/s/1008-2016-07-17_20-33-31.jpg', //(absolute URL of the small round image)
		'title'=>'Lotus Seven', //(title of the object)
		'description'=>'The Lotus Seven is a small, simple, lightweight two-seater open-top sports car produced by Lotus Cars (initially called Lotus Engineering) between 1957 and 1972.', //(description)
		'button_text'=>'Buy now', //(text on the button)
		'button_url'=>'http://www.ebay.com/bhp/lotus-7', //(URL where the button goes)
		'big_image_url'=>'', //(URL of the big image)
		'video_url'=>'', //(URL of the video that can appear)
		'shadow' => true,
		'info_on_hover' => false
	], //here finishes the description of one object. Put a comma (,) if another object follows


	[
        'id' => 2,
		'obj' => 'oil.obj',
		'texture' => 'oil.jpg',
		'size' => 4,
		'pos_x' =>760,
		'pos_y'=>-1487,
		'pos_z'=>-4,
		'rot_x'=>0,
		'rot_y'=>0,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false,
        'image_url'=>'http://clip2net.com/clip/m347957/8bbbf-clip-14kb.jpg?nocache=1', //(absolute URL of the small round image)
		'title'=>'Oil filtration machine', //(title of the object)
		'description'=>'Series ZYD Double-stage transformer oil purifier can quickly remove water, trace water, gas, particles as well as acetylene, hydrogen, methane and other harmful ingredients from oil effectively to improve oil dielectric strength, effectively making sure electric equipments working safely and normally.', //(description)
		'button_text'=>'Buy now', //(text on the button)
		'button_url'=>'https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=oil+filtration', //(URL where the button goes)
        'big_image_url'=>'http://sitesman.com/s/1008-2016-07-17_20-23-45.jpg',

	],


	[
        'id' => 3,
		'obj' => 'fridge.obj',
		'texture' => 'fridge_chocolate.jpg',
		'size' => 2,
		'pos_x' =>145,
		'pos_y'=>203,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false,
        'image_url'=>'',
        'title'=>'Refrigerator Smeg', //(title of the object)
		'description'=>'Like other famous designs, the original and best FAB28 coloured refrigerator is more than just a mere fridge. It dominates its surroundings, just like the sofa or lamp in your living room.', //(description)
		'button_text'=>'Buy now', //(text on the button)
		'button_url'=>'http://www.smeg.com/refrigerators/refrigerators/', //(URL where the button goes)
        'video_url'=>'https://www.youtube.com/watch?v=7mj3uO4_HLA',
	]

	,


	[
        'id' => 4,
		'obj' => 'fridge.obj',
		'texture' => 'fridge_grey.jpg',
		'size' => 1.8,
		'pos_x' =>245,
		'pos_y'=>203,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]

	,


	[
        'id' => 5,
		'obj' => 'fridge.obj',
		'texture' => 'fridge_dark_grey.jpg',
		'size' => 1.8,
		'pos_x' =>365,
		'pos_y'=>203,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]


	,


	[
        'id' => 6,
		'obj' => 'fridge.obj', //if the same model will be loaded, just add ?n=2, 3, etc.
		'texture' => 'fridge_red.jpg',
		'size' => 2,
		'pos_x' =>945,
		'pos_y'=>1243,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>0,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]

	,


	[
        'id' => 7,//111111111111
		'obj' => 'fridge.obj', //if the same model will be loaded, just add ?n=2, 3, etc.
		'texture' => 'fridge_yellow.jpg',
		'size' => 2,
		'pos_x' =>1290,
		'pos_y'=>207,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]


	,


	[
        'id' => 8,//////////
		'obj' => 'fridge.obj', //if the same model will be loaded, just add ?n=2, 3, etc.
		'texture' => 'fridge_dark_grey.jpg',
		'size' => 1.8,
		'pos_x' =>1190,
		'pos_y'=>207,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]

	,


	[
        'id' => 9,//////
		'obj' => 'fridge.obj', //if the same model will be loaded, just add ?n=2, 3, etc.
		'texture' => 'fridge_violet.jpg',
		'size' => 1.9,
		'pos_x' =>1095,
		'pos_y'=>207,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]


		,


	[
        'id' => 10,/////
		'obj' => 'fridge.obj', //if the same model will be loaded, just add ?n=2, 3, etc.
		'texture' => 'fridge_blue.jpg',
		'size' => 1.7,
		'pos_x' =>995,
		'pos_y'=>207,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]



	,


	[
        'id' => 11,///
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white.jpg',
		'size' => 0.5,
		'pos_x' =>498,
		'pos_y'=>216,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>false
	]


		,


	[
        'id' => 12,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white_2.jpg',
		'size' => 0.6,
		'pos_x' =>-792,
		'pos_y'=>-211,
		'pos_z'=>99,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true,
        'title'=>'MyChat360', //(title of the object)
		'description'=>'MyChat360 is a wonderful plugin that turns your website into a 3D world!', //(description)
		'button_text'=>'Buy now!', //(text on the button)
		'button_url'=>'https://secure.avangate.com/order/checkout.php?PRODS=4674866&QTY=1&CART=1&CARD=1&ORDERSTYLE=nLWom5XPprs=', //(URL where the button goes)
        'video_url'=>'https://www.youtube.com/watch?v=i-R063bbf6A',
		'info_on_hover' => true
	]

			,


	[
        'id' => 13,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white_4.jpg',
		'size' => 0.6,
		'pos_x' =>-851,
		'pos_y'=>567,
		'pos_z'=>99,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]

			,


	[
        'id' => 14,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white_2.jpg',
		'size' => 0.4,
		'pos_x' =>-851,
		'pos_y'=>467,
		'pos_z'=>99,
		'rot_x'=>0,
		'rot_y'=>-90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]

			,


	[
        'id' => 15,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white_4.jpg',
		'size' => 0.4,
		'pos_x' =>-540,
		'pos_y'=>1620,
		'pos_z'=>156,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>7,
		'cursor_rotation'=>false
	]

			,


	[
        'id' => 16,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white.jpg',
		'size' => 0.4,
		'pos_x' =>-640,
		'pos_y'=>1620,
		'pos_z'=>156,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>7,
		'cursor_rotation'=>false
	]
	,
	[
        'id' => 17,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white_2.jpg',
		'size' => 0.4,
		'pos_x' =>-740,
		'pos_y'=>1620,
		'pos_z'=>156,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>7,
		'cursor_rotation'=>false
	]

	,
	[
        'id' => 18,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_yellow.jpg',
		'size' => 0.4,
		'pos_x' =>-840,
		'pos_y'=>1620,
		'pos_z'=>156,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>7,
		'cursor_rotation'=>false
	]
	,
	[
        'id' => 19,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_grey.jpg',
		'size' => 0.4,
		'pos_x' =>-940,
		'pos_y'=>1620,
		'pos_z'=>156,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>7,
		'cursor_rotation'=>false
	]

	,
	[
        'id' => 20,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_black.jpg',
		'size' => 0.4,
		'pos_x' =>-1040,
		'pos_y'=>1620,
		'pos_z'=>156,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>7,
		'cursor_rotation'=>false
	]

	,
	[
        'id' => 21,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_blue.jpg',
		'size' => 0.6,
		'pos_x' =>-384,
		'pos_y'=>535,
		'pos_z'=>99,
		'rot_x'=>0,
		'rot_y'=>90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]

	,
	[
        'id' => 22,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_black.jpg',
		'size' => 0.6,
		'pos_x' =>700,
		'pos_y'=>1949,
		'pos_z'=>217,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]

	,
	[
        'id' => 23,//
		'obj' => 'notebook.obj',
		'texture' => 'notebook_white.jpg',
		'size' => 0.6,
		'pos_x' =>600,
		'pos_y'=>1949,
		'pos_z'=>217,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]


	,
	[
        'id' => 24,//
		'obj' => 'chair.obj',
		'texture' => 'chair.jpg',
		'size' => 1,
		'pos_x' =>133,
		'pos_y'=>1207,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true,
		'title'=>'Bar stool', //(title of the object)
		'description'=>'This Winsome Wood 25.2-Inch Adjustable Air Lift Counter Stool - Set of 2 features a truly unique design with incredible comfort. Its sophisticated, modern design consists of a polished chrome base and padded, contoured seat upholstered in black faux leather. ', //(description)
		'button_text'=>'Buy now', //(text on the button)
		'button_url'=>'https://www.amazon.com/Barstools-Home-Bar-Furniture-D%C3%A9cor/b?ie=UTF8&node=3733851', //(URL where the button goes)
        'big_image_url'=>'http://sitesman.com/s/1008-2016-07-17_20-35-11.jpg',
	]

	,
	[
        'id' => 25,//
		'obj' => 'nightstand.obj',
		'texture' => 'nightstand.jpg',
		'size' => 0.7,
		'pos_x' =>140,
		'pos_y'=>1315,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]

		,
	[
        'id' => 26,//
		'obj' => 'locker.obj',
		'texture' => 'locker.jpg',
		'size' => 1,
		'pos_x' =>130,
		'pos_y'=>1445,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>270,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]


			,
	[
        'id' => 27,//
		'obj' => 'locker_2.obj',
		'texture' => 'locker_2.jpg',
		'size' => 1,
		'pos_x' =>243,
		'pos_y'=>1210,
		'pos_z'=>29,
		'rot_x'=>0,
		'rot_y'=>90,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true
	]

			,
	[
        'id' => 28,
		'obj' => 'armchair.obj',
		'texture' => 'armchair.jpg',
		'size' => 1,
		'pos_x' =>380,
		'pos_y'=>1230,
		'pos_z'=>28,
		'rot_x'=>0,
		'rot_y'=>180,
		'rot_z'=>0,
		'rotation_speed'=>0,
		'cursor_rotation'=>true,
		'title'=>'Rebecca Stylish Wire Armchair', //(title of the object)
		'description'=>'Rebecca is an armchair of modern chic design, with a brilliant chromed steel wire base. Each leg is tipped with a plastic glide embedded into the metal wire.', //(description)
		'button_text'=>'Buy now', //(text on the button)
		'button_url'=>'http://www.houzz.com/photos/2441596/Rebecca-Stylish-Wire-Armchair-by-sohoConcept-contemporary-armchairs-and-accent-chairs-orange-county', //(URL where the button goes)
        'big_image_url'=>'http://sitesman.com/s/1008-2016-07-17_20-36-00.jpg',
	]

];


























echo json_encode($data);
?>
