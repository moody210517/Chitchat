<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

function getDefaultRooms()
{
    $result = '';
    $room = DB::field('chat_room', 'id', '`status` = 1', 'position', 1);
    if (!empty($room)) {
        $result = $room[0];
    }

    return $result;
}

function getTextBetween($textPar, $startText, $endText, $offset = 0)
{
    $text = "--" . $textPar . "--";
    $textBetween = "";
    $i = 0;
    $startPosition = 0;

    for ($i = 0; $i <= $offset; $i++)
    {
        $startPosition = strPos($text, $startText, $startPosition);

        if ($startPosition >= 1)
        {
            $startPosition += strLen($startText);
            $textFromHere = subStr($text, $startPosition);
            $endPosition = strPos($textFromHere, $endText);

            if ($endPosition >= 1 && $i == $offset)
            {
                $textBetween = subStr($textFromHere, 0, $endPosition);
            }
        }
    }

    return $textBetween;
}
function getFileText($filePath)
{
    $fileText = "";

    $fileArray = file($filePath);
    $countFile = count($fileArray);
    for ($i = 0; $i < $countFile; $i++)
        $fileText .= $fileArray[$i];

    return $fileText;
}
function setFileText($filePath, $fileText)
{
    $writingOnly = "w";
    $fileHandle = fOpen($filePath, $writingOnly);
    fWrite($fileHandle, $fileText);
    fClose($fileHandle);
}
function getIsoDate()
{
    $today = getdate();
    $year = $today['year'];
    $mon = pad($today['mon']);
    $mday = pad($today['mday']);
    $hours = pad($today['hours']);
    $minutes = pad($today['minutes']);
    $seconds = pad($today['seconds']);
    return "$year-$mon-$mday $hours:$minutes:$seconds";
}
function pad($thisValue)
{
    $newValue = $thisValue;
    if ( strlen($thisValue) == 1 )
    {
        $newValue = "0" . $newValue;
    }
    return $newValue;
}
function misc_toXml($s)
{
    $s = Common::parseLinks($s, '_blank', '', 'getHref', true);
    $s = str_replace('&', '&#38;', $s);
    $s = str_replace('<', '&lt;', $s);
    $s = str_replace('>', '&gt;', $s);

    return $s;
}
function misc_toAttribute($s)
{
    $s = misc_toXml($s);
    $s = str_replace('"', '&quot;', $s);

    return $s;
}
function misc_toName($s)
{
    $s = strtolower($s);
    $abc = 'abcdefghijklmnopqrstuvwxyz';
    $sNew = '';

    for ($i = 0; $i < strlen($s); $i++)
    {
        $letter = substr($s, $i, 1);
        if ( strpos($abc, $letter) === false )
        {
            $letter = '';
        }

        $sNew .= $letter;
    }

    return $sNew;
}






function handleTrivia($nick, $line)
{
    global $g_botName;
    global $room;

    $say = '';

    $question = '';
    $answer = '';
    $answer2 = '';
    $hint = '';

    $asked = 0;

    DB::query("SELECT asked FROM chat_chair WHERE bot = '1' AND room = '$room' LIMIT 1");
    while ( $c = DB::fetch_row() )
    {
        $asked = $c['asked'];
    }

    if ($asked != 0)
    {
        DB::query("SELECT question, answer, answer2, hint FROM chat_trivia WHERE id = '$asked'");
        while ( $c = DB::fetch_row() )
        {
            $question = $c['question'];
            $answer = $c['answer'];
            $answer2 = $c['answer2'];
            $hint = $c['hint'];
        }
    }

    if ($question != '')
    {
        if ($line == '!hint')
        {
            if ($hint != '')
            {
                $say = 'Hint: ' . $hint;
            }
            else
            {
                $say = 'No hint for this question.';
            }
        }
        else if ($line == '!ask')
        {
            $say = 'I repeat: ' . $question;
        }
        else if ($line == '!answer')
        {
            $say = 'Correct answer was: ' . $answer;
            stopGame();
        }
        else
        {
            if ( answerIsCorrect($answer, $answer2, $line) )
            {
                $say = ucfirst($nick) . ', your answer is correct!';
                stopGame();
            }
        }
    }
    else
    {
        if ($line == '!ask')
        {
            $say = getNewQuestion();
        }
        else if ($line == '!answer')
        {
            $say = 'No question was asked.';
        }
    }

    $randomlyRepeatQuestion = ( $say == '' && $question != '' && rand(1, 1000) == 1000 );
    if ($randomlyRepeatQuestion)
    {
        $say = $question;
    }

    if ($say != '')
    {
        $say = str_replace("'", "''", $say);
        addLine($g_botName, 'mastrps', $say, $room);
    }
}

function getNewQuestion()
{
    global $room;

    $question = '';
    $question_id = 0;

    DB::query("SELECT id, question FROM chat_trivia ORDER BY rand() LIMIT 1");
    while ( $c = DB::fetch_row() )
    {
        $question_id = $c['id'];
        $question = $c['question'];
    }

    $rows = DB::query("UPDATE chat_chair SET asked = '$question_id' WHERE room = '$room' AND bot = '1'");


    return $question;
}

