<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

class OutsideImages
{

    static $sizesBaseImage = array('orig' => array(0, 0),
                                   'b'    => array(1920, 1080),
                                   'th'   => array(888, 888));

	static public function filter_to_db($text, $old_text = null)
    {
    	self::do_upload_images($text);

    	$old_ids = self::retrieve_ids($old_text);
    	$new_ids = self::retrieve_ids($text);

    	foreach($old_ids as $old_id)
    	{
    		$key = array_search($new_ids, $old_id);
    		if($key !== false)
    		{
    			unset($new_ids[$key]);
    		}
    		else
    		{
    			self::delete_image($old_id);
    		}
    	}

    	return $text;
    }

    static public function filter_to_html($text, $start_tag, $end_tag, $a_class, $target = '_blank', $isCalcMaxWidth = false, $prfId = '')
    {
        global $g;

        $tmplWallType = Common::getOptionTemplate('wall_type');
        $isEdgeWall = $tmplWallType == 'edge';

        $ids = self::retrieve_ids($text);

        foreach ($ids as $id){
        	$image = self::image_by_id($id);
        	if ($image){
                self::imageThereReupload($image);

                $filePrefix = $g['path']['url_files'] . "outside_images/" . $image['image_id'];
                $image_b = "{$filePrefix}_b.jpg";
                $image_th = "{$filePrefix}_th.jpg";

                if ($isCalcMaxWidth) {
                    Wall::calcMaxImageWidth($image_th);
                }

                $tagId = 'outside_img_' . $prfId . $id;
                $tag = '{img:' . $id . '}';
                if ($isEdgeWall) {
                    $tagHtml = $start_tag
                                . '<a data-id="' . $tagId . '" class="' . $a_class . ' ' . $tagId . '" href="' . $image_b . '">'
                                    . '<img src="' . $image_th . '" alt=""/>'
                                . '</a>'
                               . $end_tag;
                    $tagHtml .= "<script>clWall.onLoadImgTimeLine('" . $tagId . "');</script>";
                } else {
                    $tagHtml = $start_tag . '<a target="' . $target . '" class="' . $a_class . '" href="' . $image_b . '"><img data-src-b="' . $image_b . '" id="' . $tagId . '" src="' . $image_th . '" alt=""/></a>' . $end_tag;
                }
                $text = Common::getTextTagsToBr($text, $tag, $tagHtml);
                #$text = str_replace($tag, $start_tag . '<a target="' . $target . '" class="'.$a_class.'" href="' . $image_b . '"><img src="' . $image_th . '" alt=""/></a>' . $end_tag, $text);
        	}
        }

        return $text;
    }

    static public function on_delete($text)
    {
        $ids = self::retrieve_ids($text);

        foreach($ids as $id)
        {
        	self::delete_image($id);
        }
    }

    static private function delete_image($id)
    {
        global $g;

    	$image = self::image_by_id($id);
    	if($image){
	    	if($image['image_n_links'] > 1)	{
	    		DB::execute("UPDATE outside_image SET image_n_links = image_n_links - 1 WHERE image_id = " . to_sql($image['image_id']) . " LIMIT 1");
	    	} else {
	    		$filePrefix = $g['path']['dir_files'] . 'outside_images/' . $image['image_id'];
	            foreach(self::$sizesBaseImage as $k => $size) {
                    $file = "{$filePrefix}_{$k}.jpg";
                    Common::saveFileSize($file, false);
	            	@unlink($file);
                }
                self::deleteImageDb($image['image_id']);
	    	}
    	}
    }

    static private function retrieve_ids($text)
    {
    	return grabs($text, '{img:', '}');
    }

    static private function do_upload_images(&$text)
    {
        $text = Common::parseLinks($text, '', '', 'getImgTagToDb');
    }

    static private function image_by_id($id)
    {
    	return DB::row("SELECT * FROM outside_image WHERE image_id = " . to_sql($id) . " LIMIT 1");
    }

    public static function createBaseImageFile($image, $baseFileName, $sourceFile)
    {
        global $g;


        $watermarkParams = CProfilePhoto::watermarkParams();

        // make copy of source file if enough memory or load from file

        $first = true;

        /* Maximum image width https://sitesman.com/s/1014/1014-2019-02-18_13-19-06.png */
        foreach(self::$sizesBaseImage as $k => $size) {
            $fileName = $baseFileName . $k . '.jpg';
            if($first) {
                //$sizeX = imageSX($image->image);
                //$sizeY = imageSY($image->image);
                if((memory_get_usage() * 2 + 1024 * 1024 * 16) < getMemoryLimitInBytes()) {
                    $image->imageCopy = Image::copyImageResource($image->image);
                } else {
                    // use only if need prevent loading image from drive when low memory
                    //$image->saveImageResourceCopy = true;
                }
            } else {

                if($image->imageCopy) {
                    $image->image = $image->imageCopy;
                } else {
                    $image->loadImage($sourceFile);
                }
                $image->saveImageResourceCopy = true;

            }
            if ($k != 'orig') {
                $sizeX = $size[0];
                $sizeY = $size[1];
                $image->resizeWH($sizeX, $sizeY, false, $g['image']['logo'], $watermarkParams['font_size'], $watermarkParams['file'], $watermarkParams['position']);
            }

            if(!$image->saveImage($fileName, $g['image']['quality'])) {
                return false;
            }
            Common::saveFileSize($fileName);
            //$image->clearImage();

            @chmod($fileName, 0777);

            $first = false;
        }

        return true;
    }

