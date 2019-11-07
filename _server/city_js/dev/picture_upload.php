<?php
$g['mobile_redirect_off'] = true;
include('../../../_include/core/main_start.php');

$response = CityGallery::uploadImageCityGallery();
if ($response) {
    echo $response;
}

include('../../../_include/core/main_close.php');