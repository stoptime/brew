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
				$r = explode('-batch', $name[0]);

				if (!array_key_exists($r[0], $recipes)) {
					$recipes[$r[0]] = null;
				}

				// place in batch order
				if (!empty($r[1])) {
					$order = ltrim($r[1], '-');
				}
				$recipes[$r[0]][$order] = rtrim($entry, '.html');
			}
		}
	}
	closedir($handle);
}
ksort($recipes);
//echo '<pre>'; print_r($recipes); echo '</pre>';
$content = '';

foreach ($recipes as $key => $value) {
	$content .= '<ul>';
	$content .= sprintf('<li><b><a href="%s/%s.html">%s</a></b>', $dir, $key, $key);
	if (isset($value)) {
		$content .=  '<ul>';
		if (is_array($value)) {
			ksort($value);
			foreach ($value as $k => $v) {
				// we only want the batch
				$v = trim($v);
				$n = explode('-', $v);
				$l = count($n);
				$content .= sprintf('<li><a class="batch" href="%s/%s.html"><span>Batch %s</span></a></li>', $dir, $v, $n[$l-1]);
			}
		}
		else {
			print_r("Whoops:");
			var_dump($value); // something went wrong
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
				color: #333;
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
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
	<script>
	$(document).ready(function() {
		$('a.batch').each(function(){
			var batch_link = $(this);
		    $.get($(batch_link).attr('href'), function(data) {
		        var real_title = $(data).filter('p.recipeTitle').text();
				if (real_title.slice(0,5) != 'Batch') {
					$(batch_link).find('span').hide().text(real_title).fadeIn();
				}
		    });
		});
	});
	</script>
</html>



	
	
	
	
	
