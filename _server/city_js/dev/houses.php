<?php
$data = [];
$data[1] = [
    'ext' => [ //эксиерьер дома
        'enterDist' => 50, //дистанция входа
        'enterPoint' => [84, 417, 150], //токачка входа, если задана - дистанция входа не работает [x,y, radius]
        'startPoint' => [-87, 825, 150, 0], //точка появления при выходе из дома [x,y, radius]
        'loc' => 23, //ид локации
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_ext_01_pt1.obj",  "map" => 'house_ext_01_pt1_2048_001.jpg'],
            ["geo" => "house_ext_01_pt2.obj",  "map" => 'house_ext_01_pt2_1024_002_E1.jpg'],
            ["geo" => "house_ext_01_col.obj", "collider" => true]

        ]
    ],
    'int1' => [ //первый этаж
        'exitDist' => 150, //дистанция выхода(до стены)
        'exitPoint' => [106, 235, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint2' => [-300, -200, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint3' => null,
        'toFloor2' => [250, 0, 50], // переход на второй этаж [x, y, radius] либо null если второго этажа нет
        'z' => 97, //высота пола
        'loc' => 24, //ид локации
        'startPoint' => [90, 120, 30, 0], //точка входа с улицы
        'fromFloor2' => [320, 0, 140, 90], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_int_01_f1_pt1.obj", "map" => "house_int_01_f1_pt1_2048_006_E3.jpg"],
            ["geo" => "house_int_01_f1_pt2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg"],
            ["geo" => "house_int_01_f1_collider.obj", "collider" => true ],
            ["geo" => "house_int_01_f1_floor1.obj", "map"=>"house_int_01_f1_pt1_2048_006_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f1_floor2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg", "floor" => true]
            ]

    ],
    'int2' => [ //второй этаж
        'toFloor3' => null,
        'toFloor1' => [325, -96, 100],
        'fromFloor1' => [164, -43, 50, 90],
        'loc' => 25,
        'z' => 376,
        'panoShift' => 0,
        'fov' => 67,
        'objs' => [
            ["geo" => "house_int_01_f2_floor.obj", "map" => "house_int_01_f2_2048_013_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f2_.obj", "map" => "house_int_01_f2_2048_013_E3.jpg"],
            ["geo" => "house_int_01_f2_collider.obj", "collider" => true ],
            ]

    ],
    'int3' => [ //третий этаж
        'toFloor2' => null,
        'objs' => [

        ]

    ]
];


$data[2] = [
    'ext' => [ //эксиерьер дома
        'enterDist' => 50, //дистанция входа
        'enterPoint' => [76, 617, 150], //токачка входа, если задана - дистанция входа не работает [x,y, radius]
        'startPoint' => [-87, 825, 150, 0], //точка появления при выходе из дома [x,y, radius]
        'loc' => 27, //ид локации
        'fov' => 65,
        'snow' => 40,
        'ice' => true,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_ext_01_pt1.obj",  "map" => 'house_ext_01_pt1_2048_001.jpg'],
            ["geo" => "house_ext_01_pt2.obj",  "map" => 'house_ext_01_pt2_1024_002_E1.jpg'],
            ["geo" => "house_ext_01_col.obj", "collider" => true]

        ]
    ],
    'int1' => [ //первый этаж
        'exitDist' => 150, //дистанция выхода(до стены)
        'exitPoint' => [95, 195, 50], //точка выхода, если задана - дистанция выхода не работает
        'toFloor2' => [250, 0, 50], // переход на второй этаж [x, y, radius] либо null если второго этажа нет
        'z' => 97, //высота пола
        'loc' => 28, //ид локации
        'startPoint' => [90, 120, 30, 0], //точка входа с улицы
        'fromFloor2' => [74, -21, 50, 90], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 65,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_int_01_f1_pt1.obj", "map" => "house_int_01_f1_pt1_2048_006_E3.jpg"],
            ["geo" => "house_int_01_f1_pt2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg"],
            ["geo" => "house_int_01_f1_collider.obj", "collider" => true ],
            ["geo" => "house_int_01_f1_floor1.obj", "map"=>"house_int_01_f1_pt1_2048_006_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f1_floor2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg", "floor" => true]
            ]

    ],
    'int2' => [ //второй этаж
        'toFloor3' => null,
        'toFloor1' => [247, -96, 10],
        'fromFloor1' => [164, -43, 50, 90],
        'loc' => 29,
        'z' => 376,
        'panoShift' => 0,
        'fov' => 65,
        'objs' => [
            ["geo" => "house_int_01_f2_floor.obj", "map" => "house_int_01_f2_2048_013_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f2_.obj", "map" => "house_int_01_f2_2048_013_E3.jpg"],
            ["geo" => "house_int_01_f2_collider.obj", "collider" => true ],
            ]

    ],
    'int3' => [ //третий этаж
        'toFloor2' => null,
        'objs' => [

        ]

    ]
];

