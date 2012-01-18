<?php
$recipes = array();
$dir = './_html';

if ($handle = opendir($dir)) {
	while (false !== ($entry = readdir($handle))) {
		if ($entry != "." && $entry != "..") {
			$name = explode('.', $entry);
			if (!strstr($name[0], '-batch')) {   // not a batch, a recipe
				if (!isset($recipes[$name[0]])) { // does this recipe have a key in the array
					$recipes[$name[0]] = array();  // if not, set it
				}
			}
			// else we have a batch
			else {
				// get the recipe name
				$r = explode('-', $name[0]);
				$recipes[$r[0]][] = $entry;
			}
		}
	}
	closedir($handle);
}
ksort($recipes);
//var_dump($recipes);
$content = '';

foreach ($recipes as $key => $value) {
	$content .= '<ul>';
	$content .= sprintf('<li><b><a href="%s/%s.html">%s</a></b>', $dir, str_replace(' ', '%20', $key), $key);
	if (isset($value)) {
		$content .=  '<ul>';
		foreach ($value as $k => $v) {
			// we only want the batch
			$v = trim($v);
			$n = explode('-', $v);
			$l = count($n);
			// strip the html
			$final_name = explode('.', $n[$l-1]);
			$content .= sprintf('<li><a href="%s/%s">%s</a></li>', $dir, str_replace(' ', '%20', $v), $final_name[0]);
		}
		$content .= '</ul>';
	}
	$content .= "</li>";
	$content .= '</ul>';
}
?>

<!doctype html>
<html lang="en">
	<head>
		<title>Matt's Recipes</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<style type="text/css" media="screen">
			body {
				font-family: helvetica;
				color: #aaa;
				font-size: 85%;
				padding-bottom: 50px;
			}
			h1 {
				font-size: 140%;
				border-bottom: 1px dashed #ccc;
			}
			a {
				color: green;
				display: block;
				padding-bottom: 5px;
			}
			a:hover {
				text-decoration: none;
				color: blue;
				background: #FF9;
			}
		</style>
	</head>
	<body>
		<h1>Matt's Homebrew Recipes</h1>
		<?=$content?>
	</body>
</html>



	
	
	
	
	
	