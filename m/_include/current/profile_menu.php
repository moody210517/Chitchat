<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

class CProfileMenu extends CHtmlBlock
{
	var $message_template = "";
	var $active = '';
	
	function setActive($active)
	{
		$this->active = $active;
	}
	
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		global $g_info;
		global $area;
		global $p;

		if($this->active)
			$html->parse('active_'.$this->active, true);
        
        $countFields = 0;
        foreach ($g['user_var'] as $k => $v) {
            if (($v['type'] == 'text' || $v['type'] == 'textarea')
                && $v['status'] == 'active') {
                    $countFields++;
            }
        }
        if ($countFields > 0) {
            $html->parse('profile', true);
        }
		
		parent::parseBlock($html);
	}
}
