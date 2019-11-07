<?php

/*
 * Check compatibility
 * - PHP version
 * - ioncube
 * - curl
 * - mbstring
 * - gd with freetype
 * - mysql/mysqli
 */

$phpVersion = phpversion();

$errors = array();

$php = explode('.',  $phpVersion);
$phpVersionMain = $php[0];
$phpVersionSub = $php[0];
if($php[0] < 5 || ($php[0] == 5 && $php[1] < 3)) {
    $errors[] = "PHP is incompatible $phpVersion";
}

$extensions = get_loaded_extensions();

$extensionsRequired = array(
    'curl',
    'gd',
    'mbstring',
);

foreach($extensionsRequired as $extension) {
    if (!in_array($extension, $extensions)) {
        $errors[] = "No $extension";
    }
}

if(!in_array('mysql', $extensions) && !in_array('mysqli', $extensions)) {
    $errors[] = 'No MySQL';
}

if(function_exists('gd_info')) {
    $gdInfo = gd_info();
    if(!isset($gdInfo['FreeType Support']) || !$gdInfo['FreeType Support']) {
        $errors[] = 'No GD FreeType Support';
    }
}

if(count($errors)) {
    echo '<b>Hosting configuration issues:</b><br>';
    echo implode('<br>', $errors);
} else {
    echo 'Hosting is compatible';
}

echo '<br><a href="' . $_SERVER['PHP_SELF'] . '?info=1">Info</a>';

if(isset($_GET['info'])) {
    phpinfo();
}