    static public function do_upload_image($url, $reupload = false)
    {
        global $g;

        $guid = guid();
        $image = DB::one('outside_image', '`outside_url` = ' . to_sql($url));
        if($image && !$reupload) {
            DB::execute('UPDATE `outside_image` SET `image_n_links` = `image_n_links` + 1 WHERE `outside_url` = ' . to_sql($url));
            return $image;
        }

        if (!$reupload) {
            $image = array(
                'user_id' => $guid,
                'outside_url' => $url
            );
        }

        $hash = $guid . '_' . md5(rand(100000, 9999999));
    	$tempFile = $g['path']['dir_files'] . "temp/outgoing_image_{$hash}.txt";
        @copyUrlToFile($url, $tempFile);
        $result = false;
        if (file_exists($tempFile)){
            $im = new Image();
            if ($im->loadImage($tempFile)) {
                if (!$reupload) {
                    $row = array('user_id'       => $image['user_id'],
                                 'outside_url'   => $image['outside_url'],
                                 'image_n_links' => 1,
                                 'created_at'    => date('Y-m-d H:i:s')
                           );
                    DB::insert('outside_image', $row);
                    $image['image_id'] = DB::insert_id();
                }

                $sFile_ = $g['path']['dir_files'] . "outside_images/" . $image['image_id'] . '_';

                if (self::createBaseImageFile($im, $sFile_, $tempFile)){
                    $result = $image;
                }
            }
            @unlink($tempFile);
        }

        if (!$result) {
            self::deleteImageDb($image['image_id']);
        }

        return $result;
    }

    static public function deleteImageDb($id)
    {
        DB::delete('outside_image', '`image_id` = ' . to_sql($id));
    }

    static public function do_upload_image_old($url, $image_sizes, $reupload = false)
    {
        global $g;
        global $g_user;

        $image = DB::row("SELECT * FROM outside_image WHERE outside_url = " . to_sql($url) . " LIMIT 1");

        if($image && !$reupload)
        {
            DB::execute("UPDATE outside_image SET image_n_links = image_n_links + 1 WHERE outside_url = " . to_sql($url) . " LIMIT 1");

            return $image;
        }

        if (!$reupload) {
        $image = array(
            'user_id' => $g_user['user_id'],
            'outside_url' => $url);
        }

    	$temp_file = $g['path']['dir_files'] . "temp/outgoing_image_" . md5(rand(100000, 9999999)) . '.txt';
        @copyUrlToFile($url, $temp_file);
        if (file_exists($temp_file))
        {
            $failed = false;

            if (!$reupload) {
                    DB::execute('INSERT INTO `outside_image`
                                    SET user_id = ' . to_sql($image['user_id'], 'Number') .
                                     ', outside_url = ' . to_sql($image['outside_url']) .
                                     ', image_n_links = 1, created_at = NOW()');

                    $image['image_id'] = DB::insert_id();
            }
        	$file_prefix = $g['path']['dir_files'] . "outside_images/" . $image['image_id'];

        	foreach($image_sizes as $image_size)
            {
            	$im = new Image();
	            if ($im->loadImage($temp_file)) {
                    $flag = true;
                    if (!$image_size['allow_smaller'] ||
                        ($im->getWidth() > $image_size['width'] &&
                        $im->getHeight() > $image_size['height']))
                    {
                        if ($flag) {
                            $imWidth = $im->getWidth();
                            if($imWidth > $image_size['width']) {
                                $imWidth = $image_size['width'];
                            }
                            $im->resizeWH($imWidth, $image_size['height']);
                        } else {
                             $im->resizeCroppedMiddle($image_size['width'], $image_size['height']);
                        }
                    }
                    elseif ($im->getWidth() > $image_size['width'])
                    {
                        $im->resizeW($image_size['width']);
                    }
                    elseif ($im->getHeight() > $image_size['height'])
                    {
                        $im->resizeH($image_size['height']);
                    }
                    else
                    {
                    	copy($temp_file, $file_prefix . "_".$image_size['file_postfix'].".jpg");
                        Common::saveFileSize($file_prefix . "_".$image_size['file_postfix'].".jpg");
                    	//break;
                    }

	                $im->saveImage($file_prefix . "_".$image_size['file_postfix'].".jpg", $g['image']['quality']);
                    Common::saveFileSize($file_prefix . "_".$image_size['file_postfix'].".jpg");
	            }
	            else
	            {
	                $failed = true;
	                break;
	            }
            }

            if(!$failed)
            {
	            //original
	            $im = new Image();
	            if ($im->loadImage($temp_file)) {
	                $im->saveImage($file_prefix . "_orig.jpg", $g['image']['quality_orig']);//80
                        Common::saveFileSize($file_prefix . "_orig.jpg");
	            }
	            else
	            {
	            	$failed = true;
	            }
            }

            @unlink($temp_file);

            if($failed)
            {
            	DB::execute('DELETE FROM outside_image WHERE image_id = ' . to_sql($image['image_id'], 'Number') . ' LIMIT 1');

            	return null;
            }

            return $image;
        }

        return null;
    }

    static public function imageThereReupload($image)
    {
        global $g;

        $filePrefix = $g['path']['url_files'] . 'outside_images/' . $image['image_id'];

        $imageTh = "{$filePrefix}_th.jpg";

        if (!file_exists($imageTh)) {
            $imageOrig = "{$filePrefix}_orig.jpg";
            $imageB = "{$filePrefix}_b.jpg";
            Common::saveFileSize(array($imageOrig, $imageB, $imageTh), false);
            @unlink($imageOrig);
            @unlink($imageB);
            @unlink($imageTh);
            self::do_upload_image($image['outside_url'], true);
        }
    }
}