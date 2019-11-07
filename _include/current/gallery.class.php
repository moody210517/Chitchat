<?php
class Gallery
{
    static private $fileName;
    static private $uploadFile;
    static private $uploadFileThumb;
    static private $uploadFileSrc;

    static function creatFolders($folder)
    {
        self::creatDir('images', null);
        self::creatDir('thumb', null);
        self::creatDir('images', $folder);
        self::creatDir('thumb', $folder);

        self::setMod('images', $folder);
        self::setMod('thumb', $folder);
    }

    static function creatDir($dir, $folder)
	{
        $path = self::getPath($dir, $folder);

        if (!is_dir($path)) {
            mkdir($path, 0777);
        }
    }

    static function getNewFolder($folder)
	{
        $path = self::getPath('images', $folder);
        $pathDir = self::getPath('images', null);
        if (empty($folder) || !is_dir($path)) {
            $folder = 1;
            while (file_exists("{$pathDir}/{$folder}")) {
                $folder++;
            }
        }
        return $folder;
    }


    static function setMod($dir, $folder)
	{
        $path = self::getPath($dir, $folder);
        @chmod($path, 0777);
    }

    static function getPath($dir, $folder)
	{
        global $g, $g_user;

        if ($folder !== null) {
            $folder = '/' . $folder;
        }
        $path = "{$g['path']['dir_files']}gallery/{$dir}/{$g_user['user_id']}{$folder}";
        $path = str_replace("\\", "/", $path);

        return $path;
    }

    static function setName($folder)
	{
        $name = 0;
        $path = self::getPath('images', $folder);
        $pathThumb = self::getPath('thumb', $folder);
        do {
            $name++;
        } while (file_exists("{$path}/{$name}.jpg"));

        self::$fileName = "{$name}.jpg";
        self::$uploadFile = "{$path}/{$name}.jpg";
        self::$uploadFileThumb = "{$pathThumb}/{$name}.jpg";
        self::$uploadFileSrc = "{$path}/{$name}_src.jpg";
    }

    static function getFileName()
	{
        return self::$fileName;
    }

    static function getUploadFile()
	{
        return self::$uploadFile;
    }

    static function getUploadFileSrc()
	{
        return self::$uploadFileSrc;
    }

    static function getUploadFileThumb()
	{
        return self::$uploadFileThumb;
    }

    static function getTitleAlbumWall()
	{
        return 'Timeline Photos';
    }

    static function uploadWall($descImage)
	{
        global $g, $g_user;

        $file = $g['path']['dir_files'] . 'temp/tmp_wall_' . $g_user['user_id'] . '.jpg';
        if (file_exists($file)) {
            self::upload($file, 0, 'Timeline Photos', $descImage);
        }
    }

    static function uploadImage($file, $folder)
	{
        global $g;

        $im = new Image();
        if (!$im->loadImage($file)) {
            return false;
        }

        self::creatFolders($folder);
        self::setName($folder);

        $watermarkParams = CProfilePhoto::watermarkParams();

        $sizesBaseImage = array(
            'th'  => array('path' => self::$uploadFileThumb,
                           'w' => 100,
                           'h' => 100
                     ),
            'src' => array('path' => self::$uploadFileSrc,
                           'w' => 1920,
                           'h' => 1080
                     ),
            'b'   => array('path' => self::$uploadFile,
                           'w' => $g['image']['gallery_width'],
                           'h' => $g['image']['gallery_height']
                     )
        );

        $result = false;
        foreach ($sizesBaseImage as $key => $params) {
            $im->prepareImageResource($file);
            if ($key == 'th') {
                $im->resizeCropped($params['w'], $params['h']);
            } else {
                $im->resizeWH($params['w'], $params['h'], false, $g['image']['logo'], $watermarkParams['font_size'], $watermarkParams['file'], $watermarkParams['position']);
            }

            if($im->saveImage($params['path'], $g['image']['quality'])){
                if ($key == 'b') {
                    $imWidth = $im->getWidth();
                    $imHeight = $im->getHeight();
                    $result = array('w' => $imWidth, 'h' => $imHeight);
                } elseif ($key == 'th') {
                    CStatsTools::count('pics_uploaded');
                }
                Common::saveFileSize($params['path']);
            } else {
                break;
            }
        }

        $im->cleanFirstImageResource();

        return $result;
    }

