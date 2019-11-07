<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

class RssLoader
{
	private $m_encoding = "UTF-8";
	private $m_using_curl = false;
	private $m_validate_mime = true;
	private $m_header_info_prefered = true;

	function __construct($encoding = "UTF-8")
	{
		$this->m_encoding = $encoding;
	}

	function set_using_curl($using_curl)
	{
		$this->m_using_curl = $using_curl;
	}

	function set_header_info_prefered($header_info_prefered)
	{
		$this->m_header_info_prefered = $header_info_prefered;
	}

	function set_validate_mime($validate_mime)
	{
		$this->m_validate_mime = $validate_mime;
	}

	function load($url)
	{
		if($this->m_using_curl)
		{
			$ch = curl_init();

			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/530.5 (KHTML, like Gecko) Chrome/2.0.172.33 Safari/530.5");
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			//curl_setopt($ch, CURLOPT_HEADER,1);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

			$rss = curl_exec($ch);
			if($rss === FALSE)
				return false; //trigger_error('RssLoader: error retrieving url "' . $url . '" through curl ');

			/* Get the content type from CURL */
			$content_type = curl_getinfo( $ch, CURLINFO_CONTENT_TYPE );

			/* Get the MIME type and character set */
			preg_match( '@([\w/+]+)(;\s+charset=(\S+))?@i', $content_type, $matches );
			if ( isset( $matches[1] ) )
			    $header_mime = $matches[1];
			if ( isset( $matches[3] ) )
			    $header_charset = $matches[3];

			curl_close($ch);
		}
		else
		{
			$rss = file_get_contents($url);

			if($rss === FALSE) {

				return false; //trigger_error('RssLoader: error retrieving url "' . $url . '" through file_get_contents ');
            }



            /* Get the content type from the HTTP response */
			$nlines = count( $http_response_header );
			for ( $i = $nlines-1; $i >= 0; $i-- ) {
			    $line = $http_response_header[$i];
			    if ( substr_compare( $line, 'Content-Type', 0, 12, true ) == 0 ) {
			        $content_type = $line;
			        break;
			    }
			}



			/* Get the MIME type and character set */
			preg_match( '@Content-Type:\s+([\w/+]+)(;\s+charset=(\S+))?@i', $content_type, $matches );
			if ( isset( $matches[1] ) )
			    $header_mime = $matches[1];
			if ( isset( $matches[3] ) )
			    $header_charset = $matches[3];
		}

		/*echo htmlspecialchars($rss);

		if(@simplexml_load_string($rss) == FALSE)
			trigger_error('RssLoader: not valid xml!');*/


		$double_quote = true;

		/* Get the character set */
		preg_match( '@<\?xml.+encoding="([^\s"]+)@si', $rss, $matches );
		$content_mime = 'application/xml';
		if ( isset( $matches[1] ) )
			$content_charset = $matches[1];
		else
		{
			$double_quote = false;

			preg_match( "@<\?xml.+encoding='([^\s']+)@si", $rss, $matches );
			$content_mime = 'application/xml';
			if ( isset( $matches[1] ) )
				$content_charset = $matches[1];
		}

		if(isset($matches[0]))
		{
			if($double_quote)
				$rss = str_replace($matches[0],'<?xml version="1.0" encoding="' . $this->m_encoding . '', $rss);
			else
				$rss = str_replace($matches[0],"<?xml version='1.0' encoding='" . $this->m_encoding . '', $rss);
		}
		else
		{
            /*
			$rss = '<?xml version="1.0" encoding="' . $this->m_encoding . '" ?>' . $rss;
             *
             */
		}

		if($this->m_header_info_prefered)
		{
			$mime = isset($header_mime) ? $header_mime : (isset($content_mime) ? $content_mime : null);
			$charset = isset($header_charset) ? $header_charset : (isset($content_charset) ? $content_charset : null);
		}
		else
		{
			$mime = isset($content_mime) ? $content_mime : (isset($header_mime) ? $header_mime : null);
			$charset = isset($content_charset) ? $content_charset : (isset($header_charset) ? $header_charset : null);
		}

		if(!$charset)
			$charset = "UTF-8";

		if($this->m_validate_mime && ($mime != "application/xml") && ($mime != "application/rss+xml") && ($mime != "text/xml"))
			return false; //trigger_error('RssLoader: wrong mime type "' . $mime . '"');



		if($charset != $this->m_encoding)
		{
			if(extension_loaded('mbstring'))
			{
				$rss = mb_convert_encoding($rss, $this->m_encoding, $charset);
			}
			else if(extension_loaded('iconv'))
			{
				$rss = iconv($charset, $this->m_encoding, $rss);
			}
			else
				trigger_error('RssLoader: "mbstring" or "iconv" extension are required!');
		}



		//echo 'mime = ' . $mime . '<br/>';
		//echo 'charset = ' . $charset . '<br/>';
		//echo htmlspecialchars($rss);

        #echo $rss;

		if(extension_loaded('simplexml'))		{

			if(@simplexml_load_string($rss) === false) {
				return false; //trigger_error('RssLoader: not valid xml!');
            }
		}
		else
			trigger_error('RssLoader: "simplexml" extension are required!');



		return $rss;
	}
}