function stopGame()
{
    global $room;

    $rows =  DB::query("UPDATE chat_chair SET asked = '0' WHERE room = '$room' AND bot = '1'");

}

function standardizeAnswer($text)
{
    $text = strToLower($text);
    $text = replaceSpecialCharacters($text);
    $text = removeSpecialCharacters($text);
    $text = cutStart($text, "the");
    $text = cutStart($text, "19");
    return $text;
}

function removeSpecialCharacters($text)
{
    $textLen = strLen($text);
    $newText = "";
    for ($i = 0; $i < $textLen; $i++)
    {
        $letter = subStr($text, $i, 1);
        $isOption = ($letter == "[" || $letter == "]");
        $isAlpha = ($letter >= "a" && $letter <= "z");
        $isNumerical = ($letter >= "0" && $letter <= "9");
        if ($isAlpha or $isNumerical)
        {
            $newText .= $letter;
        }
    }
    return $newText;
}

function replaceSpecialCharacters($text)
{
    $text = str_replace("�", "oe", $text);
    $text = str_replace("�", "ae", $text);
    $text = str_replace("�", "ue", $text);
    $text = str_replace("�", "ss", $text);
    $text = str_replace("�", "ss", $text);
    $text = str_replace("�", "a", $text);
    $text = str_replace("�", "a", $text);
    $text = str_replace("�", "a", $text);
    $text = str_replace("�", "e", $text);
    $text = str_replace("�", "e", $text);
    $text = str_replace("�", "e", $text);
    $text = str_replace("�", "o", $text);
    $text = str_replace("�", "i", $text);
    return $text;
}

function cutStart($text, $sStart)
{
    if ( stringStartsWith($text, $sStart) )
    {
        $text = subStr( $text, strLen($sStart) );
    }
    return $text;
}

function answerIsCorrect($sCorrect, $sCorrect2, $sAnswer)
{
    $isCorrect = getThisIsCorrect($sCorrect, $sAnswer);
    if (!$isCorrect)
    {
        if ($sCorrect2 != '')
        {
            $isCorrect = getThisIsCorrect($sCorrect2, $sAnswer);
        }
    }

    return $isCorrect;
}

function getThisIsCorrect($sCorrect, $sAnswer)
{
    // Example: "Charl[y|ie|es] [Spencer|s.|] Chaplin"
    // Correct: "Charlie Chaplin"

    $optionsStart = "[";
    $optionsEnd = "]";
    $optionsSeperator = "|";
    $isCorrect = false;
    $sOptions = "";
    $iStart = 0;
    $iEnd = 0;
    $i = 0;
    $sOption = "";
    $compareStart = "";
    $thisCompareStart = "";
    $didFind = false;
    $temp = "";
    $bestCorrect = "";

    $sCorrect = standardizeAnswer($sCorrect);
    $sAnswer = standardizeAnswer($sAnswer);

    $iStart = -1;
    $isCorrect = ($sCorrect == $sAnswer);
    if (!$isCorrect)
    {
        similar_text($sCorrect, $sAnswer, $percentage);
        $isCorrect = ($percentage > 90);
    }

    if (!$isCorrect)
    {
        for (;;)
        {
            $iStart = strpos($sCorrect, $optionsStart, $iStart + 1);
            if (!$iStart == false)
            {
                $iEnd = strpos($sCorrect, $optionsEnd, $iStart + 1);

                if (!$iEnd == false)
                {
                    $compareStart = substr($sCorrect, 0, $iStart);

                    $sOptions = substr($sCorrect, $iStart + 1, $iEnd - $iStart - 1);
                    if ( strPos($sOptions, "|") === false )
                    {
                        $sOptions .= "|";
                    }
                    $arrOptions = split("[" . $optionsSeperator . "]", $sOptions);
                    $didFind = false;
                    $bestCorrect = "";

                    for ($i = 0; $i < count($arrOptions); $i++)
                    {
                        $sOption = $arrOptions[$i];

                        $thisCompareStart = $compareStart . $sOption;
                        if ( $thisCompareStart == substr( $sAnswer, 0, strlen($thisCompareStart) ) )
                        {
                            $didFind = true;
                            if ( strlen($thisCompareStart) >= strlen($bestCorrect) )
                            {
                                $bestCorrect = $thisCompareStart;
                            }
                        }
                    }
                    if ($didFind)
                    {
                        $sCorrect = $bestCorrect . substr($sCorrect, $iEnd + 1);
                    }
                    else
                    {
                        break;
                    }
                }
            }
            else
            {
                break;
            }
        }

        $isCorrect = ($sCorrect == $sAnswer);
    }

    return $isCorrect;
}

function stringStartsWith($string, $start)
{
    return (subStr( $string, 0, strLen($start) ) == $start);
}

