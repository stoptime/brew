package main

import (
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
	"fmt"

	"github.com/kennygrant/sanitize"
)

var (
	err       error
	directory = "./_html/"
	ext       string
	fileBase  string
	saniFile  string
	total			int
	renamed   int
)

func main() {
	files, err := ioutil.ReadDir(directory)
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		total++;
		ext = path.Ext(file.Name())
		fileBase = strings.TrimSuffix(file.Name(), ext)
		fileBase = strings.TrimSuffix(fileBase, "-")
		saniFile = sanitize.BaseName(fileBase) + ext
		err := os.Rename(directory+file.Name(), directory+saniFile)
		if err != nil {
			log.Fatal(err)
			fmt.Printf("Failed to rename file: %s to %s \n", file.Name, saniFile)
		} else {
			renamed++
		}
	}
	fmt.Printf("Processed %d out of %d files \n", renamed, total)
}