$data[3] = [
    'ext' => [ //эксиерьер дома
        'enterDist' => 50, //дистанция входа
        'enterPoint' => [84, 417, 150], //токачка входа, если задана - дистанция входа не работает [x,y, radius]
        'iconPoint' => null, //точка отображения иконки входа, если не задана отображается на координатах точки входа
        'startPoint' => [-87, 825, 150, 0], //точка появления при выходе из дома [x,y, radius]
        'loc' => 31, //ид локации
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_ext_01_pt1.obj",  "map" => 'house_ext_01_pt1_2048_001.jpg'],
            ["geo" => "house_ext_01_pt2.obj",  "map" => 'house_ext_01_pt2_1024_002_E1.jpg'],
            ["geo" => "house_ext_01_col.obj", "collider" => true]

        ]
    ],
    'int1' => [ //первый этаж
        'exitDist' => 150, //дистанция выхода(до стены)
        'exitPoint' => [106, 235, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint2' => [-300, -200, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint3' => null,
        'toFloor2' => [250, 0, 50], // переход на второй этаж [x, y, radius] либо null если второго этажа нет
        'z' => 97, //высота пола
        'loc' => 32, //ид локации
        'startPoint' => [90, 120, 30, 0], //точка входа с улицы
        'fromFloor2' => [320, 0, 140, 90], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_int_01_f1_pt1.obj", "map" => "house_int_01_f1_pt1_2048_006_E3.jpg"],
            ["geo" => "house_int_01_f1_pt2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg"],
            ["geo" => "house_int_01_f1_collider.obj", "collider" => true ],
            ["geo" => "house_int_01_f1_floor1.obj", "map"=>"house_int_01_f1_pt1_2048_006_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f1_floor2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg", "floor" => true]
            ]

    ],
    'int2' => [ //второй этаж
        'toFloor3' => null,
        'toFloor1' => [325, -96, 100],
        'fromFloor1' => [164, -43, 50, 90],
        'loc' => 33,
        'z' => 376,
        'panoShift' => 0,
        'fov' => 67,
        'objs' => [
            ["geo" => "house_int_01_f2_floor.obj", "map" => "house_int_01_f2_2048_013_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f2_.obj", "map" => "house_int_01_f2_2048_013_E3.jpg"],
            ["geo" => "house_int_01_f2_collider.obj", "collider" => true ],
            ]

    ],
    'int3' => [ //третий этаж
        'toFloor2' => null,
        'objs' => [

        ]

    ]
];


