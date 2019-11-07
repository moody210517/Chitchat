<?php
$g['mobile_redirect_off'] = true;
include('../../../_include/core/main_start.php');

$location = get_param('location');
$fetchType = DB::getFetchType();
$chashTypeObject = array();
$responseData = array();
DB::setFetchType(MYSQL_ASSOC);
$sql = 'SELECT *
          FROM `' . CityBase::getTable('object') . '`
         WHERE `enabled` = 1';
$objects = DB::rows($sql);
foreach ($objects as $key => $object) {
    $objId = $object['object_id'];
    if (!isset($chashTypeObject[$objId])) {
        $sql = 'SELECT *
                  FROM `' . CityBase::getTable('object_type') . '`
                 WHERE `id`=' . to_sql($objId);
        $type = DB::row($sql);
        $chashTypeObject[$objId] = $type;
    } else {
        $type = $chashTypeObject[$objId];
    }
    if (!$type) {
        continue;
    }
    if (!$type['default']) {
        $object['path'] = $g['path']['url_files'] . 'city/custom_obj/obj/';
    }
    $object['obj'] = $type['obj'];
    $object['texture'] = $type['texture'];
    $loc = $object['location'];
    if (!isset($responseData[$loc])) {
        $responseData[$loc] = array();
    }
    $floats = array('size');
    foreach ($floats as $value) {
        $object[$value] = floatval($object[$value]);
    }
    $ints = array('id', 'rotation_speed', 'pos_x', 'pos_y', 'pos_z', 'rot_x', 'rot_y', 'rot_z');
    foreach ($ints as $value) {
        $object[$value] = intval($object[$value]);
    }
    $bools = array('cursor_rotation', 'info_on_hover');
    foreach ($bools as $value) {
        $object[$value] = intval($object[$value]);
    }
    unset($object['location']);
    unset($object['object_id']);
    unset($object['enabled']);

    $responseData[$loc][] = $object;

}
//print_r($responseData);
DB::setFetchType($fetchType);

echo json_encode($responseData);

include('../../../_include/core/main_close.php');