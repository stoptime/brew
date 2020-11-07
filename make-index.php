<?php

define('DIR', './_html');
$template = './index-template.html';

// sanitize file names
$out = system("go run rename.go");
echo $out;

// make the file
make_index($template);

function make_index($template): bool {
  $recipes = make_recipes();
  $recipe_list = make_html_list($recipes);
  $template_string = file_get_contents($template);
  $template_replaced = str_replace('::content::', $recipe_list, $template_string);
  $fp = fopen($template, 'w');
  $written = fwrite($fp, $template_replaced);
  if ($written) {
    echo "\nindex.html written \n";
    return true;
  }
  echo "\nindex.html NOT written\n";
  return false;
}

function make_recipes(): array {
  $recipes = [];
  if ($handle = opendir(DIR)) {
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
  return $recipes;
}

function make_html_list($recipes): string {
  $content = '';

  foreach ($recipes as $key => $value) {
    $content .= '<ul>';
    $content .= sprintf('<li><b><a href="%s/%s.html">%s</a></b>', DIR, $key, $key);
    if (isset($value)) {
      $content .=  '<ul>';
      if (is_array($value)) {
        ksort($value);
        foreach ($value as $k => $v) {
          // we only want the batch
          $v = trim($v);
          $n = explode('-', $v);
          $l = count($n);
          $content .= sprintf('<li><a class="batch" href="%s/%s.html"><span>Batch %s</span></a></li>', DIR, $v, $n[$l - 1]);
        }
      } else {
        print_r("Whoops - expected an array:");
        print_r($value); // something went wrong
      }
      $content .= '</ul>';
    }
    $content .= "</li>";
    $content .= '</ul>';

  }
    return $content;
}