$data[4] = [
    'ext' => [ //эксиерьер дома
        'enterDist' => 50, //дистанция входа
        'enterPoint' => [84, 417, 150], //токачка входа, если задана - дистанция входа не работает [x,y, radius]
        'startPoint' => [-87, 825, 150, 0], //точка появления при выходе из дома [x,y, radius]
        'loc' => 35, //ид локации
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_ext_01_pt1.obj",  "map" => 'house_ext_01_pt1_2048_001.jpg'],
            ["geo" => "house_ext_01_pt2.obj",  "map" => 'house_ext_01_pt2_1024_002_E1.jpg'],
            ["geo" => "house_ext_01_col.obj", "collider" => true]

        ]
    ],
    'int1' => [ //первый этаж
        'exitDist' => 150, //дистанция выхода(до стены)
        'exitPoint' => [106, 235, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint2' => [-300, -200, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint3' => null,
        'toFloor2' => [250, 0, 50], // переход на второй этаж [x, y, radius] либо null если второго этажа нет
        'z' => 97, //высота пола
        'loc' => 36, //ид локации
        'startPoint' => [90, 120, 30, 0], //точка входа с улицы
        'fromFloor2' => [320, 0, 140, 90], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_int_01_f1_pt1.obj", "map" => "house_int_01_f1_pt1_2048_006_E3.jpg"],
            ["geo" => "house_int_01_f1_pt2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg"],
            ["geo" => "house_int_01_f1_collider.obj", "collider" => true ],
            ["geo" => "house_int_01_f1_floor1.obj", "map"=>"house_int_01_f1_pt1_2048_006_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f1_floor2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg", "floor" => true]
            ]

    ],
    'int2' => [ //второй этаж
        'toFloor3' => null,
        'toFloor1' => [325, -96, 100],
        'fromFloor1' => [164, -43, 50, 90],
        'loc' => 37,
        'z' => 376,
        'panoShift' => 0,
        'fov' => 67,
        'objs' => [
            ["geo" => "house_int_01_f2_floor.obj", "map" => "house_int_01_f2_2048_013_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f2_.obj", "map" => "house_int_01_f2_2048_013_E3.jpg"],
            ["geo" => "house_int_01_f2_collider.obj", "collider" => true ],
            ]

    ],
    'int3' => [ //третий этаж
        'toFloor2' => null,
        'objs' => [

        ]

    ]
];

$data[5] = [
    'ext' => [ //эксиерьер дома
        'enterDist' => 50, //дистанция входа
        'enterPoint' => [84, 417, 150], //токачка входа, если задана - дистанция входа не работает [x,y, radius]
        'startPoint' => [67, 758, 100, 0], //точка появления при выходе из дома [x,y, radius]
        'loc' => 39, //ид локации
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_ext_01_pt1.obj",  "map" => 'house_ext_01_pt1_2048_001.jpg'],
            ["geo" => "house_ext_01_pt2.obj",  "map" => 'house_ext_01_pt2_1024_002_E1.jpg'],
            ["geo" => "house_ext_01_col.obj", "collider" => true]

        ]
    ],
    'int1' => [ //первый этаж
        'exitDist' => 150, //дистанция выхода(до стены)
        'exitPoint' => [106, 235, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint2' => [-300, -200, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint3' => null,
        'toFloor2' => [250, 0, 50], // переход на второй этаж [x, y, radius] либо null если второго этажа нет
        'z' => 97, //высота пола
        'loc' => 40, //ид локации
        'startPoint' => [90, 120, 30, 0], //точка входа с улицы
        'fromFloor2' => [320, 0, 140, 90], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_int_01_f1_pt1.obj", "map" => "house_int_01_f1_pt1_2048_006_E3.jpg"],
            ["geo" => "house_int_01_f1_pt2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg"],
            ["geo" => "house_int_01_f1_collider.obj", "collider" => true ],
            ["geo" => "house_int_01_f1_floor1.obj", "map"=>"house_int_01_f1_pt1_2048_006_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f1_floor2.obj", "map" => "house_int_01_f1_pt2_1024_003_E1.jpg", "floor" => true]
            ]

    ],
    'int2' => [ //второй этаж
        'toFloor3' => null,
        'toFloor1' => [325, -96, 100],
        'fromFloor1' => [164, -43, 50, 90],
        'loc' => 41,
        'z' => 376,
        'panoShift' => 0,
        'fov' => 67,
        'objs' => [
            ["geo" => "house_int_01_f2_floor.obj", "map" => "house_int_01_f2_2048_013_E3.jpg", "floor" => true],
            ["geo" => "house_int_01_f2_.obj", "map" => "house_int_01_f2_2048_013_E3.jpg"],
            ["geo" => "house_int_01_f2_collider.obj", "collider" => true ],
            ]

    ],
    'int3' => [ //третий этаж
        'toFloor2' => null,
        'objs' => [

        ]

    ]
];



