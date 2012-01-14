<?php
$recipes = array();
$dir = './_recipes';

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

//var_dump($recipes);

foreach ($recipes as $key => $value) {
	echo '<ul>';
	printf('<li><b><a href="%s/%s.html">%s</a></b>', $dir, $key, $key);
	if (isset($value)) {
		echo '<ul>';
		foreach ($value as $k => $v) {
			// we only want the batch
			$n = explode('-', $v);
			$l = count($n);
			// strip the html
			$final_name = explode('.', $n[$l-1]);
			printf('<li><a href="%s/%s">%s</a></li>', $dir, $v, $final_name[0]);
		}
		echo '</ul>';
	}
	echo "</li>";
	echo '</ul>';
}