    static function upload($file, $folder, $title, $desc = '', $time = '')
	{
        global $g, $g_user;

        $guid = $g_user['user_id'];
        $wallUid = Wall::getUid();
        $isAllowLoadStrangerAlbum = false;
        if (Common::getOption('set', 'template_options') == 'urban' && $wallUid != $guid) {
            //$isAllowLoadStrangerAlbum = true;
            //$g_user['user_id'] = $wallUid;
        }

        //if ($isAllowLoadStrangerAlbum) {
        //    $g_user['user_id'] = $guid;
        //}

        $imgSize = self::uploadImage($file, $folder);
        if (!$imgSize) {
            return false;
        }

        $id = DB::result('SELECT `id`
                            FROM `gallery_albums`
                           WHERE `folder` = ' . to_sql($folder)
                         . ' AND `user_id` = ' . to_sql($guid, 'Number'));

        $date = date('Y-m-d H:i:s');
        if ($time == '') {
            $time = $date;
        }
        if($id == 0) {
            $sql = "INSERT INTO `gallery_albums` ( `user_id` , `parentid` , `folder` , `title` , `desc` , `date` , `place` , `show` , `thumb` , `sort_type` , `sort_order` , `views` )
                                         VALUES ('" . $guid . "', NULL, " . to_sql($folder) . ', ' . to_sql(he(l($title))) . ", '', '" . $date . "', '' , '1', '" . self::$fileName . "', NULL , NULL , '0')";
            DB::execute($sql);
            $id = DB::insert_id();
            $access = 'public';
        } else {
            $access = DB::result('SELECT `access`
                                    FROM `gallery_albums`
                                   WHERE `folder` = '.to_sql($folder)
                                 . ' AND `user_id` = ' . $guid);
        }
        $row = array('user_id' => $guid,
                     'albumid' => $id,
                     'filename' => self::$fileName,
                     'width' => $imgSize['w'],
                     'height' => $imgSize['h'],
                     'datetime' => $time,
                     'title' => '',
                     'desc' => $desc,
                );
        DB::insert('gallery_images', $row);
        $imgId = DB::insert_id();

        Wall::addItemForUser($imgId, 'pics', $guid);
        Wall::addItemForUser($imgId, 'pics', $wallUid);
        $paramsSection = '';
        if (!$folder) {
            $paramsSection = 'timeline';
        }
        Wall::add('pics', $id, $wallUid, $time, true, 0, $access, $guid, $paramsSection);
    }

    static function imageDelete($id, $uid, $deleteEmptyAlbum = true)
    {
        $sql = 'SELECT i.*, a.folder, a.thumb
            FROM gallery_images AS i
            LEFT JOIN gallery_albums AS a ON i.albumid=a.id
            WHERE i.id = ' . to_sql($id, 'Number') . '
                AND i.user_id = ' . to_sql($uid, 'Number');
        DB::query($sql, 1);
        if($row = DB::fetch_row(1)) {

            // IMAGE
            $sql = 'DELETE FROM gallery_images
                WHERE id = ' . to_sql($id, 'Number');
            DB::execute($sql);
            // COMMENTS
            $sql = 'SELECT * FROM gallery_comments
                WHERE imageid = ' . to_sql($row['id']);
            DB::query($sql, 2);
            while($comment = DB::fetch_row(2)) {
                self::commentDelete($comment['id'], $uid, true);
            }

            // FILES
            $row['type'] = 'images';
            $fileName = $row['filename'];
            $prepareFile = explode('.', $fileName);
            $image = self::albumPath($row) . $fileName;
            $imageSrc = self::albumPath($row) . $prepareFile[0] . '_src.' . $prepareFile[1];
            $row['type'] = 'thumb';
            $thumb = self::albumPath($row) . $fileName;
            Common::saveFileSize(array($image, $thumb, $imageSrc), false);
            @unlink($image);
            @unlink($imageSrc);
            @unlink($thumb);

            // check if exists minimum one image from set
            $albumId = $row['albumid'];
            $time = $row['datetime'];

            $sql = 'SELECT COUNT(*) FROM gallery_images
                WHERE albumid = ' . to_sql($albumId, 'Number') . '
                    AND datetime = ' . to_sql($time, 'Text');
            $count = DB::result($sql, 0, 2);
            if($count == 0) {
                Wall::removeByParams('pics', $albumId, $row['datetime']);
            }

            if($deleteEmptyAlbum) {
                $sql = 'SELECT COUNT(*) FROM gallery_images
                    WHERE user_id = ' . to_sql($uid, 'Number') . '
                        AND albumid = ' . to_sql($albumId, 'Number');
                $images = DB::result($sql, 0, 2);
                if($images == 0) {
                    self::albumDelete($albumId, $uid);
                    return 'album_empty';
                }
            }

            if (!file_exists(self::albumPath($row) . $row['thumb'])) {
                $sql = 'SELECT filename
                    FROM gallery_images
                    WHERE user_id = ' . to_sql($uid, 'Number') . '
                        AND albumid = ' . to_sql($albumId, 'Number');
                $thumb = DB::result($sql, 0, 2);
                $sql = 'UPDATE gallery_albums
                    SET thumb = ' . to_sql($thumb, 'Text') . '
                    WHERE user_id = ' . to_sql($uid, 'Number') . '
                        AND id = ' . to_sql($albumId, 'Number');
                DB::execute($sql);
            }

        }
    }