$data[6] = [
    'ext' => [ //эксиерьер дома
        'enterDist' => 50, //дистанция входа
        'enterPoint' => [248, 459, 150], //токачка входа, если задана - дистанция входа не работает [x,y, radius]
        'startPoint' => [67, 758, 100, 0], //точка появления при выходе из дома [x,y, radius]
        'iconPoint' => [245, 280, 150],
        'loc' => 31, //ид локации
        'shadowCutDist' => 1, //0-1 0-полное обрезаниеб 1-ничего не обрезаем 0.8 - по умолчанию
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
            ["geo" => "house_03_ext.obj",  "map" => ['house_03_ext_pt1_2048_002.jpg', 'house_03_ext_pt2_1024_001.jpg']],
            ["geo" => "house_03_glass.obj",  "map" => 'lj-BopBg.png', "glass"=>true],
            /*["geo" => "house_03_f0.obj", "map" => "house_03_f0_2048_002.jpg"]*/
           

        ]
    ],
    'int0' => [ //первый этаж
      
        'exitPoint' => [245, 210, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint2' => null, //точка выхода, если задана - дистанция выхода не работает
        'exitPoint3' => null,
        'toFloor1' => [428, -51, 50],
        'z' => 27, //высота пола
        'loc' => 46, //ид локации
        'startPoint' => [200, 115, 30, 0], //точка входа с улицы
        'fromFloor1' => [593, -530,  90, 180], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
           
            ["geo" => "house_03_f0.obj", "map" => 'house_03_f0_2048_002.jpg'],
           
            
            ]

    ],
    'int1' => [ //первый этаж
        'exitDist' => 150, //дистанция выхода(до стены)
        'exitPoint' => [245, 210, 100], //точка выхода, если задана - дистанция выхода не работает
        'exitPoint2' => null, //точка выхода, если задана - дистанция выхода не работает
        'exitPoint3' => null,
        'toFloor0' => [289, -64, 50],
        'toFloor2' => [-217, -126, 50], // переход на второй этаж [x, y, radius] либо null если второго этажа нет
        'z' => 97, //высота пола
        'loc' => 32, //ид локации
        'startPoint' => [200, 115, 30, 0], //точка входа с улицы
        'fromFloor0' => [125, -48,  90, 180], 
        'fromFloor2' => [-143, -20,  90, 180], //точка входа со втрого этажа
        'panoShift' => 0, //смещение панорамы по z
        'fov' => 67,
        'objs' => [ //конфигурация объектов дома
           
            ["geo" => "house_03_f1.obj", "map" => ["house_03_f1_pt2_2048_002.jpg", "house_03_f1_pt1_1024_002.jpg",]],
           
            
            ]

    ],
    'int2' => [ //второй этаж
        'toFloor3' =>  [-220, -169, 50],
        'toFloor1' => [-97, -144, 50],
        'fromFloor1' => [-157, -55, 50, 0],
        'fromFloor3' => [-157, -55, 50, 0],
        'loc' => 33,
        'z' => 430,
        'panoShift' => 0,
        'fov' => 67,
        'objs' => [
            ["geo" => "house_03_f2.obj", "map" => ["house_03_f2_pt1_1024_002.jpg", "house_03_f2_pt2_2048_003.jpg"] ],
            ]

    ],
    'int3' => [ //третий этаж
        'toFloor2' => [-93, -178, 50],
        'fromFloor2' => [-157, -55, 50, 0],
        'loc' => 34,
        'z' => 757,
        'objs' => [
            ["geo" => "house_03_f3.obj", "map"=>"house_03_f3_2048_003.jpg"]
        ]

    ]
];

echo json_encode($data);
?>
