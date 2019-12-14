package main

import (
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"

	"github.com/kennygrant/sanitize"
)

var (
	err       error
	directory = "./_html/"
	ext       string
	fileBase  string
	saniFile  string
)

func main() {
	files, err := ioutil.ReadDir(directory)
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		ext = path.Ext(file.Name())
		fileBase = strings.TrimSuffix(file.Name(), ext)
		fileBase = strings.TrimSuffix(fileBase, "-")
		saniFile = sanitize.BaseName(fileBase) + ext
		err := os.Rename(directory+file.Name(), directory+saniFile)
		if err != nil {
			log.Fatal(err)
		}
	}
}