    static function albumDelete($id, $uid)
    {
        $sql = 'SELECT * FROM gallery_images
            WHERE albumid = ' . to_sql($id) . ' AND user_id = ' . to_sql($uid, 'Number');
        $rows = DB::rows($sql);
        if(Common::isValidArray($rows)) {
            foreach($rows as $row) {
                self::imageDelete($row['id'], $row['user_id'], false);
            }
        }

        $sql = 'SELECT * FROM gallery_albums
            WHERE id = ' . to_sql($id, 'Number');
        $vars = DB::row($sql);

        $sql = 'DELETE FROM gallery_albums
            WHERE id = ' . to_sql($id, 'Number');
        DB::execute($sql);

        if($vars) {
            $vars['type'] = 'images';
            $dirMain = self::albumPath($vars);
            $vars['type'] = 'thumb';
            $dirThumb = self::albumPath($vars);

            Common::dirRemove($dirMain);
            Common::dirRemove($dirThumb);
        }

        if (DB::count('gallery_albums', 'user_id = ' . to_sql($uid, 'Number')) == 0) {
            $vars['type'] = 'images';
            $dirMain = self::albumPathUser($vars);
            $vars['type'] = 'thumb';
            $dirThumb = self::albumPathUser($vars);

            Common::dirRemove($dirMain);
            Common::dirRemove($dirThumb);
        }
    }

    static function albumPath($vars)
    {
        global $g;
        return $g['path']['dir_files'] . 'gallery/' . $vars['type'] . '/' . $vars['user_id'] . '/' . $vars['folder'] . '/';
    }

    static function albumPathUser($vars)
    {
        global $g;
        return $g['path']['dir_files'] . 'gallery/' . $vars['type'] . '/' . $vars['user_id'] . '/';
    }

    static function commentsDeleteByUid($uid, $isAdmin = false)
    {
        $sql = 'SELECT id FROM gallery_comments
            WHERE user_id = ' . to_sql($uid, 'Number');
        $ids = DB::column($sql);
        foreach($ids as $id) {
            self::commentDelete($id, $uid, $isAdmin);
        }
    }

    static function commentDelete($id, $uid = false, $isAdmin = false, $dbIndex = DB_MAX_INDEX)
    {
        $delete = $isAdmin;

        if(!$delete && $uid) {
            $sql = 'SELECT * FROM gallery_comments WHERE id = ' . to_sql($id);
            DB::query($sql, $dbIndex);
            while($row = DB::fetch_row($dbIndex)) {
                if($row['user_id'] == $uid) {
                    $delete = true;
                } else {
                    $sql = 'SELECT user_id FROM gallery_images
                        WHERE id = ' . to_sql($row['imageid']);
                    $imageOwner = DB::result($sql, 0, $dbIndex);
                    if($imageOwner == $uid) {
                        $delete = true;
                    }
                }
            }
        }

        if($delete) {
            $sql = 'DELETE FROM `gallery_comments`
                WHERE id = ' . to_sql($id);
            DB::execute($sql);
            Wall::remove('pics_comment', $id);
        }
    }
}