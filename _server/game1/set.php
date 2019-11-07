<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('common.php');

if ($yesNo=="yes") {
DB::execute("UPDATE users SET active='yes' WHERE login=".to_sql($activeLogin));
} else {
DB::execute("UPDATE users SET active='no' WHERE login=".to_sql($activeLogin));
}

echo "isOk='ok'";

?>