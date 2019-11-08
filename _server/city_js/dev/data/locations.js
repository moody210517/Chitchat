var locations = {
    1: {
        name: 'Локация 1',
        shadow: [60, -60],
        obj: [{
                id: 'loc1_main'
            }, {
                id: 'loc1_floor'
            }, {
                id: 'loc1_pic1'
            }, {
                id: 'loc1_pic2'
            }, {
                id: 'loc1_pic3'
            }, {
                id: 'loc1_pic4'
            }, {
                id: 'loc1_pic5'
            }, {
                id: 'loc1_sky'
            },

            {
                id: 'loc1_col'
            }
        ],
        exits: [{
            loc: '2',
            spawn: 0,
            x1: 90,
            y2: -750,
            x2: 400,
            y1: -900,
            angle: 0

        }, {
            loc: '6',

            spawn: 1,
            x1: 250,
            y1: 1450,
            x2: 550,
            y2: 1550,
            angle: 180
        }],
        z: -400,
        enters: [
            [250, 250]
        ]
    },
    2: {
        name: 'Локация 2',
        shadow: [-10, 0],
        obj: [{
            id: 'loc2_display'
        }, {
            id: 'loc02'
        }, {
            id: 'loc2_floor'
        }, {
            id: 'loc2_col'
        }, {
            id: 'loc2_p1'
        }, {
            id: 'loc2_p2'
        }, {
            id: 'loc2_p3'
        }, {
            id: 'loc2_p4'
        }, {
            id: 'loc2_p5'
        }, {
            id: 'loc2_p6'
        }, {
            id: 'loc2_p7'
        }, {
            id: 'loc2_p8'
        }, {
            id: 'loc2_sky'
        }],
        z: 17,
        enters: [
            [-500, 575]
        ],
        exits: [{
                loc: '1',
                spawn: 0,
                x1: -700,
                y2: 850,
                x2: -300,
                y1: 700,
                angle: 180
            },

            {
                loc: '3',
                spawn: 0,
                x1: 850,
                y2: 200,
                x2: 999,
                y1: -50,
                angle: 230
            }
        ],
        video: {
            obj: 'loc2_display',
            sound: [180, -1055],
            x1: -580,
            y2: -800,
            x2: 850,
            y1: -1060,
            loader_pos: [165, 250, -1085],
            loader_rot: [0, 0, 0]

        },
        /*view_zones: '2_viewzones.json'*/
    },

    3: {
        name: 'Локация 3',
        shadow: [280, -280],
        obj: [{
            id: 'loc3_floor'
        }, {
            id: 'loc3_pt1'
        }, {
            id: 'loc3_pt2'
        }, {
            id: 'loc3_pic01'
        }, {
            id: 'loc3_pic02'
        }, {
            id: 'loc3_pic03'
        }, {
            id: 'loc3_pic04'
        }, {
            id: 'loc3_pic05'
        }, {
            id: 'loc3_pic06'
        }, {
            id: 'loc3_pic07'
        }, {
            id: 'loc3_pic08'
        }, {
            id: 'loc3_pic09'
        }, {
            id: 'loc3_pic10'
        }, {
            id: 'loc3_pic11'
        }, {
            id: 'loc3_pic12'
        }, {
            id: 'loc3_pic13'
        }, {
            id: 'loc3_pic14'
        }, {
            id: 'loc3_pic15'
        }, {
            id: 'loc3_pic16'
        }, {
            id: 'loc3_pic17'
        }, {
            id: 'loc3_pic18'
        }, {
            id: 'loc3_pic19'
        }, {
            id: 'loc3_pic21'
        }, {
            id: 'loc3_pic22'
        }, {
            id: 'loc3_pic23'
        }, {
            id: 'loc3_pic24'
        }, {
            id: 'loc3_pic25'
        }, {
            id: 'loc3_pic26'
        }, {
            id: 'loc3_pic27'
        }, {
            id: 'loc3_pic28'
        }, {
            id: 'loc3_pic20'
        }, {
            id: 'loc3_sky'
        }, {
            id: 'loc3_col'
        }],
        z: 17,
        //dyn_view_zones: '3_dyn_view.json',
        enters: [
            [-500, 575]
        ],
        exits: [{
                loc: '2',
                spawn: 1,
                x1: 300,
                y2: 1100,
                x2: 600,
                y1: 950,
                angle: 180
            },

            {
                loc: '4',
                spawn: 0,
                x1: -380,
                y2: -1150,
                x2: -200,
                y1: -1250
            }
        ]
    },

    4: {
        name: 'Локация 4',
        shadow: [140, -140],
        obj: [{
            id: 'loc4_floor'
        }, {
            id: 'loc4'
        }, {
            id: 'loc4_flowers'
        }, {
            id: 'loc4_pic1'
        }, {
            id: 'loc4_pic2'
        }, {
            id: 'loc4_pic3'
        }, {
            id: 'loc4_pic4'
        }, {
            id: 'loc4_pic5'
        }, {
            id: 'loc4_col'
        }, {
            id: 'loc4_sphere'
        }],
        z: 17,
        enters: [
            [0, 575]
        ],
        exits: [{
                loc: '3',
                spawn: 1,
                x1: -350,
                y1: 777,
                y2: 1000,
                x2: -90,
                angle: 180

            },

            {
                loc: '5',
                spawn: 0,
                x1: -1300,
                y2: -345,
                x2: -1177,
                y1: -479,
                angle: 90
            }
        ]
    },

    5: {
        name: 'Локация 5',
        shadow: [-190, 190],
        obj: [{
                id: 'loc5_floor'
            }, {
                id: 'loc5'
            }, {
                id: 'loc5_display'
            }, {
                id: 'loc5_mag'
            }, {
                id: 'loc5_pic001'
            }, {
                id: 'loc5_pic002'
            }, {
                id: 'loc5_pic003'
            }, {
                id: 'loc5_pic004'
            }, {
                id: 'loc5_pic005'
            }, {
                id: 'loc5_pic006'
            }, {
                id: 'loc5_pic007'
            }, {
                id: 'loc5_pic008'
            },
            {
                id: 'loc5_collider'
            },
            /*{
                id: 'loc5_collider0'
            },
            {
                id: 'loc5_collider1'
            },

            {
                id: 'loc5_collider2'
            },
            {
                id: 'loc5_collider3'
            },
            {
                id: 'loc5_collider4'
            },
            {
                id: 'loc5_collider5'
            },
            {
                id: 'loc5_collider6'
            },
            {
                id: 'loc5_collider7'
            },
            {
                id: 'loc5_collider8'
            },
            {
                id: 'loc5_collider9'
            },

            {
                id: 'loc5_collider10'
            },

            {
                id: 'loc5_collider11'
            },

            {
                id: 'loc5_collider12'
            },

            {
                id: 'loc5_collider13'
            },

            {
                id: 'loc5_collider14'
            },

            {
                id: 'loc5_collider15'
            },

            {
                id: 'loc5_collider16'
            },

            {
                id: 'loc5_collider17'
            },

            {
                id: 'loc5_collider18'
            },

            {
                id: 'loc5_collider19'
            },

            {
                id: 'loc5_collider20'
            },

            {
                id: 'loc5_collider21'
            },

            {
                id: 'loc5_collider22'
            },

            {
                id: 'loc5_collider23'
            },

            {
                id: 'loc5_collider24'
            },

            {
                id: 'loc5_collider25'
            },

            {
                id: 'loc5_collider26'
            },

            {
                id: 'loc5_collider27'
            },

            {
                id: 'loc5_collider28'
            },

            {
                id: 'loc5_collider29'
            },

            {
                id: 'loc5_collider30'
            },

            {
                id: 'loc5_collider31'
            },

            {
                id: 'loc5_collider32'
            },

            {
                id: 'loc5_collider33'
            },

            {
                id: 'loc5_collider34'
            },

            {
                id: 'loc5_collider35'
            },

            {
                id: 'loc5_collider36'
            },

            {
                id: 'loc5_collider37'
            },

            {
                id: 'loc5_collider38'
            },

            {
                id: 'loc5_collider39'
            },

            {
                id: 'loc5_collider40'
            },

            {
                id: 'loc5_collider41'
            },

            {
                id: 'loc5_collider42'
            },

            {
                id: 'loc5_collider43'
            },

            {
                id: 'loc5_collider44'
            },

            {
                id: 'loc5_collider45'
            },

            {
                id: 'loc5_collider46'
            },

            {
                id: 'loc5_collider47'
            },

            {
                id: 'loc5_collider48'
            },

            {
                id: 'loc5_collider49'
            },

            {
                id: 'loc5_collider50'
            },

            {
                id: 'loc5_collider51'
            },

            {
                id: 'loc5_collider52'
            },

            {
                id: 'loc5_collider53'
            },

            {
                id: 'loc5_collider54'
            },

            {
                id: 'loc5_collider55'
            },

            {
                id: 'loc5_collider56'
            },

            {
                id: 'loc5_collider57'
            },

            {
                id: 'loc5_collider58'
            },

            {
                id: 'loc5_collider59'
            },

            {
                id: 'loc5_collider60'
            },

            {
                id: 'loc5_collider61'
            },

            {
                id: 'loc5_collider62'
            },

            {
                id: 'loc5_collider63'
            },

            {
                id: 'loc5_collider64'
            },

            {
                id: 'loc5_collider65'
            },

            {
                id: 'loc5_collider66'
            },

            {
                id: 'loc5_collider67'
            },

            {
                id: 'loc5_collider68'
            },

            {
                id: 'loc5_collider69'
            },

            {
                id: 'loc5_collider70'
            },

            {
                id: 'loc5_collider71'
            },*/


            {
                id: 'loc5_sphere'
            }
        ],
        z: 17,
        enters: [
            [0, 575]
        ],
        video: {
            obj: 'loc5_display',
            sound: [179, 0],
            x1: 210,
            y2: 240,
            x2: 350,
            y1: -180,
            loader_pos: [179, 189, 10],
            loader_rot: [0, Math.PI / 2, 0]

        },
        exits: [{
                loc: '4',
                spawn: 1,
                x1: -575,
                y1: 750,
                y2: 830,
                x2: -300,
                angle: 180

            },

            {
                loc: '6',
                spawn: 1,
                x1: 1050,
                y1: -100,
                y2: 170,
                x2: 1170,
                angle: 270

            }
        ]
    },

    6: {
        name: 'Локация 6',
        shadow: [-285, 285],
        obj: [{
            id: 'loc6_floor'
        }, {
            id: 'loc6'
        }, {
            id: 'loc6_collider'
        }],
        //camera_far: 4000,
        z: 17,
        enters: [
            [0, 575]
        ],
        exits: [{
                loc: '5',
                spawn: 1,
                x1: 1840,
                y1: -300,
                y2: -50,
                x2: 1910,
                angle: 270

            },

            {
                loc: '1',
                spawn: 1,
                x1: -1350,
                y1: -650,
                y2: -450,
                x2: -1200,
                angle: 90

            }
        ],
        scripts: ['customobjselect.js'],
        textures: ['text_active2.png']
    },


    7: {
        name: 'Локация 7',
        shadow: [-285, 285],
        water: {
            w: 50000,
            h: 50000,
            x: 0,
            y: 0,
            z: 0
        },
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        sun: {
            x: -600,
            y: 100,
            z: 100,
            color: 0x999999
        },
        obj: [{
            id: 'loc8'
        }, {
            id: 'loc8_antenna'
        }, {
            id: 'loc8_col'
        }, {
            id: 'loc8_handrail'
        }, {
            id: 'loc8_wineglass'
        }, {
            id: 'loc8_pic1'
        }, {
            id: 'loc8_pic2'
        }, {
            id: 'loc8_floor1'
        }, {
            id: 'loc8_floor2'
        }, {
            id: 'loc8_glass_front'
        }, {
            id: 'loc8_glass_table'
        }],
        //camera_far: 4000,
        z: 205,
        z2: 520,
        enters: [
            [0, 575]
        ],


        lifts: [{
            x1: -300,
            x2: -210,
            y1: 35,
            y2: 60,
            end_x: -220,
            end_y: -350,
            rot: 1,
            floor: 2
        }, {
            x1: -300,
            x2: -200,
            y1: -325,
            y2: -300,
            end_x: -220,
            end_y: 100,
            rot: 180,
            floor: 1
        }]
    },

    8: {
        name: 'Локация 8',
        shadow: [-285, 285],
        water: {
            w: 50000,
            h: 50000,
            x: 0,
            y: 0,
            z: 0
        },
        sun: {
            x: -450,
            y: 300,
            z: 1000,
            color: 0xffffff
        },
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8_night'
        },
        obj: [{
            id: 'loc8_night'
        }, {
            id: 'loc8_antenna_night'
        }, {
            id: 'loc8_col'
        }, {
            id: 'loc8_handrail1'
        }, {
            id: 'loc8_handrail2'
        }, {
            id: 'loc8_wineglass'
        }, {
            id: 'loc8_pic1'
        }, {
            id: 'loc8_pic2'
        }, {
            id: 'loc8_floor1_night'
        }, {
            id: 'loc8_floor2_night'
        }, {
            id: 'loc8_glass_front_night'
        }, {
            id: 'loc8_glass_table_night'
        }],
        //camera_far: 4000,
        z: 205,
        z2: 520,
        enters: [
            [0, 575]
        ],


        lifts: [{
            x1: -300,
            x2: -210,
            y1: 35,
            y2: 60,
            end_x: -220,
            end_y: -350,
            rot: 1,
            floor: 2
        }, {
            x1: -300,
            x2: -200,
            y1: -325,
            y2: -300,
            end_x: -220,
            end_y: 100,
            rot: 180,
            floor: 1
        }]
    },

    9: {
        name: 'Локация 9',

        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: -100,
            map: 'loc9'
        },

        water: {
            w: 50000,
            h: 50000,
            x: 0,
            y: 0,
            z: -100
        },
        sun: {
            x: -450,
            y: 300,
            z: 1000,
            color: 0xffffff
        },

        obj: [{
            id: 'loc9_col'
        }, {
            id: 'loc9_floor'
        }, {
            id: 'loc9_inner'
        }, {
            id: 'loc9_outer'
        }, {
            id: 'loc9_fire'
        }, {
            id: 'loc9_smog'
        }, {
            id: 'loc9_prop'
        }, {
            id: 'loc_09_candle_fire'
        }],
        //camera_far: 4000,
        z: -28,

        enters: [
            [0, 575]
        ]


    },

    10: {
        name: 'Локация 10',

        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: -100,
            rot: 90,
            map: 'loc9_night'
        },

        water: {
            w: 50000,
            h: 50000,
            x: 0,
            y: 0,
            z: -100
        },
        sun: {
            x: -450,
            y: 300,
            z: 1000,
            color: 0xffffff
        },

        obj: [{
            id: 'loc9_col_n'
        }, {
            id: 'loc9_floor_n'
        }, {
            id: 'loc9_inner'
        }, {
            id: 'loc9_outer_n'
        }, {
            id: 'loc9_fire'
        }, {
            id: 'loc9_smog'
        }, {
            id: 'loc9_prop'
        }, {
            id: 'loc_09_candle_fire'
        }],
        //camera_far: 4000,
        z: -27,

        enters: [
            [0, 575]
        ]


    },

    12: {
        name: 'street platform 1',
        obj: [{
                id: 'street_sphere'
            }, {
                id: 'street_col'
            }, {
                id: 'street_gate'
            }, {
                id: 'street_gate_floor'
            },
            {
                id: 'street_col_snow'
            }, {
                id: 'street_gate_snow'
            }, {
                id: 'street_gate_floor_snow'
            },
            {
                id: 'platform_05_snow'
            },
            {
                id: 'loc_10_pave'
            }, {
                id: 'loc_10_pave_col'
            }, {
                id: 'loc_10_pave_floor'
            }, {
                id: 'loc_10_pave_plants'
            }, {
                id: 'loc_10_pave_shadow'
            },

            {
                id: 'loc_10_08'
            }, {
                id: 'loc_10_08_col'
            }, {
                id: 'loc_10_08_floor'
            }, {
                id: 'loc_10_07'
            }, {
                id: 'loc_10_07_col'
            }, {
                id: 'loc_10_07_floor'
            }, {
                id: 'loc_10_07_plants'
            }, {
                id: 'loc_10_07_shadow'
            },

            {
                id: 'loc_10_09'
            }, {
                id: 'loc_10_09_col'
            }, {
                id: 'loc_10_09_floor'
            }, {
                id: 'loc_10_09_plants'
            },

            {
                id: 'loc_10_10'
            },
            /*{
            	id: 'loc_10_10_col'
            },*/
            {
                id: 'loc_10_10_floor'
            }, {
                id: 'loc_10_10_plants'
            }, {
                id: 'loc_10_10_shadow'
            }, {
                id: 'loc_10_10_col'
            },

            {
                id: 'loc_10_11_col'
            }, {
                id: 'loc_10_11_shadow'
            }, {
                id: 'loc_10_11_floor'
            }, {
                id: 'loc_10_11_plants'
            }, {
                id: 'loc_10_11_sled'
            },

            {
                id: 'loc_10_11_col_2'
            }, {
                id: 'loc_10_11_shadow_2'
            }, {
                id: 'loc_10_11_floor_2'
            }, {
                id: 'loc_10_11_plants_2'
            }, {
                id: 'loc_10_11_sled_2'
            }, {
                id: 'loc_10_16_collider'
            }, {
                id: 'loc_10_16_floor'
            }, {
                id: 'loc_10_16_gazebo'
            }, {
                id: 'loc_10_16_fire'
            }, {
                id: 'loc_10_17_collider'
            }, {
                id: 'loc_10_17_road_works'
            }, {
                id: 'loc_10_17_road_snow'
            }, {
                id: 'loc_10_17_road_floor'
            }, {
                id: 'loc_10_17_road_smog'
            }, {
                id: 'loc_10_17_road_shadow'
            }, {
                id: 'loc_10_17_collider_2'
            }, {
                id: 'loc_10_17_road_works_2'
            }, {
                id: 'loc_10_17_road_floor_2'
            }, {
                id: 'loc_10_17_road_smog_2'
            }, {
                id: 'loc_10_14_floor'
            }, {
                id: 'loc_10_14_chains'
            }, {
                id: 'loc_10_14_collider'
            }, {
                id: 'loc_10_14_glass'
            }, {
                id: 'loc_10_14_mt'
            }

            , {
                id: 'loc_10_18_carousel'
            }, {
                id: 'loc_10_18_coach'
            }, {
                id: 'loc_10_18_coach2'
            }, {
                id: 'loc_10_18_coach3'
            }, {
                id: 'loc_10_18_coach4'
            }, {
                id: 'loc_10_18_fence'
            }, {
                id: 'loc_10_18_horse_1'
            }, {
                id: 'loc_10_18_horse_2'
            }, {
                id: 'loc_10_18_floor'
            }, {
                id: 'loc_10_18_col'
            }, {
                id: 'loc_10_18_horse_3'
            }, {
                id: 'loc_10_18_horse_4'
            }, {
                id: 'loc_10_18_horse_5'
            }, {
                id: 'loc_10_18_horse_6'
            }, {
                id: 'loc_10_18_horse_7'
            }, {
                id: 'loc_10_18_horse_8'
            }, {
                id: 'loc_10_12_army_truck'
            }, {
                id: 'loc_10_12_collider'
            }, {
                id: 'loc_10_12_floor'
            }, {
                id: 'loc_10_13_pickup_truck'
            }, {
                id: 'loc_10_13_collider'
            }, {
                id: 'loc_10_13_floor'
            }, {
                id: 'loc_10_15_collider'
            }, {
                id: 'loc_10_15_floor'
            }, {
                id: 'loc_10_15_pavilion'
            }, {
                id: 'loc_10_15_plants'
            }

            , {
                id: 'pl_20'
            }, {
                id: 'pl_20_col'
            }, {
                id: 'pl_20_ground'
            }, {
                id: 'pl_20_wings'
            }, {
                id: 'pl_20_plants'
            }

            , {
                id: 'pl_19'
            }, {
                id: 'pl_19_col'
            }, {
                id: 'pl_19_ground'
            }, {
                id: 'pl_19_plants'
            }, {
                id: 'pl_19_b1'
            }, {
                id: 'pl_19_b2'
            }, {
                id: 'pl_19_b3'
            }, {
                id: 'pl_19_b4'
            }, {
                id: 'pl_19_b5'
            }, {
                id: 'pl_19_b6'
            }, {
                id: 'pl_19_b7'
            }, {
                id: 'pl_19_b8'
            }, {
                id: 'pl_19_b9'
            }, {
                id: 'pl_19_b10'
            }, {
                id: 'pl_19_b11'
            }, {
                id: 'pl_19_b12'
            },

            {
                id: "pl_24_floor"
            },
            {
                id: "pl_24"
            },
            {
                id: "pl_24_col"
            },

            {
                id: "pl_25_floor"
            },
            {
                id: "pl_25"
            },
            {
                id: "pl_25_col"
            },

            {
                id: "pl_26_floor"
            },
            {
                id: "pl_26"
            },
            {
                id: "pl_26_col"
            },

            {
                id: "pl_27_floor"
            },
            {
                id: "pl_27"
            },
            {
                id: "pl_27_col"
            },

            { "id": "pl_23" }, { "id": "pl_23_water" }, /*{ "id": "pl_23_water_1" }, { "id": "pl_23_water_2" }, { "id": "pl_23_water_3" },*/ { "id": "pl_23_mc_plant_k03_001" }, { "id": "pl_23_mc_plant_111_001" }, { "id": "pl_23_mc_plant_204_001" }, { "id": "pl_23_mc_plant_319_001" }, { "id": "pl_23_mc_plant_309_001" }, { "id": "pl_23_mc_plant_311_001" }, { "id": "pl_23_mc_plant_305_001" }, { "id": "pl_23_mc_plant_309_002" }, { "id": "pl_23_mc_plant_305_002" }, { "id": "pl_23_mc_plant_309_003" }, { "id": "pl_23_mc_plant_705_001" }, { "id": "pl_23_mc_plant_k13_001" }, { "id": "pl_23_mc_plant_k13_002" }, { "id": "pl_23_mc_plant_705_002" }, { "id": "pl_23_mc_plant_k13_003" }, { "id": "pl_23_mc_plant_k13_004" }, { "id": "pl_23_mc_plant_201_001" }, { "id": "pl_23_mc_plant_705_003" }, { "id": "pl_23_mc_plant_201_002" }, { "id": "pl_23_mc_tree_1_001" }, { "id": "pl_23_mc_plant_k03_002" }, { "id": "pl_23_mc_plant_204_002" }, { "id": "pl_23_mc_plant_201_003" }, { "id": "pl_23_floor" }, { "id": "pl_23_collider" }

        ],

        onInit: function() {
            //console.log(chat3d.world.googlemap.getLinks());
            //console.log(chat3d.loader);
            //for (var i in chat3d.loader.googlemap.data) {
            //console.log(chat3d.loader.googlemap.data[i].googlemap.getLinks());
            //}
            //console.log(this.col);
            this.col = new BABYLON.Mesh(new BABYLON.SphereGeometry(2000, 100, 100), new BABYLON.MeshBasicMaterial({ side: BABYLON.DoubleSide, wireframe: true, visible: false }));
            this.col.position.set(chat3d.world.custom_loc_data.gm_offset.y * -5, 0, chat3d.world.custom_loc_data.gm_offset.x * -5);
            chat3d.world.scene.add(this.col);
            this.hub = new p2phub();
            var colGeo = new BABYLON.PlaneGeometry(250, 250);
            var colMat = new BABYLON.MeshBasicMaterial({ visible: false, side: BABYLON.doubleSide });
            this.mark1 = new BABYLON.Sprite(
                new BABYLON.SpriteMaterial({
                    map: chat3d.loader.textures.get(chat3d.world.maps + 'loc/pokazyvalka.png'),

                })
            );
            this.mark1.visible = false;
            this.mark1.enabled = false;


            this.mark1_col = new BABYLON.Mesh(colGeo,
                colMat);

            this.mark1.scale.set(250, 250, 250);

            chat3d.world.scene.add(this.mark1);
            chat3d.world.scene.add(this.mark1_col);


            this.mark2 = new BABYLON.Sprite(
                new BABYLON.SpriteMaterial({
                    map: chat3d.loader.textures.get(chat3d.world.maps + 'loc/pokazyvalka2.png'),
                    //blending: BABYLON.AdditiveBlending
                    //depthTest: false
                })
            );
            this.mark2.visible = false;
            this.mark2.enabled = false;

            this.mark2_col = new BABYLON.Mesh(colGeo, colMat);

            this.mark2.scale.set(250, 250, 250);
            chat3d.world.scene.add(this.mark2);
            chat3d.world.scene.add(this.mark2_col);
            //console.log(this.mark1);
            this.setMark = function(pos, type) {

                this['mark' + type].position.copy(pos);
                this['mark' + type + '_col'].position.copy(pos);
                this['mark' + type].enabled = true;
                this['mark' + type].material.opacity = 0.3;
            };

            this.setMarkOff = function(type) {
                this['mark' + type].enabled = false;
            };

            this.sendMarkState = function(type) {

                this.hub.broadcast('markState' + type, {
                    enabled: this['mark' + type].enabled,
                    pos: this['mark' + type].position.toArray()
                });
            };

            this.showNextPano = function() {
                chat3d.world.custom_loc_data['gm_uniforms'].map.value = chat3d.world.custom_loc_data['gm_next_tex'];
                chat3d.world.location.goNext = false;

            };

            this.loadNext = function(data) {
                chat3d.world.googlemap = data;
                var nextpano = new GSVPANO.PanoLoader({ noFakeLoad: true });
                nextpano.onPanoramaLoad = function() {
                    var tex;
                    if (!chat3d.mobile_mode) {
                        var canvas = document.createElement('canvas');
                        canvas.width = 4096;
                        canvas.height = 2048;

                        var context = canvas.getContext('2d');

                        context.drawImage(this.canvas[0], 0, 0, canvas.width, canvas.height);
                        //console.log(this.canvas[0]);
                        tex = new BABYLON.Texture(canvas);
                    } else {

                        tex = new BABYLON.Texture(this);

                    }
                    tex.needsUpdate = true;
                    //console.log(tex);
                    chat3d.world.custom_loc_data['gm_uniforms'].map.value = tex;
                    chat3d.world.location.goNext = false;
                    //chat3d.world.custom_loc_data['gm_next_tex'] = tex;

                    chat3d.msg.send('nextStreetLoadDone', '');
                    //chat3d.msg.send('nextStreetMap', chat3d.world.googlemap);

                };
                var Latlng = new google.maps.LatLng(data.lat, data.lng);
                //console.log(chat3d.panorama.location, Latlng);

                nextpano.setZoom(!chat3d.mobile_mode ? 4 : 3);
                //nextpano.load(chat3d.panorama.location.latLng, chat3d.panorama.pano);
                nextpano.load(Latlng, data.platform);

                chat3d.msg.send('nextStreetLoadStart', '');
                chat3d.msg.send('nextStreetMap', chat3d.world.googlemap);
            };

            this.isSameMarkPos = function(pos, type) {
                if (pos[0] != this['mark' + type].position.x) {
                    //console.log('new x ', pos[0], this['mark' + type].position.x);
                    return false;
                }

                if (pos[1] != this['mark' + type].position.y) {
                    //console.log('new y ', pos[1], this['mark' + type].position.y);
                    return false;
                }

                if (pos[2] != this['mark' + type].position.z) {
                    //console.log('new z ', pos[2], this['mark' + type].position.z);
                    return false;
                }

                return true;
            };

            this.setCamRot = function(pos) {
                if (chat3d.disableMark) {
                    return;
                }
                this.rotation = true;
                this.targetRot = Math.atan2(pos[0], pos[2]) * 180 / Math.PI + 180;
                //console.log('setCamRot', this.targetRot);
                chat3d.move.setAutoRot(this.targetRot);
                //chat3d.move.h_angle = this.targetRot + 180;
            }

            if (chat3d.manager) {
                //console.log('manager');
                setTimeout(function() {
                    if (!chat3d.panorama) {
                        var panoramaOptions = {
                            position: new google.maps.LatLng(chat3d.world.googlemap.lat, chat3d.world.googlemap.lng),
                            pov: {
                                heading: 270,
                                pitch: 0
                            },
                            visible: true
                        };
                        var element = document.createElement('div');
                        var panorama = new google.maps.StreetViewPanorama(element, panoramaOptions);
                        //console.log(panorama.getLinks());

                        this.links = [];
                        chat3d.panorama = panorama;
                        this.goCols = [];


                        google.maps.event.addListener(panorama, 'links_changed', function() {
                            //console.log(panorama.getLinks());
                            chat3d.world.location.links = chat3d.panorama.getLinks();
                            //console.log(chat3d.world.location.links);
                            var geo = new BABYLON.BoxGeometry(400, 450, 20);
                            for (var i in chat3d.world.location.goCols) {
                                chat3d.world.scene.remove(chat3d.world.location.goCols[i]);
                            }
                            chat3d.world.location.goCols = [];
                            for (i in chat3d.world.location.links) {
                                //console.log(chat3d.pano_heading);
                                //var rowAngle = -(chat3d.world.location.links[i].heading - 90 - chat3d.pano_heading) * Math.PI / 180;
                                //console.log(chat3d.world.location.links[i].heading);


                                //var angle = -(chat3d.world.location.links[i].heading - 90 + chat3d.pano_heading) * Math.PI / 180;
                                var mesh = new BABYLON.Mesh(geo, new BABYLON.MeshBasicMaterial({ wireframe: true, visible: false }));
                                // mesh.position.set(Math.cos(rowAngle) * 500, 100, Math.sin(rowAngle) * 500);
                                //mesh.rotation.set(0, rowAngle, 0);

                                chat3d.world.scene.add(mesh);
                                chat3d.world.location.goCols.push(mesh);

                            }
                            /*if ($('#nextStep').length) {
                                $('#nextStep').html('');
                            }

                            for (var i in chat3d.world.location.links) {
                                $('#nextStep').append(
                                    $('<option/>').attr('value', i).text(i)
                                );
                            }*/

                            if (chat3d.world.location.goNext) {
                                var data = {};
                                //console.log(chat3d.panorama.location);
                                data.street = {
                                    lat: chat3d.panorama.location.latLng.lat(),
                                    lng: chat3d.panorama.location.latLng.lng(),
                                    platform: chat3d.panorama.location.pano, //chat3d.world.googlemap.platform,
                                    key_map: chat3d.world.googlemap.key_map,
                                };
                                var state = chat3d.move.get_state();
                                data.pos = state.pos;
                                data.rot = state.angle;
                                data.floor = state.floor;
                                data.cam_type = 0;
                                data.custom_loc_data = [];
                                data.location = 12;
                                //chat3d.world.set_loc(data);
                                chat3d.world.location.loadNext(data.street);
                                //chat3d.msg.send('nextStreetMap', data.street);


                                /*chat3d.loader.googlemap.clean();

                                chat3d.world.googlemap.lat = scope.panorama.location.latLng.lat();
                                chat3d.world.googlemap.lng = scope.panorama.location.latLng.lng();

                                chat3d.world.prev_init_loc = null;


                                if (chat3d.world.googlemap && !chat3d.world.googlemap.water) {
                                    chat3d.loader.googlemap.add(chat3d.world.googlemap.lat + '_' + chat3d.world.googlemap.lng, '1', chat3d.world.googlemap);
                                } else if (chat3d.world.googlemap && chat3d.world.googlemap.water) {
                                    chat3d.loader.textures.add(chat3d.world.maps + 'loc/water_' + chat3d.world.googlemap.water + '.jpg');
                                }
                                chat3d.loader.googlemap.start();*/


                            } else {
                                console.log(chat3d.panorama.getLinks());
                            }

                        });
                    } else {
                        console.log(chat3d.panorama);
                        if (chat3d.panorama.location.latLng.lat() != chat3d.world.googlemap.lat && chat3d.world.googlemap.lng != chat3d.panorama.location.latLng.lng()) {
                            chat3d.panorama.setPosition(new google.maps.LatLng(chat3d.world.googlemap.lat, chat3d.world.googlemap.lng));
                        }

                    }

                    if ($('#streetgobut').length === 0) {
                        var gobut = $('<img/>')
                            .attr('id', 'streetgobut')
                            .attr('src', 'img/streetgobut.png')
                            .css('position', 'absolute')
                            .css('bottom', '135px')
                            .css('left', '50%')
                            .css('width', '100px')
                            .css('margin-left', '-50px')
                            .css('cursor', 'pointer')
                            .css('display', 'none')
                            .click(function() {
                                if ($(this).data('n')) {
                                    chat3d.world.location.next($(this).data('n'));
                                    $(this).data('n', '');
                                }
                            });
                        $(gobut).hide();

                        $('body').append(gobut);
                    }
                    //console.log(chat3d.panorama);
                }.bind(this), 1000);
            }




            this.next = function(n) {
                this['mark1'].enabled = false;
                this['mark2'].enabled = false;
                this.sendMarkState(1);
                this.sendMarkState(2);
                //console.log(this.panorama);
                //console.log(1111111111, this.links);
                //this.links = chat3d.panorama.getLinks();
                //console.log(n, this.links[n], chat3d.panorama);
                chat3d.panorama.setPano(this.links[n].pano);
                //chat3d.panorama.setPov({ heading: this.links[n].heading, pitch: 0 });
                //this.panorama.setVisible(true);m
                this.goNext = true;
                //console.log(this.panorama);


            };



            this.goNextStreet = function(data) {
                chat3d.panorama.setPano(data.platform);
                this.loadNext(data);
                //chat3d.panorama.setPosition(new google.maps.LatLng(chat3d.world.googlemap.lat, chat3d.world.googlemap.lng));
            }


        },

        onRender: function(delta) {

            if (chat3d.manager && !this.goNext) {

                //console.log(this.links);
                //this.links = chat3d.panorama.getLinks();
                var rot = chat3d.math.norm_angle(180 - chat3d.move.get_state().angle);

                /*for (var n in this.links) {

                    var heading = chat3d.math.norm_angle(this.links[n].heading + chat3d.pano_heading);
                     var delta = Math.abs(chat3d.math.get_angle_delta(heading, rot));
                    if (delta < 40) {
                        $('#streetgobut').data('n', n).fadeIn();
                        return;
                    }
                }*/

                var raycast = chat3d.view.raycaster;
                raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);
                var vector = new BABYLON.Vector3(0, 0, 0.9);
                vector.unproject(chat3d.world.camera);
                vector.sub(raycast.ray.origin).normalize();
                raycast.far = 1000;
                raycast.ray.direction = vector;
                var fadein;
                var angle;
                $('#streetgobut').data('n', '');
                for (var i in this.goCols) {

                    angle = -(this.links[i].heading - 90 - chat3d.pano_heading) * Math.PI / 180;
                    this.goCols[i].position.set(-Math.cos(angle) * 500, 100, Math.sin(angle) * 500);
                    this.goCols[i].lookAt(raycast.ray.origin);
                    this.goCols[i].updateMatrixWorld();
                    var intersects = raycast.intersectObject(this.goCols[i]);
                    if (intersects.length) {
                        $('#streetgobut').data('n', i);

                        $('#streetgobut').fadeIn();

                        //.fadeIn();
                        fadein = true;
                        this.fadein = true;
                        //console.log('fadein');
                    }

                }

                if (!fadein) {
                    if (this.fadein) {
                        $('#streetgobut').fadeOut();
                        //console.log('fadeout');
                    } else {
                        this.fadein = false;
                    }
                    //console.log(this.goCols);
                }
            }

            if (this.mark1.enabled) {
                this.mark1.visible = true;
                this.mark1.material.opacity += delta * 2;
                this.mark1.material.opacity = Math.min(this.mark1.material.opacity, 1);
            } else {
                this.mark1.material.opacity -= delta * 2;
                if (this.mark1.material.opacity < 0.3) {
                    this.mark1.visible = false;
                }
            }
            if (this.mark2.enabled) {
                this.mark2.visible = true;
                this.mark2.material.opacity += delta;
                this.mark2.material.opacity = Math.min(this.mark2.material.opacity, 1);
            } else {
                this.mark2.material.opacity -= delta;
                if (this.mark2.material.opacity < 0.3) {
                    this.mark2.visible = false;
                }
            }

            if (chat3d.disableMark) {
                this.mark2.visible = false;
                this.mark1.visible = false;
            }




        },

        onClean: function() {
            for (var i in this.goCols) {
                chat3d.world.scene.remove(this.goCols[i]);
            }
            $('#streetgobut').fadeOut();
            chat3d.world.scene.remove(this.mark1);
            chat3d.world.scene.remove(this.mark2);
            chat3d.world.scene.remove(this.mark1_col);
            chat3d.world.scene.remove(this.mark2_col);
            chat3d.world.scene.remove(this.col);
        },

        onMouseUp: function(e) {
            if (!chat3d.disableMark) {
                if (chat3d.manager || chat3d.visitor) {
                    if (this.markActionTimer) {
                        clearTimeout(this.markActionTimer);
                        this.markActionTimer = null;
                        console.log('clean timer');
                        return true;
                    }
                    if (chat3d.pc_controls.move < 20) {

                        var x = e.clientX;
                        var y = e.clientY;
                        var raycast = chat3d.view.raycaster;
                        raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);
                        var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                        vector.unproject(chat3d.world.camera);
                        vector.sub(raycast.ray.origin).normalize();
                        raycast.far = 5000;
                        raycast.ray.direction = vector;
                        var type = '1';
                        var type2 = '2';
                        if (!chat3d.manager) {
                            type = '2';
                            type2 = '1';
                        }
                        this['mark' + type + '_col'].lookAt(raycast.ray.origin);
                        this['mark' + type + '_col'].updateMatrixWorld();
                        var intersects;
                        intersects = raycast.intersectObject(this['mark' + type + '_col']);
                        if (intersects.length && this['mark' + type].enabled) {
                            this.markActionTimer = setTimeout(function() {
                                this.setMarkOff(type);
                                this.sendMarkState(type);
                                this.markActionTimer = null;
                            }.bind(this), 200);
                        } else {
                            this['mark' + type2 + '_col'].lookAt(raycast.ray.origin);
                            this['mark' + type2 + '_col'].updateMatrixWorld();
                            intersects = raycast.intersectObject(this['mark' + type2 + '_col']);
                            if (intersects.length === 0 || !this['mark' + type2].enabled) {
                                intersects = raycast.intersectObject(this.col);
                                if (intersects.length) {
                                    //console.log(intersects[0]);
                                    var point = intersects[0].point;
                                    //var stepBack = new BABYLON.Vector3().copy(vector).multiplyScalar(-400);
                                    //point.add(stepBack);
                                    this.markActionTimer = setTimeout(function() {
                                        this.setMark(point, type);
                                        this.sendMarkState(type);
                                        this.markActionTimer = null;
                                    }.bind(this), 200);
                                }
                            }
                        }


                    }
                }
            }

            return true;
        },

        onMessage: function(data) {
            if (data) {

                //console.log(data);
                for (var i in data) {
                    var msg = data[i];
                    if (this.hub.pCounters[msg.type] && this.hub.pCounters[msg.type] > msg.counter) {
                        console.log('%c old data!!', ' background: #FF2222');
                        console.log(msg.type, this.hub.pCounters[msg.type], msg.counter);

                    } else {
                        switch (msg.type) {

                            case 'markState1':
                                if (chat3d.manager || chat3d.visitor) {
                                    if (msg.data.enabled) {

                                        if (chat3d.visitor && !this.isSameMarkPos(msg.data.pos, '1')) {
                                            this.setCamRot(msg.data.pos);
                                        }
                                        if (!this.isSameMarkPos(msg.data.pos, '1')) {
                                            this.setMark(new BABYLON.Vector3().fromArray(msg.data.pos), '1');
                                        }
                                    } else {
                                        this.setMarkOff('1');
                                    }
                                }
                                break;

                            case 'markState2':
                                if (chat3d.manager || chat3d.visitor) {
                                    if (msg.data.enabled) {
                                        if (chat3d.manager && !this.isSameMarkPos(msg.data.pos, '2')) {
                                            this.setCamRot(msg.data.pos);
                                        }
                                        if (!this.isSameMarkPos(msg.data.pos, '2')) {
                                            this.setMark(new BABYLON.Vector3().fromArray(msg.data.pos), '2');
                                        }

                                    } else {
                                        this.setMarkOff('2');
                                    }
                                }
                                break;


                            default:
                                console.log('old or unknown', msg);
                                break;


                        }
                        this.hub.onMessage(msg);
                    }
                }
            }


        },

        /*onMouseMove: function(e) {

            var x = e.clientX;
            var y = e.clientY;
            if ($('#streetgobut').data('n')) {
                var raycast = chat3d.view.raycaster;
                raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);
                var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);

                vector.unproject(chat3d.world.camera);
                vector.sub(raycast.ray.origin).normalize();
                raycast.far = 1000;
                raycast.ray.direction = vector;
                for (var i in this.goCols) {
                    var intersects = raycast.intersectObject(this.goCols[i]);
                    if (intersects.length) {
                        $('#streetgobut').fadeIn();
                        return true;
                    }
                }
                $('#streetgobut').fadeOut();
            } else {
                $('#streetgobut').fadeOut();
            }
            return true;
        },*/



        z: 20,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', 'waternormals.jpg', 'Water_1_M_Normal.jpg', 'Water_2_M_Normal.jpg'],
        scripts: ['p2player.js', 'horMirror.js', 'Water2.js']

    },



    11: {
        skybox: {
            w: 500000,
            h: 500000,
            t: 500000,
            x: 0,
            y: 0,
            z: 0,

            map: 'mars'
        },
        obj: [{
            id: 'loc_11_col'
        }, {
            id: 'loc_11_mars'
        }, {
            id: 'loc_11_station_bridge'
        }, {
            id: 'loc_11_station_pt1'
        }, {
            id: 'loc_11_station_pt2'
        }],
        z: 20
            //z: 150
    },

    13: {
        obj: [],
        z: 20,
        cam_floor: true,
        deviceOrientationListener: function(e) {


        },

        onInit: function() {

            var video = document.querySelector("#camvideo");

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

            if (navigator.getUserMedia) {
                navigator.mediaDevices.enumerateDevices()
                    .then(function(devices) {
                        devices.forEach(function(device) {
                            if (device.kind == 'videoinput') {
                                if (device.label.indexOf('facing back') != -1) {
                                    navigator.getUserMedia({
                                        video: {
                                            optional: [{
                                                sourceId: device.deviceId
                                            }]
                                        }
                                    }, handleVideo, videoError);

                                }

                            }
                        });
                    })
                    .
                catch(function(err) {
                    console.log(err.name + ": " + error.message);
                });

            }

            function handleVideo(stream) {
                video.src = window.URL.createObjectURL(stream);
            }

            function videoError(e) {
                // do something
            }

            //chat3d.touch_controls.off();
            chat3d.orientation_controls.on();


        },
        onClean: function() {
            var video = document.querySelector("#camvideo");
            video.pause();

            //chat3d.touch_controls.on();
            chat3d.orientation_controls.off();
        }
    },

    14: {
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },

        obj: [{
                id: 'loc_12_anchor'
            }, {
                id: 'loc_12_barrel'
            }, {
                id: 'loc_12_barrel2'
            }, {
                id: 'loc_12_barrel3'
            }, {
                id: 'loc_12_barrel4'
            }, {
                id: 'loc_12_bench'
            }, {
                id: 'loc_12_black_mold'
            }, {
                id: 'loc_12_bucket'
            }, {
                id: 'loc_12_bucket2'
            }, {
                id: 'loc_12_chair'
            }, {
                id: 'loc_12_chair2'
            }, {
                id: 'loc_12_chest'
            }, {
                id: 'loc_12_chest2'
            }, {
                id: 'loc_12_chest3'
            }, {
                id: 'loc_12_clock'
            }, {
                id: 'loc_12_collider'
            }, {
                id: 'loc_12_crate1'
            }, {
                id: 'loc_12_crate2'
            }, {
                id: 'loc_12_crate3'
            }, {
                id: 'loc_12_crate4'
            }, {
                id: 'loc_12_crate5'
            }, {
                id: 'loc_12_ground'
            }, {
                id: 'loc_12_ivy1'
            }, {
                id: 'loc_12_ivy1_2'
            }, {
                id: 'loc_12_ivy1_3'
            }, {
                id: 'loc_12_ivy1_4'
            }, {
                id: 'loc_12_ivy1_5'
            }, {
                id: 'loc_12_ivy2_1'
            }, {
                id: 'loc_12_ivy2_2'
            }, {
                id: 'loc_12_ivy2_3'
            }, {
                id: 'loc_12_ivy2_4'
            }, {
                id: 'loc_12_ivy2_5'
            }, {
                id: 'loc_12_ivy2_6'
            }, {
                id: 'loc_12_ivy3_1'
            }, {
                id: 'loc_12_ivy3_2'
            }, {
                id: 'loc_12_ivy3_3'
            }, {
                id: 'loc_12_knife'
            }, {
                id: 'loc_12_other'
            }, {
                id: 'loc_12_plants1_1'
            }, {
                id: 'loc_12_plants1_2'
            }, {
                id: 'loc_12_plants2_1'
            }, {
                id: 'loc_12_plants2_2'
            }, {
                id: 'loc_12_plants2_3'
            }, {
                id: 'loc_12_plants2_4'
            }, {
                id: 'loc_12_plants3_1'
            }, {
                id: 'loc_12_plants3_2'
            }, {
                id: 'loc_12_plants3_3'
            }, {
                id: 'loc_12_plants3_4'
            }, {
                id: 'loc_12_plants4_1'
            }, {
                id: 'loc_12_plants4_2'
            }, {
                id: 'loc_12_plants4_3'
            }, {
                id: 'loc_12_plants5_1'
            }, {
                id: 'loc_12_plants5_2'
            }, {
                id: 'loc_12_plants6_1'
            }, {
                id: 'loc_12_plants6_2'
            }, {
                id: 'loc_12_plants7_1'
            }, {
                id: 'loc_12_plants7_2'
            }, {
                id: 'loc_12_plants7_3'
            }, {
                id: 'loc_12_plants8_1'
            }, {
                id: 'loc_12_plants9_1'
            }, {
                id: 'loc_12_saber'
            }, {
                id: 'loc_12_spanish_moss_1'
            }, {
                id: 'loc_12_spanish_moss_2'
            }, {
                id: 'loc_12_spanish_moss_3'
            }, {
                id: 'loc_12_stone'
            }, {
                id: 'loc_12_stones'
            }, {
                id: 'loc_12_torch_1'
            }, {
                id: 'loc_12_torch_2'
            }, {
                id: 'loc_12_torch_3'
            }, {
                id: 'loc_12_torch_4'
            }, {
                id: 'loc_12_torch_5'
            }, {
                id: 'loc_12_torch_6'
            }, {
                id: 'loc_12_torch_7'
            }, {
                id: 'loc_12_tree_1'
            }, {
                id: 'loc_12_tree_2'
            }, {
                id: 'loc_12_tree2'
            }, {
                id: 'loc_12_vines_1'
            }, {
                id: 'loc_12_vines_2'
            }, {
                id: 'loc_12_vines_3'
            }, {
                id: 'loc_12_vines_4'
            }, {
                id: 'loc_12_vines_5'
            }, {
                id: 'loc_12_vines_6'
            }, {
                id: 'loc_12_wall'
            }, {
                id: 'loc_12_windows'
            }, {
                id: 'loc_12_windows_2'
            }, {
                id: 'loc_12_windows_3'
            }, {
                id: 'loc_12_windows_4'
            }, {
                id: 'loc_12_windows_5'
            }, {
                id: 'loc12_fire_1'
            }, {
                id: 'loc12_fire_2'
            }, {
                id: 'loc12_fire_3'
            }, {
                id: 'loc12_fire_4'
            }, {
                id: 'loc12_fire_5'
            }, {
                id: 'loc12_fire_6'
            }, {
                id: 'loc12_fire_7'
            }, {
                id: 'loc12_fire_8'
            }, {
                id: 'loc12_fire_9'
            }



        ],
        z: 20,
        view_zones: '14_view.json',
        dyn_view_zones: '14_dyn_view.json',

    },

    15: {
        obj: [{
            id: 'loc_14_alpha'
        }, {
            id: 'loc_14_collider'
        }, {
            id: 'loc_14_floor'
        }, {
            id: 'loc_14_main'
        }],
        z: 20,
        onInit: function() {
            console.log('%cinit custom location', ' background: #DAFF7F');
            this.black_player = null;
            this.white_player = null;
            this.comp_timer = 0;
            this.player1 = null;
            this.player2 = null;
            this.player1_ttl = 0;
            this.player2_ttl = 0;
            this.cur_turn = 'w';
            this.game_id = null;
            this.renderDelay = 0;
            this.gameEndTimer = 0;
            this.gameTime = 0;
            this.singlePlayer = true;
            this.light = new BABYLON.HemisphereLight(0xfffff9, 0x444444, 0.9);
            this.light2 = new BABYLON.DirectionalLight(0xfffff9, 0.1);
            chat3d.world.scene.add(this.light);
            chat3d.world.scene.add(this.light2);
            this.light.position.set(0, 5, 0);
            this.light2.position.set(0, 5, 0);

            this.hub = new p2phub();

            this.started = false;
            //var data = chat3d.world.custom_loc_data;
            var game = this.game = new Chess();
            var scope = this;
            var engineRunning = false;
            var cursor = 0;
            var moveList = this.moveList = [],
                scoreList = [];
            this.player = 'w';
            var entirePGN = '';

            var engine = this.engine = new Worker("data/scripts/lozza.js");
            engine.postMessage("uci");
            engine.postMessage("ucinewgame");

            this.getPlayersColor = function() {
                if (this.player1 == chat3d.selfid) {
                    return 'w';
                }
                if (this.player2 == chat3d.selfid) {
                    return 'b';
                }
                return;
            };

            this.set_player1 = function(id) {

                if (id != this.player1) {
                    if (id && this.player2 == chat3d.selfid && this.game_id) {
                        //this.board.players[0] = new ChessPlayer(this.board, 1);

                        if (this.player2 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                        }
                    }
                    if (this.player1 == chat3d.selfid && id != chat3d.selfid) {
                        console.log('%cim droped from player1 by id ' + id, ' background: #DAFF7F');
                    }

                    this.player1 = id;
                    if (id == chat3d.selfid) {
                        this.player = 'w';
                    }

                    if (!id) {
                        this.player1_ttl = 0;

                    } else {
                        this.player1_ttl = 10;


                    }
                }

            };

            this.set_player2 = function(id) {


                if (id != this.player2) {
                    if (id && this.player1 == chat3d.selfid) {
                        //this.board.players[1] = new ChessPlayer(this.board, 2);
                        console.log('%cset player 2', 'background: #DAFF7F');
                        if (this.player1 == chat3d.selfid && this.game_id) {
                            chat3d.msg.send('alert', 'player_joined');
                            console.log('%cSend player 2 joined alert', 'background: #DAFF7F');
                        }
                    }
                    this.player2 = id;
                    if (id == chat3d.selfid) {
                        this.player = 'b';
                    }

                    if (!id) {
                        this.player2_ttl = 0;

                    } else {
                        //this.singlePlayer = false;
                        console.log('%csinglePlayer mode off', 'background: #DAFF7F');
                        this.player2_ttl = 10;
                    }
                }

            };

            this.update_player1 = function(id, age) {
                if (id == this.player1) {
                    if (age < 6) {
                        this.player1_ttl = 10;
                    } else if (age > 30) {
                        this.player1_ttl = 0;
                    }
                }

            };

            this.update_player2 = function(id, age) {
                if (id == this.player2) {
                    if (age < 6) {
                        this.player2_ttl = 10;
                    } else if (age > 30) {
                        this.player2_ttl = 0;
                    }
                }

            };

            this.setGameId = function(id) {
                this.game_id = id;
                this.player1_ttl = 1;
                this.player2_ttl = 1;
            };


            this.getPlayerNum = function() {
                if (!this.game_id && this.in_game_zone) {
                    return 0;
                }

                if (this.player1 == chat3d.selfid) {
                    return 0;
                } else if (this.player2 == chat3d.selfid) {
                    return 1;
                }

                if (this.player2 != chat3d.selfid && this.player1 === null && this.game.turn() == 'w') {
                    return 0;
                }

                if (this.player1 != chat3d.selfid && this.player2 === null && this.game.turn() == 'b') {
                    return 1;
                }

                return false;
            };

            this.sendGameState = function() {
                this.stateId = Math.random();
                //console.log(this.board.orientation());
                //console.log(scope.game.turn());
                console.log('%c send game state!!', ' background: #22ff22');
                console.log('send turn', this.game.turn());
                this.cur_turn = this.game.turn();
                this.hub.broadcast('gameState', {
                    game_id: this.game_id,

                    player1: this.player1,
                    player2: this.player2,
                    cur_turn: this.game.turn(),
                    board: this.board.getCurState(),
                    board2: this.game.getBoard(),
                    game_over: this.game.game_over(),
                    stateId: this.stateId,
                    etc: this.game.getEtc()
                });
                //console.log(this.board.getCurState());
                //console.log(this.game.getEtc());
                //console.log(this.game);
                var etc = this.game.getEtc();
                console.log(etc);
                if (etc.history.length) {
                    /*for (var i in etc.history) {
                        console.log(etc.history[i].move.to, this.game.getSq(etc.history[i].move.to));
                        if (this.board.findPMesh(this.game.getSq(etc.history[i].move.to))) {
                            this.board.findPMesh(this.game.getSq(etc.history[i].move.to)).material.emissive.set(0xdddddd);
                        }
                    }*/
                }

                //проверка на конец игры
                if (!this.game_over) {
                    if (this.game.game_over()) {
                        this.game_over = true;
                        console.log('gameover');
                        if (this.getPlayersColor()) {
                            if (this.game.turn() === this.getPlayersColor()) {
                                console.log('you lose');
                                chat3d.msg.send('alert', 'game_lose');
                            } else {
                                console.log('you win');
                                chat3d.msg.send('alert', 'game_won');
                            }
                        }
                    }
                }
            };


            this.setGameState = function(data, age, counter) {
                if (this.stateId != data.stateId) {
                    //console.log('%c set game state!!', ' background: #22ff22');
                    //console.log('set turn', data.cur_turn);
                    this.board.snapbackDraggedPiece();
                    this.cur_turn = data.cur_turn;
                    /*if (this.hub.pCounters.gameState && this.hub.pCounters.gameState == counter) {
                        if (data.stateId != this.stateId) {
                            console.log('%cfalse_start', ' background: #FF2222');
                            chat3d.msg.send('alert', 'false_start');
                            return;
                        }
                    }*/
                    this.stateId = data.stateId;

                    if (age < 10) {
                        this.lastTurnTime = 0;
                    } else {
                        this.lastTurnTime = 10;
                    }


                    /*if (data.board) {
                        this.board.setCurState(data.board);
                        //console.log(this.board.fen());
                        //var msg = "position fen " + this.board.fen();
                        //engine.postMessage(msg);
                    }*/

                    if (data.board2) {
                        this.game.setBoard(data.board2);
                        if (!this.packetCount) {
                            this.board.setCurState(data.board);
                            this.packetCount = 1;
                        } else {
                            this.board.position(this.game.fen(), true);
                            this.packetCount++;
                        }
                    }

                    if (data.etc) {
                        this.game.setEtc(data.etc);
                    }

                    this.set_player1(data.player1);
                    this.set_player2(data.player2);



                    //this.cur_turn = data.cur_turn;
                    if (data.cur_turn == 0) {
                        data.cur_turn = 'w';
                    }

                    if (data.cur_turn == 1) {
                        data.cur_turn = 'b';
                    }
                    this.game.setTurn(data.cur_turn);

                    if (this.game_id && !this.game_over && data.game_over) {
                        console.log('gameover');
                        if (this.getPlayersColor()) {
                            if (this.game.turn() === this.getPlayersColor()) {
                                console.log('you lose');
                                chat3d.msg.send('alert', 'game_lose');
                            } else {
                                console.log('you win');
                                chat3d.msg.send('alert', 'game_won');
                            }
                        }
                    }
                    this.game_over = data.game_over;
                    this.game_id = 1;
                }

            };

            function fireEngine() {
                engineRunning = true;
                updateStatus();
                var currentScore;
                var msg = "position fen " + game.fen();
                console.log("GUI: " + msg);
                engine.postMessage(msg);
                msg = 'go movetime ' + 1;
                console.log("GUI: " + msg);
                engine.postMessage(msg);
                engine.onmessage = function(event) {
                    var line = event.data;
                    console.log("ENGINE: " + line);
                    var best = parseBestMove(line);
                    console.log(best);
                    if (best !== undefined) {
                        var move = game.move(best);
                        moveList.push(move);
                        if (currentScore !== undefined) {
                            if (scoreList.length > 0) {
                                scoreList.pop(); // remove the dummy score for the user's prior move
                                scoreList.push(currentScore); // Replace it with the engine's opinion
                            }
                            scoreList.push(currentScore); // engine's response
                        } else {
                            scoreList.push(0); // not expected
                        }
                        cursor++;
                        scope.board.position(game.fen(), true);
                        engineRunning = false;
                        updateStatus();
                        scope.sendGameState();
                        scope.lastTurnTime = 0;

                    } else {
                        // Before the move gets here, the engine emits info responses with scores
                        var score = parseScore(line);
                        if (score !== undefined) {
                            if (scope.player === 'w') {
                                score = -score; // convert from engine's score to white's score
                            }
                            //updateScoreGauge(score);
                            currentScore = score;
                        }
                    }
                };
            }

            function parseBestMove(line) {
                var match = line.match(/bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/);
                console.log(line);
                if (match) {
                    var bestMove = match[1];
                    var promotion = match[2];
                    return {
                        from: bestMove.substring(0, 2),
                        to: bestMove.substring(2, 4),
                        promotion: promotion
                    }
                }
            }

            function parseScore(line) {
                var match = line.match(/score\scp\s(-?\d+)/);
                if (match) {
                    return match[1];
                } else {
                    if (line.match(/mate\s-?\d/)) {
                        return 2500;
                    }
                }
            }

            function updateStatus() {

                var status = '';

                var moveColor = 'White';
                if (game.turn() === 'b') {
                    moveColor = 'Black';
                }
                console.log(game.turn());

                if (game.game_over()) {

                    if (game.in_checkmate()) {
                        status = moveColor + ' checkmated.';
                    } else if (game.in_stalemate()) {
                        status = moveColor + " stalemated";
                    } else if (game.insufficient_material()) {
                        status = "Draw (insufficient material)."
                    } else if (game.in_babylonfold_repetition()) {
                        status = "Draw (babylonfold repetition)."
                    } else if (game.in_draw()) {
                        status = "Game over (fifty move rule)."
                    }
                    console.log({
                        title: "Game Over",
                        text: status,
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonColor: "#DD6655",
                        onConfirmButtonText: 'OK',
                        closeOnConfirm: true
                    });
                    engineRunning = false;
                }

                // game still on
                else {
                    if (scope.player === 'w') {
                        status = "Computer playing Black; ";
                    } else {
                        status = "Computer playing White; ";
                    }
                    status += moveColor + ' to move.';

                    // check?
                    if (game.in_check() === true) {
                        status += ' ' + moveColor + ' is in check.';
                    }
                }

                //fenEl.html(game.fen().replace(/ /g, '&nbsp;'));
                var currentPGN = game.pgn({
                    max_width: 10,
                    newline_char: "<br>"
                });
                var matches = entirePGN.lastIndexOf(currentPGN, 0) === 0;
                if (matches) {
                    currentPGN += "<span>" + entirePGN.substring(currentPGN.length, entirePGN.length) + "</span>";
                } else {
                    entirePGN = currentPGN;
                }
                //pgnEl.html(currentPGN);
                if (engineRunning) {
                    status += ' Thinking...';
                }
                //statusEl.html(status);
            };

            var onDrop = function(source, target) {
                if (engineRunning) {
                    return 'snapback';
                }
                if (scope.board.hasOwnProperty('removeGreySquares') && typeof scope.board.removeGreySquares === 'function') {
                    scope.board.removeGreySquares();
                }

                // see if the move is legal
                var move = game.move({
                    from: source,
                    to: target,
                    //promotion: $("#promotion").val()
                });

                // illegal move
                if (move === null) return 'snapback';
                if (cursor === 0) {
                    //console.log("GUI: ucinewgame");
                    //engine.postMessage("ucinewgame");
                    //var msg = "position fen " + scope.board.fen();
                    //engine.postMessage(msg);
                }
                moveList = moveList.slice(0, cursor);
                scoreList = scoreList.slice(0, cursor);
                moveList.push(move);
                //console.log(moveList);
                // User just made a move- add a dummy score for now. We will correct this element once we hear from the engine
                scoreList.push(scoreList.length === 0 ? 0 : scoreList[scoreList.length - 1]);
                cursor = moveList.length;
            };


            var onSnapEnd = function() {
                if (!scope.game.game_over() && scope.game.turn() !== scope.player && scope.singlePlayer) {

                    //fireEngine();
                }
            };


            var onMouseoverSquare = function(square) {
                //console.log(square);

                // get list of possible moves for this square
                var moves = scope.game.moves({
                    square: square,
                    verbose: true
                });

                //console.log(scope.game.turn());


                // exit if there are no moves available for this square
                if (moves.length === 0) return;

                if (scope.board.hasOwnProperty('greySquare') && typeof scope.board.greySquare === 'function') {
                    // highlight the square they moused over
                    scope.board.greySquare(square);


                    // highlight the possible squares for this piece
                    for (var i = 0; i < moves.length; i++) {
                        scope.board.greySquare(moves[i].to);
                    }
                }
            };

            var onMouseoutSquare = function(square, piece) {
                if (scope.board.hasOwnProperty('removeGreySquares') && typeof scope.board.removeGreySquares === 'function') {
                    scope.board.removeGreySquares();
                }
            };


            var cfg = {
                cameraControls: false,
                draggable: true,
                position: 'start',
                onDrop: onDrop,
                onSetPos: function(position) {
                    this.sendGameState();
                }.bind(this),
                onMouseoutSquare: onMouseoutSquare,
                onMouseoverSquare: onMouseoverSquare,
                onSnapEnd: onSnapEnd,
                moveSpeed: 'slow',
                blackPieceColor: 0x5b3514
            };
            this.board = new ChessBoard3(cfg);

            this.board.scene.position.set(0, 81, 0);
            this.board.scene.scale.set(5, 5, 5);
            chat3d.world.scene.add(this.board.scene);

            this.resetbox = new BABYLON.Mesh(new BABYLON.CubeGeometry(14, 1, 14), new BABYLON.MeshBasicMaterial({
                visible: false
            }));
            this.resetbox.position.set(-69.5, 80, -0.5);
            chat3d.world.scene.add(this.resetbox);

            this.isResetable = function(x, y, msg) {

                if (this.getPlayersColor()) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 500;
                    raycast.ray.direction = vector;
                    intersects = raycast.intersectObject(this.resetbox);
                    if (intersects.length) {



                        return true;
                    }
                }

                return false;

            };

            this.resetBut = function(x, y) {
                if (this.isResetable(x, y, true)) {

                    chat3d.msg.send('confirm', 'game_reset');

                    return true;
                }
                return false;

            };

            this.reset = function() {
                this.game.reset();
                this.board.reset();
                this.game_over = false;
            };

            this.isClickable = function(x, y, all) {
                /*var raycast = chat3d.view.raycaster;
                raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);
                var vector = new BABYLON.Vector3(pos.x, pos.y, 0.9);
                vector.unproject(chat3d.world.camera);
                vector.sub(raycast.ray.origin).normalize();
                raycast.far = 500;
                raycast.ray.direction = vector;
                intersects = raycast.intersectObjects(this.board.scene.children, true);
                if (intersects.length) {
                    return true;
                }*/

                //console.log(this.board.raycast(pos.x, pos.y));

                if (this.board.raycast(x, y, all).mesh) {
                    return true;
                }

                return;
            }

            this.onLoop = function(delta) {
                //console.log(this.game.turn());
                //this.board.animate();
                //-50 60
                //50 130
                this.player1_ttl -= delta;
                this.player2_ttl -= delta;
                if (this.player1_ttl < 0 && this.player1) {
                    this.set_player1(null);
                }

                if (this.player2_ttl < 0 && this.player2) {
                    this.set_player2(null);
                }


                with(chat3d.world.eyes.position) {
                    if (x > -110 && x < 100 && z > 20 && z < 150) {
                        //console.log('w zone');
                        if (!this.player1) {
                            this.started = true;
                            this.player = 'w';
                            this.set_player1(chat3d.selfid);
                            chat3d.msg.send('alert', 'ingame');
                            this.sendGameState();
                            this.player1_ttl = 10;
                            console.log('set player 1');
                            if (!this.player2) {
                                //this.singlePlayer = true;
                                this.player2_ttl = 1;
                            }


                        }
                        if (this.player1 == chat3d.selfid && this.player1_ttl < 8) {
                            console.log('update self as player1');

                            this.player1_ttl = 10;
                            this.hub.broadcast('update_player1', this.player1);

                        }

                    } else if (x > -110 && x < 110 && z > -150 && z < -20) {
                        /*if (!this.started && moveList.length === 0) {
                            fireEngine();
                        }*/
                        //console.log('b zone');

                        if (!this.player2) {
                            this.started = true;
                            this.player = 'b';
                            this.set_player2(chat3d.selfid);
                            chat3d.msg.send('alert', 'ingame');
                            this.sendGameState();
                            this.player2_ttl = 10;
                            console.log('set player 2');
                            if (!this.player1) {
                                //this.singlePlayer = true;
                                this.player1_ttl = 1;
                            }
                        }
                        if (this.player2 == chat3d.selfid && this.player2_ttl < 8) {
                            //console.log('update self as player2');
                            this.player2_ttl = 10;
                            this.hub.broadcast('update_player2', this.player2);
                        }

                        //console.log(moveList.length);
                    } else {
                        //console.log('n zone');
                        this.started = false;
                        this.player = '';
                        //console.log(this.player1, chat3d.selfid);
                        if (this.player1 == chat3d.selfid) {
                            this.player1 = null;

                            this.sendGameState();
                            //this.ttt.game.playerManager.players[0].resetIntersect();

                            console.log('player 1 off');
                        }
                        if (this.player2 == chat3d.selfid) {
                            this.player2 = null;

                            this.sendGameState();
                            console.log('player 2 off');
                        }
                    }

                }
                if (this.player1 !== null && this.player2 !== null) {
                    this.singlePlayer = false;
                }
                if (!this.game_over && this.getPlayersColor()) {
                    if ((this.player1 === null && this.player1_ttl < -5) || (this.player2 === null && this.player2_ttl < -5)) {

                        if (this.cur_turn != this.getPlayersColor()) {
                            this.comp_timer += delta;
                            if (this.comp_timer > 1) {
                                this.comp_timer = 0;
                                fireEngine();
                                if (!this.singlePlayer) {
                                    chat3d.msg.send('alert', 'comp_joined');
                                }
                                this.singlePlayer = true;
                            }
                        }
                    }
                }

            };



            //this.onTouchMove = this.onMouseMove;
            //this.onTouchDown = this.onMouseDown;
            //this.onTouchUp = this.onMouseUp;

            this.lastTurnTimer = 0;
            this.lastTurnTime = 0;

            this.isGameOverReset = function(x, y) {
                if (!this.game_over) {
                    return false;
                }
                if (this.getPlayersColor()) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 500;
                    raycast.ray.direction = vector;

                    intersects = raycast.intersectObjects(this.board.scene.children);
                    if (intersects.length) {
                        return true;
                    }
                }

                return false;
            };

        },
        //mobileZShift: 20,
        //mobileLook: 120,
        lookDist: 200,
        noSlip: true,

        onRender: function(delta) {
            if (chat3d.mobile_mode && chat3d.world.camera.fov != 95) {
                chat3d.world.camera.fov = 95;
                chat3d.world.camera.updateProjectionMatrix();
            }

            var mobileLook = 30;
            if (this.getPlayersColor()) {
                mobileLook = 120;
            }

            if (chat3d.world.location.mobileLook < mobileLook) {
                chat3d.world.location.mobileLook += delta * 100;
                chat3d.world.location.mobileLook = Math.min(mobileLook, chat3d.world.location.mobileLook);
            } else if (chat3d.world.location.mobileLook > mobileLook) {
                chat3d.world.location.mobileLook -= delta * 100;
                chat3d.world.location.mobileLook = Math.max(mobileLook, chat3d.world.location.mobileLook);
            }

            this.board.animate();
            var etc = this.game.getEtc();
            if (etc.history.length) {
                var last = etc.history[etc.history.length - 1];
                var mesh = this.board.findPMesh(this.game.getSq(last.move.to));
                for (var m in this.board.scene.children) {
                    if (this.board.scene.children[m].material.name == 'w' || this.board.scene.children[m].material.name == 'b') {
                        this.board.scene.children[m].material.emissive.set(0x000000);
                    }
                }
                if (last.turn != this.getPlayersColor()) {
                    this.lastTurnTimer += delta;
                    this.lastTurnTime += delta;
                    if (this.lastTurnTimer > 1) {
                        this.lastTurnTimer = 0;
                    }
                    if (mesh) {

                        if (this.lastTurnTimer < 0.5 && this.lastTurnTime < 3) {
                            mesh.material.emissive.set(0x000000);


                        } else {
                            if (mesh.material.name == 'w') {
                                mesh.material.emissive.set(0x111111);
                            } else {
                                mesh.material.emissive.set(0x222222);
                            }

                        }
                    }
                    if (this.lastTurnTime >= 3) {
                        this.lastTurnTimer = 0;
                        mesh.material.emissive.set(0x000000);
                    }
                } else {
                    if (mesh) {
                        mesh.material.emissive.set(0x000000);
                    }
                }
            }
        },
        onClean: function() {
            chat3d.world.scene.remove(this.board.scene);
            chat3d.world.scene.remove(this.light);
            chat3d.world.scene.remove(this.resetbox);
            if (chat3d.mobile_mode) {
                chat3d.world.width = 0;
                chat3d.world.resize();
            }

        },
        onMouseMove: function(e) {
            if (!this.game_over && this.cur_turn === this.getPlayersColor()) {
                return this.board.mouseMove(e);
            }
            return true;
        },
        onMouseDown: function(e) {
            this.mouseDown = true;
            if (!this.game_over && this.cur_turn === this.getPlayersColor()) {
                this.board.mouseMove(e);
                this.board.mouseDown(e);
            } else {
                if (this.game_over && this.isGameOverReset(e.clientX, e.clientY)) {
                    chat3d.msg.send('confirm', 'game_reset');
                    return true;
                }
                if (this.getPlayersColor() && this.isClickable(e.clientX, e.clientY, true)) {
                    chat3d.msg.send('alert', 'partners_turn');
                }
            }

            return true;
        },
        onMouseUp: function(e) {
            this.mouseDown = false;
            if (this.getPlayersColor()) {
                if (this.resetBut(e.clientX, e.clientY)) {

                    return true;
                }

                /*if (this.game_over && this.isGameOverReset(e.clientX, e.clientY)) {
                    chat3d.msg.send('confirm', 'game_reset');
                    return true;
                }*/
            }



            if (!this.game_over && this.cur_turn === this.getPlayersColor()) {
                this.board.mouseUp(e);
            }


            return true;

        },

        onTouchMove: function(e) {
            if (!this.game_over && this.cur_turn === this.getPlayersColor()) {
                this.board.mouseMove(e, true);
                if (this.board.getDragInfo()) {
                    return;
                }
            }
            return true;
        },

        onTouchUp: function(e) {
            if (this.getPlayersColor()) {
                if (this.resetBut(e.changedTouches[0].clientX, e.changedTouches[0].clientY)) {

                    return;
                }

                if (this.game_over && this.isGameOverReset(e.changedTouches[0].clientX, e.changedTouches[0].clientY)) {

                    chat3d.msg.send('confirm', 'game_reset');
                    return;
                }
            }



            if (!this.game_over && this.cur_turn === this.getPlayersColor()) {
                if (this.board.getDragInfo()) {
                    this.board.mouseUp(e, true);
                    return;
                }
            }

            return true;

        },

        onTouchDown: function(e) {
            if (this.board.getDragInfo()) {
                return;
            }
            if (!this.game_over) {
                if (this.cur_turn === this.getPlayersColor()) {
                    //this.onTouch = true;
                    this.board.mouseMove(e, true);
                    this.board.mouseDown(e, true);
                } else {
                    if (this.getPlayersColor() && this.isClickable(e.touches[0].clientX, e.touches[0].clientY, true)) {
                        chat3d.msg.send('alert', 'partners_turn');
                    }
                }
            }
            return true;

        },

        onMessage: function(data) {
            if (data) {

                //console.log(data);
                for (var i in data) {
                    var msg = data[i];
                    if (this.hub.pCounters[msg.type] && this.hub.pCounters[msg.type] > msg.counter) {
                        console.log('%c old data!!', ' background: #FF2222');
                        console.log(msg.type, this.hub.pCounters[msg.type], msg.counter);

                    } else {
                        switch (msg.type) {

                            case 'gameState':
                                this.setGameState(msg.data, msg.age, msg.counter);

                                break;

                            case 'update_player1':
                                this.update_player1(msg.data, msg.age);
                                break;

                            case 'update_player2':
                                this.update_player2(msg.data, msg.age);
                                break;

                            case 'resetmsg':
                                if (msg.age < 10 && this.hub.checkCounter(msg)) {
                                    chat3d.msg.send('alert', 'reseted');
                                    console.log('%creset alert', 'background: #DAFF7F');
                                }
                                break;

                            default:
                                console.log('old or unknown', msg);
                                break;


                        }
                        this.hub.onMessage(msg);
                    }
                }
            }


        },

        onView: function(x, y) {
            //console.log(this.game);
            var pointer = false;
            var move = false;

            if (this.isResetable(x, y) || this.isGameOverReset(x, y)) {
                $('#world canvas').attr('title', chat3d.translate.reset);
                pointer = true;

            } else if (!this.game_over && this.getPlayersColor() == this.cur_turn && this.isClickable(x, y)) {
                pointer = true;

                $('#world canvas').attr('title', '');

            } else {
                pointer = false;
                $('#world canvas').attr('title', '');
            }

            if (this.board.getDragInfo()) {
                move = true;
            }

            if (pointer || move) {
                if (move) {
                    $('canvas').addClass('pointer_on_game_obj_move');
                } else {
                    $('canvas').addClass('pointer_on_game_obj');
                    $('canvas').removeClass('pointer_on_game_obj_move');
                }

            } else {
                $('canvas').removeClass('pointer_on_game_obj').removeClass('pointer_on_game_obj_move');
            }




        },

        onConfirm: function(type) {
            console.log(type);

            switch (type) {
                case 'game_reset':
                    console.log('reset callback');
                    this.reset();
                    this.sendGameState();
                    if (this.player1 && this.player2) {
                        var msgto;
                        if (this.player1 == chat3d.selfid) {
                            msgto = this.player2;
                        } else {
                            msgto = this.player1;
                        }
                        this.hub.broadcast('resetmsg', msgto);
                    }

                    break;
            }

        },

        /*onCharUnload: function() {
        	this.p2phub.rollcall();
        },*/

        geo: ['B.json', 'K.json', 'N.json', 'P.json', 'Q.json', 'R.json'],
        //fonts: ['helvetiker_regular.typeface.js'],
        scripts: ['chessboard3.js', 'chess.js', 'p2player.js', 'chessPlayer.js', 'chessComp.js', 'tween.min.js'],
        textures: ['chess4.jpg']
    },

    16: {
        obj: [{
                "id": "loc_16_plant_2_001"
            }, {
                "id": "loc_16_tree_001_1"
            }, {
                "id": "loc_16_plant_1_001"
            }, {
                "id": "loc_16_plant_3_002"
            }, {
                "id": "loc_16_plant_2_002"
            }, {
                "id": "loc_16_plant_5_001"
            }, {
                "id": "loc_16_plant_5_002"
            }, {
                "id": "loc_16_tree_001_5"
            }, {
                "id": "loc_16_plant_1_002"
            }, {
                "id": "loc_16_plant_1_003"
            }, {
                "id": "loc_16_plant_3_007"
            }, {
                "id": "loc_16_plant_4_001"
            }, {
                "id": "loc_16_plant_3_001"
            }, {
                "id": "loc_16_plant_2_003"
            }, {
                "id": "loc_16_plant_7_001"
            }, {
                "id": "loc_16_plant_6_001"
            }, {
                "id": "loc_16_plant_10_002"
            }, {
                "id": "loc_16_plant_11_001"
            }, {
                "id": "loc_16_plant_9"
            }, {
                "id": "loc_16_plant_8"
            }, {
                "id": "loc_16_plant_2_004"
            }, {
                "id": "loc_16_tree_001_4"
            }, {
                "id": "loc_16_plant_7_002"
            }, {
                "id": "loc_16_plant_1_004"
            }, {
                "id": "loc_16_plant_4_002"
            }, {
                "id": "loc_16_tree_001_3"
            }, {
                "id": "loc_16_plant_4_003"
            }, {
                "id": "loc_16_plant_2_005"
            }, {
                "id": "loc_16_plant_5_003"
            }, {
                "id": "loc_16_plant_7_003"
            }, {
                "id": "loc_16_plant_3_005"
            }, {
                "id": "loc_16_plant_3_004"
            }, {
                "id": "loc_16_plant_1_005"
            }, {
                "id": "loc_16_plant_6_002"
            }, {
                "id": "loc_16_plant_3_003"
            }, {
                "id": "loc_16_plant_11_002"
            }, {
                "id": "loc_16_plant_10_001"
            }, {
                "id": "loc_16_plant_6_003"
            }, {
                "id": "loc_16_plant_7_004"
            }, {
                "id": "loc_16_plant_3_006"
            }, {
                "id": "loc_16_tree_003_1"
            }, {
                "id": "loc_16_tree_003_2"
            }, {
                "id": "loc_16_tree_003_3"
            }, {
                "id": "loc_16_tree_004"
            }, {
                "id": "loc_16_tree_005_1"
            }, {
                "id": "loc_16_tree_001_2"
            }, {
                "id": "loc_16_tree_002_1"
            }, {
                "id": "loc_16_tree_002_2"
            }, {
                "id": "loc_16_tree_005_1"
            }, {
                "id": "loc_16_stuff"
            }, {
                "id": "loc_16_flat_ground"
            }, {
                "id": "loc_16_pavement"
            }, {
                "id": "loc_16_ground"
            }, {
                "id": "loc_16_collider"
            }

        ],
        z: 20,
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        //mobileLook: 125,



        onInit: function() {
            var loc = this;
            this.player1 = null;
            this.player2 = null;
            this.player1_ttl = 0;
            this.player2_ttl = 0;
            this.game_id = null;
            this.renderDelay = 0;
            this.mouseDown = false;
            this.gameEndTimer = 0;
            this.hub = new p2phub();
            this.game = new CHECKERS.Game();
            chat3d.world.scene.add(this.game.controller.scene);
            this.game.controller.scene.scale.set(12.5, 12.5, 12.5);
            this.game.controller.scene.position.set(-500, 1, -500);

            this.set_player1 = function(id) {

                if (id != this.player1) {
                    if (id) {


                        if (this.player2 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                        }
                    }
                    if (this.player1 == chat3d.selfid && id != chat3d.selfid) {
                        console.log('%cim droped from player1 by id ' + id, ' background: #DAFF7F');
                    }

                    this.player1 = id;

                    if (!id) {
                        this.player1_ttl = 0;

                    } else {
                        this.player1_ttl = 10;


                    }
                }

            };

            this.set_player2 = function(id) {


                if (id != this.player2) {
                    if (id) {

                        console.log('%cset player 2', 'background: #DAFF7F');
                        if (this.player1 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                            console.log('%cSend player 2 joined alert', 'background: #DAFF7F');
                        }
                    }
                    this.player2 = id;

                    if (!id) {
                        this.player2_ttl = 0;

                    } else {
                        this.singlePlayer = false;
                        console.log('%csinglePlayer mode off', 'background: #DAFF7F');
                        this.player2_ttl = 10;

                    }
                }

            };

            this.update_player1 = function(id, age) {
                if (id == this.player1) {
                    if (age < 6) {
                        this.player1_ttl = 10;
                    } else if (age > 30) {
                        this.player1_ttl = 0;
                    }
                }

            };

            this.update_player2 = function(id, age) {
                if (id == this.player2) {
                    if (age < 6) {
                        this.player2_ttl = 10;
                    } else if (age > 30) {
                        this.player2_ttl = 0;
                    }
                }

            };

            this.interchangePlayers = function() {
                var player1 = this.player1;
                var player2 = this.player2;
                this.set_player1(player2);
                this.set_player2(player1);
                this.hub.broadcast('set_player1', this.player1);
                this.hub.broadcast('set_player2', this.player2);


            };

            this.sendGameState = function() {
                //console.log('send Game State', this.game.getBoard());
                this.hub.broadcast('gameState', {
                    game_id: this.game_id,
                    board: this.game.getBoard(),
                    player1: this.player1,
                    player2: this.player2,
                    cur_turn: this.game.getCurTurn(),
                    stateId: this.stateId
                });
                if (this.game.gameOver()) {
                    if (this.game.gameOver() == this.game.getCurTurn()) {
                        chat3d.msg.send('alert', 'game_won');
                        console.log("Congrats You win! (send state)");
                    } else {
                        chat3d.msg.send('alert', 'game_lose');
                        console.log("You lose. (send state)");
                    }
                }

            };

            this.setGameId = function(id) {
                this.game_id = id;
            };

            this.setGameState = function(data, age, counter) {
                if (this.hub.pCounters.gameState && this.hub.pCounters.gameState == counter) {
                    if (data.stateId != this.stateId) {
                        console.log('%cfalse_start', ' background: #FF2222');
                        chat3d.msg.send('alert', 'false_start');
                    }
                }
                console.log('set Game State', data);
                var gamestate = this.game.gameOver();
                this.game_id = data.game_id;
                this.set_player1(data.player1);
                this.set_player2(data.player2);
                this.game.setBoard(data.board);
                this.game.setCurTurn(data.cur_turn);
                if (!gamestate && this.game.gameOver()) {
                    if (this.game.gameOver() == this.game.getCurTurn()) {
                        chat3d.msg.send('alert', 'game_won');
                        console.log("Congrats You win! (set state)");
                    } else {
                        chat3d.msg.send('alert', 'game_lose');
                        console.log("You lose. (set state)");
                    }
                }

            };

            this.getPlayerNum = function() {
                if (this.player1 == chat3d.selfid) {
                    return 2;
                }
                if (this.player2 == chat3d.selfid) {
                    return 1;
                }
                return false;
            };


            this.isResetable = function(x, y, msg) {
                var playerNum = this.getPlayerNum();
                if (playerNum !== false) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 1000;
                    raycast.ray.direction = vector;
                    intersects = raycast.intersectObject(this.resetbox);
                    if (intersects.length) {

                        return true;
                    }
                } else if (msg) {

                    chat3d.msg.send('alert', 'cant_reset');


                }

                return false;

            };

            this.resetBut = function(x, y) {
                if (this.isResetable(x, y, true)) {
                    chat3d.msg.send('confirm', 'game_reset');

                    return true;
                }
                return false;

            };

            this.reset = function() {
                this.game.reset();
                this.setGameId(null);
                //this.set_player1(null);
                //this.set_player2(null);
            };

            this.resetbox = new BABYLON.Mesh(new BABYLON.CubeGeometry(30, 10, 30), new BABYLON.MeshBasicMaterial({
                visible: false
            }));
            this.resetbox.position.set(-660, 100, 0);
            chat3d.world.scene.add(this.resetbox);

            this.comp = new checkerscomp();

            //console.log(this.game.getBoard());
            //console.log(this.comp.getBoard());
            //console.log(this.game.boardToComp());
            //this.game.boardFromComp(this.comp.getBoard());


        },

        onMouseDown: function(e) {
            if (!this.game.gameOver() && this.getPlayerNum() !== false) {
                if (this.getPlayerNum() == this.game.getCurTurn()) {

                    this.mouseDown = true;
                    this.game.controller.onMouseDown(e, this.game.getCurTurn());
                } else {
                    if (this.game.controller.checkMousePos(e, this.game.getCurTurn())) {

                        chat3d.msg.send('alert', 'partners_turn');
                        //console.log('partners_turn');
                    }
                }
            }
            return true;
        },

        onMouseUp: function(e) {
            if (this.getPlayerNum() !== false) {
                console.log('mousUp is player');
                if (chat3d.pc_controls.move < 20) {
                    var x = e.clientX;
                    var y = e.clientY;
                    if (this.resetBut(x, y)) {

                        return true;
                    }
                }
                if (this.getPlayerNum() == this.game.getCurTurn()) {
                    this.mouseDown = false;
                    this.game.controller.onMouseUp(e);
                    console.log('mouseUp');
                }


            }
            return true;
        },

        onMouseMove: function(e) {
            if (this.getPlayerNum() !== false) {
                if (this.getPlayerNum() == this.game.getCurTurn()) {
                    this.game.controller.onMouseMove(e);
                    if (this.game.controller.selectedPiece()) {
                        //console.log(this.game.controller.selectedPiece());
                        return false;
                    }
                }
            }
            return true;
        },

        onTouchMove: function(e) {
            var pos = { layerX: e.changedTouches[0].clientX, layerY: e.changedTouches[0].clientY };

            if (this.getPlayerNum() !== false) {
                if (this.getPlayerNum() == this.game.getCurTurn()) {
                    this.game.controller.onMouseMove(pos);
                    if (this.game.controller.selectedPiece()) {
                        //console.log(this.game.controller.selectedPiece());
                        return false;
                    }
                }
            }
            return true;
        },

        onTouchUp: function(e) {
            var pos = { layerX: e.changedTouches[0].clientX, layerY: e.changedTouches[0].clientY };
            if (this.getPlayerNum() !== false) {
                console.log('mousUp is player');
                if (chat3d.pc_controls.move < 20) {
                    var x = pos.layerX;
                    var y = pos.layerY;
                    if (this.resetBut(x, y)) {

                        return true;
                    }
                }
                if (this.getPlayerNum() == this.game.getCurTurn()) {
                    this.mouseDown = false;
                    this.game.controller.onMouseUp(pos);
                    console.log('mouseUp');
                }


            }
            return true;

        },

        onTouchDown: function(e) {
            //console.log(e);
            var pos = { layerX: e.changedTouches[0].clientX, layerY: e.changedTouches[0].clientY };
            if (chat3d.move.side_speed === 0 && chat3d.move.front_speed === 0 && chat3d.move.h_rot_speed === 0) {
                if (!this.game.gameOver() && this.getPlayerNum() !== false) {
                    if (this.getPlayerNum() == this.game.getCurTurn()) {

                        this.mouseDown = true;
                        this.game.controller.onMouseDown(pos, this.game.getCurTurn());
                    } else {
                        if (this.game.controller.checkMousePos(pos, this.game.getCurTurn())) {

                            chat3d.msg.send('alert', 'partners_turn');
                            //console.log('partners_turn');
                        }
                    }
                }
            }
            return true;

        },

        onClean: function() {
            chat3d.world.scene.remove(this.game.controller.scene);
            chat3d.world.scene.remove(this.resetbox);

            chat3d.world.width = 0;
            chat3d.world.resize();

        },

        onLoop: function(delta) {
            this.player1_ttl -= delta;
            this.renderDelay += delta;
            if (this.renderDelay > 30) {
                if (this.game_id) {
                    if (this.player1 == chat3d.selfid) {
                        this.set_player1(null);
                        this.sendGameState();

                    }

                    if (this.player2 == chat3d.selfid) {
                        this.set_player2(null);
                        this.sendGameState();
                    }
                }

                return;
            }


            if (this.player1) {

                if (this.player1_ttl <= 0) {
                    this.player1 = null;
                    console.log('%cdrop player1', 'background: #DAFF7F');
                }

            }

            this.player2_ttl -= delta;
            if (this.player2) {

                if (this.player2_ttl <= 0) {
                    this.player2 = null;
                    console.log('%cdrop player2', 'background: #DAFF7F');
                }
            }

            var pos_x = chat3d.world.eyes.position.x;
            var pos_y = chat3d.world.eyes.position.z;
            //console.log(this.getPlayerNum());

            if (pos_x > -850 && pos_x < 850 && pos_y > -690 && pos_y < 690) {
                if (this.renderDelay < 30) {
                    if (!this.player1 && this.player2 != chat3d.selfid) {
                        this.set_player1(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player1_ttl = 10;
                        console.log('set player 1');
                    }

                    if (!this.player2 && this.player1 != chat3d.selfid) {
                        this.set_player2(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player2_ttl = 10;
                        console.log('set player 2');
                    }
                    if (this.player1 == chat3d.selfid && this.player1_ttl < 8) {
                        console.log('update self as player1');
                        this.player1_ttl = 10;
                        this.hub.broadcast('update_player1', this.player1);

                    }

                    if (this.player2 == chat3d.selfid && this.player2_ttl < 8) {
                        console.log('update self as player2');
                        this.player2_ttl = 10;
                        this.hub.broadcast('update_player2', this.player2);
                    }
                }
            } else {
                if (this.player1 == chat3d.selfid) {
                    this.player1 = null;
                    this.sendGameState();
                    console.log('player 1 off');
                }

                if (this.player2 == chat3d.selfid) {
                    this.player2 = null;
                    this.sendGameState();
                    console.log('player 2 off');
                }
            }
            //console.log(this.getPlayerNum(), this.game.getCurTurn());
            if (this.getPlayerNum !== false) {
                if (this.player1 && !this.player2 && this.player2_ttl < -5 && this.game.getCurTurn() === 1) {
                    if (!this.game.gameOver()) {
                        this.compTimer += delta;
                        if (this.compTimer > 1) {
                            this.compTimer = 0;
                            this.comp.setBoard(this.game.boardToComp());
                            this.comp.turn();
                            this.game.boardFromComp(this.comp.getBoard());
                            this.game.setCurTurn(2);
                            this.sendGameState();
                        }
                    }
                } else {
                    this.compTimer = 0;
                }
            } else {
                this.compTimer = 0;
            }




        },

        onView: function(x, y) {
            var pointer = false;
            var move = false;

            var playerNum = this.getPlayerNum();
            if (playerNum !== false) {
                if (this.isResetable(x, y)) {
                    pointer = true;
                    $('#world canvas').attr('title', chat3d.translate.reset);


                } else if (this.getPlayerNum() == this.game.getCurTurn()) {
                    //console.log(x, y);
                    if (this.game.controller.checkMousePos({ layerX: x, layerY: y },
                            this.game.getCurTurn())) {
                        pointer = true;
                        if (this.game.controller.getSelectedPiece()) {
                            move = true;
                        }
                    }
                }


            }

            if (pointer || move) {
                if (move) {
                    $('canvas').addClass('pointer_on_game_obj_move');
                } else {
                    $('canvas').addClass('pointer_on_game_obj');
                    $('canvas').removeClass('pointer_on_game_obj_move');
                }

            } else {
                $('canvas').removeClass('pointer_on_game_obj').removeClass('pointer_on_game_obj_move');
            }

        },

        onRender: function(delta) {
            this.renderDelay = 0;
            this.game.controller.onAnimationFrame(delta);
            if (chat3d.mobile_mode && chat3d.world.camera.fov != 95) {
                chat3d.world.camera.fov = 95;
                chat3d.world.camera.updateProjectionMatrix();
            }

            if (!chat3d.mobile_mode && chat3d.world.camera.fov != 70) {
                chat3d.world.camera.fov = 70;
                chat3d.world.camera.updateProjectionMatrix();
            }
            var targetLook = 30;
            if (this.getPlayerNum() !== false) {
                targetLook = 125;
            }
            if (this.mobileLook > targetLook) {
                this.mobileLook -= delta * 100;
                if (this.mobileLook < targetLook) {
                    this.mobileLook = targetLook;
                }
            } else if (this.mobileLook < targetLook) {
                this.mobileLook += delta * 100;
                if (this.mobileLook > targetLook) {
                    this.mobileLook = targetLook;
                }
            }


        },

        onMessage: function(data) {
            if (data) {

                for (var i in data) {
                    var msg = data[i];
                    if (this.hub.pCounters[msg.type] && this.hub.pCounters[msg.type] > msg.counter) {
                        console.log('%c old data!!', ' background: #FF2222');

                    } else {
                        switch (msg.type) {


                            case 'gameState':
                                this.setGameState(msg.data, msg.age, msg.counter);

                                break;

                            case 'update_player1':
                                this.update_player1(msg.data, msg.age);
                                break;

                            case 'update_player2':
                                this.update_player2(msg.data, msg.age);
                                break;

                            case 'resetmsg':
                                if (msg.age < 10 && this.hub.checkCounter(msg)) {
                                    chat3d.msg.send('alert', 'reseted');
                                    console.log('%creset alert', 'background: #DAFF7F');
                                }
                                break;

                            default:
                                console.log('old or unknown', msg);
                                break;


                        }
                        this.hub.onMessage(msg);
                    }
                }
            }

        },


        onConfirm: function(type) {


            switch (type) {
                case 'game_reset':
                    console.log('reset callback');
                    this.reset();
                    this.sendGameState();

                    if (this.player1 && this.player2) {
                        var msgto;
                        if (this.player1 == chat3d.selfid) {
                            msgto = this.player2;
                        } else {
                            msgto = this.player1;
                        }
                        this.hub.broadcast('resetmsg', msgto);
                    }

                    break;
            }

        },

        scripts: ['p2player.js', 'checkers/Game.js', 'checkers/BoardController.js', 'babylonjs/Projector.js', 'checkers/comp.js'],
        textures: ['piece_shadow.png', 'loc_16_dark_king_3_1024.jpg', 'loc_16_dark_chess_1_512.jpg', 'loc_16_light_chess_2_512.jpg', 'loc_16_light_king_2_1024.jpg'],
        geo: ['piece.js', 'light_chess.js', 'light_king.js'],
    },

    17: {
        obj: [{
            "id": "loc_15_cubes"
        }, {
            "id": "loc_15_main"
        }, {
            "id": "loc_15_collider"
        }],
        z: 20,

        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        /*water: {
        	w: 50000,
        	h: 50000,
        	x: 0,
        	y: 0,
        	z: -390
        },*/
        onInit: function() {
            this.player1 = null;
            this.player2 = null;
            this.player1_ttl = 0;
            this.player2_ttl = 0;
            this.game_id = null;
            this.renderDelay = 0;
            this.mouseDown = false;
            this.gameEndTimer = 0;
            this.computerSkill = 0;
            this.gameTime = 0;


            this.singlePlayer = true;
            var _cubeGeo = new BABYLON.CubeGeometry(7.7, 7.7, 7.7);
            var cubeGeo = new BABYLON.BufferGeometry().fromGeometry(_cubeGeo);
            //console.log(cubeGeo);
            var srcGeo = chat3d.loader.geo.get('data/geometry/loc/cubes.js')
            for (var i = 0; i < 72; i++) {
                cubeGeo.attributes.uv.array[i] = srcGeo.attributes.uv.array[i];
            }
            var path = chat3d.world.maps + 'loc/';
            this.p1Cube = new BABYLON.Mesh(cubeGeo, new BABYLON.MeshBasicMaterial({
                map: chat3d.loader.textures.get(path + 'loc_15_cubes_green_E2.png')
            }));
            this.p2Cube = new BABYLON.Mesh(cubeGeo, new BABYLON.MeshBasicMaterial({
                map: chat3d.loader.textures.get(path + 'loc_15_cubes_blue_2_E2.png')
            }));
            //this.p1Cube.position.set(0, 190, -5);
            //this.p2Cube.position.set(0, 190, -5);


            /*this.p1Cube.scale.set(0.01, 0.01, 0.01);
            this.p2Cube.scale.set(0.01, 0.01, 0.01);

            this.p1Cube.position.set(0, 0.03, -0.33);
            this.p2Cube.position.set(0, 0.03, -0.33);*/

            this.p1Cube.rotation.x = Math.PI;
            this.p2Cube.rotation.x = Math.PI;
            chat3d.world.scene.add(this.p1Cube);
            chat3d.world.scene.add(this.p2Cube);


            this.p1CubePlace = new BABYLON.Object3D();
            this.p2CubePlace = new BABYLON.Object3D();
            this.p1CubePlace.position.set(0, 0.03, -0.4);
            this.p2CubePlace.position.set(0, 0.03, -0.4);


            this.reset = function() {
                if ((this.ttt.game.playerManager.players[0] instanceof Demo.Player.Computer) ||
                    (this.ttt.game.playerManager.players[1] instanceof Demo.Player.Computer)) {
                    this.computerSkill++;
                }
                if (this.ttt) {
                    chat3d.world.scene.remove(this.ttt.scene);

                }
                this.ttt = new Demo.Scene({
                    dims: 4,
                    position: new BABYLON.Vector3(0, 166, 0)
                });



                chat3d.world.scene.add(this.ttt.scene);
                this.ttt.game.init({
                    userFirst: true
                });
                this.manager = this.ttt.game;


                this.setGameId(null);
                //this.hub.broadcast('gameid', this.game_id);



                this.cur_turn = 0;
                //this.hub.broadcast('cur_turn', this.cur_turn);*/

                this.sendGameState();

                this.ttt.game.last1 = 100;
                this.ttt.game.last2 = 100;
                //this.hub.broadcast('last1', 100);
                //this.hub.broadcast('last2', 100);


            };


            this.resetIntersect = Demo.Player.User.prototype.resetIntersect;
            this.isClickable = Demo.Player.User.prototype.getCubeIntersect;

            this.resetbox = new BABYLON.Mesh(new BABYLON.CubeGeometry(20, 20, 20), new BABYLON.MeshBasicMaterial({
                visible: false
            }));
            this.resetbox.position.set(-256, 100, -256);
            chat3d.world.scene.add(this.resetbox);

            this.isResetable = function(x, y, msg) {
                var playerNum = this.getPlayerNum();
                if (playerNum !== false) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 500;
                    raycast.ray.direction = vector;
                    intersects = raycast.intersectObject(this.resetbox);
                    if (intersects.length) {



                        return true;
                    }
                } else if (msg) {
                    if (chat3d.world.eyes.position.distanceTo(this.gamezone) < 400) {
                        chat3d.msg.send('alert', 'cant_reset');
                    }

                }

                return false;

            };

            this.resetBut = function(x, y) {
                if (this.isResetable(x, y, true)) {
                    //this.reset();
                    //this.sendCubes();
                    chat3d.msg.send('confirm', 'game_reset');

                    return true;
                }
                return false;

            };

            this.sendCubes = function() {

                this.sendGameState();

            };

            this.checkForDraw = function() {
                var cubes = this.ttt.collisions;
                var colored = 0;
                for (var i in cubes) {
                    if (cubes[i].ttt) {
                        colored++;
                    }
                }

                if (colored == 64) {
                    return true;
                }
                return false;
            };

            this.checkForTTT = function(colored) {
                colored = colored || 0;
                if (this.getPlayerNum() !== false && colored !== 0) {
                    if (!this.ttt.game.gameOver) {
                        this.ttt.game.checkForTTT();
                        if (this.ttt.game.gameOver) {
                            if (this.getPlayerNum() == this.ttt.game.gameOver - 1) {
                                chat3d.msg.send('alert', 'game_won');
                                console.log("Congrats You win! (set)");
                            } else {
                                chat3d.msg.send('alert', 'game_lose');
                                console.log("You lose. (set)");
                            }
                        } else if (this.checkForDraw()) {
                            this.ttt.game.gameOver = 3;
                            chat3d.msg.send('alert', 'game_draw');
                            console.log("It's a draw! (checkForTTT)");
                        }
                    } else {
                        this.ttt.game.gameOver = false;
                        this.ttt.game.checkForTTT(true);
                    }

                } else {
                    this.ttt.game.gameOver = false;
                    this.ttt.game.checkForTTT(true);
                }
            };



            //this.sendCubes();
            this.hub = new p2phub();
            this.gamezone = new BABYLON.Vector3();
            this.resetPlayers = function() {


            };

            this.getPlayerNum = function() {
                if (!this.game_id && this.in_game_zone) {
                    return 0;
                }

                if (this.player1 == chat3d.selfid) {
                    return 0;
                } else if (this.player2 == chat3d.selfid) {
                    return 1;
                }

                return false;
            };

            this.cur_turn = 0;

            this.next_turn = function() {
                //this.ttt.game.checkForTTT(true);
                if (!this.ttt.game.gameOver) {
                    if (this.cur_turn === 0) {
                        this.cur_turn = 1;
                    } else {
                        this.cur_turn = 0;
                    }
                    //this.hub.broadcast('cur_turn', this.cur_turn);
                    this.sendGameState();
                    this.ttt.game.playerManager.players[this.cur_turn].takeTurn();
                }

            };

            this.set_player1 = function(id) {

                if (id != this.player1) {
                    if (id && (this.ttt.game.playerManager.players[0] instanceof Demo.Player.Computer)) {
                        this.ttt.game.playerManager.players[0] = new Demo.Player.User({
                            context: this.ttt.game,
                            name: 'player1',
                            cssColor: "#00FF00"
                        });

                        if (this.player2 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                        }
                    }
                    if (this.player1 == chat3d.selfid && id != chat3d.selfid) {
                        console.log('%cim droped from player1 by id ' + id, ' background: #DAFF7F');
                    }

                    this.player1 = id;

                    if (!id) {
                        this.player1_ttl = 0;

                    } else {
                        this.player1_ttl = 10;


                    }
                }

            };

            this.set_player2 = function(id) {


                if (id != this.player2) {
                    if (id && (this.ttt.game.playerManager.players[1] instanceof Demo.Player.Computer)) {
                        this.ttt.game.playerManager.players[1] = new Demo.Player.User({
                            context: this.ttt.game,
                            name: 'player2',
                            cssColor: "#FF0000"
                        });
                        console.log('%cset player 2', 'background: #DAFF7F');
                        if (this.player1 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                            console.log('%cSend player 2 joined alert', 'background: #DAFF7F');
                        }
                    }
                    this.player2 = id;

                    if (!id) {
                        this.player2_ttl = 0;

                    } else {
                        this.singlePlayer = false;
                        console.log('%csinglePlayer mode off', 'background: #DAFF7F');
                        this.player2_ttl = 10;

                    }
                }

            };

            this.update_player1 = function(id, age) {
                if (id == this.player1) {
                    if (age < 6) {
                        this.player1_ttl = 10;
                    } else if (age > 30) {
                        this.player1_ttl = 0;
                    }
                }

            };

            this.update_player2 = function(id, age) {
                if (id == this.player2) {
                    if (age < 6) {
                        this.player2_ttl = 10;
                    } else if (age > 30) {
                        this.player2_ttl = 0;
                    }
                }

            };

            this.isFirstTurn = function() {
                var cubes = this.ttt.collisions;

                for (var i in cubes) {
                    if (cubes[i].ttt) {
                        return false;
                    }
                }
                return true;

            };

            this.interchangePlayers = function() {
                var player1 = this.player1;
                var player2 = this.player2;
                this.set_player1(player2);
                this.set_player2(player1);
                this.hub.broadcast('set_player1', this.player1);
                this.hub.broadcast('set_player2', this.player2);


            }

            this.setGameId = function(id) {


                this.game_id = id;
            };



            this.sendGameState = function() {
                var list = [];
                var cubes = this.ttt.collisions;

                var last1;
                var last2;
                for (var i in cubes) {
                    list.push(cubes[i].ttt);
                    if (cubes[i].last) {
                        if (cubes[i].last == 'player1') {
                            last1 = i;
                        } else {
                            last2 = i;
                        }

                        cubes[i].last = false;
                    }
                }
                this.stateId = Math.random();

                this.hub.broadcast('gameState', {
                    game_id: this.game_id,
                    cubes: list,
                    player1: this.player1,
                    player2: this.player2,
                    cur_turn: this.cur_turn,
                    stateId: this.stateId
                });

                if (last1 !== undefined) {
                    this.hub.broadcast('last1', last1);
                    this.ttt.game.last1 = (this.player1 == chat3d.selfid) ? 101 : last1;
                    this.ttt.game.last1Time = 0;
                }

                if (last2 !== undefined) {
                    this.hub.broadcast('last2', last2);
                    this.ttt.game.last2 = (this.player2 == chat3d.selfid) ? 101 : last2;
                    this.ttt.game.last2Time = 0;
                }

                if (this.ttt.game.gameOver && this.getPlayerNum() !== false) {
                    if (this.getPlayerNum() == this.ttt.game.gameOver - 1) {
                        chat3d.msg.send('alert', 'game_won');
                        console.log("Congrats You win!");
                    } else {
                        chat3d.msg.send('alert', 'game_lose');
                        console.log("You lose. (send)");
                    }
                } else {
                    if (this.checkForDraw()) {
                        this.ttt.game.gameOver = 3;
                        chat3d.msg.send('alert', 'game_draw');
                        console.log("It's a draw! (send)");
                    }
                }

            };

            this.setGameState = function(data, age, counter) {
                if (this.hub.pCounters.gameState && this.hub.pCounters.gameState == counter) {
                    if (data.stateId != this.stateId) {
                        console.log('%cfalse_start', ' background: #FF2222');
                        chat3d.msg.send('alert', 'false_start');
                    }
                }
                this.game_id = data.game_id;
                var cubes = this.ttt.collisions;
                var colored = 0;
                for (var i in cubes) {

                    if (cubes[i].ttt) {
                        colored++;
                    }
                }

                for (var i in data.cubes) {
                    if (cubes[i]) {
                        cubes[i].ttt = data.cubes[i];
                    }
                }
                //this.player1 = data.player1;
                //this.player2 = data.player2;
                this.set_player1(data.player1);
                this.set_player2(data.player2);

                this.cur_turn = data.cur_turn;
                this.stateId = data.stateId;

                this.checkForTTT(colored);
                if (this.ttt.game.gameOver) {
                    this.gameEndTimer = age;
                } else {
                    this.gameEndTimer = 0;
                }

            };

            this.set_last1 = function(n, age, counter) {
                if (age < 10 && n != this.ttt.game.last1 && counter > parseInt(this.hub.pCounters.last1)) {
                    this.ttt.game.last1 = n;
                    this.ttt.game.last1Time = 0;
                }
            };

            this.set_last2 = function(n, age, counter) {
                if (age < 10 && n != this.ttt.game.last2 && counter > parseInt(this.hub.pCounters.last2)) {
                    this.ttt.game.last2 = n;
                    this.ttt.game.last2Time = 0;

                }
            };

            //this.reset();
            this.ttt = new Demo.Scene({
                dims: 4,
                position: new BABYLON.Vector3(0, 166, 0)
            });



            chat3d.world.scene.add(this.ttt.scene);
            this.ttt.game.init({
                userFirst: true
            });
            this.manager = this.ttt.game;
            this.goResetBox = new BABYLON.Mesh(new BABYLON.CubeGeometry(270, 270, 270), new BABYLON.MeshBasicMaterial({ visible: false }));
            this.goResetBox.position.y = 175;
            chat3d.world.scene.add(this.goResetBox);
            this.isGameOverReset = function(x, y) {
                if (!this.ttt.game.gameOver) {
                    return false;
                }
                if (this.getPlayerNum() !== false) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 500;
                    raycast.ray.direction = vector;

                    intersects = raycast.intersectObject(this.goResetBox);
                    if (intersects.length) {
                        return true;
                    }
                }

                return false;
            };


        },

        onClean: function() {
            chat3d.world.scene.remove(this.ttt.scene);
            chat3d.world.scene.remove(this.resetbox);
            chat3d.world.scene.remove(this.p1Cube);
            chat3d.world.scene.remove(this.p2Cube);
            chat3d.world.scene.remove(this.goResetBox);
        },

        onMouseDown: function() {
            this.mouseDown = true;
            return true;
        },

        onMouseUpEnd: function(e) {
            this.mouseDown = false;
            if (chat3d.pc_controls.move < 20) {
                var x = e.clientX;
                var y = e.clientY;
                var pos = {
                    x: ((x - e.currentTarget.offsetLeft) / e.currentTarget.width) * 2 - 1,
                    y: -((y - e.currentTarget.offsetTop) / e.currentTarget.height) * 2 + 1
                };

                if (this.resetBut(x, y)) {

                    return true;
                }

                if (this.isGameOverReset(x, y)) {
                    chat3d.msg.send('confirm', 'game_reset');
                    return true;
                }
                var playerObj;
                if (this.ttt.game.playerManager.players[0] instanceof Demo.Player.User) {
                    playerObj = this.ttt.game.playerManager.players[0];
                } else {
                    playerObj = this.ttt.game.playerManager.players[1];
                }
                var intersected = playerObj.getCubeIntersect(pos);


                if (intersected.length) {
                    var playerNum = this.getPlayerNum();
                    if (playerNum !== false) {


                        if (!this.ttt.game.gameOver) {
                            if (this.cur_turn == playerNum) {
                                //this.ttt.game.checkForTTT(true);
                                if (!this.game_id) {
                                    if (intersected.length && intersected[0].object.ttt === null) {
                                        console.log('new game ', this.player1, this.player2);
                                        if (this.player2 == chat3d.selfid) {
                                            this.set_player2(this.player1);

                                        }
                                        this.set_player1(chat3d.selfid);
                                        //this.hub.broadcast('set_player1', this.player1, 'force');
                                        //this.hub.broadcast('set_player2', this.player2, 'force');
                                        if (!this.player2) {
                                            this.singlePlayer = true;
                                        }

                                        this.setGameId(chat3d.selfid);
                                        //this.hub.broadcast('gameid', this.game_id);

                                        this.ttt.game.playerManager.players[playerNum].selectCube(pos);

                                    }

                                } else {
                                    this.ttt.game.playerManager.players[playerNum].selectCube(pos);
                                }



                            } else {
                                chat3d.msg.send('alert', 'partners_turn');
                                /*if (!this.isFirstTurn()) {
                                	chat3d.msg.send('alert', 'partners_turn');
                                } else {
                                	this.interchangePlayers();
                                	this.ttt.game.playerManager.players[0].selectCube(pos);

                                }*/
                            }
                        } else {
                            console.log('%cgameover', 'background: #DAFF7F');
                            chat3d.msg.send('alert', 'game_over');
                        }
                    } else {
                        if (chat3d.world.eyes.position.distanceTo(this.gamezone) < 600) {
                            chat3d.msg.send('alert', 'game_in_progress');
                        }

                    }
                }

            }
            //console.log(this.player1, this.player2, chat3d.selfid);

            //return true;

        },

        onView: function(x, y) {
            var pointer = false;

            if (this.isResetable(x, y) || this.isGameOverReset(x, y)) {
                pointer = true;
                $('#world canvas').attr('title', chat3d.translate.reset);

            } else if (!this.ttt.game.gameOver &&
                this.in_game_zone &&
                this.getPlayerNum() !== false &&
                this.cur_turn == this.getPlayerNum() &&
                !this.mouseDown &&
                this.isClickable({
                    x: (x / window.innerWidth) * 2 - 1,
                    y: -(y / window.innerHeight) * 2 + 1
                }, true).length) {
                pointer = true;
                $('#world canvas').attr('title', "");
            } else {
                pointer = false;
                $('#world canvas').attr('title', "");
            }


            if (pointer) {
                $('canvas').addClass('pointer_on_game_obj');

            } else {
                $('canvas').removeClass('pointer_on_game_obj');
            }



        },

        onTouchUpEnd: function(e) {
            var x = e.changedTouches[0].clientX;
            var y = e.changedTouches[0].clientY;
            var pos = {
                x: ((x) / window.innerWidth) * 2 - 1,
                y: -((y) / window.innerHeight) * 2 + 1
            };
            if (Math.abs(x - chat3d.touch_controls.start_touch.x) < 100 && Math.abs(y - chat3d.touch_controls.start_touch.y) < 100) {
                if (this.resetBut(x, y)) {
                    return true;
                }

                if (this.isGameOverReset(x, y)) {
                    chat3d.msg.send('confirm', 'game_reset');
                    return true;
                }

                var playerObj;
                if (this.ttt.game.playerManager.players[0] instanceof Demo.Player.User) {
                    playerObj = this.ttt.game.playerManager.players[0];
                } else {
                    playerObj = this.ttt.game.playerManager.players[1];
                }
                var intersected = playerObj.getCubeIntersect(pos);

                if (intersected.length) {
                    var playerNum = this.getPlayerNum();
                    if (playerNum !== false) {

                        if (!this.ttt.game.gameOver) {
                            if (this.cur_turn == playerNum) {
                                //this.ttt.game.checkForTTT(true);


                                //this.ttt.game.playerManager.players[playerNum].selectCube(pos);
                                if (!this.game_id) {
                                    if (intersected.length && intersected[0].object.ttt === null) {
                                        if (this.player2 == chat3d.selfid) {
                                            this.set_player2(this.player1);

                                        }
                                        this.set_player1(chat3d.selfid);
                                        //this.hub.broadcast('set_player1', this.player1, 'force');
                                        //this.hub.broadcast('set_player2', this.player2, 'force');
                                        if (!this.player2) {
                                            this.singlePlayer = true;
                                        }

                                        this.setGameId(chat3d.selfid);
                                        //this.hub.broadcast('gameid', this.game_id);

                                        this.ttt.game.playerManager.players[playerNum].selectCube(pos);

                                    }

                                } else {
                                    this.ttt.game.playerManager.players[playerNum].selectCube(pos);
                                }

                            } else {
                                chat3d.msg.send('alert', 'partners_turn');
                                /*if (!this.isFirstTurn()) {
                                	chat3d.msg.send('alert', 'partners_turn');
                                } else {
                                	this.interchangePlayers();

                                	this.ttt.game.playerManager.players[0].selectCube(pos);

                                }*/
                            }
                        } else {
                            console.log('%cgameover', 'background: #DAFF7F');
                            chat3d.msg.send('alert', 'game_over');

                        }
                    } else {
                        if (chat3d.world.eyes.position.distanceTo(this.gamezone) < 600) {
                            chat3d.msg.send('alert', 'game_in_progress');
                        }
                    }
                }
            }

            //return true;

        },


        onLoop: function(delta) {
            //console.log(chat3d.selfid);
            this.gameTime += delta;
            //this.hub.onLoop(delta);
            this.player1_ttl -= delta;
            this.renderDelay += delta;
            if (this.renderDelay > 30) {
                if (this.game_id) {
                    if (this.player1 == chat3d.selfid) {
                        this.set_player1(null);
                        this.sendGameState();

                    }

                    if (this.player2 == chat3d.selfid) {
                        this.set_player2(null);
                        this.sendGameState();
                    }
                }

                return;
            }


            if (this.player1) {


                //console.log(this.player1_ttl);
                if (this.player1_ttl <= 0) {
                    this.player1 = null;
                    console.log('%cdrop player1', 'background: #DAFF7F');
                }

                if (this.game_id && this.player2_ttl < -3 && this.player1 == chat3d.selfid) {
                    if (this.ttt.game.playerManager.players[1] instanceof Demo.Player.User) {
                        this.ttt.game.playerManager.players[1] = new Demo.Player.Computer({
                            context: this.ttt.game,
                            name: 'player2',
                            cssColor: "#FF0000",
                            skill: this.computerSkill
                        });
                        if (!this.singlePlayer) {
                            console.log('comp joined');
                            if (this.gameTime > 10) {
                                chat3d.msg.send('alert', 'comp_joined');
                            }
                        }
                        if (this.cur_turn == 1) {
                            //this.ttt.game.checkForTTT(true);
                            if (!this.ttt.game.gameOver) {
                                this.ttt.game.playerManager.players[1].takeTurn();
                                console.log('comp takeTurn');
                            }
                        }
                    }

                }

            }
            this.player2_ttl -= delta;
            //console.log(this.player2_ttl);

            if (this.player2) {

                if (this.player2_ttl <= 0) {
                    this.player2 = null;
                    console.log('%cdrop player2', 'background: #DAFF7F');
                }

                if (this.game_id && this.player1_ttl < -3 && this.player2 == chat3d.selfid) {
                    if (this.ttt.game.playerManager.players[0] instanceof Demo.Player.User) {
                        this.ttt.game.playerManager.players[0] = new Demo.Player.Computer({
                            context: this.ttt.game,
                            name: 'player1',
                            cssColor: "#00FF00",
                            skill: this.computerSkill
                        });
                        if (this.gameTime > 10) {
                            chat3d.msg.send('alert', 'comp_joined');
                        }
                        if (this.cur_turn == 0) {
                            //this.ttt.game.playerManager.players[0].takeTurn();
                            //this.cur_turn = 1;
                            //this.hub.broadcast('cur_turn', this.cur_turn);
                            //this.ttt.game.checkForTTT(true);
                            if (!this.ttt.game.gameOver) {
                                this.ttt.game.playerManager.players[0].takeTurn();
                                console.log('comp takeTurn');
                            }
                        }
                    }

                }
            }

            if (!this.player1 && !this.player2 && this.player1_ttl < 7) {
                if (this.ttt.game.playerManager.players[0] instanceof Demo.Player.Computer) {
                    this.ttt.game.playerManager.players[0] = new Demo.Player.User({
                        context: this.ttt.game,
                        name: 'player1',
                        cssColor: "#00FF00"
                    });
                }

                if (this.ttt.game.playerManager.players[1] instanceof Demo.Player.Computer) {
                    this.ttt.game.playerManager.players[1] = new Demo.Player.User({
                        context: this.ttt.game,
                        name: 'player2',
                        cssColor: "#FF0000"
                    });
                }

            }




            if (chat3d.world.eyes.position.distanceTo(this.gamezone) < 750) {
                this.in_game_zone = true;

                if (this.game_id && this.renderDelay <= 30) {



                    if (!this.player1 && this.player2 != chat3d.selfid && this.player1_ttl < 7) {
                        //this.player1 = chat3d.selfid;
                        this.set_player1(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        //this.hub.broadcast('set_player1', this.player1);
                        this.sendGameState();
                        //this.resetPlayers();
                        this.player1_ttl = 10;
                        console.log('set player 1');
                        if (!this.player2) {
                            this.singlePlayer = true;
                        }
                        //delete localStorage['ttt_last_player_2'];
                    }
                    if (!this.player2 && this.player1 != chat3d.selfid && this.player2_ttl < 7) {
                        //this.player2 = chat3d.selfid;
                        this.set_player2(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        //this.hub.broadcast('set_player2', this.player2);
                        this.sendGameState();
                        //this.resetPlayers();
                        this.player2_ttl = 10;
                        console.log('set player 2');
                        //localStorage['ttt_last_player_2'] = true;
                    }
                }






                if (this.player1 == chat3d.selfid && this.player1_ttl < 8) {
                    console.log('update self as player1');

                    this.player1_ttl = 10;
                    this.hub.broadcast('update_player1', this.player1);

                }

                /*if (this.player1 == this.player2 && this.player1 == chat3d.selfid) {
                	this.player2 = null;
                	this.hub.broadcast('set_player2', null);
                }*/

                if (this.player2 == chat3d.selfid && this.player2_ttl < 8) {
                    console.log('update self as player2');
                    this.player2_ttl = 10;
                    this.hub.broadcast('update_player2', this.player2);
                }
            } else {
                this.in_game_zone = false;
                if (this.player1 == chat3d.selfid) {
                    this.player1 = null;
                    //chat3d.msg.send('alert', 'leftgame');
                    //this.hub.broadcast('set_player1', null);
                    this.sendGameState();
                    this.ttt.game.playerManager.players[0].resetIntersect();
                    //this.resetPlayers();
                    console.log('player 1 off');
                }
                if (this.player2 == chat3d.selfid) {
                    this.player2 = null;
                    //chat3d.msg.send('alert', 'leftgame');
                    //this.hub.broadcast('set_player2', null);
                    this.sendGameState();
                    this.ttt.game.playerManager.players[1].resetIntersect();
                    //this.resetPlayers();
                    console.log('player 2 off');
                }

            }



            if (chat3d.selfid != 'dummy') {
                if (this.ttt.game.gameOver) {
                    if (!this.player1 && !this.player2) {
                        var minid = chat3d.selfid;
                        for (var i in chat3d.world.chars) {
                            minid = Math.min(chat3d.world.chars[i].id, minid);
                        }
                        if (minid == chat3d.selfid) {
                            this.reset();
                        }
                    } else {
                        this.gameEndTimer += delta;
                        if (this.gameEndTimer > 30) {
                            var minid = chat3d.selfid;
                            this.gameEndTimer = 0;
                            for (var i in chat3d.world.chars) {
                                minid = Math.min(chat3d.world.chars[i].id, minid);
                            }
                            if (minid == chat3d.selfid) {
                                this.reset();

                            }
                        }
                    }



                } else {
                    this.gameEndTimer = 0;
                }
            }



            //this.p1Cube.rotation.y += delta;
            //this.p2Cube.rotation.y += delta;
        },

        onRender: function(delta) {
            this.renderDelay = 0;
            this.ttt.game.last1Time += delta;
            this.ttt.game.last2Time += delta;
            /*if (chat3d.world.eyes.position.distanceTo(this.gamezone) > 1000) {
            	chat3d.world.water.visible = true;

            }
            else {
            	chat3d.world.water.visible = false;

            }*/

            if (this.ttt.game.last1 != 100 && this.ttt.game.last1Time > 2) {
                //this.hub.broadcast('last1', 100);
                this.ttt.game.last1 = 100;
                this.ttt.game.last1Time = 0;
            }

            if (this.ttt.game.last2 != 100 && this.ttt.game.last2Time > 2) {
                //this.hub.broadcast('last2', 100);
                this.ttt.game.last2 = 100;
                this.ttt.game.last2Time = 0;
            }

            this.ttt.game.setUniforms(this.mapMult, delta);

            if (!this.player1) {
                if (this.p1CubePlace.parent) {
                    this.p1CubePlace.parent.remove(this.p1CubePlace);

                    console.log('%c remove player2 cube', 'background: #DAFF7F');
                }
                this.p1Cube.visible = false;
            } else {
                if (chat3d.world.chars[this.player1] && chat3d.world.chars[this.player1].head) {
                    if (chat3d.world.chars[this.player1].head != this.p1CubePlace.parent) {
                        chat3d.world.chars[this.player1].head.add(this.p1CubePlace);

                        console.log('%c add player1 cube', 'background: #DAFF7F');
                    }
                    chat3d.world.chars[this.player1].pivot.updateMatrix(true, true);
                    //chat3d.world.chars[this.player1].pivot.updateMatrixWorld(true, true);
                    chat3d.world.chars[this.player1].forceAnim = true;
                    this.p1Cube.visible = true;
                    this.p1Cube.position.setFromMatrixPosition(this.p1CubePlace.matrixWorld);
                    if (!chat3d.world.chars[this.player1].visible) {
                        this.p1Cube.visible = false;
                    }
                } else {
                    if (this.p1CubePlace.parent) {
                        this.p1CubePlace.parent.remove(this.p1CubePlace);
                        console.log('%c remove player1 cube', 'background: #DAFF7F');
                    }
                    this.p1Cube.visible = false;
                }
            }

            if (!this.player2) {
                if (this.p2CubePlace.parent) {
                    this.p2CubePlace.parent.remove(this.p2CubePlace);
                    console.log('%c remove player2 cube', 'background: #DAFF7F');
                }
                this.p2Cube.visible = false;
            } else {
                if (chat3d.world.chars[this.player2] && chat3d.world.chars[this.player2].head) {
                    if (chat3d.world.chars[this.player2].head != this.p2CubePlace.parent) {
                        chat3d.world.chars[this.player2].head.add(this.p2CubePlace);

                        console.log('%c add player2 cube', 'background: #DAFF7F');
                    }
                    chat3d.world.chars[this.player2].pivot.updateMatrix(true, true);
                    //chat3d.world.chars[this.player2].pivot.updateMatrixWorld(true, true);
                    chat3d.world.chars[this.player2].forceAnim = true;
                    this.p2Cube.visible = true;
                    this.p2Cube.position.setFromMatrixPosition(this.p2CubePlace.matrixWorld);
                    if (!chat3d.world.chars[this.player2].visible) {
                        this.p2Cube.visible = false;
                    }
                } else {
                    if (this.p2CubePlace.parent) {
                        this.p2CubePlace.parent.remove(this.p2CubePlace);
                        console.log('%c remove player2 cube', 'background: #DAFF7F');
                    }
                    this.p2Cube.visible = false;
                }
            }

            if (!this.game_id) {
                this.p1Cube.visible = false;
                this.p2Cube.visible = false;

            }

        },

        onMessage: function(data) {
            if (data) {

                //console.log(data);
                for (var i in data) {
                    var msg = data[i];
                    if (this.hub.pCounters[msg.type] && this.hub.pCounters[msg.type] > msg.counter) {
                        console.log('%c old data!!', ' background: #FF2222');
                        console.log(msg.type, this.hub.pCounters[msg.type], msg.counter);

                    } else {
                        switch (msg.type) {


                            case 'last1':
                                this.set_last1(msg.data, msg.age, msg.counter);
                                break;

                            case 'last2':
                                this.set_last2(msg.data, msg.age, msg.counter);
                                break;

                            case 'gameState':
                                this.setGameState(msg.data, msg.age, msg.counter);

                                break;

                            case 'update_player1':
                                this.update_player1(msg.data, msg.age);
                                break;

                            case 'update_player2':
                                this.update_player2(msg.data, msg.age);
                                break;

                            case 'resetmsg':
                                if (msg.age < 10 && this.hub.checkCounter(msg)) {
                                    chat3d.msg.send('alert', 'reseted');
                                    console.log('%creset alert', 'background: #DAFF7F');
                                }
                                break;

                            default:
                                console.log('old or unknown', msg);
                                break;


                        }
                        this.hub.onMessage(msg);
                    }
                }
            }

        },


        onConfirm: function(type) {
            console.log(type);

            switch (type) {
                case 'game_reset':
                    console.log('reset callback');
                    this.reset();
                    //this.sendCubes();
                    if (this.player1 && this.player2) {
                        var msgto;
                        if (this.player1 == chat3d.selfid) {
                            msgto = this.player2;
                        } else {
                            msgto = this.player1;
                        }
                        this.hub.broadcast('resetmsg', msgto);
                    }

                    break;
            }

        },
        mobileLook: 25,

        textures: ['loc_15_cubes_blue_2_E2.png', 'loc_15_cubes_green_E2.png', 'loc_15_cubes_grey_3_E1.png'],
        scripts: ['p2player.js', 'babylonjs/Projector.js', 'ttt/config.js', 'ttt/interactions.js', 'ttt/player-manager.js', 'ttt/scene.js', 'ttt/game.js', 'ttt/computer.js', 'ttt/camera.js', 'ttt/setup.js', 'ttt/user.js', 'ttt/util.js', 'ttt/cubes.js']

    },

    18: {
        obj: [{ "id": "loc_17_ground" }, { "id": "loc_17_main" }, { "id": "loc_17_collider" }, { "id": "mc_plant_103_001" }, { "id": "mc_tree_1_001" }, { "id": "mc_plant_101_002" }, { "id": "mc_plant_110_001" }, { "id": "mc_plant_103_002" }, { "id": "mc_plant_111_001" }, { "id": "mc_plant_111_002" }, { "id": "mc_plant_116_001" }, { "id": "mc_plant_206_001" }, { "id": "mc_plant_204_002" }, { "id": "mc_plant_201_001" }, { "id": "mc_plant_214_001" }, { "id": "mc_plant_103_003" }, { "id": "mc_plant_101_001" }, { "id": "mc_plant_116_002" }, { "id": "mc_plant_116_003" }, { "id": "mc_plant_103_004" }, { "id": "mc_plant_111_003" }, { "id": "mc_plant_208_001" }, { "id": "mc_plant_110_002" }, { "id": "mc_plant_201_002" }, { "id": "mc_plant_204_001" }, { "id": "mc_plant_208_002" }, { "id": "mc_plant_206_002" }, { "id": "mc_tree_3_001" }, { "id": "mc_tree_3_002" }, { "id": "mc_tree_4_001" }, { "id": "mc_tree_5_002" }, { "id": "mc_tree_1_002" }, { "id": "mc_tree_2_001" }, { "id": "mc_tree_2_002" }, { "id": "mc_tree_5_001" }, { "id": "mc_tree_3_003" }, { "id": "mc_plant_111_004" }, { "id": "mc_plant_201_003" }, { "id": "mc_plant_201_004" }],
        z: 20,
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        mobileLook: -15,

        onInit: function() {
            this.player1 = null;
            this.player2 = null;
            this.player1_ttl = 0;
            this.player2_ttl = 0;
            this.game_id = null;
            this.renderDelay = 0;
            this.gameEndTimer = 0;
            this.gameTime = 0;
            this.singlePlayer = true;
            //this.cur_turn = 0;

            this.resetbox = new BABYLON.Mesh(new BABYLON.CubeGeometry(40, 40, 40), new BABYLON.MeshBasicMaterial({
                visible: false
            }));
            this.resetbox.position.set(735, 80, 35);
            chat3d.world.scene.add(this.resetbox);


            this.hub = new p2phub();
            this.gamezone = new BABYLON.Vector3();

            var geopath = 'data/geometry/loc/';
            var pointer_geo = chat3d.loader.geo.get(geopath + 'loc_17_pointer.js');
            pointer_geo.center();
            var texpath = chat3d.world.maps + 'loc/';
            /*if (!chat3d.mobile_mode) {
                this.pointer1 = new BABYLON.Mesh(pointer_geo, new BABYLON.MeshBasicMaterial({ map: chat3d.loader.textures.get(texpath + 'loc_17_pointer_light_001.jpg') }));
                this.pointer2 = new BABYLON.Mesh(pointer_geo, new BABYLON.MeshBasicMaterial({ map: chat3d.loader.textures.get(texpath + 'loc_17_pointer_red_001.jpg') }));
            } else {
                this.pointer1 = new BABYLON.Object3D();
                this.pointer2 = new BABYLON.Object3D();
            }*/



            this.pointer1 = new BABYLON.Object3D();
            this.pointer2 = new BABYLON.Object3D();

            this.pointer1.position.set(0, 600, 0);
            this.pointer2.position.set(0, 600, 0);
            //chat3d.world.scene.add(this.pointer1);
            //chat3d.world.scene.add(this.pointer2);

            /*if (!chat3d.mobile_mode) {
                this.pointer1Mesh = new BABYLON.Mesh(pointer_geo, new BABYLON.MeshBasicMaterial({ map: chat3d.loader.textures.get(texpath + 'loc_17_pointer_light_001.jpg') }));
                this.pointer2Mesh = new BABYLON.Mesh(pointer_geo, new BABYLON.MeshBasicMaterial({ map: chat3d.loader.textures.get(texpath + 'loc_17_pointer_red_001.jpg') }));
                chat3d.world.scene.add(this.pointer1Mesh);
                chat3d.world.scene.add(this.pointer2Mesh);
                this.pointer1Mesh.position.copy(this.pointer1.position);
                this.pointer2Mesh.position.copy(this.pointer2.position);
            }*/

            var chip_geo = chat3d.loader.geo.get(geopath + 'loc_17_chip.js');
            chip_geo.center();
            var _boardGeo = new BABYLON.Geometry();
            for (var i = 0; i < 6; i++) {

                for (var j = 0; j < 7; j++) {
                    var mesh = new BABYLON.Mesh(chip_geo);


                    mesh.position.set(j * 87, 5 * 87 - i * 87, 0);
                    mesh.updateMatrixWorld();
                    _boardGeo.merge(chip_geo, mesh.matrixWorld);
                }
            }
            var boardGeo = new BABYLON.BufferGeometry();
            boardGeo.fromGeometry(_boardGeo);
            var index = new Float32Array(1440 * 42);

            var n = 0;
            for (i = 0; i < 1440 * 42; i += 1440) {
                for (var ii = 0; ii < 1440; ii++) {
                    index[i + ii] = n;
                }

                n++;
            }
            boardGeo.addAttribute('indexf', new BABYLON.BufferAttribute(index, 1));
            boardGeo.attributes.indexf.needsUpdate = true;


            this.mapMult = new Float32Array(4 * 42);


            var uniforms = {
                map1: {
                    type: "t",
                    value: chat3d.loader.textures.get(texpath + 'loc_17_chip_light_002.jpg')
                },

                map2: {
                    type: "t",
                    value: chat3d.loader.textures.get(texpath + 'loc_17_chip_red_004_E1.jpg')
                },



                mapMult: {
                    type: "fv",
                    value: this.mapMult
                }

            };

            //console.log(chip_geo);
            this.board = new BABYLON.Mesh(boardGeo, new BABYLON.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: BABYLON.ShaderLib.c4board.vertexShader,
                fragmentShader: BABYLON.ShaderLib.c4board.fragmentShader
            }));
            this.board.position.set(-263, 47, -30);
            chat3d.world.scene.add(this.board);


            this.p1Mark = new BABYLON.Mesh(chip_geo, new BABYLON.MeshBasicMaterial({
                map: chat3d.loader.textures.get(texpath + 'loc_17_chip_light_002.jpg')
            }));
            this.p2Mark = new BABYLON.Mesh(chip_geo, new BABYLON.MeshBasicMaterial({
                map: chat3d.loader.textures.get(texpath + 'loc_17_chip_red_004_E1.jpg')
            }));

            this.p1Mark.scale.set(0.2, 0.2, 0.2);
            this.p2Mark.scale.set(0.2, 0.2, 0.2);

            chat3d.world.scene.add(this.p1Mark);
            chat3d.world.scene.add(this.p2Mark);

            this.p1MarkPlace = new BABYLON.Object3D();
            this.p2MarkPlace = new BABYLON.Object3D();
            this.p1MarkPlace.position.set(0, 0.03, -0.37);
            this.p2MarkPlace.position.set(0, 0.03, -0.37);



            this.reset = function() {
                /*if (this.c4) {
                    chat3d.world.scene.remove(this.c4.board);
                }*/
                var ai_dif = 0;
                if (this.c4) {
                    if (this.c4.players[0].type == 'comp' || this.c4.players[1].type == 'comp') {
                        ai_dif = this.c4.ai_dif + 0.2;

                    }
                }

                this.c4 = new Connect4();
                this.c4.board.position.set(-260, 40, 0);
                this.c4.board.updateMatrixWorld();
                //chat3d.world.scene.add(this.c4.board);
                this.setGameId(null);
                this.set_player1(null);
                this.set_player2(null);

                this.c4.ai_dif = ai_dif;

            };

            this.setGameId = function(id) {
                this.game_id = id;
                this.player1_ttl = 1;
                this.player2_ttl = 1;
            };


            this.getPlayerNum = function() {
                if (!this.game_id && this.in_game_zone) {
                    return 0;
                }

                if (this.player1 == chat3d.selfid) {
                    return 0;
                } else if (this.player2 == chat3d.selfid) {
                    return 1;
                }

                if (this.player2 != chat3d.selfid && this.player1 === null && this.cur_turn == 0) {
                    return 0;
                }

                if (this.player1 != chat3d.selfid && this.player2 === null && this.cur_turn == 1) {
                    return 1;
                }

                return false;
            };

            this.set_player1 = function(id) {

                if (id != this.player1) {
                    if (id && (this.c4.players[0].type == 'comp')) {
                        this.c4.players[0] = new C4Player(this.c4, 1);

                        if (this.player2 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                        }
                    }
                    if (this.player1 == chat3d.selfid && id != chat3d.selfid) {
                        console.log('%cim droped from player1 by id ' + id, ' background: #DAFF7F');
                    }

                    this.player1 = id;

                    if (!id) {
                        this.player1_ttl = 0;

                    } else {
                        this.player1_ttl = 10;


                    }
                }

            };

            this.set_player2 = function(id) {


                if (id != this.player2) {
                    if (id && (this.c4.players[1].type == 'comp')) {
                        this.c4.players[1] = new C4Player(this.c4, 2);
                        console.log('%cset player 2', 'background: #DAFF7F');
                        if (this.player1 == chat3d.selfid) {
                            chat3d.msg.send('alert', 'player_joined');
                            console.log('%cSend player 2 joined alert', 'background: #DAFF7F');
                        }
                    }
                    this.player2 = id;

                    if (!id) {
                        this.player2_ttl = 0;

                    } else {
                        this.singlePlayer = false;
                        console.log('%csinglePlayer mode off', 'background: #DAFF7F');
                        this.player2_ttl = 10;
                    }
                }

            };

            this.sendGameState = function() {
                this.stateId = Math.random();

                this.hub.broadcast('gameState', {
                    game_id: this.game_id,
                    field: this.c4.gameField,
                    player1: this.player1,
                    player2: this.player2,
                    cur_turn: this.cur_turn,
                    gameover: this.c4.gameover,
                    stateId: this.stateId
                });

                if (this.c4.gameover && this.getPlayerNum() !== false) {
                    if (this.getPlayerNum() == this.c4.gameover - 1) {
                        chat3d.msg.send('alert', 'game_won');
                        console.log("Congrats You win!");
                    } else if (this.c4.gameover == 3) {
                        chat3d.msg.send('alert', 'game_draw');
                        console.log("It's a draw! (send)");
                    } else {
                        chat3d.msg.send('alert', 'game_lose');
                        console.log("You lose. (send)");
                    }
                }
            };

            this.update_player1 = function(id, age) {
                if (id == this.player1) {
                    if (age < 6) {
                        this.player1_ttl = 10;
                    } else if (age > 30) {
                        this.player1_ttl = 0;
                    }
                }

            };

            this.update_player2 = function(id, age) {
                if (id == this.player2) {
                    if (age < 6) {
                        this.player2_ttl = 10;
                    } else if (age > 30) {
                        this.player2_ttl = 0;
                    }
                }

            };

            this.setGameState = function(data, age, counter) {
                console.log('setGameState', data);
                if (this.hub.pCounters.gameState && this.hub.pCounters.gameState == counter) {
                    if (data.stateId != this.stateId) {
                        console.log('%cfalse_start', ' background: #FF2222');
                        chat3d.msg.send('alert', 'false_start');
                    }
                }

                this.game_id = data.game_id;

                this.c4.gameField = data.field;
                this.set_player1(data.player1);
                this.set_player2(data.player2);
                console.log(this.c4.gameover, data.gameover);
                if (!this.c4.gameover && data.gameover) {
                    if (this.getPlayerNum() !== false) {
                        if (data.gameover == 3) {
                            chat3d.msg.send('alert', 'game_draw');
                            console.log("It's a draw! (set)");
                        } else if (this.getPlayerNum() != data.gameover - 1) {
                            chat3d.msg.send('alert', 'game_lose');
                            console.log("You lose. (set)");
                        }
                    }

                    for (var i = 0; i < 6; i++) {
                        for (var j = 0; j < 7; j++) {
                            this.c4.checkForVictory(i, j);
                        }
                    }

                }


                this.c4.gameover = data.gameover;
                this.cur_turn = data.cur_turn;
                this.stateId = data.stateId;
                if (this.c4.gameover) {
                    this.gameEndTimer = age;
                    console.log('set game end timer age ', age);
                } else {
                    this.gameEndTimer = 0;
                }
                this.c4.updateField();

            };

            this.isResetable = function(x, y, msg) {
                var playerNum = this.getPlayerNum();
                if (playerNum !== false) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 1000;
                    raycast.ray.direction = vector;
                    intersects = raycast.intersectObject(this.resetbox);
                    if (intersects.length) {



                        return true;
                    }
                } else if (msg) {
                    if (chat3d.world.eyes.position.distanceTo(this.gamezone) < 400) {
                        chat3d.msg.send('alert', 'cant_reset');
                    }

                }

                return false;

            };

            this.resetBut = function(x, y) {
                if (this.isResetable(x, y, true)) {
                    chat3d.msg.send('confirm', 'game_reset');
                    console.log('send reset');
                    return true;
                }
                return false;

            };

            Object.defineProperty(this, "cur_turn", {
                get: function() { return this.c4.currentPlayer - 1; },
                set: function(value) { this.c4.currentPlayer = value + 1; }
            });

            this.goResetBox = new BABYLON.Mesh(new BABYLON.CubeGeometry(750, 600, 100), new BABYLON.MeshBasicMaterial({ visible: false }));
            this.goResetBox.position.y = 300;
            chat3d.world.scene.add(this.goResetBox);

            this.isGameOverReset = function(x, y) {
                if (!this.c4.gameover) {
                    return false;
                }
                if (this.getPlayerNum() !== false) {
                    var raycast = chat3d.view.raycaster;
                    raycast.ray.origin.setFromMatrixPosition(chat3d.world.camera.matrixWorld);

                    var vector = new BABYLON.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9);
                    //console.log(vector);
                    vector.unproject(chat3d.world.camera);
                    vector.sub(raycast.ray.origin).normalize();
                    raycast.far = 1500;
                    raycast.ray.direction = vector;

                    intersects = raycast.intersectObject(this.goResetBox);
                    if (intersects.length) {
                        return true;
                    }
                }

                return false;
            };

            this.reset();


        },

        onClean: function() {
            chat3d.world.scene.remove(this.board);
            chat3d.world.scene.remove(this.p1Mark);
            chat3d.world.scene.remove(this.p2Mark);
            chat3d.world.scene.remove(this.resetbox);
            chat3d.world.scene.remove(this.goResetBox);
            if (chat3d.mobile_mode) {
                chat3d.world.width = 0;
                chat3d.world.resize();
            } else {
                chat3d.world.scene.remove(this.pointer1Mesh);
                chat3d.world.scene.remove(this.pointer2Mesh);
            }
        },

        onView: function(x, y) {
            //console.log(x, y);
            if (this.c4) {
                var playerNum = this.getPlayerNum();
                if (playerNum !== false && !this.c4.gameover && !chat3d.mobile_mode) {

                    this.c4.players[playerNum].onMouseMove(x, y);
                    if (playerNum === 0 && this.c4.players[0].currentCol != -1) {
                        this.pointer1.visible = true;
                        this.pointer1.position.x = this.c4.players[0].currentCol * 87 - 250;

                    } else {
                        this.pointer1.visible = false;
                    }


                    if (playerNum === 1 && this.c4.players[1].currentCol != -1) {
                        this.pointer2.visible = true;
                        this.pointer2.position.x = this.c4.players[1].currentCol * 87 - 250;
                    } else {
                        this.pointer2.visible = false;
                    }

                } else {
                    //console.log('pointers off');
                    this.pointer1.visible = false;
                    this.pointer2.visible = false;
                }

                if (this.isResetable(x, y) || this.isGameOverReset(x, y)) {
                    pointer = true;
                    $('#world canvas').attr('title', chat3d.translate.reset);

                } else if (playerNum !== false && playerNum == this.cur_turn && !this.c4.gameover) {
                    if (this.c4.players[playerNum].currentCol != -1) {
                        pointer = true;
                    } else {
                        pointer = false;
                    }
                    $('#world canvas').attr('title', '');
                } else {
                    pointer = false;
                    $('#world canvas').attr('title', '');
                }

                if (pointer) {
                    $('canvas').addClass('pointer_on_game_obj');
                    //$('canvas').removeClass('pointer_on_game_obj_wait');

                } else {
                    $('canvas').removeClass('pointer_on_game_obj');
                    if (playerNum !== false && playerNum != this.cur_turn && !this.c4.gameover) {
                        var wait = false;
                        if (playerNum === 0 && !this.player2) {
                            wait = true;
                        } else if (playerNum === 1 && !this.player1) {
                            wait = true;
                        }

                        /*if (wait) {
                            $('canvas').addClass('pointer_on_game_obj_wait');
                        }*/

                    }
                }
            }
        },

        onRender: function(delta) {
            if (chat3d.mobile_mode && chat3d.world.camera.fov != 85) {
                chat3d.world.camera.fov = 85;
                chat3d.world.camera.updateProjectionMatrix();
            }

            this.renderDelay = 0;
            var n = 0;
            this.c4.updateTimers(delta);

            for (var i = 0; i < 6; i++) {

                for (var j = 0; j < 7; j++) {
                    if (this.c4.gameField[i][j] == 1) {
                        this.mapMult[n] = 1;
                        this.mapMult[n + 1] = 1;
                        this.mapMult[n + 2] = 0;
                        if (this.getPlayerNum() === 0 && !this.c4.gameover) {
                            this.mapMult[n + 3] = 0;
                        } else {
                            this.mapMult[n + 3] = this.c4.isMarked(i, j) ? 1 : 0;
                        }
                    } else if (this.c4.gameField[i][j] == 2) {
                        this.mapMult[n] = 1;
                        this.mapMult[n + 1] = 0;
                        this.mapMult[n + 2] = 1
                        if (this.getPlayerNum() === 1 && !this.c4.gameover) {
                            this.mapMult[n + 3] = 0;
                        } else {
                            this.mapMult[n + 3] = this.c4.isMarked(i, j) ? 1 : 0;
                        }

                    } else {
                        this.mapMult[n] = 0;
                        this.mapMult[n + 1] = 0;
                        this.mapMult[n + 2] = 0
                        this.mapMult[n + 3] = 0;

                    }
                    n += 4;
                }
            }

            if (!this.player1) {
                if (this.p1MarkPlace.parent) {
                    this.p1MarkPlace.parent.remove(this.p1MarkPlace);

                    console.log('%c remove player2 mark', 'background: #DAFF7F');
                }
                this.p1Mark.visible = false;
            } else {
                if (chat3d.world.chars[this.player1] && chat3d.world.chars[this.player1].head) {
                    if (chat3d.world.chars[this.player1].head != this.p1MarkPlace.parent) {
                        chat3d.world.chars[this.player1].head.add(this.p1MarkPlace);
                        chat3d.world.chars[this.player1].pivot.updateMatrixWorld(true);
                        chat3d.world.chars[this.player1].forceAnim = true;
                        console.log('%c add player1 mark', 'background: #DAFF7F');
                    }
                    this.p1Mark.visible = true;
                    this.p1Mark.position.setFromMatrixPosition(this.p1MarkPlace.matrixWorld);
                    this.p1Mark.rotation.y = chat3d.world.chars[this.player1].angle * Math.PI / 180;
                    if (!chat3d.world.chars[this.player1].visible) {
                        this.p1Mark.visible = false;
                    }
                } else {
                    if (this.p1MarkPlace.parent) {
                        this.p1MarkPlace.parent.remove(this.p1MarkPlace);
                        console.log('%c remove player1 mark', 'background: #DAFF7F');
                    }
                    this.p1Mark.visible = false;
                }
            }

            if (!this.player2) {
                if (this.p2MarkPlace.parent) {
                    this.p2MarkPlace.parent.remove(this.p2MarkPlace);
                    console.log('%c remove player2 mark', 'background: #DAFF7F');
                }
                this.p2Mark.visible = false;
            } else {
                if (chat3d.world.chars[this.player2] && chat3d.world.chars[this.player2].head) {
                    if (chat3d.world.chars[this.player2].head != this.p2MarkPlace.parent) {
                        chat3d.world.chars[this.player2].head.add(this.p2MarkPlace);
                        chat3d.world.chars[this.player2].pivot.updateMatrixWorld(true);
                        chat3d.world.chars[this.player2].forceAnim = true;
                        console.log('%c add player2 mark', 'background: #DAFF7F');
                    }
                    this.p2Mark.visible = true;
                    this.p2Mark.position.setFromMatrixPosition(this.p2MarkPlace.matrixWorld);
                    this.p2Mark.rotation.y = chat3d.world.chars[this.player2].angle * Math.PI / 180;
                    if (!chat3d.world.chars[this.player2].visible) {
                        this.p2Mark.visible = false;
                    }
                } else {
                    if (this.p2MarkPlace.parent) {
                        this.p2MarkPlace.parent.remove(this.p2MarkPlace);
                        console.log('%c remove player2 mark', 'background: #DAFF7F');
                    }
                    this.p2Mark.visible = false;
                }
            }

            if (!this.game_id) {
                this.p1Mark.visible = false;
                this.p2Mark.visible = false;

            }

            /*if (!chat3d.mobile_mode) {
                this.pointer1Mesh.visible = this.pointer1.visible;
                this.pointer2Mesh.visible = this.pointer2.visible;
                var step = delta * 350;
                var moveV = new BABYLON.Vector3();
                var p1Dist = this.pointer1Mesh.position.distanceTo(this.pointer1.position);
                if (step > p1Dist) {
                    this.pointer1Mesh.position.copy(this.pointer1.position);
                } else {
                    moveV.copy(this.pointer1.position)
                        .sub(this.pointer1Mesh.position)
                        .normalize()
                        .multiplyScalar(step);
                    this.pointer1Mesh.position.add(moveV);
                    //console.log(moveV);
                }

                var p2Dist = this.pointer2Mesh.position.distanceTo(this.pointer2.position);
                if (step > p2Dist) {
                    this.pointer2Mesh.position.copy(this.pointer2.position);
                } else {
                    moveV.copy(this.pointer2.position)
                        .sub(this.pointer2Mesh.position)
                        .normalize()
                        .multiplyScalar(step);
                    this.pointer2Mesh.position.add(moveV);
                }
            }*/


        },

        onLoop: function(delta) {
            this.gameTime += delta;
            this.player1_ttl -= delta;
            this.renderDelay += delta;

            if (this.renderDelay > 30) {
                if (this.game_id) {
                    if (this.player1 == chat3d.selfid) {
                        this.set_player1(null);
                        this.sendGameState();

                    }

                    if (this.player2 == chat3d.selfid) {
                        this.set_player2(null);
                        this.sendGameState();
                    }
                }

                return;
            }

            if (this.player1) {
                if (this.player1_ttl <= 0) {
                    this.player1 = null;
                    console.log('%cdrop player1', 'background: #DAFF7F');
                }
                var charsCount = 0;
                for (var i in chat3d.world.chars) {
                    charsCount++;
                }

                if (this.game_id && this.player2_ttl < (charsCount ? -7 : -3) && this.player1 == chat3d.selfid) {
                    if (this.c4.players[1].type == 'player') {
                        this.c4.players[1] = new C4Comp(this.c4, 2);
                        console.log('comp joined', this.player2_ttl, charsCount);
                        if (!this.singlePlayer) {

                            if (this.gameTime > 10) {
                                chat3d.msg.send('alert', 'comp_joined');
                            }
                        }
                    }
                }
                this.player2_ttl -= delta;

            }

            if (this.player2) {

                if (this.player2_ttl <= 0) {
                    this.player2 = null;
                    console.log('%cdrop player2', 'background: #DAFF7F');
                }

                if (this.game_id && this.player1_ttl < -5 && this.player2 == chat3d.selfid) {
                    if (this.c4.players[0].type == 'player') {
                        this.c4.players[0] = new C4Comp(this.c4, 1);
                        if (this.gameTime > 10) {
                            chat3d.msg.send('alert', 'comp_joined');
                        }
                    }

                }
            }

            if (chat3d.world.eyes.position.distanceTo(this.gamezone) < 750) {
                this.in_game_zone = true;

                /*if (this.game_id && this.renderDelay <= 30) {
                    if (!this.player1 && this.player2 != chat3d.selfid && this.player1_ttl < 7) {
                        this.set_player1(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player1_ttl = 10;
                        console.log('set player 1');
                        if (!this.player2) {
                            this.singlePlayer = true;
                        }

                    }

                    if (!this.player2 && this.player1 != chat3d.selfid && this.player2_ttl < 7) {
                        this.set_player2(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player2_ttl = 10;
                        console.log('set player 2');
                    }

                }*/

                if (this.player1 == chat3d.selfid && this.player1_ttl < 8) {
                    console.log('update self as player1');

                    this.player1_ttl = 10;
                    this.hub.broadcast('update_player1', this.player1);

                }

                if (this.player2 == chat3d.selfid && this.player2_ttl < 8) {
                    console.log('update self as player2');
                    this.player2_ttl = 10;
                    this.hub.broadcast('update_player2', this.player2);
                }

            } else {
                this.in_game_zone = false;
                if (this.player1 == chat3d.selfid) {
                    this.player1 = null;
                    // chat3d.msg.send('alert', 'leftgame');

                    this.sendGameState();


                    console.log('player 1 off');
                }
                if (this.player2 == chat3d.selfid) {
                    this.player2 = null;
                    // chat3d.msg.send('alert', 'leftgame');
                    this.sendGameState();
                    console.log('player 2 off');
                }
            }

            if (chat3d.selfid != 'dummy') {
                if (this.c4.gameover) {
                    if (!this.player1 && !this.player2) {
                        var minid = chat3d.selfid;
                        for (var i in chat3d.world.chars) {
                            minid = Math.min(chat3d.world.chars[i].id, minid);
                        }
                        if (minid == chat3d.selfid) {
                            console.log('autoreset noplayers');
                            this.reset();
                            this.sendGameState();
                        }
                    } else {
                        this.gameEndTimer += delta;
                        if (this.gameEndTimer > 30) {
                            var minid = chat3d.selfid;
                            this.gameEndTimer = 0;
                            for (var i in chat3d.world.chars) {
                                minid = Math.min(chat3d.world.chars[i].id, minid);
                            }
                            if (minid == chat3d.selfid) {
                                console.log('autoreset gameEndTimer');
                                this.reset();
                                this.sendGameState();
                            }
                        }
                    }
                } else {
                    this.gameEndTimer = 0;
                }
            }

            if (!this.c4.gameover && this.c4.players[0].type == 'comp' && this.cur_turn == 0) {
                this.c4.players[0].turn();
            }

            if (!this.c4.gameover && this.c4.players[1].type == 'comp' && this.cur_turn == 1) {
                this.c4.players[1].turn();
            }

            if (this.c4.needsUpdateState) {
                this.c4.needsUpdateState = false;
                console.log('send state');
                this.sendGameState();
            }

            if (this.c4.needsUpdateLast1) {
                this.c4.needsUpdateLast1 = false;
                this.hub.broadcast('lastTurn1', this.c4.lastTurn1);
            }

            if (this.c4.needsUpdateLast2) {
                this.c4.needsUpdateLast2 = false;
                this.hub.broadcast('lastTurn2', this.c4.lastTurn2);
            }


        },

        onMouseDown: function() {
            this.mouseDown = true;
            return true;
        },

        onMouseUpEnd: function(e) {
            this.mouseDown = false;
            if (chat3d.pc_controls.move < 20) {
                if (!this.c4.gameover) {
                    if (this.game_id && !this.player1 && this.player2 != chat3d.selfid) {
                        this.set_player1(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player1_ttl = 10;
                        console.log('set player 1');
                        if (!this.player2) {
                            this.singlePlayer = true;
                        }

                    }

                    if (this.game_id && !this.player2 && this.player1 != chat3d.selfid) {
                        this.set_player2(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player2_ttl = 10;
                        console.log('set player 2');
                    }
                }

                var playerNum = this.getPlayerNum();

                if (playerNum !== false) {
                    if (this.resetBut(e.clientX, e.clientY)) {

                        return true;
                    }

                    if (this.isGameOverReset(e.clientX, e.clientY)) {
                        chat3d.msg.send('confirm', 'game_reset');
                    }
                    if (!this.c4.gameover) {
                        this.c4.players[playerNum].onMouseMove(e.clientX, e.clientY);
                        if (this.c4.players[playerNum].currentCol != -1) {
                            if (this.cur_turn == playerNum) {
                                if (!this.game_id) {
                                    console.log('new game ', this.player1, this.player2);
                                    /*if (this.player2 == chat3d.selfid) {
                                        this.set_player2(this.player1);

                                    }*/
                                    this.set_player1(chat3d.selfid);
                                    if (!this.player2) {
                                        this.singlePlayer = true;
                                    }

                                    this.setGameId(chat3d.selfid);
                                    this.c4.players[playerNum].onMouseMove(e.clientX, e.clientY);
                                }

                                this.c4.players[playerNum].onClick();
                            } else {
                                chat3d.msg.send('alert', 'partners_turn');
                                console.log('partners_turn');
                                //console.log('cant click', this.cur_turn, playerNum, this.c4.players[playerNum].currentCol);
                            }
                        }
                    }
                } else {
                    console.log('non player');
                }
            }
        },

        onTouchUpEnd: function(e) {
            var x = e.changedTouches[0].clientX;
            var y = e.changedTouches[0].clientY;
            if (Math.abs(x - chat3d.touch_controls.start_touch.x) < 100 && Math.abs(y - chat3d.touch_controls.start_touch.y) < 100) {
                if (!this.c4.gameover) {
                    if (this.game_id && !this.player1 && this.player2 != chat3d.selfid) {
                        this.set_player1(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player1_ttl = 10;
                        console.log('set player 1');
                        if (!this.player2) {
                            this.singlePlayer = true;
                        }

                    }

                    if (this.game_id && !this.player2 && this.player1 != chat3d.selfid) {
                        this.set_player2(chat3d.selfid);
                        chat3d.msg.send('alert', 'ingame');
                        this.sendGameState();
                        this.player2_ttl = 10;
                        console.log('set player 2');
                    }
                }


                var playerNum = this.getPlayerNum();
                if (playerNum !== false) {
                    if (this.resetBut(x, y)) {

                        return true;
                    }
                    //console.log(x, y);
                    if (this.isGameOverReset(x, y)) {
                        chat3d.msg.send('confirm', 'game_reset');
                    }
                    if (!this.c4.gameover) {
                        this.c4.players[playerNum].onMouseMove(x, y);
                        if (this.c4.players[playerNum].currentCol != -1) {
                            if (this.cur_turn == playerNum) {
                                if (!this.game_id) {
                                    console.log('new game ', this.player1, this.player2);
                                    if (this.player2 == chat3d.selfid) {
                                        this.set_player2(this.player1);

                                    }
                                    this.set_player1(chat3d.selfid);
                                    if (!this.player2) {
                                        this.singlePlayer = true;
                                    }

                                    this.setGameId(chat3d.selfid);
                                }
                                this.c4.players[playerNum].onMouseMove(x, y);
                                this.c4.players[playerNum].onClick();
                            } else {
                                chat3d.msg.send('alert', 'partners_turn');
                            }
                        }
                    }
                }
            }
        },

        onMessage: function(data) {
            if (data) {

                //console.log(data);
                for (var i in data) {
                    var msg = data[i];
                    if (this.hub.pCounters[msg.type] && this.hub.pCounters[msg.type] > msg.counter) {
                        console.log('%c old data!!', ' background: #FF2222');
                        console.log(msg.type, this.hub.pCounters[msg.type], msg.counter);

                    } else {
                        switch (msg.type) {
                            case 'gameState':
                                this.setGameState(msg.data, msg.age, msg.counter);

                                break;

                            case 'update_player1':
                                this.update_player1(msg.data, msg.age);
                                break;

                            case 'update_player2':
                                this.update_player2(msg.data, msg.age);
                                break;

                            case 'resetmsg':
                                if (msg.age < 10 && this.hub.checkCounter(msg)) {
                                    chat3d.msg.send('alert', 'reseted');
                                    console.log('%creset alert', 'background: #DAFF7F');
                                }
                                break;

                            case 'lastTurn1':
                                if (msg.age < 10) {

                                    this.c4.setLastTurn(msg.data[0], msg.data[1], 1, true);
                                }
                                break;

                            case 'lastTurn2':
                                if (msg.age < 10) {
                                    this.c4.setLastTurn(msg.data[0], msg.data[1], 2, true);
                                }
                                break;


                        }
                        this.hub.onMessage(msg);
                    }
                }
            }
        },
        onConfirm: function(type) {
            console.log(type);

            switch (type) {
                case 'game_reset':
                    console.log('reset callback');
                    this.reset();
                    this.sendGameState();
                    if (this.player1 && this.player2) {
                        var msgto;
                        if (this.player1 == chat3d.selfid) {
                            msgto = this.player2;
                        } else {
                            msgto = this.player1;
                        }
                        this.hub.broadcast('resetmsg', msgto);
                    }

                    break;
            }

        },
        mobileLook: 25,
        scripts: ['p2player.js', 'connect4/game.js', 'connect4/player.js', 'connect4/comp.js', 'connect4/board.js'],
        textures: ['loc_17_chip_light_002.jpg', 'loc_17_chip_red_004_E1.jpg', 'loc_17_pointer_light_001.jpg', 'loc_17_pointer_red_001.jpg'],
        geo: ['loc_17_chip.js', 'loc_17_pointer.js']

    },
    19: {
        obj: [{ "id": "loc_07_nt" }, { "id": "loc_07_nt_floor" },
            { "id": "loc_07_col" },
            { "id": "bezier_cabinet_glass" },
            { "id": "bezier_cabinet" }, { "id": "lobby_closet", rot: [0, 180, 0] },
            { "id": "lobby_closet_mirror", rot: [0, 180, 0] },
            { "id": "lobby_closet_cabinet_glass", rot: [0, 180, 0] },
            { "id": "showcase_closet" }, { "id": "showcase_closet_glass" }
        ],
        z: 20,
    },

    20: {
        obj: [{ "id": "loc_07_w" }, { "id": "loc_07_w_floor" }, { "id": "loc_07_w_col" }],
        z: 20,
    },

    21: {
        obj: [{ "id": "loc_22" }, { "id": "loc_22_collider" }, { "id": "loc_22_floor" }],
        z: 20,
    },

    22: {
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        obj: [{ "id": "loc_19_main" }, { "id": "loc_19_chrome" }, /*{ "id": "loc_19_ship3_001" }, { "id": "loc_19_ship2_001" }, { "id": "loc_19_ship4_001" }, { "id": "loc_19_ship5_001" },*/ { "id": "loc_19_pic_001" }, { "id": "loc_19_pic_002" }, { "id": "loc_19_pic_003" }, { "id": "loc_19_pic_004" }, { "id": "loc_19_collider" }, { "id": "loc_19_floor" }],
        z: 20,
        noSlip: true,

        scripts: ['p2player.js', 'shipWar/main.js', 'shipWar/ship.js', 'shipWar/ai.js', 'shipWar/playersicon.js'],
        textures: ['ship4_0010.jpg', 'ship4_0011.jpg', 'ship4_0100.jpg', 'ship4_0101.jpg', 'ship4_1010.jpg', 'ship4_1011.jpg', 'ship4_1101.jpg', 'ship_00000.jpg', 'ship_00001.jpg', 'ship_00010.jpg', 'ship_00011.jpg', 'ship_00100.jpg', 'ship_00110.jpg', 'ship_00111.jpg', 'ship_01000.jpg', 'ship_01001.jpg', 'ship_01010.jpg', 'ship_01011.jpg', 'ship_01100.jpg', 'ship_01110.jpg', 'ship_01111.jpg', 'ship_10000.jpg', 'ship_10001.jpg', 'ship_10010.jpg', 'ship_10100.jpg', 'ship_11000.jpg', 'ship_11001.jpg', 'ship_11010.jpg', 'ship_11011.jpg', 'ship_11100.jpg', 'ship_11101.jpg', 'ship_11110.jpg', 'ship_11111.jpg', 'dot.png', 'cap.jpg', 'cross.png', 'fire1.png', 'fire2.png', 'fire3.png', 'fire4.png', 'fire5.png', 'fire6.png'],
        geo: ['loc_19_ship2_001.js', 'loc_19_ship3_001.js', 'loc_19_ship4_001.js', 'loc_19_ship5_001.js']
    },

    23: {
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        obj: [{ "id": "est_loc1_ground" }, { "id": "mc_flowers_3" }, { "id": "mc_pine_1_001" }, { "id": "mc_pine_3_002" }, { "id": "mc_pine_1_002" }, { "id": "mc_pine_1_003" }, { "id": "mc_pine_2_006" }, { "id": "mc_fir_4_003" }, { "id": "mc_pine_3_005" }, { "id": "mc_pine_3_008" }, { "id": "mc_pine_1_004" }, { "id": "mc_fir_2_006" }, { "id": "mc_pine_2_005" }, { "id": "mc_pine_3_003" }, { "id": "mc_fir_2_003" }, { "id": "mc_fir_2_002" }, { "id": "mc_fir_2_001" }, { "id": "mc_fir_4_001" }, { "id": "mc_fir_2_004" }, { "id": "mc_pine_2_002" }, { "id": "mc_pine_3_001" }, { "id": "mc_pine_3_007" }, { "id": "mc_fir_1_001" }, { "id": "mc_fir_2_007" }, { "id": "est_loc_01_collider" }, { "id": "mc_fir_3_002" }, { "id": "mc_fir_3_003" }, { "id": "mc_fir_3_004" }, { "id": "mc_fir_3_005" }, { "id": "mc_fir_3_006" }, { "id": "mc_fir_3_001" },
            /*{ "id": "house_ext_01" }, , { "id": "house_ext_01_col" },*/
            /*{"id":"house_int_01_f1_pt1"},{"id":"house_int_01_f1_pt2"},{"id":"house_int_01_f1_collider"},{"id":"house_int_01_f1_floor1"},{"id":"house_int_01_f1_floor2"}*/
        ],
        z: 20,
        mobileLook: -10,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js'],

    },

    24: {

        obj: [{ id: "house_sphere" },

        ],
        z: 50,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    25: {

        obj: [{ id: "house_sphere" }, ],
        z: 250,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    26: {

        obj: [{ id: "house_sphere" }, ],
        z: 450,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    27: {
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 0,
            map: 'loc9'
        },
        water: {
            w: 170000,
            h: 170000,
            x: 0,
            y: 0,
            z: -50
        },
        mobileLook: -10,
        obj: [{ "id": "est_loc_02" }, { "id": "mc_pine_1_001_2" }, { "id": "mc_fir_2_001_2" }, { "id": "mc_fir_4_001_2" }, { "id": "mc_fir_1_001_2" }, { "id": "mc_fir_4_003_2" }, { "id": "mc_fir_2_003_2" }, { "id": "mc_fir_1_002_2" }, { "id": "mc_fir_1_003_2" }, { "id": "mc_pine_1_002_2" }, { "id": "mc_fir_2_004_2" }, { "id": "mc_fir_4_004_2" }, { "id": "mc_fir_4_005_2" }, { "id": "mc_fir_4_006_2" }, { "id": "mc_fir_4_007_2" }, { "id": "mc_fir_1_004_2" }, { "id": "mc_plant_116_004_2" }, { "id": "mc_plant_101_004_2" }, { "id": "mc_plant_101_003_2" }, { "id": "mc_plant_101_005_2" }, { "id": "mc_plant_103_002_2" }, { "id": "mc_plant_103_001_2" }, { "id": "mc_plant_101_006_2" }, { "id": "mc_plant_116_005_2" }, { "id": "mc_plant_101_001_2" }, { "id": "mc_fir_2_006_2" }, { "id": "mc_fir_4_008_2" }, { "id": "mc_fir_2_007_2" }, { "id": "mc_pine_1_003_2" }, { "id": "mc_plant_101_002_2" }, { "id": "mc_fir_4_009_2" }, { "id": "mc_fir_4_010_2" }, { "id": "mc_pine_1_004_2" }, { "id": "mc_fir_1_005_2" }, { "id": "mc_fir_4_012_2" }, { "id": "mc_fir_4_013_2" }, { "id": "est_loc_02_collider" }],
        z: 20,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png'],
        scripts: ['houses/main.js', 'p2player.js', 'babylonjs/TessellateModifier.js', 'babylonjs/SubdivisionModifier.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']

    },

    28: {

        obj: [{ id: "house_sphere2" }, ],
        z: 50,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    29: {

        obj: [{ id: "house_sphere2" }, ],
        z: 250,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    30: {

        obj: [{ id: "house_sphere2" }, ],
        z: 450,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    31: {
        obj: [{ "id": "est_loc_03" }, { "id": "est_loc_03_transparent_objects" }, { "id": "mc_birch_3_001" }, { "id": "mc_birch_3_002" }, { "id": "mc_birch_3_003" }, { "id": "mc_birch_3_004" }, { "id": "mc_tree_3" }, { "id": "mc_tree_1" }, { "id": "mc_tree_2" }, { "id": "mc_tree_5_001_3" }, { "id": "mc_tree_4" }, { "id": "mc_birch_3_005" }, { "id": "mc_plant_201" }, { "id": "est_loc_03_collider" }],
        z: 20,
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        water: {
            w: 170000,
            h: 170000,
            x: 0,
            y: 0,
            z: -45
        },
        mobileLook: -10,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js', 'Reflector.js']
    },

    32: {

        obj: [{ id: "house_sphere3" }, ],
        z: 50,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    33: {

        obj: [{ id: "house_sphere3" }, ],
        z: 250,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    34: {

        obj: [{ id: "house_sphere3" }, ],
        z: 450,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    35: {
        obj: [{ "id": "est_loc_04" }, { "id": "est_loc_04_collider" }],
        z: 120690,
        houseZ: 120670,
        skybox: {
            w: 800000,
            h: 800000,
            t: 800000,
            x: 0,
            y: 0,
            z: 45000,
            map: 'est_loc4'
        },
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    36: {
        skysp: {
            r: 80000,
            w: 100,
            h: 100,
            x: 0,
            y: 0,
            z: 37000,
            map: 'est_loc4_int'
        },

        obj: [],
        z: 50,
        mobileLook: -10,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    37: {
        skysp: {
            r: 800000,
            w: 100,
            h: 100,
            x: 0,
            y: 0,
            z: 45000,
            map: 'est_loc4_int'
        },

        obj: [],
        z: 250,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    38: {
        skysp: {
            r: 800000,
            w: 100,
            h: 100,
            x: 0,
            y: 0,
            z: 45000,
            map: 'est_loc4_int'
        },

        obj: [],
        z: 450,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    39: {
        obj: [{ "id": "est_loc_05" }, { "id": "est_loc_05_collider" }],
        z: 45,
        houseZ: 25,
        skybox: {
            w: 40000,
            h: 40000,
            t: 40000,
            x: 0,
            y: 0,
            z: 5000,
            map: 'est_loc5'
        },
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },


    40: {
        skysp: {
            r: 1200000,
            w: 100,
            h: 100,
            x: 0,
            y: 0,
            z: 570000,
            map: 'est_loc5_int'
        },

        obj: [],
        z: 50,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    41: {
        skysp: {
            r: 1200000,
            w: 100,
            h: 100,
            x: 0,
            y: 0,
            z: 45000,
            map: 'est_loc5_int'
        },

        obj: [],
        z: 250,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    42: {
        skysp: {
            r: 1200000,
            w: 100,
            h: 100,
            x: 0,
            y: 0,
            z: 45000,
            map: 'est_loc5_int'
        },

        obj: [],
        z: 450,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js', 'houses/EffectComposer.js', 'houses/HorizontalBlurShader.js', 'houses/VerticalBlurShader.js', 'houses/RenderPass.js', 'houses/ShaderPass.js', 'houses/CopyShader.js']
    },

    43: {
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        water: {
            w: 17000,
            h: 17000,
            x: 0,
            y: 0,
            z: -45
        },

        obj: [{ "id": "loc_18" }, /*{ "id": "chip_dark_001" }, { "id": "chip_light_001" }, { "id": "chip_shadow_001" }, { "id": "chip_shadow_002" },*/ { "id": "loc_18_collider" }, { "id": "loc_18_mc_tree_1_001" }, { "id": "loc_18_mc_plant_111_001" }, { "id": "loc_18_mc_plant_116_001" }, { "id": "loc_18_mc_plant_201_001" }, { "id": "loc_18_mc_plant_208_001" }, { "id": "loc_18_mc_tree_3_001" }, { "id": "loc_18_mc_tree_3_002" }, { "id": "loc_18_mc_tree_5_002" }, { "id": "loc_18_mc_tree_1_002" }, { "id": "loc_18_mc_tree_2_001" }, { "id": "loc_18_mc_tree_2_002" }, { "id": "loc_18_mc_tree_5_001" }, { "id": "loc_18_mc_plant_201_002" }, { "id": "loc_18_mc_plant_201_003" }, { "id": "loc_18_mc_tree_4_001" }, { "id": "loc_18_mc_tree_1_003" }, { "id": "loc_18_mc_plant_101_001" }, { "id": "loc_18_mc_plant_101_002" }, { "id": "loc_18_mc_plant_101_003" }, { "id": "loc_18_mc_plant_204_001" }, { "id": "loc_18_mc_plant_116_002" }, { "id": "loc_18_mc_plant_103_001" }, { "id": "loc_18_mc_plant_103_002" }, { "id": "loc_18_mc_plant_103_003" }, { "id": "loc_18_mc_plant_201_004" }, { "id": "loc_18_mc_plant_103_004" }, { "id": "loc_18_mc_plant_111_002" }, { "id": "loc_18_mc_plant_103_005" }, { "id": "loc_18_mc_plant_214_001" }, { "id": "loc_18_mc_plant_116_004" }, { "id": "loc_18_mc_plant_208_002" }, { "id": "loc_18_mc_plant_201_005" }, { "id": "loc_18_mc_plant_k13_001" }, { "id": "loc_18_mc_plant_305_001" }, { "id": "loc_18_mc_plant_k03_001" }, { "id": "loc_18_mc_plant_k05_001" }, { "id": "loc_18_mc_plant_305_002" }, { "id": "loc_18_mc_plant_116_003" }, { "id": "loc_18_mc_plant_k13_002" }, { "id": "loc_18_mc_plant_305_003" }, { "id": "loc_18_mc_plant_k05_002" }, { "id": "loc_18_mc_plant_305_004" }, { "id": "loc_18_mc_plant_116_005" }, { "id": "loc_18_ground" }],
        z: 20,
        textures: ['loc_18_chip_light_1024_001.jpg', 'loc_18_chip_dark_1024_001.jpg', 'piece_shadow2.png'],
        geo: ['chip_shadow_001.js', 'chip_dark_001.js'],
        scripts: ['reversi/main.js', 'p2player.js', 'reversi/chips.js']
    },

    44: {
        skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },
        obj: [{ "id": "hoverboard_loc_20_ground" }, { "id": "hoverboard_loc_20_house_002" }, { "id": "hoverboard_loc_20_house_001" }, { "id": "hoverboard_loc_20_house_003" }, { "id": "hoverboard_loc_20_house_004" }, { "id": "hoverboard_loc_20_road" }, { "id": "hoverboard_loc_20_race_fence" }, { "id": "hoverboard_loc_20_small_tank" }, { "id": "hoverboard_loc_20_billboard" }, { "id": "hoverboard_loc_20_ad_001" }, { "id": "hoverboard_loc_20_start_construction" }, { "id": "hoverboard_loc_20_trashbin" }, { "id": "hoverboard_loc_20_container_001" }, { "id": "hoverboard_loc_20_container_002" }, { "id": "hoverboard_loc_20_ad_002" }, { "id": "hoverboard_loc_20_concrete_barrier_004" }, { "id": "hoverboard_loc_20_concrete_barrier_003" }, { "id": "hoverboard_loc_20_grid_fence_003" }, { "id": "hoverboard_loc_20_grid_fence_001" }, { "id": "hoverboard_loc_20_grid_fence_type2" }, { "id": "hoverboard_loc_20_mfl_color_001" }, { "id": "hoverboard_loc_20_concrete_barrier_002" }, { "id": "hoverboard_loc_20_ad_003" }, { "id": "hoverboard_loc_20_high_billboard" }, { "id": "hoverboard_loc_20_ad_004" }, { "id": "hoverboard_loc_20_concrete_barrier_005" }, { "id": "hoverboard_loc_20_house_005" }, { "id": "hoverboard_loc_20_grid_fence_002" }, { "id": "hoverboard_loc_20_concrete_barrier_006" }, { "id": "hoverboard_loc_20_kiosk" }, { "id": "hoverboard_loc_20_lightpost_001" }, { "id": "hoverboard_loc_20_lightpost_002" }, { "id": "hoverboard_loc_20_lightpost_003" }, { "id": "hoverboard_loc_20_lightpost_004" }, { "id": "hoverboard_loc_20_lightpost_005" }, { "id": "hoverboard_loc_20_lightpost_006" }, { "id": "hoverboard_loc_20_lightpost_007" }, { "id": "hoverboard_loc_20_lightpost_008" }, { "id": "hoverboard_loc_20_lightpost_009" }, { "id": "hoverboard_loc_20_lightpost_010" }, { "id": "hoverboard_loc_20_lightpost_011" }, { "id": "hoverboard_loc_20_lightpost_012" }, { "id": "hoverboard_loc_20_lightpost_013" }, { "id": "hoverboard_loc_20_lightpost_014" }, { "id": "hoverboard_loc_20_lightpost_015" }, { "id": "hoverboard_loc_20_lightpost_016" }, { "id": "hoverboard_loc_20_lightpost_017" }, { "id": "hoverboard_loc_20_lightpost_018" }, { "id": "hoverboard_loc_20_lightpost_019" }, { "id": "hoverboard_loc_20_lightpost_020" }, { "id": "hoverboard_loc_20_lightpost_021" }, { "id": "hoverboard_loc_20_lightpost_022" }, { "id": "hoverboard_loc_20_lightpost_023" }, { "id": "hoverboard_loc_20_lightpost_024" }, { "id": "hoverboard_loc_20_lightpost_025" }, { "id": "hoverboard_loc_20_lightpost_026" }, { "id": "hoverboard_loc_20_lightpost_027" }, { "id": "hoverboard_loc_20_lightpost_028" }, { "id": "hoverboard_loc_20_lightpost_029" }, { "id": "hoverboard_loc_20_lightpost_030" }, { "id": "hoverboard_loc_20_lightpost_031" }, { "id": "hoverboard_loc_20_lightpost_032" }, { "id": "hoverboard_loc_20_concrete_barrier_001" }, { "id": "hoverboard_mc_plant_705_001" }, { "id": "hoverboard_mc_plant_715_001" }, { "id": "hoverboard_mc_plant_715_002" }, { "id": "hoverboard_mc_plant_715_003" }, { "id": "hoverboard_mc_plant_715_004" }, { "id": "hoverboard_mc_plant_719_001" }, { "id": "hoverboard_mc_plant_719_002" }, { "id": "hoverboard_mc_plant_719_003" }, { "id": "hoverboard_mc_plant_719_004" }, { "id": "hoverboard_mc_plant_705_002" }, { "id": "hoverboard_mc_plant_706_001" }, { "id": "hoverboard_mc_plant_706_002" }, { "id": "hoverboard_mc_plant_706_003" }, { "id": "hoverboard_loc_20_plastic_barrel_002" }, { "id": "hoverboard_loc_20_metal_barrel" }, { "id": "hoverboard_loc_20_plastic_barrel_001" }, { "id": "hoverboard_loc_20_mfl_001" }, { "id": "hoverboard_loc_20_mfl_color_002" }, { "id": "hoverboard_loc_20_mfl_color_003" }, { "id": "hoverboard_loc_20_mfl_002" }, { "id": "hoverboard_loc_20_mfl_003" }, { "id": "hoverboard_loc_20_metal_fence_001" }, { "id": "hoverboard_loc_20_metal_fence_002" }, { "id": "hoverboard_loc_20_metal_fence_003" }, { "id": "hoverboard_loc_20_mfl_004" }, { "id": "hoverboard_loc_20_grid_fence_004" }, { "id": "hoverboard_mc_tree_1_001" }, { "id": "hoverboard_mc_plant_116_001" }, { "id": "hoverboard_mc_plant_208_001" }, { "id": "hoverboard_mc_tree_3_001" }, { "id": "hoverboard_mc_tree_5_002" }, { "id": "hoverboard_mc_tree_1_002" }, { "id": "hoverboard_mc_tree_2_001" }, { "id": "hoverboard_mc_tree_2_002" }, { "id": "hoverboard_mc_tree_5_001" }, { "id": "hoverboard_mc_plant_201_001" }, { "id": "hoverboard_mc_tree_4_001" }, { "id": "hoverboard_mc_tree_1_003" }, { "id": "hoverboard_mc_plant_103_001" }, { "id": "hoverboard_mc_plant_k13_001" }, { "id": "hoverboard_mc_tree_2_003" }, { "id": "hoverboard_mc_tree_4_002" }, { "id": "hoverboard_mc_plant_k13_002" }, { "id": "hoverboard_mc_tree_1_004" }, { "id": "hoverboard_mc_plant_101_001" }, { "id": "hoverboard_mc_tree_5_003" }, { "id": "hoverboard_mc_plant_201_002" }, { "id": "hoverboard_mc_tree_4_003" }, { "id": "hoverboard_mc_tree_1_005" }, { "id": "hoverboard_mc_tree_5_004" }, { "id": "hoverboard_mc_tree_3_002" }, { "id": "hoverboard_mc_plant_201_003" }, { "id": "hoverboard_mc_tree_2_004" }, { "id": "hoverboard_mc_tree_2_005" }, { "id": "hoverboard_mc_tree_1_006" }, { "id": "hoverboard_mc_tree_1_007" }, { "id": "hoverboard_loc_20_metal_fence_004" }, { "id": "hoverboard_hoverboard" }, { "id": "hoverboard_loc_20_collider" }],

        z: 20,
        scripts: ['hoverboard/main.js', 'p2player.js', 'hoverboard/character.js', ],
        css: ['speed.css'],
        html: ['speed.html']

    },


    /*45: {
        name: 'Локация 45',
        shadow: [-10, 0],
        obj: [{
            id: 'loc2_canvas'
        }, {
            id: 'loc02'
        }, {
            id: 'loc2_floor'
        }, {
            id: 'loc2_col'
        }, {
            id: 'loc2_p1'
        }, {
            id: 'loc2_p2'
        }, {
            id: 'loc2_p3'
        }, {
            id: 'loc2_p4'
        }, {
            id: 'loc2_p5'
        }, {
            id: 'loc2_p6'
        }, {
            id: 'loc2_p7'
        }, {
            id: 'loc2_p8'
        }, {
            id: 'loc2_sky'
        }],
        z: 17,
        enters: [
            [-500, 575]
        ],
        exits: [{
                loc: '1',
                spawn: 0,
                x1: -700,
                y2: 850,
                x2: -300,
                y1: 700,
                angle: 180
            },

            {
                loc: '3',
                spawn: 0,
                x1: 850,
                y2: 200,
                x2: 999,
                y1: -50,
                angle: 230
            }
        ],
        scripts: ['p2player.js', 'paint/main.js'],
        textures: ['podlojka.png', 'pen.png', 'pen_active.png', 'brush.png',
            'brush_active.png', 'rectangle.png', 'rectangle_active.png', 'ellips.png',
            'ellips_active.png', 'text.png', 'text_active.png', 'drag.png',
            'line1.png', 'line2.png', 'line3.png', 'line4.png', 'drag_active.png',
            'line1_active.png', 'line2_active.png', 'line3_active.png', 'line4_active.png',
            'color1.png', 'color2.png', 'color3.png', 'color4.png', 'color5.png', 'color6.png',
            'color7.png', 'color8.png', 'color1_active.png', 'color2_active.png', 'color3_active.png',
            'color4_active.png', 'color5_active.png', 'color6_active.png', 'color7_active.png',
            'color8_active.png', 'undo.png', 'clear_all.png'
        ],
        
    },*/

    46: {

        obj: [{ id: "house_sphere3" }, ],
        z: 50,
        textures: ['pokazyvalka.png', 'pokazyvalka2.png', '3d_icon_downstairs.png', '3d_icon_enter.png', '3d_icon_exit.png', '3d_icon_upstairs.png', 'lenghtarrow.png', 'dotlength.png'],
        scripts: ['houses/main.js', 'p2player.js']
    },

    45: {
        /*skybox: {
            w: 80000,
            h: 50000,
            t: 80000,
            x: 0,
            y: 0,
            z: 500,
            map: 'loc8'
        },*/
        obj: [{ "id": "loc_23" }, { "id": "loc_23_collider" }, { "id": "loc_23_floor" }, {
            id: 'loc5_sphere'
        }],
        z: 20,
        scripts: ['p2player.js', 'paint/main.js'],
        textures: ['podlojka.png', 'pen.png', 'pen_active.png', 'brush.png',
            'brush_active.png', 'rectangle.png', 'rectangle_active.png', 'ellips.png',
            'ellips_active.png', 'text.png', 'text_active.png', 'drag.png',
            'line1.png', 'line2.png', 'line3.png', 'line4.png', 'drag_active.png',
            'line1_active.png', 'line2_active.png', 'line3_active.png', 'line4_active.png',
            'color1.png', 'color2.png', 'color3.png', 'color4.png', 'color5.png', 'color6.png',
            'color7.png', 'color8.png', 'color1_active.png', 'color2_active.png', 'color3_active.png',
            'color4_active.png', 'color5_active.png', 'color6_active.png', 'color7_active.png',
            'color8_active.png', 'undo.png', 'clear_all.png'
        ],

    }



};


locations.street = locations[12];