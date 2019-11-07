<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
include("./_include/core/main_start.php");

$_GET['t'] = Common::filterProfileText($_GET['t']);

$str = implode("|", $_GET);
$strToParams = urlencode($str);

echo '<html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=koi8-r" />
        <title>' . l('Preview') . '</title>
        <body bgcolor="#ffffff">
            <table width="100%" height="100%">
                <tr>
                    <td align="center" valign="middle">
                    ' . User::flashPostcard(null, 'mail', '', $strToParams, 'mail.php') . '
                    </td>
                </tr>
            </table>
        </body>
     </html>';

include("./_include/core/main_close.php");