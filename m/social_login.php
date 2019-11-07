<?php



$area = "public";

include("./_include/core/pony_start.php");



global $g;



$nameSocial='';

if(isset($_GET['module'])){

    $nameSocial = $_GET['module'];

}



if(method_exists($nameSocial,'oAuthApi')){

    $social=$nameSocial::getInstance();

    if(!$social) {
        Common::toLoginPage();
    }

    Social::checkParams($social);

    $social->oAuthApi();





}

